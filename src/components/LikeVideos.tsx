import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { ThumbsUp, Clock, Award, ShieldAlert, X, AlertCircle, Sparkles } from 'lucide-react';
import TaskVerificationOverlay from './TaskVerificationOverlay';
import { SupportedLanguages } from '../lib/translations';

interface LikeVideosProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const likeTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    availableTitle: 'متاح حالياً: {count} مقطع تفاعلي',
    mainTitle: 'الإعجاب بالفيديوهات وكسب النقاط',
    mainDesc: 'قم بالنقر لزيارة فيديوهات الأعضاء والانتظار 60 ثانية متواصلة بالصفحة لتنشيط زر التفاعل وتأكيد الإعجاب لكسب النقاط.',
    noCampaigns: 'لا توجد مقاطع لايك متاحة حالياً',
    noCampaignsDesc: 'حاول مرة أخرى لاحقاً، أو كن أول من يطلق خطة إعجاب للفيديو لتلقي الدعم من آلاف الزوار!',
    yourCampaign: 'حملتك الإعلانية ⭐️ (معاينة)',
    rewardPoints: '{reward} نقطة',
    requiredTime: '60 ثانية',
    testAndPreview: 'اختبر ومعاينة حملتك',
    startLiking: 'تفاعل واكسب {reward} نقطة',
    prevBtn: 'السابق &rarr;',
    nextBtn: '&larr; التالي',
    pageIndicator: 'المجموعة {current} من {total}',
    stepsHeading: 'خطوات تأكيد التفاعل وكسب النقاط:',
    stepOpenLink: '1. قم بنقر الزر بالأسفل لفتح الفيديو بصفحة مستقلة ومتابعة المشاهدة لمدة 60 ثانية دون إغلاق الصفحة.',
    stepClickLike: '2. انتظر المؤقت، ثم اضغط على زر الإعجاب بالفيديو والتأكيد في هذه النافذة لحساب كسبك.',
    timerLabel: 'مؤقت التثبيت التلقائي:',
    timerPaused: '🔴 تم إيقاف المؤقت! يجب استمرار مشاهدة الفيديو لمدة 60 ثانية متواصلة دون مغادرة الصفحة لفتح زر الإعجاب.',
    timeCompleted: 'كتمل وقت الانتظار المطلوب !',
    instructionsLabel: '💡 إشعار هام:',
    instructionsDesc: 'قم بالنقر على زر الإعجاب الفعلي 👍 في تطبيق أو موقع يوتيوب للفيديو المفتوح، ثم انقر الزر بالأسفل للتأكيد.',
    visitedText: 'رابط الفيديو مفتوح الآن 🔗',
    likedConfirmText: 'نعم، قمت بالضغط على زر الإعجاب بالفيديو 👍',
    claimRewardBtn: 'تأكيد الإعجاب والحصول على {reward} نقطة مخصصة',
    verificationError: 'عذراً، لم نتمكن من تسجيل إعجابك. ربما قمت بهذا الفعل مسبقاً.'
  },
  en: {
    availableTitle: 'Available now: {count} like tasks',
    mainTitle: 'Like Videos & Earn Points',
    mainDesc: 'Click to open other members\' videos and wait for 60 seconds continuously on the page to unlock the like option and claim points.',
    noCampaigns: 'No like campaigns available currently',
    noCampaignsDesc: 'Try again later, or be the first to launch a like campaign to receive support from thousands of visitors!',
    yourCampaign: 'Your Campaign ⭐️ (Preview)',
    rewardPoints: '{reward} Points',
    requiredTime: '60 seconds',
    testAndPreview: 'Test & Preview Campaign',
    startLiking: 'Like & Earn {reward} Points',
    prevBtn: 'Previous &rarr;',
    nextBtn: '&larr; Next',
    pageIndicator: 'Page {current} of {total}',
    stepsHeading: 'How to complete this task:',
    stepOpenLink: '1. Click the button below to open the video in a new window and keep watching it for 60 seconds without leaving that window.',
    stepClickLike: '2. Wait for the counter to complete, click the Like button on the opened video, then confirm here to claim points.',
    timerLabel: 'Verification Timer:',
    timerPaused: '🔴 Timer paused! You must stay on this page with the video open for 60 seconds to unlock the confirmation button.',
    timeCompleted: 'Time limit reached!',
    instructionsLabel: '💡 Important Notice:',
    instructionsDesc: 'Make sure to click the actual Like 👍 button on the YouTube video page, then returned here to click confirm below.',
    visitedText: 'Video URL page has opened 🔗',
    likedConfirmText: 'Yes, I clicked the YouTube Like button 👍',
    claimRewardBtn: 'Confirm Like & Claim {reward} Points',
    verificationError: 'Sorry, we could not verify your reaction action. Make sure you reacted or did not complete this already.'
  },
  fr: {
    availableTitle: 'Disponibles actuellement: {count} likes',
    mainTitle: 'Liker des vidéos & Gagner des Points',
    mainDesc: 'Cliquez pour ouvrir les médias des membres et patientez 60 secondes en continu sur la page pour valider l\'action du like.',
    noCampaigns: 'Aucune campagne de like active',
    noCampaignsDesc: 'Revenez plus tard, ou créez votre première campagne de like pour attirer de l\'audience !',
    yourCampaign: 'Votre Campagne ⭐️ (Aperçu)',
    rewardPoints: '{reward} Points',
    requiredTime: '60 secondes',
    testAndPreview: 'Essayer & Tester la campagne',
    startLiking: 'Liker & Gagner {reward} Pts',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} de {total}',
    stepsHeading: 'Consignes de validation obligatoires:',
    stepOpenLink: '1. Cliquez sur le bouton d\'ouverture pour lire la vidéo dans une autre fenêtre pendant 60 secondes complètes.',
    stepClickLike: '2. Une fois le chronomètre fini, appliquez le Like 👍 sur YouTube et confirmez le versement ici.',
    timerLabel: 'Compteur technique d\'audit:',
    timerPaused: '🔴 Pause chrono ! Vous devez maintenir l\'activité de lecture pendant 60 secondes continues.',
    timeCompleted: 'Minutage validé avec succès !',
    instructionsLabel: '💡 Note Importante:',
    instructionsDesc: 'Marquez votre adhésion avec le pouce bleu 👍 sur l\'interface originale de YouTube, puis cliquez ci-dessous.',
    visitedText: 'Lien vidéo ouvert dans un onglet externe 🔗',
    likedConfirmText: 'Oui, j\'ai interagi avec le bouton du Like 👍',
    claimRewardBtn: 'Confirmer mon action & Gagner {reward} Pts',
    verificationError: 'Impossible d\'enregistrer le Like. Action déjà récompensée.'
  },
  es: {
    availableTitle: 'Disponibles ahora: {count} campañas de Like',
    mainTitle: 'Me Gusta en Videos para Ganar Puntos',
    mainDesc: 'Haga clic para visitar los videos de los miembros y espere 60 segundos continuos en la ventana para verificar su reacción.',
    noCampaigns: 'No hay campañas de Me Gusta activas',
    noCampaignsDesc: 'Regrese más tarde, o impulse su propia campaña de likes para ser respaldado por la plataforma.',
    yourCampaign: 'Su Campaña ⭐️ (Vista Previa)',
    rewardPoints: '{reward} Puntos',
    requiredTime: '60 segundos',
    testAndPreview: 'Probar Mi Campaña',
    startLiking: 'Interactuar por {reward} Puntos',
    prevBtn: 'Anterior &rarr;',
    nextBtn: '&larr; Siguiente',
    pageIndicator: 'Página {current} de {total}',
    stepsHeading: 'Cómo ganar la recompensa:',
    stepOpenLink: '1. Abra con el botón de abajo el vídeo en un navegador y permanezca observándolo por 60 segundos continuos.',
    stepClickLike: '2. Tras completarse los segundos, asigne Like 👍 en el sitio de YouTube y regrese para reclamar saldo.',
    timerLabel: 'Temporizador de Auditoria:',
    timerPaused: '🔴 ¡Contador detenido! Debe mantenerse viendo por 60 segundos continuos para activar la comprobación.',
    timeCompleted: '¡Tiempo requerido superado!',
    instructionsLabel: '💡 Notificación Importante:',
    instructionsDesc: 'Habiendo marcado con un me gusta 👍 real el video respectivo en YouTube, confirme con el botón inferior.',
    visitedText: 'Sitio de video abierto de forma paralela 🔗',
    likedConfirmText: 'Sí, he pulsado el botón de Like en YouTube 👍',
    claimRewardBtn: 'Comprobar Reacción & Recibir {reward} Puntos',
    verificationError: 'Surgió un inconveniente de validación. Probablemente ya acreditó estos puntos.'
  }
};

export default function LikeVideos({ user, onPointsEarned, lang = 'en' }: LikeVideosProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeVideo, setActiveVideo] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds required before liking
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [isConfirmingLike, setIsConfirmingLike] = useState<boolean>(false);

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = likeTranslations[activeLang];

  // High-precision tracking states
  const [hasOpenedLink, setHasOpenedLink] = useState<boolean>(false);
  const [actualSecondsElapsed, setActualSecondsElapsed] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const campaignsPerPage = 10;

  const loadCampaigns = () => {
    const allCampaigns = db.getCampaigns();
    const interactions = db.getHistory();
    
    // Filter out:
    // 1. Not active
    // 2. Not 'like' type
    // 3. Already completed by user (keep user's own campaigns so they can verify they are launched!)
    const filtered = allCampaigns.filter(c => 
      c.status === 'active' && 
      c.type === 'like' && 
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

  // Safely adjust page index if campaign list shrinks after liking
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
        setAlertMsg(t.timerPaused);
      }
    };

    const handleFocus = () => {
      if (!timerRunning && activeVideo && timeLeft > 0 && !liked) {
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
  }, [timerRunning, activeVideo, timeLeft, liked, t.timerPaused]);

  // Countdown clock loop
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        setActualSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && activeVideo && timerRunning) {
      setTimerRunning(false);
      setIsConfirmingLike(true); // show like interaction panel
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timeLeft, activeVideo]);

  const handleStartLiking = (campaign: Campaign) => {
    setActiveVideo(campaign);
    setTimeLeft(60); // Must play for exactly 60 seconds
    setActualSecondsElapsed(0);
    setTimerRunning(true);
    setHasOpenedLink(true);
    setLiked(false);
    setIsConfirmingLike(false);
    setAlertMsg(null);
  };

  const handleConfirmLike = () => {
    setLiked(true);
    setIsConfirmingLike(false);
  };

  const handleClaimPoints = () => {
    if (!activeVideo || timeLeft > 0) return;

    if (activeVideo.creatorId === user.uid) {
      setLiked(true);
      setActiveVideo(null);
      setAlertMsg(null);
      return;
    }

    if (!liked) return;

    setIsVerifying(true);
  };

  const handleVerificationSuccess = (profileHandle: string) => {
    const reward = 40; // Like reward is fixed at 40 points
    const success = db.recordInteraction(user.uid, activeVideo!.id, 'like', reward, profileHandle);

    setIsVerifying(false);
    if (success) {
      setActiveVideo(null);
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
          <ThumbsUp className="w-6 h-6 text-red-500" />
        </h2>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
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
              <div id={`like-card-${camp.id}`} key={camp.id} className="bg-slate-900 border border-slate-800 hover:border-red-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px]">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-row">
                    {camp.creatorId === user.uid ? (
                      <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                        {t.yourCampaign}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full flex-row">
                        {t.rewardPoints.replace('{reward}', '40')}
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
                  <p className="text-xs text-slate-500">createdBy: {camp.creatorEmail}</p>
                </div>

                <button
                  id={`like-start-btn-${camp.id}`}
                  onClick={() => handleStartLiking(camp)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-red-500 hover:text-white border border-slate-800 hover:border-red-500 rounded-xl font-semibold text-xs text-red-500 transition flex items-center justify-center gap-1.5 cursor-pointer flex-row"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{camp.creatorId === user.uid ? t.testAndPreview : t.startLiking.replace('{reward}', '40')}</span>
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

      {/* ANTIBYPASS WINDOW LIGHTNING SIMULATOR */}
      {activeVideo && (
        <div className="fixed inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-row">
              <h3 className="text-base font-bold text-white truncate max-w-sm">{activeVideo.title}</h3>
              <button
                id="close-interaction-box-btn"
                onClick={() => setActiveVideo(null)}
                className="p-1.5 bg-slate-950 border border-slate-850 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-4">
              <h4 className="text-xs font-bold tracking-wider uppercase text-red-500">{t.stepsHeading}</h4>
              <ul className="space-y-2.5 text-slate-400 text-xs">
                <li className="flex items-start gap-2 flex-row">
                  <span className="text-red-500 shrink-0 font-bold">•</span>
                  <span>{t.stepOpenLink}</span>
                </li>
                <li className="flex items-start gap-2 flex-row">
                  <span className="text-red-500 shrink-0 font-bold">•</span>
                  <span>{t.stepClickLike}</span>
                </li>
              </ul>
            </div>

            {/* Simulated Live status counter */}
            <div className="p-5 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col items-center justify-center text-center space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono">{t.timerLabel}</span>
              <div className={`text-3xl font-black font-mono tracking-tight transition-colors ${
                timeLeft > 0 ? 'text-red-500 animate-pulse' : 'text-emerald-500'
              }`}>
                {timeLeft > 0 ? (
                  <span>{timeLeft}s</span>
                ) : (
                  <span className="flex items-center gap-2 flex-row-reverse">
                    {t.timeCompleted} <Sparkles className="w-5 h-5 fill-current text-amber-500" />
                  </span>
                )}
              </div>
            </div>

            {/* Custom live focus alerts */}
            {alertMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center flex items-center justify-center gap-2 rounded-xl flex-row">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{alertMsg}</span>
              </div>
            )}

            {/* Action buttons triggers */}
            <div className="space-y-3">
              <a
                id="external-video-link-trigger"
                href={activeVideo.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                onClick={() => {
                  setHasOpenedLink(true);
                }}
                className={`w-full py-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                  hasOpenedLink 
                    ? 'bg-slate-950 text-slate-400 border border-slate-800' 
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{activeVideo.creatorId === user.uid ? t.testAndPreview : t.startLiking.replace('{reward}', '40')}</span>
              </a>

              {/* Confirm prompt after countdown complete */}
              {isConfirmingLike && hasOpenedLink && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3 text-center">
                  <div className="text-xs text-emerald-400 font-medium">
                    <p className="font-bold">{t.instructionsLabel}</p>
                    <p className="mt-1 text-[11px] leading-relaxed opacity-90">{t.instructionsDesc}</p>
                  </div>
                  <button
                    id="interaction-liked-yes"
                    onClick={handleConfirmLike}
                    className="py-2.5 px-6 bg-slate-950 hover:bg-emerald-600 border border-slate-800 hover:border-emerald-600 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {t.likedConfirmText}
                  </button>
                </div>
              )}

              {/* Visited display and final check */}
              {liked && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1.5 text-center">
                  <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 flex-row">
                    <Sparkles className="w-3.5 h-3.5 fill-current text-emerald-500" />
                    {t.visitedText}
                  </span>
                </div>
              )}

              {/* Claim Points button */}
              {activeVideo.creatorId === user.uid ? (
                <button
                  id="final-claim-btn"
                  onClick={handleClaimPoints}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  {t.finishPreview}
                </button>
              ) : (
                <button
                  id="final-claim-btn"
                  disabled={timeLeft > 0 || !liked}
                  onClick={handleClaimPoints}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                    timeLeft === 0 && liked
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{t.claimRewardBtn.replace('{reward}', '40')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Verification Overlay to avoid fake liking */}
      {isVerifying && activeVideo && (
        <TaskVerificationOverlay
          isOpen={true}
          onClose={() => setIsVerifying(false)}
          onSuccess={handleVerificationSuccess}
          campaignType="like"
          campaignId={activeVideo.id}
          campaignTitle={activeVideo.title}
          requiredSeconds={60}
          actualSecondsElapsed={actualSecondsElapsed}
          hasOpenedLink={hasOpenedLink}
          rewardPoints={40}
          campaignUrl={activeVideo.youtubeUrl}
        />
      )}

    </div>
  );
}
