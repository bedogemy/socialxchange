import { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { User } from '../types';
import { Gift, Zap, HelpCircle, Loader2 } from 'lucide-react';

interface DailyBonusCardProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const bonusTranslations: Record<string, {
  title: string;
  pointsLabel: string;
  tasksCompleted: string;
  tasksRemaining: string;
  claimBtnText: string;
  claimWaitText: string;
  timerLabel: string;
  unlockedMsg: string;
  completedWaitMsg: string;
  errorClaiming: string;
  successClaiming: string;
  requiredTasksTip: string;
  refreshBtn: string;
}> = {
  ar: {
    title: '🎁 المكافأة اليومية (1000 نقطة)',
    pointsLabel: '1000 نقطة إضافية تضاف فوراً',
    tasksCompleted: 'المهمات المنفذة',
    tasksRemaining: 'المهمات المتبقية',
    claimBtnText: '🎁 اضغط هنا لاستلام الـ 1000 نقطة!',
    claimWaitText: 'انتظر جلب البيانات والتحقق...',
    timerLabel: 'التجديد بعد:',
    unlockedMsg: '🎉 مبارك! لقد أكملت 50 مهمة اليوم بنجاح ومكافأتك جاهزة للاستلام.',
    completedWaitMsg: 'تم استلام مكافأة اليوم بالفعل',
    errorClaiming: 'تعذر استلام الجائزة:',
    successClaiming: '🌟 مبارك! حصلت على جائزتك اليومية بقيمة 1000 نقطة مجانية بنجاح تم إيداعها بمحفظتك.',
    requiredTasksTip: '💡 تلميح: أكمل 50 مهمة (فيديوهات، قنوات، لايكات، مواقع) لتفعيل زر استلام الجائزة المجانية اليومية.',
    refreshBtn: 'تحديث البيانات 🔄'
  },
  en: {
    title: '🎁 Daily Bonus (1,000 Points)',
    pointsLabel: '1,000 extra points added instantly',
    tasksCompleted: 'Tasks Completed',
    tasksRemaining: 'Tasks Remaining',
    claimBtnText: '🎁 Claim Your 1,000 Points Daily Bonus!',
    claimWaitText: 'Fetching status and verifying...',
    timerLabel: 'Refills In:',
    unlockedMsg: '🎉 Congratulations! You have completed 50 tasks today, reward is ready to claim!',
    completedWaitMsg: 'Today\'s reward already claimed',
    errorClaiming: 'Claim failed:',
    successClaiming: '🌟 Success! 1,000 extra points credited to your balance.',
    requiredTasksTip: '💡 Tip: Perform 50 interactions (likes, sub, websites, etc) to unlock this free 1,000 points daily bonus.',
    refreshBtn: 'Sync Status 🔄'
  },
  fr: {
    title: '🎁 Bonus Quotidien (1 000 Points)',
    pointsLabel: '1 000 points crédités instantanément',
    tasksCompleted: 'Missions complétées',
    tasksRemaining: 'Missions restantes',
    claimBtnText: '🎁 Réclamer mon Bonus Quotidien de 1 000 pts!',
    claimWaitText: 'Vérification en cours...',
    timerLabel: 'Renouvellement dans:',
    unlockedMsg: '🎉 Félicitations! Vous avez accompli les 50 tâches, bonus prêt à être réclamé.',
    completedWaitMsg: 'Bonus quotidien déjà réclamé',
    errorClaiming: 'Échec de la réclamation:',
    successClaiming: '🌟 Félicitations! 1 000 points ajoutés avec succès.',
    requiredTasksTip: '💡 Astuce: Complétez 50 missions d\'échange aujourd\'hui pour débloquer votre cadeau quotidien.',
    refreshBtn: 'Actualiser 🔄'
  },
  es: {
    title: '🎁 Bono Diario (1,000 Puntos)',
    pointsLabel: '1,000 puntos agregados al instante',
    tasksCompleted: 'Misiones completadas',
    tasksRemaining: 'Misiones restantes',
    claimBtnText: '🎁 ¡Reclamar Bono Diario de 1000 Pts!',
    claimWaitText: 'Sincronizando estado...',
    timerLabel: 'Se renueva en:',
    unlockedMsg: '🎉 ¡Felicitaciones! Has completado 50 tareas, el bono está listo para reclamarse.',
    completedWaitMsg: 'Bono de hoy ya reclamado',
    errorClaiming: 'Fallo al reclamar:',
    successClaiming: '🌟 ¡Éxito! Se han acreditado 1,000 puntos a su saldo.',
    requiredTasksTip: '💡 Consejo: Realice 50 interacciones e intercambios hoy para liberar el bono gratuito.',
    refreshBtn: 'Sincronizar 🔄'
  }
};

export default function DailyBonusCard({ user, onPointsEarned, lang = 'ar' }: DailyBonusCardProps) {
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [canClaim, setCanClaim] = useState(false);
  const [timeRemainingMs, setTimeRemainingMs] = useState(0);
  const [hasClaimedToday, setHasClaimedToday] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const activeLang = bonusTranslations[lang] ? lang : 'ar';
  const t = bonusTranslations[activeLang];

  const targetTasks = 50;
  const remainingTasks = Math.max(0, targetTasks - tasksCompleted);
  const progressPercent = Math.min(100, Math.round((tasksCompleted / targetTasks) * 100));

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          action: 'get_status'
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setTasksCompleted(data.tasksCompletedToday || 0);
          setHasClaimedToday(!data.canClaimBonusTime);
          setTimeRemainingMs(data.timeRemainingMs || 0);

          // Can claim if they hit target AND time is ready
          const hasMetHoursAndTasks = data.tasksCompletedToday >= targetTasks && data.canClaimBonusTime;
          setCanClaim(hasMetHoursAndTasks);
        }
      }
    } catch (e) {
      console.error('Failed to load daily bonus state:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Periodically update timer if countdown is active
    const interval = setInterval(() => {
      setTimeRemainingMs(prev => {
        if (prev <= 1000) return 0;
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [user.uid]);

  const handleClaim = async () => {
    if (!canClaim || claiming) return;

    setClaiming(true);
    setMessage(null);

    try {
      const response = await fetch('/.netlify/functions/daily-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          action: 'claim_bonus'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failure');
      }

      // Success claiming bonus!
      // Add points to our local database context
      db.updateUserPoints(user.uid, 1000);

      // Trigger visual parent refresh
      onPointsEarned();

      // Update state
      setMessage({ text: t.successClaiming, isError: false });
      setHasClaimedToday(true);
      setCanClaim(false);
      setTimeRemainingMs(1000 * 60 * 60 * 24); // 24 hours fake countdown until next refresh
      
      await fetchStatus();

    } catch (err: any) {
      console.error('Error claiming daily bonus:', err);
      setMessage({ text: `${t.errorClaiming} ${err.message || 'Server error'}`, isError: true });
    } finally {
      setClaiming(false);
    }
  };

  const formatCountdown = (ms: number) => {
    if (ms <= 0) return '';
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div id="manual-daily-bonus-card" className="bg-indigo-950/30 border border-slate-800/80 p-6 md:p-8 rounded-3xl backdrop-blur-md space-y-5 my-6 text-right font-[Cairo] relative overflow-hidden transition-all duration-300">
      
      {/* Glow background anchor */}
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header bar and info loader */}
      <div className="flex justify-between items-center flex-row-reverse">
        <h3 className="m-0 text-md sm:text-lg font-black text-amber-400 flex items-center gap-2">
          <span>{t.title}</span>
        </h3>
        
        <div className="flex items-center gap-2">
          {loading && <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />}
          
          {hasClaimedToday && timeRemainingMs > 0 && (
            <span id="bonus-timer" className="text-xs text-red-400 bg-red-500/10 border border-red-500/10 px-3 py-1 rounded-full font-bold font-mono">
              {t.timerLabel} {formatCountdown(timeRemainingMs)}
            </span>
          )}
        </div>
      </div>

      {/* Numerical Indicators Grid */}
      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-slate-950/80 border border-slate-850/60 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 font-bold block mb-1">{t.tasksCompleted}</span>
          <b id="bonus-completed-count" className="text-2xl font-black text-emerald-400 font-mono">
            {tasksCompleted}
          </b>
        </div>
        <div className="bg-slate-950/80 border border-slate-850/60 p-4 rounded-xl">
          <span className="text-[11px] text-slate-400 font-bold block mb-1">{t.tasksRemaining}</span>
          <b id="bonus-remaining-count" className="text-2xl font-black text-amber-500 font-mono">
            {remainingTasks}
          </b>
        </div>
      </div>

      {/* Continuous Progression bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
          <span>{progressPercent}%</span>
          <span>{tasksCompleted} / {targetTasks}</span>
        </div>
        <div className="relative w-full bg-slate-950 border border-slate-850 rounded-full h-2.5 overflow-hidden">
          <div 
            id="bonus-progress-bar" 
            className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Conditional visual banners */}
      {message && (
        <div className={`p-4 rounded-2xl text-xs font-black ${
          message.isError 
            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse'
        }`}>
          {message.text}
        </div>
      )}

      {tasksCompleted >= targetTasks && !hasClaimedToday && !message && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold rounded-2xl text-center">
          {t.unlockedMsg}
        </div>
      )}

      {/* Button controls */}
      <div className="pt-2 flex flex-col gap-3">
        <button
          id="claim-bonus-btn"
          disabled={!canClaim || claiming || loading}
          onClick={handleClaim}
          className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border ${
            canClaim 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/10 border-emerald-500/30' 
              : 'bg-slate-800/80 border-slate-850 text-slate-500 cursor-not-allowed'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t.claimWaitText}</span>
            </>
          ) : hasClaimedToday ? (
            <span>🔒 {t.completedWaitMsg}</span>
          ) : (
            <span>{t.claimBtnText}</span>
          )}
        </button>

        <div className="flex justify-between items-center flex-row">
          <button
            onClick={fetchStatus}
            disabled={loading}
            className="text-[10px] text-slate-400 hover:text-indigo-400 font-bold flex items-center gap-1 bg-slate-900/60 border border-slate-850 px-3 py-1.5 rounded-lg active:scale-95 transition-all outline-none"
          >
            <span>{t.refreshBtn}</span>
          </button>
          
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-slate-600" />
            <span>50 مهمة ترويجية للمكافأة</span>
          </span>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
        {t.requiredTasksTip}
      </p>

    </div>
  );
}
