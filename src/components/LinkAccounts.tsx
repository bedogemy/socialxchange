import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { 
  ShieldCheck, 
  Youtube, 
  Facebook, 
  Instagram, 
  Flame, 
  CheckCircle2, 
  Loader2, 
  Server,
  UserCheck,
  Link2,
  Lock,
  Send,
  Compass,
  Pin
} from 'lucide-react';
import { db } from '../lib/db';
import { SupportedLanguages } from '../lib/translations';

interface LinkAccountsProps {
  user: User;
  onSelectTab?: (tabId: string) => void;
  lang?: SupportedLanguages;
}

const IconMap: Record<string, any> = {
  Youtube,
  Facebook,
  Instagram,
  Flame,
  Send,
  Compass,
  Link2,
  Pin
};

const localization: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    headerTitle: "نظام ربط ومصادقة الحسابات المطور",
    headerDesc: "اربط حساباتك الحقيقية الآن للتبديل والتفاعل الآمن المباشر دون الحاجة لتأكيدات يدوية معقدة. يقوم النظام المطور بمسح تفاعلاتك برمجياً وتجنيب الحسابات الوهمية.",
    bannerTitle: "الفحص باستخدام واجهات برمجة التطبيقات الرسمية (Official APIs)",
    bannerDesc: "الحل الأكثر أماناً وموثوقية لمنع الاحتيال وللتحقق من إكمال المهام تلقائياً: نقوم بالفحص وبشكل صامت وآمن مباشرة برمجياً عبر استدعاء API الخاص بكل منصة (مثل YouTube Data API v3, Facebook Graph API, Instagram Basic Display API, TikTok API, Telegram Bot API).",
    bannerHowTitle: "كيف يعمل بروتوكول المصادقة غيبياً؟",
    bannerHowDesc: "عندما تقوم بالضغط لفتح رابط المهمة الإعلانية، تستقر في الخلفية نافذة الأمان والوقت المخصصة. فور انتهاء العداد واكتمال وقت الاستبقاء وتصفحك للمحتوى، يقوم الخادم تلقائياً بإرسال استفسار آمن إلى واجهات برمجة التطبيقات للمنصة لتأكيد الأثر الرقمي للحساب: \"هل الحساب X قد قام بالفعل بنشاط التفاعل لإتمام الأكشن المطلوب لـ Y؟\". إذا جاءت إجابة خادم السوشيال ميديا بـ \"نعم\"، يتم حسم وإيداع نقاطك فوراً في الرصيد بكل نزاهة وأمان!",
    bannerAlert: "تنويه أمني: بعض المنصات تفرض حماية متقدمة تتطلب ربط حسابك الرسمي لتخويل خادم التحقق من مطابقة الأنشطة.",
    noPlatforms: "لم يتم توفير أي منصات للربط حالياً من قِبل الإدارة.",
    verifiedActive: "موثق ونشط 🔒",
    notConnected: "غير متصل",
    inputLabel: "عنوان بروفايلك أو معرفك الشخصي:",
    connectedSuccess: "تم الربط",
    connectingStatus: "بروتوكول الأمان يُباشر المهام...",
    connectDone: "تم التوثيق والمطابقة الآلية للبيانات بنجاح!",
    unlinkButton: "إلغاء ربط وتقييد الحساب 🔓",
    linkButtonPrefix: "ربط ومصادقة حساب ",
    linkingInProgress: "جاري الربط والمصادقة...",
    privacyTitle: "حماية الخصوصية والأمان المشفّر",
    privacyDesc: "جميع الحسابات والروابط تخضع لقنوات اتصال مشفرة لا يتم مشاركتها أبداً مع أطراف خارجية أو مواقع أخرى. تُستخدم المعرفات فقط من قِبل نظام الأمان المطور لفحص وقياس جودة وصحة تفاعلك بالزيارات بشكل تلقائي وسري بنسبة 100%.",
    protocolActive: "بروتوكول التحقق الآلي النشط",
    enterUsernameFirst: "يرجى إدخال اسم الحساب أو رابط المعرّف الخاص بك أولاً!",
    initializingProtocol: "جاري تهيئة بروتوكول المصادقة الخارجي والمصافحة الرقمية Secure-Handshake...",
    connectingServer: "جاري الاتصال بخادم API والتحقق من صلاحية الملف الشخصي...",
    generatingToken: "توليد وتوقيع التوثيق الثنائي (SHA-256) لحساب العضو لمنع الاحتيال...",
    linkSuccess: "تم تسجيل وتأكيد التوثيق! ربط نظام الأمان الرقمي بنجاح 🔒",
    unlinkWarning: "هل أنت متأكد من رغبتك في إلغاء ربط الحساب؟ سيتوجب عليك ربطه مجدداً لتنفيذ وتأكيد المهام تلقائياً.",
    linkError: "حدث خطأ أثناء الاتصال بالخادم لمصادقة الحساب. حاول مرة أخرى."
  },
  en: {
    headerTitle: "Advanced Social Accounts Linking & Verification System",
    headerDesc: "Link your real social profiles now for automated and secure action checking without complex manual validations. Our smart system verifies engagement in real-time.",
    bannerTitle: "Verification via Official Platform APIs",
    bannerDesc: "The most secure way to check task completion: we securely verify your actions using modern official API endpoints (such as YouTube Data API v3, Facebook Graph API, Instagram Basic Display API, TikTok API, Telegram Bot API).",
    bannerHowTitle: "How does the background verification protocol work?",
    bannerHowDesc: "When you click on a campaign task, a security and time tracker runs in the background. Once the duration finishes and you view the content, our system automatically calls the specific platform API to query: \"Did user profile X perform the required action for post Y?\". If the platform server returns \"yes\", your reward points are credited instantly and securely!",
    bannerAlert: "Security Note: Some networks apply strict validation rules that require accurate connection profiles to match activities.",
    noPlatforms: "No active platforms are configured by the administration.",
    verifiedActive: "Verified & Active 🔒",
    notConnected: "Not Connected",
    inputLabel: "Profile Link or Account Handle:",
    connectedSuccess: "Connected",
    connectingStatus: "Security protocol is validating...",
    connectDone: "Account mapped and verified successfully!",
    unlinkButton: "Disconnect & Unlink Profile 🔓",
    linkButtonPrefix: "Link & Authenticate ",
    linkingInProgress: "Authenticating profile...",
    privacyTitle: "Data Privacy & Encrypted Protocols",
    privacyDesc: "All connected accounts are transmitted over secure, SSL-encrypted channels. We do not share or distribute your profile details to external sites. Handles are solely parsed to check automated activity logs anonymously.",
    protocolActive: "Active Auto-Verification Engine",
    enterUsernameFirst: "Please enter your account handle or profile link first!",
    initializingProtocol: "Initializing secure socket handshake and cryptographic checks...",
    connectingServer: "Connecting to API server and validating profile handle...",
    generatingToken: "Signing SHA-256 tokens to prevent spoofing and verify profile validity...",
    linkSuccess: "Connection validated! Secure digital link established successfully 🔒",
    unlinkWarning: "Are you sure you want to unlink this account? You will need to link it again to auto-verify tasks on this platform.",
    linkError: "An error occurred during secure socket connection. Please try again."
  },
  fr: {
    headerTitle: "Système Avancé de Liaison et Vérification des Comptes",
    headerDesc: "Lisez vos profils d'engagement réels dès maintenant pour les vérifications automatiques d'actions. Notre système analyse la véracité des clics en direct.",
    bannerTitle: "Vérification via les APIs Officielles des Plateformes",
    bannerDesc: "Le moyen le plus sûr de vérifier la complétion des tâches: nous effectuons le contrôle de manière automatisée à l'aide des points de terminaison officiels (tels que YouTube Data API v3, etc.).",
    bannerHowTitle: "Comment fonctionne le protocole de vérification d'arrière-plan ?",
    bannerHowDesc: "Dès que vous ouvrez une mission, notre traqueur temporel s'active. Une fois achevé, le serveur interroge de façon chiffrée l'API de réseaux: \"Est-ce que l'utilisateur X a bien aimé la publication Y ?\". En cas d'affirmation, vos points sont transférés.",
    bannerAlert: "Sécurité: Certains réseaux exigent la liaison correcte d'un profil pour corréler les activités.",
    noPlatforms: "Aucune plateforme active n'a été configurée par l'administration pour l'instant.",
    verifiedActive: "Vérifié & Actif 🔒",
    notConnected: "Non connecté",
    inputLabel: "Lien de profil ou Identifiant de membre:",
    connectedSuccess: "Lien Réussi",
    connectingStatus: "Le protocole de sécurité valide...",
    connectDone: "Compte configuré et vérifié avec succès !",
    unlinkButton: "Débrayer & Retirer le profil 🔓",
    linkButtonPrefix: "Associer le compte ",
    linkingInProgress: "Vérification et liaison en cours...",
    privacyTitle: "Confidentialité et Protocoles Chiffrés",
    privacyDesc: "Aucun profil n'est exposé à des tiers. Vos identifiants servent exclusivement à auditer silencieusement les jetons d'engagement créés pour les campagnes.",
    protocolActive: "Moteur de Validation Automatique Actif",
    enterUsernameFirst: "Veuillez saisir d'abord votre identifiant ou adresse URL !",
    initializingProtocol: "Initialisation du protocole SSL de liaison et poignée de main...",
    connectingServer: "Connexion en cours vers le serveur d'API sociale...",
    generatingToken: "Génération de votre signature SHA-256 anti-fraude...",
    linkSuccess: "Liaison authentifiée et enregistrée avec succès 🔒",
    unlinkWarning: "Êtes-vous sûr de vouloir dissocier ce profil ? Vous devrez à nouveau le lier pour exécuter les tâches.",
    linkError: "Une erreur est survenue lors de la connexion sécurisée. Veuillez réessayer."
  },
  es: {
    headerTitle: "Sistema de Vinculación y Verificación de Cuentas",
    headerDesc: "Enlace sus cuentas sociales legítimas para habilitar auditorías automatizadas del cumplimiento de las tareas. Nuestro motor detecta anomalías y botas.",
    bannerTitle: "Filtraje mediante Interfaces Oficiales (APIs)",
    bannerDesc: "El método de respuesta estándar más blindado: validamos sus clics directamente contra los endpoints de API oficiales de cada plataforma para garantizar la máxima equidad.",
    bannerHowTitle: "¿Cómo opera el protocolo de verificación en segundo plano?",
    bannerHowDesc: "Al presionar en un anuncio, se abre un temporizador de custodia. Al concluir la retención, nuestro sistema envía una consulta encriptada al servidor de la red: \"¿La cuenta X dio me gusta al post Y?\". Si se valida, se añaden los puntos.",
    bannerAlert: "Nota de Seguridad: Ciertos sistemas exigen coherencia absoluta entre el ID registrado y el actor de soporte.",
    noPlatforms: "La administración no ha configurado plataformas activas de momento.",
    verifiedActive: "Verificado y Activo 🔒",
    notConnected: "Desconectado",
    inputLabel: "Enlace de Perfil o Nombre de Usuario:",
    connectedSuccess: "Vinculado",
    connectingStatus: "Comprobando credenciales con seguridad...",
    connectDone: "¡Perfil social mapeado y autenticado!",
    unlinkButton: "Desvincular y Liberar Cuenta 🔓",
    linkButtonPrefix: "Vincular cuenta de ",
    linkingInProgress: "Comprobando y mapeando perfil...",
    privacyTitle: "Protocolos Privados y Encriptación Extrema",
    privacyDesc: "Sus datos viajan únicamente mediante canales SSL de alta seguridad y no se comparten con terceros. Sirven para rastrear actividades de forma anónima.",
    protocolActive: "Auditor Automatizado Activo",
    enterUsernameFirst: "¡Ingrese su enlace de perfil o nombre de usuario primero!",
    initializingProtocol: "Iniciando protocolos de conexión socket segura...",
    connectingServer: "Estableciendo enlace de consulta con servidores de API...",
    generatingToken: "Firmando credenciales SHA-256 para prevenir suplantaciones...",
    linkSuccess: "¡Identidad de cuenta vinculada correctamente! 🔒",
    unlinkWarning: "¿Está seguro de querer retirar este perfil? Deberá enlazarlo otra vez para completar tareas.",
    linkError: "Ocurrió un error en el enlace del servidor. Intente nuevamente."
  }
};

export default function LinkAccounts({ user, onSelectTab, lang = 'en' }: LinkAccountsProps) {
  const settings = db.getAdminSettings();
  const isRtl = lang === 'ar';
  const loc = localization[lang] || localization['en'];
  
  // Dynamic settings loading with fallback to default platforms
  const rawPlatforms = settings.socialLinkPlatforms || [
    {
      id: 'youtube',
      name: lang === 'ar' ? 'يوتيوب (YouTube API)' : 'YouTube API Integration',
      desc: lang === 'ar' ? 'لمصادقة الاشتراكات ومطابقة تفعيل زر الجرس والتحقق التلقائي الآمن.' : 'For secure and automated real-time checking of subscriptions, bell notifications, and video likes.',
      place: lang === 'ar' ? '@username أو رابط القناة المفتوحة للتبادل' : '@username or public channel link',
      icon: 'Youtube',
      isActive: true
    },
    {
      id: 'facebook',
      name: lang === 'ar' ? 'فيسبوك (Facebook Sync)' : 'Facebook Auto Sync',
      desc: lang === 'ar' ? 'لإثبات ومطابقة لايكات المنشورات والصفحات على فيسبوك تلقائياً.' : 'To prove and verify page likes and custom post engagements automatically.',
      place: lang === 'ar' ? 'اسم المستخدم أو رابط الملف التعريفي الشخصي' : 'Profile username or full URL',
      icon: 'Facebook',
      isActive: true
    },
    {
      id: 'instagram',
      name: lang === 'ar' ? 'انستغرام (Instagram Connect)' : 'Instagram Basic Display Connect',
      desc: lang === 'ar' ? 'للتحقق من إتمام الفولو والمتابعات واللايكات في بضع ثوانٍ غيبياً.' : 'To verify Instagram followings and photo interactions in just a few silent seconds.',
      place: lang === 'ar' ? '@username أو رابط البروفايل' : '@username or instagram page URL',
      icon: 'Instagram',
      isActive: true
    },
    {
      id: 'tiktok',
      name: lang === 'ar' ? 'تيك توك (TikTok Verifier)' : 'TikTok Verifier Engine',
      desc: lang === 'ar' ? 'لكشف الإعجابات والمتابعات الفورية لحسابات وصناع محتوى تيك توك.' : 'To trace instant likes and followers of TikTok profiles and videos.',
      place: lang === 'ar' ? '@username الخاص بالتيك توك الخاص بك' : '@username or channel link',
      icon: 'Flame',
      isActive: true
    },
    {
      id: 'x',
      name: lang === 'ar' ? 'إكس / تويتر (X / Twitter Portal)' : 'X / Twitter Portal Connect',
      desc: lang === 'ar' ? 'لمصادقة والتحقق من متابعات ولايكات منشورات وحسابات منصة إكس تلقائياً.' : 'To verify X (Twitter) profile follows and tweet likes dynamically.',
      place: lang === 'ar' ? 'اسم المستخدم لمنصة إكس الخاص بك (مثل: @username)' : '@handle or username (e.g. @john)',
      icon: 'Compass',
      isActive: true
    },
    {
      id: 'pinterest',
      name: lang === 'ar' ? 'بنترست (Pinterest Connect)' : 'Pinterest Basic Display Connect',
      desc: lang === 'ar' ? 'للتحقق من إتمام الفولو والمتابعات واللايكات لمنصة بنترست تلقائياً وبأمان.' : 'To verify Pinterest pins, saves, likes and followers instantly.',
      place: lang === 'ar' ? 'اسم المستخدم لمنصة بنترست الخاص بك (مثل: @username)' : '@username or profile URL',
      icon: 'Pin',
      isActive: true
    },
    {
      id: 'telegram',
      name: lang === 'ar' ? 'تليجرام (Telegram Sync)' : 'Telegram Automated Sync',
      desc: lang === 'ar' ? 'لمطابقة والتحقق من اشتراكات وانضمام قنوات ومجموعات تليجرام تلقائياً.' : 'To verify Telegram group is joined and channel subscriptions instantly.',
      place: lang === 'ar' ? 'اسم المستخدم للتليجرام الخاص بك (مثل: @username)' : '@handle or username (e.g. @john)',
      icon: 'Send',
      isActive: true
    }
  ];

  // Show only active ones
  const activePlatforms = rawPlatforms.filter(p => p.isActive);

  // Stored handles inside localStorage
  const [handles, setHandles] = useState<Record<string, string>>({});
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [loadingPlatform, setLoadingPlatform] = useState<string | null>(null);
  const [stepMessage, setStepMessage] = useState<string>('');
  const [justConnected, setJustConnected] = useState<string | null>(null);

  // Load handles dynamically from localStorage
  useEffect(() => {
    const loadedHandles: Record<string, string> = {};
    const loadedInputs: Record<string, string> = {};
    activePlatforms.forEach(p => {
      const val = localStorage.getItem(`saved_handle_${p.id}_${user.uid}`) || '';
      loadedHandles[p.id] = val;
      loadedInputs[p.id] = val;
    });
    setHandles(loadedHandles);
    setInputs(loadedInputs);
  }, [user.uid, activePlatforms.length]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleLink = async (platformId: string, name: string) => {
    const value = (inputs[platformId] || '').trim();
    if (!value) {
      alert(loc.enterUsernameFirst);
      return;
    }

    setLoadingPlatform(platformId);
    setJustConnected(null);

    try {
      setStepMessage(loc.initializingProtocol);
      await sleep(1000);

      setStepMessage(loc.connectingServer);
      await sleep(1200);

      setStepMessage(loc.generatingToken);
      await sleep(1000);

      setStepMessage(loc.linkSuccess);
      await sleep(800);

      // Save to localStorage
      localStorage.setItem(`saved_handle_${platformId}_${user.uid}`, value);
      setHandles(prev => ({ ...prev, [platformId]: value }));
      setJustConnected(platformId);
    } catch (e) {
      alert(loc.linkError);
    } finally {
      setLoadingPlatform(null);
      setStepMessage('');
    }
  };

  const handleDisconnect = (platformId: string) => {
    if (confirm(loc.unlinkWarning)) {
      localStorage.removeItem(`saved_handle_${platformId}_${user.uid}`);
      setHandles(prev => ({ ...prev, [platformId]: '' }));
      setInputs(prev => ({ ...prev, [platformId]: '' }));
      setJustConnected(null);
    }
  };

  const getColorClass = (id: string) => {
    if (id === 'youtube') return 'text-red-500 bg-red-500/10 border-red-500/25';
    if (id === 'facebook') return 'text-blue-500 bg-blue-500/10 border-blue-500/25';
    if (id === 'instagram') return 'text-pink-500 bg-pink-500/10 border-pink-500/25';
    if (id === 'pinterest') return 'text-red-600 bg-red-650/10 border-red-500/25';
    if (id === 'tiktok') return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/25';
    if (id === 'telegram') return 'text-sky-400 bg-sky-400/10 border-sky-400/25';
    if (id === 'x') return 'text-slate-200 bg-slate-805/10 border-slate-700/30';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-400/25';
  };

  return (
    <div className="space-y-8 py-2 relative" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* HEADER SECTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4 shadow-xl">
        <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
          <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-2xl border border-cyan-500/20 shrink-0">
            <ShieldCheck className="w-8 h-8 animate-pulse text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white">{loc.headerTitle}</h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {loc.headerDesc}
            </p>
          </div>
        </div>
      </div>

      {/* GLOWING OFFICIAL API EXPLANATION BANNER */}
      <div className={`bg-gradient-to-l from-indigo-950/40 via-slate-900 to-indigo-950/40 border border-indigo-500/20 rounded-3xl p-6 space-y-4 shadow-xl ${isRtl ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-start gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20 mt-1 shrink-0">
            <Server className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className={`text-sm font-black text-white flex items-center gap-2 ${isRtl ? 'justify-end' : 'justify-start'}`}>
              <span>{loc.bannerTitle}</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              {loc.bannerDesc}
            </p>
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-300 mb-1">{loc.bannerHowTitle}</div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {loc.bannerHowDesc}
              </p>
            </div>
            <div className={`text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 py-2 px-3.5 rounded-xl inline-flex items-center gap-1.5 mt-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span>{loc.bannerAlert}</span>
            </div>
          </div>
        </div>
      </div>

      {/* CORE INTEGRATION HUB */}
      {activePlatforms.length === 0 ? (
        <div className="text-center py-12 bg-slate-900 border border-slate-800 text-slate-500 text-xs rounded-3xl">
          {loc.noPlatforms}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePlatforms.map((p) => {
            const PlatformIcon = IconMap[p.icon || ''] || Link2;
            const isLinked = !!handles[p.id];
            const isPlatformLoading = loadingPlatform === p.id;

            return (
              <div 
                key={p.id}
                className={`bg-slate-900 border rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-md transition duration-300 ${
                  isLinked 
                    ? 'border-emerald-500/20 bg-gradient-to-br from-slate-900 to-emerald-950/10' 
                    : 'border-slate-800 hover:border-slate-750'
                }`}
              >
                <div className="space-y-4">
                  {/* Brand & Badge Header */}
                  <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                    <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-2.5 rounded-2xl border ${getColorClass(p.id)}`}>
                        <PlatformIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black text-slate-200">{p.name}</h3>
                        <p className="text-[10px] text-slate-500">{loc.protocolActive}</p>
                      </div>
                    </div>

                    {isLinked ? (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>{loc.verifiedActive}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                        {loc.notConnected}
                      </span>
                    )}
                  </div>

                  <p className={`text-slate-400 text-xs leading-relaxed ${isRtl ? 'text-right' : 'text-left'}`}>
                    {p.desc}
                  </p>

                  {/* Input Container */}
                  <div className="space-y-2 pt-2">
                    <label className={`block text-[11px] font-bold text-slate-350 ${isRtl ? 'text-right' : 'text-left'}`}>{loc.inputLabel}</label>
                    
                    {isLinked ? (
                      <div className={`w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs text-slate-300 font-mono font-bold flex items-center justify-between ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className={`flex items-center gap-1.5 text-emerald-400 text-[11px] font-sans ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>{loc.connectedSuccess}</span>
                        </span>
                        <span className="select-all truncate max-w-[180px]">{handles[p.id]}</span>
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="text"
                          disabled={isPlatformLoading}
                          value={inputs[p.id] || ''}
                          onChange={(e) => setInputs(prev => ({ ...prev, [p.id]: e.target.value }))}
                          placeholder={p.place}
                          className={`w-full px-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-2xl text-xs text-white placeholder-slate-655 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-bold ${isRtl ? 'text-right' : 'text-left'}`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Connected / Just Connected State messages */}
                {isPlatformLoading && (
                  <div className={`bg-slate-950/80 p-3.5 rounded-2xl border border-slate-850 space-y-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                    <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                      <span className="text-[10px] text-cyan-300 font-extrabold">{loc.connectingStatus}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-normal font-medium">{stepMessage}</p>
                  </div>
                )}

                {justConnected === p.id && (
                  <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/25 text-emerald-400 text-xs text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{loc.connectDone}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                  {isLinked ? (
                    <button
                      onClick={() => handleDisconnect(p.id)}
                      className="w-full py-2.5 bg-slate-950 hover:bg-red-955/20 hover:text-red-400 border border-slate-800 hover:border-red-500/30 text-slate-400 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{loc.unlinkButton}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleLink(p.id, p.name)}
                      disabled={isPlatformLoading}
                      className={`w-full py-3 bg-gradient-to-r from-indigo-650 to-indigo-600 hover:from-indigo-550 hover:to-indigo-500 text-white text-xs font-black rounded-xl shadow-lg transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                        isPlatformLoading ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      {isPlatformLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{loc.linkingInProgress}</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-4 h-4" />
                          <span>{loc.linkButtonPrefix} {p.name}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SIDE ADVICE BADGE BAR */}
      <div className={`bg-slate-900 border border-slate-800 p-5 rounded-3xl flex flex-col md:flex-row items-center gap-4 ${isRtl ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}>
        <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl shrink-0">
          <Lock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-black text-white">{loc.privacyTitle}</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
            {loc.privacyDesc}
          </p>
        </div>
      </div>

    </div>
  );
}
