import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { ThumbsUp, Clock, Award, AlertCircle, Sparkles, X, Pin } from 'lucide-react';
import TaskVerificationOverlay from './TaskVerificationOverlay';
import { SupportedLanguages } from '../lib/translations';

interface LikePinterestProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const pinLikeTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    availableTitle: 'متاح حالياً: {count} حملة',
    mainTitle: 'تبادل لايكات وإعجابات بنترست (Pinterest Likes)',
    mainDesc: 'شارك للتفاعل بوضع اللايكات وحفظ الدبابيس (Pins) للأعضاء على بنترست لجمع نقاط سريعة وآمنة. البقاء بالتصفح لـ 15 ثانية إلزامي.',
    noCampaigns: 'لا توجد حملات لايك بنترست حالياً',
    noCampaignsDesc: 'أنشئ حملتك الترويجية الأولى للايكات بنترست وسيتفاعل معها آلاف الأعضاء فوراً!',
    yourCampaign: 'حملتك الإعلانية ⭐️',
    rewardPoints: '{reward} نقطة',
    requiredTime: '15 ثانية انتظار',
    startLiking: 'إعجاب بالدبوس واكسب {reward} نقطة',
    testAndPreview: 'اختبر حملتك ومعاينة الرابط',
    prevBtn: 'السابق &rarr;',
    nextBtn: '&larr; التالي',
    pageIndicator: 'المجموعة {current} من {total}',
    modalTitle: 'مهمة لايك بنترست',
    modalDesc: 'تبادل لايك وإعجابات دبابيس بنترست. يرجى الانتظار وتكمل التفاعل بالنافذة المفتوحة.',
    openTargetBtn: 'فتح الرابط وتحقيق الشرط 🔗',
    reopenTargetBtn: 'إعادة فتح الرابط',
    waitTimerText: 'مدة التحقق المتبقية: {seconds} ثانية',
    waitButtonText: 'انتظر ({seconds}ث) لفتح المكافأة',
    finishPreview: 'إنهاء وضع المعاينة',
    claimRewardBtn: 'تأكيد واحتساب {reward} نقطة لحسابك',
    leaveWarning: '🔴 تراجع؟ يرجى إكمال التصفح والانتظار حتى انتهاء المؤقت لتتمكن من المطالبة بالنقاط.',
    startAlert: '⚠️ يرجى الضغط على زر فتح الرابط أولاً بالمنتصف للبدء',
    verificationError: 'عذراً، لم نتمكن من تسجيل نقاطك. ربما قمت بهذا الفعل مسبقاً.'
  },
  en: {
    availableTitle: 'Available now: {count} campaigns',
    mainTitle: 'Pinterest Like Exchanges',
    mainDesc: 'Participate by liking and saving Pins of other members on Pinterest to collect instant points safely. Staying for 15 seconds is mandatory.',
    noCampaigns: 'No Pinterest like campaigns currently',
    noCampaignsDesc: 'Create your first Pinterest like campaign now and thousands of members will react to it immediately!',
    yourCampaign: 'Your Campaign ⭐️',
    rewardPoints: '{reward} Points',
    requiredTime: '15 seconds stay',
    startLiking: 'Like Pin & earn {reward} Points',
    testAndPreview: 'Test campaign & preview link',
    prevBtn: 'Previous &rarr;',
    nextBtn: '&larr; Next',
    pageIndicator: 'Page {current} of {total}',
    modalTitle: 'Pinterest Like Task',
    modalDesc: 'Pinterest pin like exchange. Please wait and complete the action in the opened window.',
    openTargetBtn: 'Open Link & Complete Task 🔗',
    reopenTargetBtn: 'Reopen Link',
    waitTimerText: 'Remaining Verification Time: {seconds} seconds',
    waitButtonText: 'Wait ({seconds}s) to unlock reward',
    finishPreview: 'Close Preview Mode',
    claimRewardBtn: 'Confirm & Claim {reward} Points for your account',
    leaveWarning: '🔴 Stop early? Please complete browsing and wait until the timer ends to claim points.',
    startAlert: '⚠️ Please click the "Open Link" button in the center first to begin',
    verificationError: 'Sorry, we couldn\'t record your point reward. You might have already done this campaign.'
  },
  fr: {
    availableTitle: 'Disponibles: {count} campagnes',
    mainTitle: 'Échanges de Likes Pinterest',
    mainDesc: 'Aimez et enregistrez les Pins d\'autres membres sur Pinterest pour accumuler des points. Un délai de présence de 15 secondes est requis.',
    noCampaigns: 'Aucun objectif de Like Pinterest',
    noCampaignsDesc: 'Créez votre première campagne de Likes Pinterest maintenant pour obtenir de l\'audience !',
    yourCampaign: 'Votre campagne ⭐️',
    rewardPoints: '{reward} Points',
    requiredTime: '15 secondes',
    startLiking: 'Liker le Pin & Gagner {reward} Pts',
    testAndPreview: 'Vérifier ma campagne & Aperçu',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} de {total}',
    modalTitle: 'Liker sur Pinterest',
    modalDesc: 'Échange de mentions j\'aime Pinterest. Veuillez patienter dans la fenêtre externe ouverte.',
    openTargetBtn: 'Ouvrir le lien & Accomplir la tâche 🔗',
    reopenTargetBtn: 'Rouvrir le lien',
    waitTimerText: 'Temps d\'authentification restant: {seconds} sec',
    waitButtonText: 'Patientez ({seconds}s) pour déverrouiller',
    finishPreview: 'Terminer la prévisualisation',
    claimRewardBtn: 'Confirmer & Créditer {reward} Pts',
    leaveWarning: '🔴 Quitter prématurément? Veuillez patienter jusqu\'au bout du chronomètre requis pour recevoir vos récompenses.',
    startAlert: '⚠️ Veuillez d\'abord cliquer sur le bouton d\'ouverture au centre pour démarrer',
    verificationError: 'Erreur technique lors de la validation. Campagne probablement déjà accomplie.'
  },
  es: {
    availableTitle: 'Disponibles: {count} de campañas',
    mainTitle: 'Intercambios de Likes Pinterest',
    mainDesc: 'Deje me gustas en los Pines de Pinterest de otros miembros para ganar saldo. Es obligatorio permanecer 15 segundos en navegación.',
    noCampaigns: 'No hay campañas de Likes Pinterest activas',
    noCampaignsDesc: 'Lanza tu nueva promoción para sumar likes Pinterest auténticos en minutos.',
    yourCampaign: 'Su campaña ⭐️',
    rewardPoints: '{reward} Puntos',
    requiredTime: '15 segundos',
    startLiking: 'Dar Like a Pin & Gagner {reward} Pts',
    testAndPreview: 'Vérifier ma campagne & Aperçu',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} de {total}',
    modalTitle: 'Dar Like en Pinterest',
    modalDesc: 'Intercambio de likes de Pinterest. Por favor espere en la ventana abierta de arriba.',
    openTargetBtn: 'Abrir enlace & Completar tarea 🔗',
    reopenTargetBtn: 'Reabrir enlace',
    waitTimerText: 'Tiempo de autenticación restante: {seconds} s',
    waitButtonText: 'Espere ({seconds}s) para desbloquear',
    finishPreview: 'Cerrar vista previa',
    claimRewardBtn: 'Confirmar & reclamar {reward} Puntos',
    leaveWarning: '🔴 ¿Cerrar antes? Manténgase en la página hasta completar el tiempo para poder reclamar sus puntos.',
    startAlert: '⚠️ Por favor, pulse el botón azul de apertura de arriba primero',
    verificationError: 'Error técnico al validar. Probablemente la campaña ya está realizada.'
  }
};

export default function LikePinterest({ user, onPointsEarned, lang = 'en' }: LikePinterestProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCamp, setActiveCamp] = useState<Campaign | null>(null);
  
  // Modal & Timer States
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerRunning, setTimerRunning] = useState(false);
  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const [windowClosedEarly, setWindowClosedEarly] = useState(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [actualSecondsElapsed, setActualSecondsElapsed] = useState(0);

  // Verification process overlay state
  const [isVerifying, setIsVerifying] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6;

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = pinLikeTranslations[activeLang];

  const openedWindowRef = useRef<Window | null>(null);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    loadCampaigns();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user.uid]);

  const loadCampaigns = () => {
    const list = db.getCampaigns()
      .filter(c => c.type === 'pinterest_like' && c.status === 'active')
      .filter(c => !db.getHistory().some(i => i.campaignId === c.id && i.userId === user.uid) && !db.hasPendingOrApprovedVerification(user.uid, c.id));
    setCampaigns(list);
  };

  // Timer loop logic
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
        setActualSecondsElapsed(prev => prev + 1);

        // Check window state
        if (openedWindowRef.current && openedWindowRef.current.closed) {
          setWindowClosedEarly(true);
          setTimerRunning(false);
          setAlertMsg(t.leaveWarning);
          clearInterval(intervalRef.current);
        }
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timeLeft, t.leaveWarning]);

  // Pagination math
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  const currentCampaigns = campaigns.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const startCampaignTask = (camp: Campaign) => {
    setActiveCamp(camp);
    setTimeLeft(15);
    setActualSecondsElapsed(0);
    setWindowClosedEarly(false);
    setTimerRunning(false);
    setHasOpenedLink(false);
    setAlertMsg(null);
  };

  const handleOpenLink = () => {
    if (!activeCamp) return;
    setHasOpenedLink(true);
    setWindowClosedEarly(false);
    setAlertMsg(null);
    setTimerRunning(true);
    
    const win = window.open(activeCamp.youtubeUrl, '_blank');
    openedWindowRef.current = win;
  };

  const handleClaimPoints = () => {
    if (!activeCamp || timeLeft > 0) return;

    if (activeCamp.creatorId === user.uid) {
      setActiveCamp(null);
      return;
    }

    if (!hasOpenedLink) return;

    setIsVerifying(true);
  };

  const handleVerificationSuccess = (profileHandle: string) => {
    const reward = activeCamp?.rewardPerAction || 40; 
    const success = db.recordInteraction(user.uid, activeCamp!.id, 'pinterest_like', reward, profileHandle);

    setIsVerifying(false);
    if (success) {
      setActiveCamp(null);
      onPointsEarned();
      loadCampaigns();
    } else {
      setAlertMsg(t.verificationError);
    }
  };

  return (
    <div className={`w-full font-sans ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6 flex-row">
        <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          {t.availableTitle.replace('{count}', campaigns.length.toString())}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 flex-row">
          {t.mainTitle}
          <Pin className="w-6 h-6 text-red-500" />
        </h2>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {t.mainDesc}
      </p>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6">
          <Pin className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-300 font-bold mb-1">{t.noCampaigns}</p>
          <p className="text-xs text-slate-500">{t.noCampaignsDesc}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCampaigns.map((camp) => (
              <div id={`pin-like-card-${camp.id}`} key={camp.id} className="bg-slate-900 border border-slate-800 hover:border-red-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px]">
                <div>
                   <div className="flex items-center justify-between mb-3 flex-row">
                     {camp.creatorId === user.uid ? (
                       <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                         {t.yourCampaign}
                       </span>
                     ) : (
                       <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full flex-row">
                         {t.rewardPoints.replace('{reward}', (camp.rewardPerAction || 40).toString())}
                         <Award className="w-3.5 h-3.5" />
                       </div>
                     )}
                     <div className="text-xs text-slate-500 flex items-center gap-1 font-mono flex-row">
                       {t.requiredTime}
                       <Clock className="w-3.5 h-3.5 font-mono" />
                     </div>
                   </div>
                   <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 h-10 mb-2">
                     {camp.title}
                   </h3>
                </div>

                <button
                  id={`pin-like-btn-${camp.id}`}
                  onClick={() => startCampaignTask(camp)}
                  className="w-full py-3 bg-slate-950 border border-slate-850 hover:bg-red-655 hover:border-red-500 text-slate-200 hover:text-white rounded-xl font-bold text-xs transition-all duration-250 flex items-center justify-center gap-1.5 flex-row cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4 text-red-500 hover:text-white" />
                  <span>{camp.creatorId === user.uid ? t.testAndPreview : t.startLiking.replace('{reward}', (camp.rewardPerAction || 40).toString())}</span>
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-row">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-red-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.prevBtn}</span>
              </button>
              
              <span className="text-xs font-bold text-slate-300 font-mono">
                {t.pageIndicator.replace('{current}', (currentPage + 1).toString()).replace('{total}', totalPages.toString())}
              </span>

              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-red-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.nextBtn}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* CONFIRMATION OVERLAY MODAL */}
      {activeCamp && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0f141c] border border-slate-800/80 rounded-3xl p-6 md:p-8 flex flex-col items-center relative shadow-2xl overflow-hidden">
            
            {/* Ambient Background Glows */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl pointer-events-none opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none opacity-20 animate-pulse"></div>

            {/* Absolute Top-Left Close Button */}
            <button
              id="close-sub-modal-btn"
              onClick={() => {
                if (timeLeft > 0 && hasOpenedLink && !windowClosedEarly) {
                  setAlertMsg(t.leaveWarning);
                } else {
                  setActiveCamp(null);
                }
              }}
              className="absolute top-4 left-4 p-2 bg-slate-950/50 hover:bg-slate-800 border border-slate-800/40 rounded-xl text-slate-400 hover:text-white transition cursor-pointer z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Centered App Icon Avatar with pulsing animations */}
            <div className="inline-flex p-5 rounded-full mb-4 bg-gradient-to-tr from-red-600 to-rose-600 text-red-500 border border-red-500/20 shadow-lg shadow-red-500/10 animate-pulse">
              <Pin className="w-10 h-10 text-white" />
            </div>

            {/* Campaign Title */}
            <h3 className="text-lg font-black text-white mb-1.5 truncate max-w-[280px]">
              {activeCamp.title}
            </h3>

            {/* Dynamic Instructional Subtitle */}
            <p className="text-xs text-slate-400 mb-6 max-w-sm leading-relaxed text-center font-semibold">
              {t.modalDesc}
            </p>

            {/* Reopen / Open direct Action Button */}
            <button
              onClick={handleOpenLink}
              className="w-full py-3 px-6 bg-slate-950 hover:bg-slate-855 text-slate-200 border border-slate-855 hover:border-slate-800 rounded-2xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 mb-4 shadow-sm flex-row"
            >
              <Pin className="w-3.5 h-3.5 text-red-500" />
              <span>{hasOpenedLink ? t.reopenTargetBtn : t.openTargetBtn}</span>
            </button>

            {/* State alerts (early close, missing path etc.) */}
            {alertMsg && (
              <div className="w-full mb-4 text-[11px] text-rose-450 font-bold bg-rose-500/10 border border-rose-500/15 py-2.5 px-3 rounded-xl flex items-center gap-2 text-right flex-row">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span className="flex-1 leading-relaxed">{alertMsg}</span>
              </div>
            )}

            {/* High-fidelity custom timer pill */}
            <div className="px-5 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-500 text-xs font-black flex items-center justify-center gap-1.5 font-sans mb-8 flex-row">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>{t.waitTimerText.replace('{seconds}', timeLeft.toString())}</span>
            </div>

            {/* Action Claim button at the bottom of the card */}
            {timeLeft > 0 ? (
              <button
                disabled
                className="w-full py-4 bg-slate-950/60 border border-slate-855 text-slate-600 font-extrabold text-xs rounded-2xl cursor-not-allowed flex items-center justify-center gap-1.5 font-sans shadow-inner flex-row"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{t.waitButtonText.replace('{seconds}', timeLeft.toString())}</span>
              </button>
            ) : activeCamp.creatorId === user.uid ? (
              <button
                onClick={() => setActiveCamp(null)}
                className="w-full py-4 bg-slate-850 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl transition cursor-pointer font-sans"
              >
                {t.finishPreview}
              </button>
            ) : hasOpenedLink ? (
              <button
                id="claim-pin-like-btn"
                onClick={handleClaimPoints}
                className="w-full py-4 bg-gradient-to-l from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-xs rounded-2xl transition shadow-lg shadow-emerald-500/10 cursor-pointer animate-pulse font-sans flex items-center justify-center gap-1.5 animate-pulse flex-row"
              >
                <Sparkles className="w-4 h-4 text-white animate-spin" />
                <span>{t.claimRewardBtn.replace('{reward}', (activeCamp?.rewardPerAction || 40).toString())}</span>
              </button>
            ) : (
              <span className="text-xs text-amber-400 font-bold font-sans text-center">
                {t.startAlert}
              </span>
            )}

          </div>
        </div>
      )}

      {/* SECURED VERIFICATION PROCESS OVERLAY */}
      <TaskVerificationOverlay
        isOpen={isVerifying}
        onClose={() => setIsVerifying(false)}
        onSuccess={handleVerificationSuccess}
        campaignTitle={activeCamp?.title || ''}
        campaignType="pinterest_like"
        requiredSeconds={15}
        actualSecondsElapsed={actualSecondsElapsed}
        hasOpenedLink={hasOpenedLink}
        windowClosedEarly={windowClosedEarly}
        campaignId={activeCamp?.id}
        campaignUrl={activeCamp?.youtubeUrl}
        rewardPoints={activeCamp?.rewardPerAction || 40}
      />
    </div>
  );
}
