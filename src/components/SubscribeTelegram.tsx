import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/db';
import { User, Campaign } from '../types';
import { UserPlus, Clock, Award, AlertCircle, Sparkles, X, Send, Info } from 'lucide-react';
import TaskVerificationOverlay from './TaskVerificationOverlay';
import { SupportedLanguages } from '../lib/translations';

interface SubscribeTelegramProps {
  user: User;
  onPointsEarned: () => void;
  lang?: string;
}

const tgTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    availableTitle: 'متاح حالياً: {count} حملة',
    mainTitle: 'تبادل اشتراكات قنوات تليجرام',
    mainDesc: 'اكسب نقاط إضافية بمجرد الانضمام والاشتراك في قنوات ومجموعات الأعضاء الآخرين على منصة تليجرام. يشترط البقاء لمدة 15 ثانية لتأكيد اشتراكك بنظام الأمان الزمني المطور.',
    noCampaigns: 'لا توجد حملات اشتراك تليجرام حالياً',
    noCampaignsDesc: 'عد لاحقاً لرؤية قنوات تليجرام الجديدة أو ابدأ بترويج قناتك الآن لتصل لآلاف المنضمين!',
    yourCampaign: 'حملتك الإعلانية ⭐️ (معاينة)',
    rewardPoints: '{reward} نقطة',
    requiredTime: '15 ثانية',
    testAndPreview: 'اختبر ومعاينة حملة التليجرام',
    startJoining: 'انضم الآن واكسب النقاط',
    prevBtn: 'السابق &rarr;',
    nextBtn: '&larr; التالي',
    pageIndicator: 'المجموعة {current} من {total}',
    stepsHeading: 'خطوات تأكيد الاشتراك وكسب النقاط:',
    stepOpenLink: '1. اضغط أولاً على زر "فتح وزيارة رابط تليجرام" الموجود بالأسفل.',
    stepJoinChan: '2. انضم أو اشترك في القناة المعروضة على تليجرام.',
    stepWaitTime: '3. انتظر لمدة 15 ثانية داخل التطبيق أو القناة لضمان احتساب وقت الزيارة قبل الضغط على مطالبة للحصول على نقاطك.',
    infoTitle: 'مهمة تليجرام متبادلة',
    infoDesc: 'يرجى اتباع البروتوكول التالي لتسجيل وتوثيق النقاط الخاصة بك بنجاح تلقائياً دون أخطاء:',
    openTargetBtn: 'فتح وزيارة رابط تليجرام المستهدف 🔗',
    waitTimerText: 'يرجى البقاء في القناة: {seconds} ثانية للتوثيق',
    finishPreview: 'إنهاء وضع المعاينة التوضيحية',
    claimRewardBtn: 'تأكيد الاشتراك واحتساب {reward} نقطة',
    verificationError: 'عذراً، لم نتمكن من تسجيل نقاطك. ربما قمت بهذا الفعل مسبقاً.'
  },
  en: {
    availableTitle: 'Available now: {count} campaigns',
    mainTitle: 'Telegram Channel Exchanges',
    mainDesc: 'Join other members\' Telegram channels and groups to gain bonus points. Stay for at least 15 seconds to pass our automated secure verification checkpoint.',
    noCampaigns: 'No Telegram active campaigns',
    noCampaignsDesc: 'Please check back later or start promoting your owned Telegram channels to reach thousands of actual views!',
    yourCampaign: 'Your Campaign ⭐️ (Preview)',
    rewardPoints: '{reward} Points',
    requiredTime: '15 seconds',
    testAndPreview: 'Test & Preview Telegram Campaign',
    startJoining: 'Join & Earn Points',
    prevBtn: 'Previous &rarr;',
    nextBtn: '&larr; Next',
    pageIndicator: 'Page {current} of {total}',
    stepsHeading: 'Verification Checkpoint Steps:',
    stepOpenLink: '1. Click on the target Telegram link button provided below.',
    stepJoinChan: '2. Joint or subscribe to the channel/group directly on Telegram.',
    stepWaitTime: '3. Stay inside the channel for 15 seconds to ensure system registers your active visit before clicking confirm.',
    infoTitle: 'Telegram Shared Task',
    infoDesc: 'Please obey the following steps to verify your points successfully without security failure:',
    openTargetBtn: 'Open Target Telegram Link 🔗',
    waitTimerText: 'Please remain on channel: {seconds} seconds',
    finishPreview: 'Close Exhibition Preview',
    claimRewardBtn: 'Verify Join & Claim {reward} Points',
    verificationError: 'Sorry, we couldn\'t record your point subscription reward. You might have already done this campaign.'
  },
  fr: {
    availableTitle: 'Disponibles: {count} campagnes',
    mainTitle: 'Échanges de Canaux Telegram',
    mainDesc: 'Rejoignez des canaux et groupes de notre communauté pour récolter des bonus de points. Un délai de 15 secondes de présence est audité.',
    noCampaigns: 'Aucun objectif Telegram disponible',
    noCampaignsDesc: 'Consultez ultérieurement notre tableau ou lancez votre premier plan de membres Telegram !',
    yourCampaign: 'Votre campagne ⭐️ (Aperçu)',
    rewardPoints: '{reward} Points',
    requiredTime: '15 secondes',
    testAndPreview: 'Tester & Visionner la campagne',
    startJoining: 'Rejoindre & Récolter',
    prevBtn: 'Précédent &rarr;',
    nextBtn: '&larr; Suivant',
    pageIndicator: 'Page {current} de {total}',
    stepsHeading: 'Directives d\'accouplement technique:',
    stepOpenLink: '1. Cliquez d\'abord sur l\'ouverture du canal Telegram cible ci-dessous.',
    stepJoinChan: '2. Rejoignez officiellement le groupe ou canal s\'ouvrant sur Telegram.',
    stepWaitTime: '3. Patientez pendant 15 sec pour laisser l\'analyseur d\'audience enregistrer votre entrée.',
    infoTitle: 'Mission partagée Telegram',
    infoDesc: 'Suivez le protocole requis pour percevoir vos pointages de gratification :',
    openTargetBtn: 'Rejoindre le canal externe Telegram 🔗',
    waitTimerText: 'Maintenez l\'onglet Telegram : {seconds} sec restantes',
    finishPreview: 'Terminer la revue d\'évaluation',
    claimRewardBtn: 'Valider mon adhésion & Recevoir {reward} Pts',
    verificationError: 'Échec d\'octroi. Compte déjà abonné ou action impossible à authentifier.'
  },
  es: {
    availableTitle: 'Disponibles: {count} campañas Telegram',
    mainTitle: 'Intercambios de Canales Telegram',
    mainDesc: 'Súmese a canales y grupos de Telegram de otros miembros para ganar saldo de puntos. Se requiere registrar 15 segundos míminos de permanencia para validar.',
    noCampaigns: 'No hay campañas activas de Telegram',
    noCampaignsDesc: 'Vuelva a intentarlo más tarde o promueva su propio grupo para recibir miles de altas.',
    yourCampaign: 'Su campaña ⭐️ (Vista Previa)',
    rewardPoints: '{reward} Puntos',
    requiredTime: '15 segundos',
    testAndPreview: 'Validar Mi Campaña',
    startJoining: 'Unirse por Puntos',
    prevBtn: 'Anterior &rarr;',
    nextBtn: '&larr; Siguiente',
    pageIndicator: 'Página {current} de {total}',
    stepsHeading: 'Pasos de seguridad requeridos:',
    stepOpenLink: '1. Oprima el botón inferior para ser redirigido a la app de Telegram.',
    stepJoinChan: '2. Únase al canal o grupo abierto de forma efectiva.',
    stepWaitTime: '3. Espere el conteo de 15 segundos en la sala antes de reclamar el saldo.',
    infoTitle: 'Tarea Compartida de Telegram',
    infoDesc: 'Por favor, siga estas especificaciones técnicas para acreditar su cobro:',
    openTargetBtn: 'Abrir Canal Cible de Telegram 🔗',
    waitTimerText: 'Debe continuar en Telegram por: {seconds} segundos',
    finishPreview: 'Finalizar Modo Explicativo',
    claimRewardBtn: 'Acreditar Suscripción & Recibir {reward} Puntos',
    verificationError: 'Error al constatar su afiliación al canal o grupo.'
  }
};

export default function SubscribeTelegram({ user, onPointsEarned, lang = 'en' }: SubscribeTelegramProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activeCamp, setActiveCamp] = useState<Campaign | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string | null>(null);

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = tgTranslations[activeLang];

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
    const filtered = allCampaigns.filter(c => 
      c.status === 'active' && 
      c.type === 'tg_join' && 
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

  useEffect(() => {
    if (currentPage >= totalPages && totalPages > 0) {
      setCurrentPage(totalPages - 1);
    } else if (currentCampaigns.length === 0 && campaigns.length > 0) {
      setCurrentPage(0);
    }
  }, [campaigns.length, totalPages, currentPage, currentCampaigns.length]);

  // High-Precision timer loop without real-time window close monitoring
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
    setTimerRunning(false);
    setHasOpenedLink(false);
    setAlertMsg(null);
  };

  const handleOpenLink = () => {
    if (!activeCamp) return;
    setHasOpenedLink(true);
    setAlertMsg(null);
    setTimerRunning(true);
    
    window.open(activeCamp.youtubeUrl, '_blank');
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
    const reward = activeCamp?.rewardPerAction || 40; // Telegram subscription reward is 40 points
    const success = db.recordInteraction(user.uid, activeCamp!.id, 'tg_join', reward, profileHandle);

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
          <Send className="w-6 h-6 text-sky-400" />
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
              <div id={`tg-join-card-${camp.id}`} key={camp.id} className="bg-slate-900 border border-slate-800 hover:border-sky-500/30 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all hover:translate-y-[-2px]">
                <div>
                  <div className="flex items-center justify-between mb-3 flex-row">
                    {camp.creatorId === user.uid ? (
                      <span className="text-[10px] bg-sky-500/20 text-sky-400 font-bold px-2 py-0.5 rounded-full border border-sky-500/30">
                        {t.yourCampaign}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full flex-row">
                        {t.rewardPoints.replace('{reward}', camp.rewardPerAction.toString())}
                        <Award className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-mono flex-row">
                      {t.requiredTime}
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 h-10 mb-2">
                    {camp.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">createdBy: {camp.creatorEmail}</p>
                </div>

                <button
                  id={`tg-join-start-btn-${camp.id}`}
                  onClick={() => handleStart(camp)}
                  className="w-full py-2.5 bg-slate-950 hover:bg-sky-500 hover:text-white border border-slate-800 hover:border-sky-500 rounded-xl font-semibold text-xs text-sky-450 transition flex items-center justify-center gap-1.5 cursor-pointer flex-row"
                >
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>{camp.creatorId === user.uid ? t.testAndPreview : t.startJoining}</span>
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl flex-row">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-sky-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.prevBtn}</span>
              </button>
              
              <span className="text-xs font-bold text-slate-300 font-mono">
                {t.pageIndicator.replace('{current}', (currentPage + 1).toString()).replace('{total}', totalPages.toString())}
              </span>

              <button
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="px-4 py-2 text-xs font-bold text-slate-300 bg-slate-950 border border-slate-850 hover:border-sky-500/30 rounded-xl hover:bg-slate-850 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.nextBtn}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* POPUP TASK DRAWER FOR CONFIRMING INTERACTION */}
      {activeCamp && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl p-6 space-y-6">
            
            {/* Header Title bar */}
            <div className="flex items-center justify-between flex-row border-b border-slate-850 pb-4">
              <div>
                <span className="text-[10px] text-sky-400 font-extrabold uppercase">{t.infoTitle}</span>
                <h3 className="text-sm font-bold text-white truncate max-w-[240px]">{activeCamp.title}</h3>
              </div>
              <button
                id="close-tg-modal-btn"
                onClick={() => setActiveCamp(null)}
                className="p-1.5 bg-slate-950 border border-slate-850 rounded-lg hover:bg-slate-850 text-slate-455 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Steps & Guidance Instructions */}
            <div className="space-y-4">
              <div className="bg-slate-955/40 p-4 rounded-2xl border border-slate-850/60 flex items-start gap-3 flex-row">
                <Info className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  {t.infoDesc}
                </p>
              </div>

              <div className="space-y-3 pl-2 border-l-2 border-slate-800 flex flex-col gap-1.5">
                <div className="text-xs text-slate-300 font-bold flex items-center gap-2 flex-row">
                  <span className="w-4 h-4 bg-slate-950 border border-slate-850 text-[10px] text-slate-400 rounded-full flex items-center justify-center font-mono">1</span>
                  <span>{t.stepOpenLink}</span>
                </div>
                <div className="text-xs text-slate-300 font-bold flex items-center gap-2 flex-row">
                  <span className="w-4 h-4 bg-slate-950 border border-slate-850 text-[10px] text-slate-400 rounded-full flex items-center justify-center font-mono">2</span>
                  <span>{t.stepJoinChan}</span>
                </div>
                <div className="text-xs text-slate-300 font-bold flex items-center gap-2 flex-row">
                  <span className="w-4 h-4 bg-slate-950 border border-slate-850 text-[10px] text-slate-400 rounded-full flex items-center justify-center font-mono">3</span>
                  <span>{t.stepWaitTime}</span>
                </div>
              </div>
            </div>

            {/* Error alerts mappings */}
            {alertMsg && (
              <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-405 text-xs rounded-xl text-center flex items-center justify-center gap-2 flex-row">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{alertMsg}</span>
              </div>
            )}

            {/* Core control buttons block */}
            <div className="space-y-3 pt-2">
              <button
                id="tg-join-open-link-btn"
                onClick={handleOpenLink}
                className="w-full py-3 bg-gradient-to-l from-sky-600 to-sky-505 hover:from-sky-500 hover:to-sky-400 text-white font-black text-xs rounded-xl transition shadow-lg shadow-sky-600/10 cursor-pointer flex items-center justify-center gap-2 flex-row"
              >
                <Send className="w-4 h-4 animate-bounce" />
                <span>{t.openTargetBtn}</span>
              </button>

              {timeLeft > 0 ? (
                <button
                  disabled
                  className="w-full py-3 bg-slate-950 border border-slate-850 text-slate-500 font-bold text-xs rounded-xl cursor-not-allowed flex items-center justify-center gap-2 font-mono flex-row"
                >
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>{t.waitTimerText.replace('{seconds}', timeLeft.toString())}</span>
                </button>
              ) : activeCamp.creatorId === user.uid ? (
                <button
                  id="tg-join-claim-btn"
                  onClick={handleClaimPoints}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl transition cursor-pointer"
                >
                  {t.finishPreview}
                </button>
              ) : (
                <button
                  id="tg-join-claim-btn"
                  onClick={handleClaimPoints}
                  disabled={!hasOpenedLink}
                  className={`w-full py-3 text-white font-black text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer flex-row ${
                    hasOpenedLink 
                      ? 'bg-gradient-to-l from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 shadow-lg shadow-emerald-500/10 animate-pulse' 
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t.claimRewardBtn.replace('{reward}', activeCamp.rewardPerAction.toString())}</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {isVerifying && activeCamp && (
        <TaskVerificationOverlay
          isOpen={isVerifying}
          onClose={() => setIsVerifying(false)}
          onSuccess={handleVerificationSuccess}
          campaignTitle={activeCamp?.title || ''}
          campaignType="tg_join"
          requiredSeconds={15}
          actualSecondsElapsed={actualSecondsElapsed}
          hasOpenedLink={hasOpenedLink}
          campaignId={activeCamp?.id}
          campaignUrl={activeCamp?.youtubeUrl}
        />
      )}
    </div>
  );
}
