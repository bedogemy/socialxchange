import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { ThumbsUp, Clock, Award, AlertCircle, Sparkles, X, ShieldAlert, Info } from 'lucide-react';
import TaskVerificationOverlay from './TaskVerificationOverlay';
import { SupportedLanguages } from '../lib/translations';

interface LikeXProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const xLikeTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    availableTitle: 'متاح حالياً: {count} حملة',
    mainTitle: 'تبادل لايكات وإعجابات منصة إكس (Twitter)',
    mainDesc: 'شارك بوضع لايكات وإعجابات على تغريدات ومنشورات الأعضاء على منصة إكس (تويتر) لجمع نقاط مكافأة فورية. البقاء بالتصفح لـ 15 ثانية إلزامي لتوثيق المصداقية.',
    noCampaigns: 'لا توجد حملات لايك إكس حالياً',
    noCampaignsDesc: 'انشئ حملتك الإعلانية الأولى للايكات الآن وسيتفاعل آلاف الداعمين معها فوراً!',
    yourCampaign: 'حملتك الإعلانية ⭐️',
    rewardPoints: '{reward} نقطة',
    requiredTime: '15 ثانية انتظار',
    startLiking: 'إعجاب بالتغريدة واكسب {reward} نقطة',
    testAndPreview: 'اختبر حملتك ومعاينة الرابط',
    prevBtn: 'السابق &rarr;',
    nextBtn: '&larr; التالي',
    pageIndicator: 'المجموعة {current} من {total}',
    modalTitle: 'مهمة إعجاب إكس (X)',
    modalDesc: 'تبادل لايك وتفاعلات إكس. يرجى الانتظار وتكمل التفاعل بالنافذة المفتوحة.',
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
    mainTitle: 'X (Twitter) Like Exchanges',
    mainDesc: 'Participate by liking tweets and posts of other members on X (Twitter) to collect instant points. Staying for 15 seconds is mandatory to verify authenticity.',
    noCampaigns: 'No X like campaigns currently',
    noCampaignsDesc: 'Create your first X like campaign now and thousands of members will react to it immediately!',
    yourCampaign: 'Your Campaign ⭐️',
    rewardPoints: '{reward} Points',
    requiredTime: '15 seconds stay',
    startLiking: 'Like Tweet & earn {reward} Points',
    testAndPreview: 'Test campaign & preview link',
    prevBtn: 'Previous &rarr;',
    nextBtn: '&larr; Next',
    pageIndicator: 'Page {current} of {total}',
    modalTitle: 'X (Twitter) Like Task',
    modalDesc: 'X like and interaction exchange. Please wait and complete the action in the opened window.',
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
    mainTitle: 'Échanges de Likes X (Twitter)',
    mainDesc: 'Dejez des likes sur les tweets et les publications d\'autres membres sur X (Twitter) pour gagner des points. Staying for 15s is mandatory.',
    noCampaigns: 'Aucun objectif de Like X',
    noCampaignsDesc: 'Créez votre première campagne X Like maintenant pour obtenir de l\'audience instantanée !',
    yourCampaign: 'Votre campagne ⭐️',
    rewardPoints: '{reward} Points',
    requiredTime: '15 secondes',
    startLiking: 'Liker le tweet & Gagner {reward} Pts',
    testAndPreview: 'Vérifier ma campagne & Aperçu',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} de {total}',
    modalTitle: 'Liker sur X',
    modalDesc: 'Échange de j\'aime X. Veuillez patienter dans la fenêtre externe ouverte.',
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
    mainTitle: 'Intercambios de Likes X (Twitter)',
    mainDesc: 'Complete interacciones de like en las publicaciones y tweets de la comunidad de X (Twitter) para cobrar puntos de recompensa.',
    noCampaigns: 'No hay campañas de Likes X activas',
    noCampaignsDesc: 'Lanza tu nueva promoción para sumar likes auténticos en minutos.',
    yourCampaign: 'Su campaña ⭐️',
    rewardPoints: '{reward} Puntos',
    requiredTime: '15 segundos',
    startLiking: 'Dar like & Ganar {reward} Puntos',
    testAndPreview: 'Probar y Validar Campaña',
    prevBtn: 'Anterior &rarr;',
    nextBtn: '&larr; Siguiente',
    pageIndicator: 'Página {current} de {total}',
    modalTitle: 'Acción Like X',
    modalDesc: 'Intercambio de reacciones de me gusta de publicaciones X. Complete la interacción en el destino abierto.',
    openTargetBtn: 'Abrir Enlace y Cumplir Tarea 🔗',
    reopenTargetBtn: 'Reabrir Enlace',
    waitTimerText: 'Temporizador de Validación: {seconds} segundos',
    waitButtonText: 'Faltan ({seconds}s) para cobrar',
    finishPreview: 'Finalizar modo de prueba',
    claimRewardBtn: 'Comprobar y Recibir {reward} Puntos',
    leaveWarning: '🔴 ¿Desea abandonar? Debe cumplir los segundos estipulados para habilitar el cobro de puntos.',
    startAlert: '⚠️ Oprima el botón del centro para abrir el tweet objetivo del anunciante',
    verificationError: 'Surgió un error. Su interacción de like no puede ser validada nuevamente.'
  }
};

export default function LikeX({ user, onPointsEarned, lang = 'en' }: LikeXProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCamp, setActiveCamp] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  // High-precision tracking states
  const [hasOpenedLink, setHasOpenedLink] = useState<boolean>(false);
  const [actualSecondsElapsed, setActualSecondsElapsed] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [windowClosedEarly, setWindowClosedEarly] = useState<boolean>(false);

  const openedWindowRef = useRef<Window | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const campaignsPerPage = 10;

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = xLikeTranslations[activeLang];

  const loadCampaigns = () => {
    const allCampaigns = db.getCampaigns();
    const interactions = db.getHistory();
    const filtered = allCampaigns.filter(c => 
      c.status === 'active' && 
      c.type === 'x_like' && 
      !interactions.some(i => i.campaignId === c.id && i.userId === user.uid) &&
      !db.hasPendingOrApprovedVerification(user.uid, c.id)
    );
    setCampaigns(filtered);
  };

  useEffect(() => {
    loadCampaigns();
    const handleUpdate = () => {
      loadCampaigns();
    };
    window.addEventListener('ytsocial_campaigns_updated', handleUpdate);
    return () => {
      window.removeEventListener('ytsocial_campaigns_updated', handleUpdate);
    };
  }, [user.uid]);

  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const startIndex = currentPage * campaignsPerPage;
  const currentCampaigns = campaigns.slice(startIndex, startIndex + campaignsPerPage);

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (currentCampaigns.length === 0 && campaigns.length > 0) {
      setCurrentPage(0);
    }
  }, [campaigns.length, totalPages, currentPage, currentCampaigns.length]);

  // High-Precision timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
        setActualSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && activeCamp && timerRunning) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timeLeft, activeCamp]);

  const handleStart = (campaign: Campaign) => {
    setActiveCamp(campaign);
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
    const success = db.recordInteraction(user.uid, activeCamp!.id, 'x_like', reward, profileHandle);

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
          <ThumbsUp className="w-6 h-6 text-slate-300" />
        </h2>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed font-semibold">
        {t.mainDesc}
      </p>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6">
          <ThumbsUp className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-300 font-bold mb-1">{t.noCampaigns}</p>
          <p className="text-xs text-slate-500">{t.noCampaignsDesc}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCampaigns.map((camp) => (
              <div id={`x-like-card-${camp.id}`} key={camp.id} className="bg-slate-900 border border-slate-800 hover:border-slate-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px]">
                <div>
                   <div className="flex items-center justify-between mb-3 flex-row">
                     {camp.creatorId === user.uid ? (
                       <span className="text-[10px] bg-slate-850 text-slate-300 font-bold px-2 py-0.5 rounded-full border border-slate-800">
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
                       <Clock className="w-3.5 h-3.5" />
                     </div>
                   </div>
                   <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 h-10 mb-2">
                     {camp.title}
                   </h3>
                   <p className="text-xs text-slate-500 truncate font-mono">createdBy: {camp.creatorEmail}</p>
                </div>

                <button
                  id={`x-like-start-${camp.id}`}
                  onClick={() => handleStart(camp)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700 rounded-xl font-semibold text-xs text-slate-300 transition flex items-center justify-center gap-1.5 cursor-pointer flex-row"
                >
                  <ThumbsUp className="w-4 h-4 text-slate-300" />
                  <span>{camp.creatorId === user.uid ? t.testAndPreview : t.startLiking.replace('{reward}', (camp.rewardPerAction || 40).toString())}</span>
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-row">
              <button
                id="x-like-prev-btn"
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-bold text-slate-400 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                {t.prevBtn}
              </button>
              <span className="text-xs font-bold font-mono text-slate-400">
                {t.pageIndicator.replace('{current}', (currentPage + 1).toString()).replace('{total}', totalPages.toString())}
              </span>
              <button
                id="x-like-next-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs font-bold text-slate-400 hover:text-white disabled:opacity-50 cursor-pointer"
              >
                {t.nextBtn}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action modal for single active campaign */}
      {activeCamp && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl">
            <button
              id="x-like-close-modal"
              onClick={() => {
                setActiveCamp(null);
                setTimerRunning(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-black text-white mb-2 flex items-center gap-2 flex-row">
              {t.modalTitle}
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h3>
            <p className="text-xs text-slate-400 mb-5 leading-relaxed">{t.modalDesc}</p>

            <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 mb-5 space-y-4">
              <div className="flex items-center gap-2 flex-row">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-[11px] text-slate-400 font-bold block">
                  {lang === 'ar' 
                    ? '1. انقر فتح الرابط بالأسفل للمتابعة بالنافذة.' 
                    : '1. Click open target button below to visit and like.'}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-row">
                <Info className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-[11px] text-slate-400 font-bold block">
                  {lang === 'ar' 
                    ? '2. انتظر المؤقت حتي ينتهي بالكامل للتحقق.' 
                    : '2. Wait for the counter to complete for verification.'}
                </span>
              </div>
            </div>

            {hasOpenedLink && timeLeft > 0 && (
              <p className="text-xs text-amber-500 font-bold mb-4 bg-amber-500/10 p-3 rounded-lg flex items-center gap-2 flex-row">
                <ShieldAlert className="w-4 h-4" />
                {t.leaveWarning}
              </p>
            )}

            {alertMsg && (
              <p className="text-xs text-red-500 font-bold mb-4 bg-red-500/10 p-3 rounded-lg flex items-center gap-2 flex-row">
                <ShieldAlert className="w-4 h-4" />
                {alertMsg}
              </p>
            )}

            <div className="space-y-3">
              <button
                id="x-like-open-link"
                onClick={handleOpenLink}
                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer flex-row ${
                  hasOpenedLink 
                    ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-750' 
                    : 'bg-white text-slate-950 font-black hover:bg-slate-100 shadow-lg'
                }`}
              >
                <span>{hasOpenedLink ? t.reopenTargetBtn : t.openTargetBtn}</span>
              </button>

              {hasOpenedLink && (
                <div className="pt-2 text-center">
                  {timeLeft > 0 ? (
                    <button
                      id="x-like-timer-btn"
                      disabled
                      className="w-full py-3 bg-slate-950 text-slate-500 border border-slate-850 rounded-xl text-xs font-mono font-black"
                    >
                      {t.waitButtonText.replace('{seconds}', timeLeft.toString())}
                    </button>
                  ) : (
                    <button
                      id="x-like-claim-btn"
                      onClick={handleClaimPoints}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition cursor-pointer shadow-lg shadow-emerald-500/10"
                    >
                      {activeCamp.creatorId === user.uid ? t.finishPreview : t.claimRewardBtn.replace('{reward}', (activeCamp.rewardPerAction || 40).toString())}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Verification Overlay (same schema as Facebook / YouTube verification inputs) */}
      <TaskVerificationOverlay
        isOpen={isVerifying}
        onClose={() => setIsVerifying(false)}
        onSuccess={handleVerificationSuccess}
        campaignTitle={activeCamp?.title || ''}
        campaignType="x_like"
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
