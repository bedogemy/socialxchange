import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { Play, Eye, Clock, Award, ShieldAlert, X, AlertCircle, Sparkles, ExternalLink, Globe, RotateCcw, CheckCircle } from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

interface WatchWebsitesProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const watchWebsitesTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    availableWebsites: 'متاح حالياً: {count} موقع',
    mainTitle: 'تصفح المواقع وكسب النقاط',
    mainDesc: 'قم بزيارة وتصفح المواقع الموضحة بالأسفل لتجميع النقاط. عند البدء، سيتم فتح نافذة مستقلة للموقع المستهدف مع تشغيل عداد الوقت بالخلفية.',
    noCampaigns: 'لا توجد مواقع رعاية متاحة الآن',
    noCampaignsDesc: 'حاول مرة أخرى لاحقاً، أو كن أول من يطلق حملة تصفح مواقع ليراها آلاف الزوار!',
    yourCampaign: 'حملتك الإعلانية ⭐️ (معاينة)',
    pointsUnit: 'نقطة',
    secondsUnit: 'ثانية',
    testAndPreview: 'اختبر ومعاينة حملتك الإعلانية',
    visitAndEarn: 'تصفح واكسب {reward} نقطة',
    prevBtn: 'السابق &rarr;',
    nextBtn: '&larr; التالي',
    pageIndicator: 'المجموعة {current} من {total}',
    nowWatching: 'حالة التصفح النشط:',
    remainingTime: 'متبقي: {seconds} ثانية',
    timeCompleted: 'اكتمل وقت التصفح!',
    leaveWarning: '⚠️ يرجى عدم إغلاق نافذة المعلن أو هذه الصفحة قبل انتهاء الوقت للحصول على نقاط المكافأة.',
    barDisabled: 'جاري قياس وقت الزيارة الفعلي وتوثيق تصفحك النشط برمجياً',
    rewardVolume: 'حجم الجائزة عند الانتهاء:',
    visitText: 'تبقى {seconds} ثانية لتصفح موقع المعلن',
    finishPreview: 'إنهاء وضع المعاينة',
    claimRewardBtn: 'احصل على {reward} نقطة الآن',
    rewardError: 'خطأ في منح النقاط. قد تكون تصفحت هذا الموقع بالفعل.',
    windowNotice: 'لقد قمنا بفتح موقع المعلن في نافذة/علامة تبويب خارجية جديدة لتجنب الحجب.',
    pleaseDoNotClose: '⚠️ برجاء عدم إغلاق صفحة المعلن حتى ينتهي العداد للحصول على النقاط.',
    reopenLink: 'إعادة فتح رابط الموقع يدوياً 🔗',
    popunderNotice: 'إذا لم تفتح النافذة تلقائياً، فقد تكون إعدادات متصفحك تمنع النوافذ المنبثقة. يرجى الضغط على الزر بالأسفل لفتح الرابط.',
    claimedSuccess: '🎉 تم إضافة {reward} نقطة لحسابك بنجاح!',
    nextSiteBtn: 'تصفح الموقع التالي &rarr;'
  },
  en: {
    availableWebsites: 'Available now: {count} websites',
    mainTitle: 'Browse Websites & Earn Points',
    mainDesc: 'Visit and browse the targeted websites shown below to accumulate points. It will automatically open the advertiser website in a new window with a background timer.',
    noCampaigns: 'No website campaigns available currently',
    noCampaignsDesc: 'Try again later, or be the first to launch an advertising campaign to showcase it to thousands of members!',
    yourCampaign: 'Your Campaign ⭐️ (Preview)',
    pointsUnit: 'Points',
    secondsUnit: 'seconds',
    testAndPreview: 'Test & Preview Your Campaign',
    visitAndEarn: 'Browse & Earn {reward} Points',
    prevBtn: 'Previous &rarr;',
    nextBtn: '&larr; Next',
    pageIndicator: 'Page {current} of {total}',
    nowWatching: 'Active Browsing Status:',
    remainingTime: 'Remaining: {seconds} seconds',
    timeCompleted: 'Viewing Time Completed!',
    leaveWarning: '⚠️ Please do not close the advertiser page or this tab before the timer completes to get your points.',
    barDisabled: 'Real visit duration is monitored to guarantee authentic page traffic.',
    rewardVolume: 'Reward on completion:',
    visitText: 'Browse for {seconds} seconds more',
    finishPreview: 'Finish Preview Mode',
    claimRewardBtn: 'Claim {reward} Points Now',
    rewardError: 'Failed to reward points. You might have viewed this website already.',
    windowNotice: 'We have securely opened the advertiser website in a secondary container window.',
    pleaseDoNotClose: "⚠️ Please do not close the advertiser's window until the timer completes to earn points.",
    reopenLink: 'Reopen website target link manually 🔗',
    popunderNotice: 'If the website popout did not load automatically, your browser might have blocked it. Click below to launch.',
    claimedSuccess: '🎉 {reward} points were successfully credited!',
    nextSiteBtn: 'Browse Next Website &rarr;'
  },
  fr: {
    availableWebsites: 'Disponible: {count} sites',
    mainTitle: 'Visiter des Sites & Gagner des Points',
    mainDesc: 'Visitez et naviguez sur les sites proposés ci-dessous pour accumuler de nouveaux points. Le site cible ouvrira dans une fenêtre externe.',
    noCampaigns: 'Aucun site disponible pour le moment',
    noCampaignsDesc: 'Repassez plus tard, ou devenez le premier membre à lancer son propre site !',
    yourCampaign: 'Votre campagne ⭐️ (Aperçu)',
    pointsUnit: 'Points',
    secondsUnit: 'secondes',
    testAndPreview: 'Essayer & Prévisualiser votre campagne',
    visitAndEarn: 'Visiter & Gagner {reward} Points',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} sur {total}',
    nowWatching: 'Visite active:',
    remainingTime: 'Restant: {seconds} sec',
    timeCompleted: 'Temps écoulé !',
    leaveWarning: '⚠️ Ne fermez pas l\'onglet cible ou cette page avant la fin du temps sous peine de perdre vos gains.',
    barDisabled: 'La navigation est créditée de façon sécurisée après écoulement',
    rewardVolume: 'Gain potentiel à la clé:',
    visitText: 'Veuillez lire la page encore {seconds} secondes',
    finishPreview: 'Terminer la prévisualisation',
    claimRewardBtn: 'Réclamer {reward} Points',
    rewardError: 'Erreur d\'attribution. Vous avez sûrement déjà visité ce site.',
    windowNotice: 'Le site de l\'annonceur s\'est ouvert dans un autre onglet.',
    pleaseDoNotClose: "⚠️ S'il vous plaît, ne fermez pas la page de l'annonceur avant la fin du temps.",
    reopenLink: 'Réouvrir le lien cible 🔗',
    popunderNotice: 'Si le site ne s\'est pas lancé, vérifiez les bloqueurs de publicité ou cliquez ici.',
    claimedSuccess: '🎉 Vos {reward} points ont été enregistrés !',
    nextSiteBtn: 'Site suivant &rarr;'
  },
  es: {
    availableWebsites: 'Disponibles: {count} sitios',
    mainTitle: 'Ver Sitios Web y Gane Puntos',
    mainDesc: 'Visite y navegue por las páginas recomendadas para acumular puntos. Se abrirá la campaña en pestaña independiente con temporizador sincronizado.',
    noCampaigns: 'No hay campañas de sitio disponibles',
    noCampaignsDesc: 'Regrese pronto, o patrocine una nueva campaña web para que otros miembros la visiten.',
    yourCampaign: 'Su Campaña ⭐️ (Apercepción)',
    pointsUnit: 'Puntos',
    secondsUnit: 'segundos',
    testAndPreview: 'Probar y Ver Mi Campaña',
    visitAndEarn: 'Ver y Ganar {reward} Puntos',
    prevBtn: 'Anterior &rarr;',
    nextBtn: '&larr; Siguiente',
    pageIndicator: 'Página {current} de {total}',
    nowWatching: 'Progreso de Visita:',
    remainingTime: 'Faltan: {seconds} segundos',
    timeCompleted: '¡Tiempo de visita completado!',
    leaveWarning: '⚠️ No cierre la ventana de anunciante ni esta pestaña antes de que acabe el tiempo para no perder sus puntos.',
    barDisabled: 'El tiempo se mide con seguridad para certificar tráfico auténtico',
    rewardVolume: 'Recompensa final:',
    visitText: 'Navegue por el sitio {seconds} segundos más',
    finishPreview: 'Finalizar Vista Previa',
    claimRewardBtn: 'Reclamar {reward} Puntos Ahora',
    rewardError: 'Error al asignar los puntos. Posiblemente ya vio este sitio anteriormente.',
    windowNotice: 'La página del anunciante se ha abierto en una ventana externa independiente.',
    pleaseDoNotClose: '⚠️ Por favor, no cierre la página del anunciante hasta que termine el contador.',
    reopenLink: 'Reabrir enlace de destino manualmente 🔗',
    popunderNotice: 'Si la ventana se bloqueó por el navegador, haga clic en el botón inferior para abrir.',
    claimedSuccess: '🎉 ¡Se agregaron {reward} puntos a su cuenta!',
    nextSiteBtn: 'Siguiente Sitio de Tráfico &rarr;'
  }
};

export default function WatchWebsites({ user, onPointsEarned, lang = 'en' }: WatchWebsitesProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeSite, setActiveSite] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [claimed, setClaimed] = useState<boolean>(false);
  const [showClaimSuccess, setShowClaimSuccess] = useState<boolean>(false);
  const [lastRewardClaimed, setLastRewardClaimed] = useState<number>(0);

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = watchWebsitesTranslations[activeLang];

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const openedWindowRef = useRef<Window | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const campaignsPerPage = 10;

  // Load available watch campaigns
  const loadCampaigns = () => {
    const allCampaigns = db.getCampaigns();
    const interactions = db.getHistory();
    
    // Filter out:
    // 1. Not active
    // 2. Not 'website_view' type
    // 3. Already interactions by user (keep user's own campaigns so they can verify they are launched!)
    const filtered = allCampaigns.filter(c => 
      c.status === 'active' && 
      c.type === 'website_view' && 
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

  // Countdown clock loop
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && activeSite && timerRunning) {
      setTimerRunning(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerRunning, timeLeft, activeSite]);

  const openTargetWindow = (url: string) => {
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (opened) {
        openedWindowRef.current = opened;
      }
    } catch (e) {
      console.warn("Could not record opened window direct reference, safe fallback continues.", e);
    }
  };

  const handleStartWatching = (campaign: Campaign) => {
    setActiveSite(campaign);
    setTimeLeft(campaign.duration);
    setTimerRunning(true);
    setClaimed(false);
    setShowClaimSuccess(false);
    setAlertMsg(null);
    
    // Open target website in a direct, complete external browser tab/window is extremely reliable!
    openTargetWindow(campaign.youtubeUrl);
  };

  const handleClaimPoints = () => {
    if (!activeSite || timeLeft > 0) return;

    if (activeSite.creatorId === user.uid) {
      setClaimed(true);
      setActiveSite(null);
      setAlertMsg(null);
      return;
    }

    const reward = activeSite.rewardPerAction;
    const success = db.recordInteraction(user.uid, activeSite.id, 'website_view', reward, 'auto_visitor');

    if (success) {
      setClaimed(true);
      setLastRewardClaimed(reward);
      setShowClaimSuccess(true);
      onPointsEarned();
      loadCampaigns();
      
      // Attempt to close opened window if browser permits it (usually restricted to windows opened by script)
      try {
        if (openedWindowRef.current && !openedWindowRef.current.closed) {
          openedWindowRef.current.close();
        }
      } catch (e) {
        // Safe to ignore if blocked by cross-origin security
      }
    } else {
      setAlertMsg(t.rewardError);
    }
  };

  return (
    <div className={`w-full font-sans ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6 flex-row">
        <span className="text-xs font-bold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">
          {t.availableWebsites.replace('{count}', campaigns.length.toString())}
        </span>
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2 flex-row">
          {t.mainTitle}
          <Globe className="w-6 h-6 text-indigo-500 animate-pulse" />
        </h2>
      </div>

      <p className="text-slate-400 text-sm mb-6 leading-relaxed">
        {t.mainDesc}
      </p>

      {campaigns.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 mb-6">
          <Globe className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-slate-300 font-bold mb-1">{t.noCampaigns}</p>
          <p className="text-xs text-slate-500">{t.noCampaignsDesc}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCampaigns.map((camp) => (
              <div id={`website-card-${camp.id}`} key={camp.id} className="bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px]">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-row border-b border-slate-800 pb-2">
                    {camp.creatorId === user.uid ? (
                      <span className="text-[10px] bg-red-500/20 text-red-400 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
                        {t.yourCampaign}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-full flex-row">
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
                  <p className="text-xs text-slate-500 truncate">{camp.youtubeUrl}</p>
                </div>

                <button
                  id={`website-start-btn-${camp.id}`}
                  onClick={() => handleStartWatching(camp)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-indigo-600 hover:text-white border border-slate-800 hover:border-indigo-600 rounded-xl font-semibold text-xs text-indigo-400 transition flex items-center justify-center gap-1.5 cursor-pointer flex-row"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{camp.creatorId === user.uid ? t.testAndPreview : t.visitAndEarn.replace('{reward}', camp.rewardPerAction.toString())}</span>
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-row">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.prevBtn}</span>
              </button>
              
              <span className="text-xs font-bold text-slate-300 font-mono">
                {t.pageIndicator.replace('{current}', (currentPage + 1).toString()).replace('{total}', totalPages.toString())}
              </span>

              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.nextBtn}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* SECURE TRAFFIC EXCHANGE CODES WITH VISUAL CONSOLE OVERLAY */}
      {activeSite && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl flex flex-col p-6 md:p-8">
            
            {/* Modal Exit */}
            <div className="absolute top-4 left-4">
              <button
                id="close-website-modal-btn"
                onClick={() => {
                  if (timeLeft > 0 && !showClaimSuccess) {
                    setAlertMsg(t.leaveWarning);
                  } else {
                    setActiveSite(null);
                    setShowClaimSuccess(false);
                  }
                }}
                className="p-2 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verification State or Success Output Screen */}
            {showClaimSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-8 space-y-6 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-400 shadow-lg mb-2">
                  <CheckCircle className="w-8 h-8" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-white">
                    {t.claimedSuccess.replace('{reward}', lastRewardClaimed.toString())}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                    {lang === 'ar' ? 'لقد تم التحقق من تصفحك وإيداع النقاط الإعلانية بحسابك بنجاح. تصفح المزيد للحصول على مكافآت أكبر!' : 'Your browsing session has been verified and digital points accredited to your balance safely.'}
                  </p>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full justify-center">
                  <button
                    id="next-site-after-claim-btn"
                    onClick={() => {
                      setActiveSite(null);
                      setShowClaimSuccess(false);
                    }}
                    className="py-3 px-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-indigo-500/10 cursor-pointer"
                  >
                    {t.nextSiteBtn}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Header info */}
                <div className="text-center space-y-2 pb-4 border-b border-slate-850">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full uppercase tracking-wider mb-2">
                    <Globe className="w-3 h-3 animate-pulse" />
                    {lang === 'ar' ? 'تصفح نشط' : 'Active Traffic exchange'}
                  </div>
                  <h3 className="text-lg font-black text-white leading-snug line-clamp-1 max-w-md mx-auto">
                    {activeSite.title}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 truncate" dir="ltr">
                    {activeSite.youtubeUrl}
                  </p>
                </div>

                {/* Main countdown interface */}
                <div className="relative py-8 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Subtle spinning background grid for premium interactive look */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] animate-pulse pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                    
                    {/* The Big Timer */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          className="text-slate-900"
                          strokeWidth="6"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="80"
                          cy="80"
                          r="70"
                          className="text-indigo-500 transition-all duration-1000"
                          strokeWidth="6"
                          strokeDasharray={440}
                          strokeDashoffset={440 - (440 * (timeLeft / activeSite.duration))}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>
                      
                      <div className="absolute flex flex-col items-center justify-center space-y-0.5">
                        <span className="text-4xl font-black text-white font-mono">{timeLeft}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase">{t.secondsUnit}</span>
                      </div>
                    </div>

                    {/* Progress Status label */}
                    {timeLeft > 0 ? (
                      <p className="text-xs font-extrabold text-indigo-400 animate-pulse tracking-wide">
                        {t.visitText.replace('{seconds}', timeLeft.toString())}
                      </p>
                    ) : (
                      <p className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 animate-bounce">
                        <Sparkles className="w-4 h-4 fill-current" />
                        {t.timeCompleted}
                      </p>
                    )}
                  </div>
                </div>

                {/* Warning message explaining traffic system rules physically */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-amber-400 leading-snug">
                      {t.pleaseDoNotClose}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      {t.barDisabled}
                    </p>
                  </div>
                </div>

                {/* Popup Blockers manual bypass container */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850/50 space-y-3">
                  <p className="text-[10.5px] text-slate-500 leading-relaxed text-center">
                    {t.windowNotice} {t.popunderNotice}
                  </p>
                  <button
                    id="reopen-manually-website-btn"
                    onClick={() => openTargetWindow(activeSite.youtubeUrl)}
                    className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.reopenLink}</span>
                  </button>
                </div>

                {/* Alerts container inside Modal */}
                {alertMsg && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center rounded-xl flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{alertMsg}</span>
                  </div>
                )}

                {/* Modal footer claim action panel */}
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between flex-row">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block uppercase">{t.rewardVolume}</span>
                    <span className="text-lg font-black text-amber-500">{activeSite.rewardPerAction} {t.pointsUnit}</span>
                  </div>

                  {timeLeft > 0 ? (
                    <button
                      disabled
                      className="py-3 px-6 bg-slate-800 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed flex items-center gap-2 flex-row"
                    >
                      <Clock className="w-4 h-4" />
                      <span>{timeLeft} {t.secondsUnit}</span>
                    </button>
                  ) : activeSite.creatorId === user.uid ? (
                    <button
                      id="claim-website-points-preview-btn"
                      onClick={handleClaimPoints}
                      className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition shadow-lg cursor-pointer"
                    >
                      {t.finishPreview}
                    </button>
                  ) : (
                    <button
                      id="claim-website-points-real-btn"
                      onClick={handleClaimPoints}
                      className="py-3 px-8 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-black text-xs rounded-xl transition shadow-lg shadow-emerald-500/10 cursor-pointer animate-pulse"
                    >
                      {t.claimRewardBtn.replace('{reward}', activeSite.rewardPerAction.toString())}
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
