import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { UserPlus, Clock, Award, ShieldAlert, X, AlertCircle, Sparkles, Youtube } from 'lucide-react';
import TaskVerificationOverlay from './TaskVerificationOverlay';
import { SupportedLanguages } from '../lib/translations';

interface SubscribeChannelsProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const subTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    availableTitle: 'متاح حالياً: {count} قناة تفاعلية',
    mainTitle: 'الاشتراك بالقنوات وكسب النقاط',
    mainDesc: 'قم بالنقر لزيارة قنوات الأعضاء والانتظار 60 ثانية متواصلة بالصفحة لتنشيط زر الاشتراك وتأكيد الاشتراك لكسب النقاط.',
    noCampaigns: 'لا توجد قنوات اشتراك متاحة حالياً',
    noCampaignsDesc: 'حاول مرة أخرى لاحقاً، أو كن أول من يطلق خطة اشتراك للقناة لتلقي الدعم من آلاف الزوار!',
    yourCampaign: 'حملتك الإعلانية ⭐️ (معاينة)',
    rewardPoints: '{reward} نقطة',
    requiredTime: '60 ثانية',
    testAndPreview: 'اختبر ومعاينة حملتك',
    startSubbing: 'اشترك واكسب {reward} نقطة',
    prevBtn: 'السابق &rarr;',
    nextBtn: '&larr; التالي',
    pageIndicator: 'المجموعة {current} من {total}',
    stepsHeading: 'خطوات تأكيد الاشتراك وكسب النقاط:',
    stepOpenLink: '1. قم بنقر الزر بالأسفل لفتح القناة بصفحة مستقلة ومتابعة المشاهدة لمدة 60 ثانية دون إغلاق الصفحة.',
    stepClickSub: '2. انتظر المؤقت، ثم اضغط على زر الاشتراك بالقناة والتأكيد في هذه النافذة لحساب كسبك.',
    timerLabel: 'مؤقت التثبيت التلقائي:',
    timerPaused: '🔴 تم إيقاف المؤقت! يجب استمرار مشاهدة الفيديو لمدة 60 ثانية متواصلة دون مغادرة الصفحة لفتح زر الاشتراك.',
    timeCompleted: 'كتمل وقت الانتظار المطلوب !',
    instructionsLabel: '💡 إشعار هام:',
    instructionsDesc: 'قم بالنقر على زر الاشتراك الفعلي 🔔 في تطبيق أو موقع يوتيوب للقناة المفتوحة، ثم انقر الزر بالأسفل للتأكيد.',
    visitedText: 'رابط القناة مفتوح الآن 🔗',
    subConfirmText: 'نعم، قمت بالضغط على زر الاشتراك بالقناة 👍',
    claimRewardBtn: 'تأكيد الاشتراك والحصول على {reward} نقطة مخصصة',
    verificationError: 'عذراً، لم نتمكن من تسجيل اشتراكك. ربما قمت بهذا الفعل مسبقاً.'
  },
  en: {
    availableTitle: 'Available now: {count} channel tasks',
    mainTitle: 'Subscribe to Channels & Earn Points',
    mainDesc: 'Click to open other members\' channels and wait for 60 seconds continuously on the page to unlock the subscribe option and claim points.',
    noCampaigns: 'No subscribe campaigns available currently',
    noCampaignsDesc: 'Try again later, or be the first to launch a subscribe campaign to receive support from thousands of visitors!',
    yourCampaign: 'Your Campaign ⭐️ (Preview)',
    rewardPoints: '{reward} Points',
    requiredTime: '60 seconds',
    testAndPreview: 'Test & Preview Campaign',
    startSubbing: 'Subscribe & Earn {reward} Points',
    prevBtn: 'Previous &rarr;',
    nextBtn: '&larr; Next',
    pageIndicator: 'Page {current} of {total}',
    stepsHeading: 'How to complete this task:',
    stepOpenLink: '1. Click the button below to open the channel in a new window and keep watching it for 60 seconds without leaving that window.',
    stepClickSub: '2. Wait for the counter to complete, click the Subscribe button on the opened channel, then confirm here to claim points.',
    timerLabel: 'Verification Timer:',
    timerPaused: '🔴 Timer paused! You must stay on this page with the channel open for 60 seconds to unlock the confirmation button.',
    timeCompleted: 'Time limit reached!',
    instructionsLabel: '💡 Important Notice:',
    instructionsDesc: 'Make sure to click the actual Subscribe 🔔 button on the YouTube channel page, then returned here to click confirm below.',
    visitedText: 'Channel URL page has opened 🔗',
    subConfirmText: 'Yes, I clicked the YouTube Subscribe button 👍',
    claimRewardBtn: 'Confirm Subscription & Claim {reward} Points',
    verificationError: 'Sorry, we could not verify your reaction action. Make sure you subscribed or did not complete this already.'
  },
  fr: {
    availableTitle: 'S\'abonner actuellement: {count} chaînes',
    mainTitle: 'S\'abonner aux chaînes & Gagner des Points',
    mainDesc: 'Cliquez pour ouvrir les pages originales des créateurs et patientez 60 secondes en continu pour déverrouiller l\'action d\'abonnement.',
    noCampaigns: 'Aucune campagne d\'abonnement disponible',
    noCampaignsDesc: 'Revenez plus tard, ou lancez un plan d\'abonnés pour votre chaîne principale !',
    yourCampaign: 'Votre campagne ⭐️ (Aperçu)',
    rewardPoints: '{reward} Points',
    requiredTime: '60 secondes',
    testAndPreview: 'Essayer & Découvrir la campagne',
    startSubbing: 'S\'abonner & Gagner {reward} Pts',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} de {total}',
    stepsHeading: 'Directives de validation obligatoires:',
    stepOpenLink: '1. Ouvrez le lien et lisez un de ses contenus pendant 60 secondes continues.',
    stepClickSub: '2. Une fois le temps validé, abonnez-vous sur la chaîne officielle et confirmez.',
    timerLabel: 'Contrôleur de temps requis:',
    timerPaused: '🔴 Pause chrono ! Vous devez maintenir l\'activité de l\'onglet pendant 60 secondes continues.',
    timeCompleted: 'Temps requis complété !',
    instructionsLabel: '💡 Information:',
    instructionsDesc: 'Cliquez sur S\'abonner 🔔 sur l\'application YouTube originale de la cible avant de soumettre.',
    visitedText: 'Canal de chaîne ouvert en parallèle 🔗',
    subConfirmText: 'Oui, je me suis abonné à la chaîne 👍',
    claimRewardBtn: 'Valider mon action & Recouvrer {reward} Pts',
    verificationError: 'Une erreur est survenue lors de l\'enregistrement de votre abonnement.'
  },
  es: {
    availableTitle: 'Disponibles ahora: {count} campañas de Suscripción',
    mainTitle: 'Suscripciones a Canales para Ganar Puntos',
    mainDesc: 'Haga clic para visitar los canales de los miembros y espere 60 segundos continuos en la ventana para verificar su suscripción.',
    noCampaigns: 'No hay campañas de suscripción activas',
    noCampaignsDesc: 'Regrese más tarde, o impulse su propia campaña para recibir el respaldo de nuestra comunidad.',
    yourCampaign: 'Su Campaña ⭐️ (Prueba)',
    rewardPoints: '{reward} Puntos',
    requiredTime: '60 segundos',
    testAndPreview: 'Probar Mi Campaña',
    startSubbing: 'Suscribirse por {reward} Puntos',
    prevBtn: 'Anterior &rarr;',
    nextBtn: '&larr; Siguiente',
    pageIndicator: 'Página {current} de {total}',
    stepsHeading: 'Instrucciones para la tarea:',
    stepOpenLink: '1. Abra con el botón de abajo el canal en un navegador independiente y manténgalo activo por 60 segundos.',
    stepClickSub: '2. Al concluir el contador, asigne Suscribirse en la página oficial de YouTube y regrese para confirmar.',
    timerLabel: 'Temporizador Obligatorio:',
    timerPaused: '🔴 ¡Contador detenido! Permanezca con el canal abierto por 60 segundos para activar el canje de saldo.',
    timeCompleted: '¡Segundos requeridos alcanzados!',
    instructionsLabel: '💡 Advertencia:',
    instructionsDesc: 'Habiéndose suscrito de forma efectiva 🔔 en el canal YouTube abierto, guarde los puntos con el botón.',
    visitedText: 'Página de canal activa en paralelo 🔗',
    subConfirmText: 'Sí, me he suscrito de forma correcta 👍',
    claimRewardBtn: 'Comprobar Suscripción & Recibir {reward} Puntos',
    verificationError: 'Inconveniente detectado con la suscripción. Intente nuevamente.'
  }
};

export default function SubscribeChannels({ user, onPointsEarned, lang = 'en' }: SubscribeChannelsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeVideo, setActiveVideo] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds required before subscription
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [isConfirmingSub, setIsConfirmingSub] = useState<boolean>(false);

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = subTranslations[activeLang];

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
    // 2. Not 'subscribe' type
    // 3. Already completed by user (keep user's own campaigns so they can verify they are launched!)
    const filtered = allCampaigns.filter(c => 
      c.status === 'active' && 
      c.type === 'subscribe' && 
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

  // Safely adjust page index if campaign list shrinks after subscribing
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
      if (!timerRunning && activeVideo && timeLeft > 0 && !subscribed) {
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
  }, [timerRunning, activeVideo, timeLeft, subscribed, t.timerPaused]);

  // Countdown clock loop
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
        setActualSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else if (timeLeft === 0 && activeVideo && timerRunning) {
      setTimerRunning(false);
      setIsConfirmingSub(true); // show subscription trigger
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timeLeft, activeVideo]);

  const handleStartSubscription = (campaign: Campaign) => {
    setActiveVideo(campaign);
    setTimeLeft(60); // Must play for exactly 60 seconds
    setActualSecondsElapsed(0);
    setTimerRunning(true);
    setHasOpenedLink(true);
    setSubscribed(false);
    setIsConfirmingSub(false);
    setAlertMsg(null);
  };

  const handleConfirmSub = () => {
    setSubscribed(true);
    setIsConfirmingSub(false);
  };

  const handleClaimPoints = () => {
    if (!activeVideo || timeLeft > 0) return;

    if (activeVideo.creatorId === user.uid) {
      setSubscribed(true);
      setActiveVideo(null);
      setAlertMsg(null);
      return;
    }

    if (!subscribed) return;

    setIsVerifying(true);
  };

  const handleVerificationSuccess = (profileHandle: string) => {
    const reward = 50; // Subscription reward is fixed at 50 points
    const success = db.recordInteraction(user.uid, activeVideo!.id, 'subscribe', reward, profileHandle);

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
          <UserPlus className="w-6 h-6 text-red-500" />
        </h2>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {t.mainDesc}
      </p>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6">
          <UserPlus className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-300 font-bold mb-1">{t.noCampaigns}</p>
          <p className="text-xs text-slate-500">{t.noCampaignsDesc}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCampaigns.map((camp) => (
              <div id={`sub-card-${camp.id}`} key={camp.id} className="bg-slate-900 border border-slate-800 hover:border-red-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px]">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-row">
                    {camp.creatorId === user.uid ? (
                      <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                        {t.yourCampaign}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full flex-row">
                        {t.rewardPoints.replace('{reward}', '50')}
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
                  id={`sub-start-btn-${camp.id}`}
                  onClick={() => handleStartSubscription(camp)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-red-500 hover:text-white border border-slate-800 hover:border-red-500 rounded-xl font-semibold text-xs text-red-500 transition flex items-center justify-center gap-1.5 cursor-pointer flex-row"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{camp.creatorId === user.uid ? t.testAndPreview : t.startSubbing.replace('{reward}', '50')}</span>
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

      {/* REACTION SYSTEM PORTAL PLAYER MODULE */}
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

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl space-y-4 text-right">
              <h4 className="text-xs font-bold tracking-wider uppercase text-red-500">{t.stepsHeading}</h4>
              <ul className="space-y-2.5 text-slate-400 text-xs">
                <li className="flex items-start gap-2 flex-row">
                  <span className="text-red-500 shrink-0 font-bold">•</span>
                  <span>{t.stepOpenLink}</span>
                </li>
                <li className="flex items-start gap-2 flex-row">
                  <span className="text-red-500 shrink-0 font-bold">•</span>
                  <span>{t.stepClickSub}</span>
                </li>
              </ul>
            </div>

            {/* Timer visual count */}
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

            {/* Warnings visual list */}
            {alertMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center flex items-center justify-center gap-2 rounded-xl flex-row">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{alertMsg}</span>
              </div>
            )}

            {/* Launchers triggers buttons */}
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
                <Youtube className="w-4 h-4" />
                <span>{activeVideo.creatorId === user.uid ? t.testAndPreview : t.startSubbing.replace('{reward}', '50')}</span>
              </a>

              {/* Confirm prompt after countdown complete */}
              {isConfirmingSub && hasOpenedLink && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-3 text-center">
                  <div className="text-xs text-emerald-400 font-medium">
                    <p className="font-bold">{t.instructionsLabel}</p>
                    <p className="mt-1 text-[11px] leading-relaxed opacity-90">{t.instructionsDesc}</p>
                  </div>
                  <button
                    id="interaction-subbed-yes"
                    onClick={handleConfirmSub}
                    className="py-2.5 px-6 bg-slate-950 hover:bg-emerald-600 border border-slate-850 hover:border-emerald-600 text-emerald-400 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    {t.subConfirmText}
                  </button>
                </div>
              )}

              {/* Confirm state representation badge */}
              {subscribed && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1.5 text-center">
                  <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 flex-row">
                    <Sparkles className="w-3.5 h-3.5 fill-current text-emerald-500" />
                    {t.visitedText}
                  </span>
                </div>
              )}

              {/* Claim Reward Button */}
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
                  disabled={timeLeft > 0 || !subscribed}
                  onClick={handleClaimPoints}
                  className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition ${
                    timeLeft === 0 && subscribed
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{t.claimRewardBtn.replace('{reward}', '50')}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Verification Dialogue overlay */}
      {isVerifying && activeVideo && (
        <TaskVerificationOverlay
          isOpen={true}
          onClose={() => setIsVerifying(false)}
          onSuccess={handleVerificationSuccess}
          campaignType="subscribe"
          campaignId={activeVideo.id}
          campaignTitle={activeVideo.title}
          requiredSeconds={60}
          actualSecondsElapsed={actualSecondsElapsed}
          hasOpenedLink={hasOpenedLink}
          rewardPoints={50}
          campaignUrl={activeVideo.youtubeUrl}
        />
      )}

    </div>
  );
}
