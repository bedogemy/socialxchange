import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { Play, Eye, Clock, Award, ShieldAlert, X, AlertCircle, Sparkles } from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

interface WatchVideosProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const watchTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    availableVideos: 'متاح حالياً: {count} فيديو',
    mainTitle: 'مشاهدة الفيديوهات وكسب النقاط',
    mainDesc: 'قم بمشاهدة فيديوهات صناع المحتوى الموضحة بالأسفل لتجميع النقاط. يرجى إبقاء تركيزك على الفيديو والانتهاء من كامل المدة المطلوبة للحصول على مكافأتك بنجاح لتجنب تجميد المؤقت.',
    noCampaigns: 'لا توجد حملات مشاهدة متاحة الآن',
    noCampaignsDesc: 'حاول مرة أخرى لاحقاً، أو كن أول من يطلق حملة إعلانية ليراها آلاف الزوار!',
    yourCampaign: 'حملتك الإعلانية ⭐️ (معاينة)',
    pointsUnit: 'نقطة',
    secondsUnit: 'ثانية',
    testAndPreview: 'اختبر ومعاينة حملتك الإعلانية',
    watchAndEarn: 'شاهد واكسب {reward} نقطة',
    prevBtn: 'السابق &rarr;',
    nextBtn: '&larr; التالي',
    pageIndicator: 'المجموعة {current} من {total}',
    nowWatching: 'تشاهد الآن:',
    remainingTime: 'متبقي: {seconds} ثانية',
    timeCompleted: 'كتمل الوقت!',
    leaveWarning: '⚠️ يرجى عدم إغلاق الفيديو قبل انتهاء الوقت المتبقي! إذا خرجت فلن تحصل على نقاط المكافأة.',
    barDisabled: 'شريط التحكم معطل لحظر التخطّي',
    rewardVolume: 'حجم الجائزة عند الانتهاء:',
    watchText: 'شاهد مدة لا تقل عن {seconds} ثانية',
    finishPreview: 'إنهاء وضع المعاينة التوضيحية',
    claimRewardBtn: 'احصل على {reward} نقطة الآن',
    timerPausedAlert: '🔴 تم إيقاف المؤقت مؤقتاً لأنك تركت نافذة الفيديو! يرجى الاستمرار في المشاهدة لكسب النقاط.',
    rewardError: 'خطأ في منح النقاط. قد تكون شاهدت هذا الفيديو بالفعل.'
  },
  en: {
    availableVideos: 'Available now: {count} videos',
    mainTitle: 'Watch Videos & Earn Points',
    mainDesc: 'Watch videos from the content creators below to accumulate points. Please maintain focus on the video tab and watch the full duration to claim your points successfully.',
    noCampaigns: 'No watch campaigns available currently',
    noCampaignsDesc: 'Try again later, or be the first to launch an advertising campaign to showcase it to thousands of members!',
    yourCampaign: 'Your Campaign ⭐️ (Preview)',
    pointsUnit: 'Points',
    secondsUnit: 'seconds',
    testAndPreview: 'Test & Preview Your Campaign',
    watchAndEarn: 'Watch & Earn {reward} Points',
    prevBtn: 'Previous &rarr;',
    nextBtn: '&larr; Next',
    pageIndicator: 'Page {current} of {total}',
    nowWatching: 'Now Watching:',
    remainingTime: 'Remaining: {seconds} seconds',
    timeCompleted: 'Time Completed!',
    leaveWarning: '⚠️ Please do not close the video until the timer has finished! If you exit, you will not receive your point rewards.',
    barDisabled: 'Control bar disabled to prevent skipping',
    rewardVolume: 'Reward on completion:',
    watchText: 'Watch for at least {seconds} seconds',
    finishPreview: 'Finish Preview Mode',
    claimRewardBtn: 'Claim {reward} Points Now',
    timerPausedAlert: '🔴 Timer paused because you left the video tab! Please keep watching to earn points.',
    rewardError: 'Failed to reward points. You might have watched this video already.'
  },
  fr: {
    availableVideos: 'Disponible: {count} vidéos',
    mainTitle: 'Regarder des vidéos & Gagner des Points',
    mainDesc: 'Regardez les vidéos proposées ci-dessous pour accumuler de nouveaux points. Veuillez garder le focus sur la vidéo tout au long du minutage pour récolter vos récompenses.',
    noCampaigns: 'Aucun média disponible pour le moment',
    noCampaignsDesc: 'Repassez plus tard, ou devenez le premier membre à lancer sa campagne publicitaire !',
    yourCampaign: 'Votre campagne ⭐️ (Aperçu)',
    pointsUnit: 'Points',
    secondsUnit: 'secondes',
    testAndPreview: 'Essayer & Prévisualiser votre campagne',
    watchAndEarn: 'Regarder & Gagner {reward} Points',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} sur {total}',
    nowWatching: 'Lecture en cours:',
    remainingTime: 'Restant: {seconds} sec',
    timeCompleted: 'Temps écoulé !',
    leaveWarning: '⚠️ Ne fermez pas la vidéo avant la fin du temps requis sinon vous ne gagnerez pas vos points.',
    barDisabled: 'Barre de contrôle désactivée pour éviter la triche',
    rewardVolume: 'Gain potentiel à la clé:',
    watchText: 'Regarder encore {seconds} secondes',
    finishPreview: 'Terminer la prévisualisation',
    claimRewardBtn: 'Réclamer {reward} Points',
    timerPausedAlert: '🔴 Horloge suspendue parce que vous avez quitté la page de la vidéo ! Poursuivez la lecture.',
    rewardError: 'Erreur d\'attribution. Vous avez sûrement déjà visionné ce média.'
  },
  es: {
    availableVideos: 'Disponibles: {count} videos',
    mainTitle: 'Vea Videos y Gane Puntos',
    mainDesc: 'Vea videos de los creadores a continuación para juntar puntos de saldo. No minimice la pestaña y siga el contador de tiempo real para asegurar el premio.',
    noCampaigns: 'No hay campañas de video disponibles',
    noCampaignsDesc: 'Regrese pronto, o patrocine una nueva campaña para que otros miembros interactúen con ella.',
    yourCampaign: 'Su Campaña ⭐️ (Apercepción)',
    pointsUnit: 'Puntos',
    secondsUnit: 'segundos',
    testAndPreview: 'Probar y Ver Mi Campaña',
    watchAndEarn: 'Ver y Ganar {reward} Puntos',
    prevBtn: 'Anterior &rarr;',
    nextBtn: '&larr; Siguiente',
    pageIndicator: 'Página {current} de {total}',
    nowWatching: 'Reproduciendo ahora:',
    remainingTime: 'Faltan: {seconds} segundos',
    timeCompleted: '¡Tiempo completado!',
    leaveWarning: '⚠️ ¡No cierre la ventana antes de que acabe el tiempo para no perder sus puntos de bonificación!',
    barDisabled: 'Barra de controles no disponible para evitar saltos',
    rewardVolume: 'Recompensa final:',
    watchText: 'Vea por al menos {seconds} segundos',
    finishPreview: 'Finalizar Vista Previa',
    claimRewardBtn: 'Reclamar {reward} Puntos Ahora',
    timerPausedAlert: '🔴 ¡Contador en pausa porque salió de la ventana de reproducción! Continúe viendo para ganar puntos.',
    rewardError: 'Error al asignar los puntos. Posiblemente ya vio este video anteriormente.'
  }
};

export default function WatchVideos({ user, onPointsEarned, lang = 'en' }: WatchVideosProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeVideo, setActiveVideo] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<boolean>(false);

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = watchTranslations[activeLang];

  // High-precision tracking states
  const [hasOpenedLink, setHasOpenedLink] = useState<boolean>(false);
  const [actualSecondsElapsed, setActualSecondsElapsed] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const campaignsPerPage = 10;

  // Load available watch campaigns
  const loadCampaigns = () => {
    const allCampaigns = db.getCampaigns();
    const interactions = db.getHistory();
    
    // Filter out:
    // 1. Not active
    // 2. Not 'view' type
    // 3. Already viewed by user (keep user's own campaigns so they can verify they are launched!)
    const filtered = allCampaigns.filter(c => 
      c.status === 'active' && 
      c.type === 'view' && 
      !interactions.some(i => i.campaignId === c.id && i.userId === user.uid)
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

  // Safely adjust page index if campaign list shrinks after watching
  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (currentCampaigns.length === 0 && campaigns.length > 0) {
      setCurrentPage(0);
    }
  }, [campaigns.length, totalPages, currentPage, currentCampaigns.length]);

  // Focus tracking to prevent tab switching or skipping
  useEffect(() => {
    const handleBlur = () => {
      if (timerRunning && activeVideo) {
        setTimerRunning(false);
        setAlertMsg(t.timerPausedAlert);
      }
    };

    const handleFocus = () => {
      if (!timerRunning && activeVideo && timeLeft > 0 && !claimed) {
        setTimerRunning(true);
        setAlertMsg(null);
      }
    };

    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [timerRunning, activeVideo, timeLeft, claimed, t.timerPausedAlert]);

  // Countdown clock loop
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        setActualSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && activeVideo && timerRunning) {
      setTimerRunning(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timeLeft, activeVideo]);

  const handleStartWatching = (campaign: Campaign) => {
    setActiveVideo(campaign);
    setTimeLeft(campaign.duration);
    setActualSecondsElapsed(0);
    setTimerRunning(true);
    setHasOpenedLink(true);
    setClaimed(false);
    setAlertMsg(null);
  };

  const handleClaimPoints = () => {
    if (!activeVideo || timeLeft > 0) return;

    if (activeVideo.creatorId === user.uid) {
      setClaimed(true);
      setActiveVideo(null);
      setAlertMsg(null);
      return;
    }

    const reward = activeVideo.rewardPerAction;
    const success = db.recordInteraction(user.uid, activeVideo.id, 'view', reward, 'auto_visitor');

    if (success) {
      setClaimed(true);
      setActiveVideo(null);
      onPointsEarned();
      loadCampaigns();
    } else {
      setAlertMsg(t.rewardError);
    }
  };

  return (
    <div className={`w-full font-sans ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6 flex-row">
        <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          {t.availableVideos.replace('{count}', campaigns.length.toString())}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 flex-row">
          {t.mainTitle}
          <Eye className="w-6 h-6 text-red-500" />
        </h2>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {t.mainDesc}
      </p>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6">
          <Eye className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-300 font-bold mb-1">{t.noCampaigns}</p>
          <p className="text-xs text-slate-500">{t.noCampaignsDesc}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCampaigns.map((camp) => (
              <div id={`video-card-${camp.id}`} key={camp.id} className="bg-slate-900 border border-slate-800 hover:border-red-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px]">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-row">
                    {camp.creatorId === user.uid ? (
                      <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                        {t.yourCampaign}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full flex-row">
                        {camp.rewardPerAction} {t.pointsUnit}
                        <Award className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <div className="text-xs text-slate-500 flex items-center gap-1 font-mono flex-row">
                      {camp.duration} {t.secondsUnit}
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 h-10 mb-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-500">createdBy: {camp.creatorEmail}</p>
                </div>

                <button
                  id={`watch-start-btn-${camp.id}`}
                  onClick={() => handleStartWatching(camp)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-red-500 hover:text-white border border-slate-800 hover:border-red-500 rounded-xl font-semibold text-xs text-red-500 transition flex items-center justify-center gap-1.5 cursor-pointer flex-row"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{camp.creatorId === user.uid ? t.testAndPreview : t.watchAndEarn.replace('{reward}', camp.rewardPerAction.toString())}</span>
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

      {/* ANTIBYPASS WATCH MODAL PLAYER */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
            {/* Top Bar with Timer */}
            <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between flex-row">
              <div>
                <span className="text-xs text-slate-500">{t.nowWatching}</span>
                <h3 className="text-sm font-bold text-white truncate max-w-xs md:max-w-md">{activeVideo.title}</h3>
              </div>
              
              <div className="flex items-center gap-3 flex-row">
                {/* Countdown display */}
                <div id="countdown-timer-display" className={`px-4 py-2 rounded-xl flex items-center gap-2 font-black font-mono text-sm shadow-inner flex-row-reverse ${
                  timeLeft > 0 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-emerald-500/10 text-emerald-500'
                }`}>
                  <Clock className="w-4 h-4" />
                  {timeLeft > 0 ? (
                    <span>{t.remainingTime.replace('{seconds}', timeLeft.toString())}</span>
                  ) : (
                    <span className="flex items-center gap-1 animate-bounce">
                      {t.timeCompleted} <Sparkles className="w-3.5 h-3.5 fill-current" />
                    </span>
                  )}
                </div>

                {/* Exit button is blocked until completion */}
                <button
                  id="close-video-modal-btn"
                  onClick={() => {
                    if (timeLeft > 0) {
                      setAlertMsg(t.leaveWarning);
                    } else {
                      setActiveVideo(null);
                    }
                  }}
                  className="p-2 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Display Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              {/* Disable double clicking and cover user interfaces by transparent mask so they don't skip */}
              <div className="absolute inset-x-0 top-0 h-10 bg-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-transparent z-10"></div>
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-transparent z-10"></div>
              
              <iframe
                id="yt-player-iframe"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&enablejsapi=1&controls=0&rel=0&disablekb=1&fs=0&origin=${window.location.origin}`}
                title={activeVideo.title}
                className="w-full h-full border-0 pointer-events-auto"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {/* Locked view overlay when timer is running */}
              {timeLeft > 0 && (
                <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-medium z-20 flex items-center gap-1 pointer-events-none flex-row">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  {t.barDisabled}
                </div>
              )}
            </div>

            {/* Custom alerts under the video */}
            {alertMsg && (
              <div className="p-3 bg-red-500/10 border-y border-red-500/20 text-red-400 text-xs text-center flex items-center justify-center gap-2 flex-row">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{alertMsg}</span>
              </div>
            )}

            {/* Bottom claim bar */}
            <div className="bg-slate-950 p-5 border-t border-slate-800 flex items-center justify-between flex-row">
              <div>
                <span className="text-xs text-slate-400">{t.rewardVolume}</span>
                <p className="text-lg font-extrabold text-amber-500">{activeVideo.rewardPerAction} {t.pointsUnit}</p>
              </div>

              {timeLeft > 0 ? (
                <button
                  disabled
                  className="py-3 px-6 bg-slate-800 text-slate-500 font-bold text-sm rounded-xl cursor-not-allowed flex items-center gap-2 flex-row"
                >
                  <Clock className="w-4 h-4" />
                  {t.watchText.replace('{seconds}', timeLeft.toString())}
                </button>
              ) : activeVideo.creatorId === user.uid ? (
                <button
                  id="claim-points-view-btn"
                  onClick={handleClaimPoints}
                  className="py-3 px-8 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg cursor-pointer animate-pulse"
                >
                  {t.finishPreview}
                </button>
              ) : (
                <button
                  id="claim-points-view-btn"
                  onClick={handleClaimPoints}
                  className="py-3 px-8 bg-gradient-to-l from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer animate-pulse-slow"
                >
                  {t.claimRewardBtn.replace('{reward}', activeVideo.rewardPerAction.toString())}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
