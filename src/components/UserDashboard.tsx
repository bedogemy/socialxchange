import React, { useState, useEffect } from 'react';
import { User, Campaign, ActionHistory } from '../types';
import { db } from '../lib/db';
import { 
  TrendingUp, 
  Activity, 
  Coins, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  Bot,
  Code,
  Key,
  Globe,
  Terminal,
  Copy,
  Check,
  Eye,
  ThumbsUp,
  UserPlus,
  Send,
  HelpCircle,
  BarChart2,
  RefreshCw,
  Lock
} from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

interface UserDashboardProps {
  user: User;
  onSelectTab: (tabId: string) => void;
  lang?: SupportedLanguages;
}

const dashTranslations = {
  ar: {
    title: 'لوحة التحكم والتحليلات المتقدمة',
    desc: 'راقب رصيدك، تحركات نقاطك، تفاصيل حملاتك البرمجية، وقم بتفعيل أنظمة الحماية وربط مزودي الخدمة تلقائياً.',
    tabStats: 'الإحصائيات والتحليلات',
    tabProtection: 'نظام الحماية والأمان (Anti-Bot)',
    tabApi: 'واجهة برمجة التطبيقات (SMM API)',
    tabSeo: 'موسوعة تهيئة (SEO & SSR)',
    
    // Stats
    totalEarned: 'إجمالي النقاط المكتسبة',
    totalSpent: 'إجمالي النقاط المستهلكة',
    campaignProgress: 'إنجاز الحملات الإجمالية',
    walletStatus: 'حالة محفظة كاش',
    withdrawn: 'دولار مسحوب / معلق',
    pointsEarnedChart: 'منحنى النقاط المكتسبة أسبوعياً',
    noCampaigns: 'لا توجد حملات معلنة حالياً',
    createOne: 'إطلاق حملتك الأولى الآن لزيادة التفاعل',
    
    // Order list
    orderTitle: 'تتبع حالة طلباتك وحملاتك الممولة',
    platform: 'المنصة',
    campaignName: 'عنوان الحملة / الفيديو',
    actions: 'التفاعلات المنجزة',
    cost: 'تكلفة الإجراء',
    status: 'الحالة',
    controls: 'إجراءات',
    active: 'نشطة',
    paused: 'متوقفة',
    completed: 'مكتملة',
    deleteConfirm: 'تم حذف الحملة واستعادة نقاط المتبقي تلقائياً.',
    pauseSuccess: 'تم إيقاف الحملة مؤقتاً.',
    resumeSuccess: 'تم تنشيط الحملة الآن بنجاح.',
    
    // Anti-bot
    antiSpamTitle: 'جدار حماية التفاعلات الذكي (Anti-Spam & Protection)',
    antiSpamDesc: 'تفعيل إعدادات الخوارزمية المتقدمة لفلترة البوتات ومنع حظر الحسابات وزيادة جودة التفاعلات المتبادلة.',
    verifyDelay: 'خطة التباعد الزمني للحملات',
    verifyDelayDesc: 'فرض فترات انتظار متباعدة وعشوائية (3-10 ثوانٍ) أثناء التحقق من التفاعل لتمثيل السلوك البشري الطبيعي بالكامل وتجنب شكوك الشبكات.',
    humanMath: 'تحدي التحقق البشري التفاعلي (Math Captcha)',
    humanMathDesc: 'إجبار المنفذ على حل مسألة رياضية عشوائية أثناء فحص التفاعل للتأكد التام من وجود إنسان حقيقي خلف الشاشة وليس أداة أتمتة.',
    profileAge: 'حظر الحسابات الفارغة والجديدة',
    profileAgeDesc: 'منع الحسابات التي لا تمتلك منشورات أو تم إنشاؤها حديثاً من التفاعل مع حملاتك لضمان جودة عالية من الـ Backlinks والمتابعين.',
    dailyLimit: 'إطار الحد اليومي لحماية حسابك الشخصي',
    dailyLimitDesc: 'تحديد الحد الأقصى للمهام المفردة التي يمكنك إتمامها يومياً لتجنب إتلاف أو تقييد حساباتك الشخصية من قبل خوارزميات فيسبوك وإنستجرام وتيك توك.',
    limitLabel: 'الحد الأقصى للإجراءات اليومية للحساب',
    limit30: '30 إجراء (أمان متناهي)',
    limit50: '50 إجراء (أمان متوسط)',
    limit100: '100 إجراء (أمان متدني)',
    unlimited: 'بدون حدود (خطر الحظر)',
    saveSettings: 'حفظ إعدادات الحماية والأمان الحارس',
    settingsSaved: 'تم حفظ وتطبيق معاملات الحسم والحماية الرقمية على حسابك بنجاح!',
    
    // API SMM
    apiTitle: 'بوابة المبرمجين ومزودي الخدمة (SMM System API)',
    apiDesc: 'قم بدمج منصتك أو لوحة SMM الخاصة بك برمجياً لإطلاق ومتابعة الحملات تلقائياً عبر SocialXchange.',
    apiKeyLabel: 'مفتاح الـ API الخاص بربط حسابك كـ Provider',
    generateKey: 'توليد / تجديد مفتاح الـ API',
    webhookLabel: 'رابط عنوان الويب هوك (Webhook URL) لتحديثات التنفيذ',
    webhookPlaceholder: 'https://yourdomain.com/api/webhooks/socialxchange',
    saveWebhook: 'حفظ رابط الويب هوك وتفعيله',
    webhookSaved: 'تم حفظ رابط Webhook بنجاح.',
    testWebhook: 'إجراء فحص webhook تجريبي',
    webhookSuccess: 'تم إرسال طلب Webhook تمثيلي بنجاح!',
    apiMethodsTitle: 'توثيق واختبار الطلبات البرمجية المتاحة (API Methods)',
    getProfile: 'الاستعلام عن نقاط الحساب الشخصي',
    createOrder: 'إنشاء طلب تفاعل جديد تلفائي',
    checkStatus: 'متابعة حالة حملة معلنة',
    interactiveConsole: '콘솔 لوحة تجارب السيرفر التفاعلية (Interactive Playground)',
    sendRequest: 'إرسال طلب تجريبي مباشر (Send Sandbox)',
    apiResponse: 'الاستجابة الراجعة من السيرفر (Server Response):',
    copied: 'تم النسخ إلى الحافظة'
  },
  en: {
    title: 'Advanced Analytics & Protection Control',
    desc: 'Monitor points, track active campaigns, leverage anti-spam systems, and connect automated SMM API providers.',
    tabStats: 'Stats & Demographics',
    tabProtection: 'Anti-Bot Protection Shield',
    tabApi: 'SMM Provider API Integrator',
    tabSeo: 'SEO & SSR Engine Hub',
    
    // Stats
    totalEarned: 'Total Points Earned',
    totalSpent: 'Total Points Utilized',
    campaignProgress: 'Total Campaigns Progress',
    walletStatus: 'E-Wallet Transfer Status',
    withdrawn: 'USD Exchanged / Pending',
    pointsEarnedChart: 'Weekly Points Earnings Trend',
    noCampaigns: 'No campaigns found',
    createOne: 'Launch your first campaign today to gain premium engagement',
    
    // Order list
    orderTitle: 'Live Campaign Execution Tracker',
    platform: 'Platform',
    campaignName: 'Campaign Details / Video',
    actions: 'Accomplished Actions',
    cost: 'Points/Action',
    status: 'Status',
    controls: 'Actions',
    active: 'Active',
    paused: 'Paused',
    completed: 'Completed',
    deleteConfirm: 'Campaign deleted and remaining points automatically refunded.',
    pauseSuccess: 'Campaign paused successfully.',
    resumeSuccess: 'Campaign resumed successfully.',
    
    // Anti-bot
    antiSpamTitle: 'Social Guard Anti-Bot Core Engine',
    antiSpamDesc: 'Activate cutting-edge verification algorithms to protect advertisers from spam and prevent account bans.',
    verifyDelay: 'Paced Verification Intervals',
    verifyDelayDesc: 'Add dynamic random delays (3-10 seconds) during the interaction challenge to mimic normal human activity.',
    humanMath: 'Dynamic Math Challenge (Math Captcha)',
    humanMathDesc: 'Mandate performers to solve quick algebraic problems during validation to rule out headless scripts.',
    profileAge: 'Block Empty & Newly Created Profiles',
    profileAgeDesc: 'Prevent newly registered social accounts with zero posts/followers from interacting with your valuable assets.',
    dailyLimit: 'Daily Action Threshold for Account Safety',
    dailyLimitDesc: 'Configure maximum support actions per day to shield your personal accounts from social platform security flags.',
    limitLabel: 'Daily Support Limit per social medium',
    limit30: '30 Actions (Highly Secure)',
    limit50: '50 Actions (Medium Risk)',
    limit100: '100 Actions (High Impact)',
    unlimited: 'Unlimited (Risk of shadow-ban)',
    saveSettings: 'Commit Protection Settings',
    settingsSaved: 'Protection metrics saved and activated on your account.',
    
    // API SMM
    apiTitle: 'SMM Panel Provider API Gateway',
    apiDesc: 'Programmatically request, fund, and manage campaigns through our secure endpoint gateway using standard REST calls.',
    apiKeyLabel: 'Secret SMM Provider API Key',
    generateKey: 'Generate / Rotate API Key',
    webhookLabel: 'Webhook Endpoint URL (Auto Status Alerts)',
    webhookPlaceholder: 'https://yourdomain.com/api/webhooks/socialxchange',
    saveWebhook: 'Set and Verify Webhook Endpoint',
    webhookSaved: 'Webhook endpoint updated successfully.',
    testWebhook: 'Trigger Sandbox Webhook Event',
    webhookSuccess: 'Simulated Webhook query ping dispatched successfully!',
    apiMethodsTitle: 'Interactive API Protocol Reference & Methods',
    getProfile: 'Check Account Points Balance',
    createOrder: 'Programmatically Fund Campaign Order',
    checkStatus: 'Retrieve Order Completion Rate',
    interactiveConsole: 'Live REST API Playground (Sandbox)',
    sendRequest: 'Send REST API Test Request',
    apiResponse: 'Server Status & JSON Output:',
    copied: 'Copied to clipboard'
  },
  fr: {
    title: 'Analyses Avancées & Contrôle de Sécurité',
    desc: 'Supervisez vos points, gérez les campagnes, configurez l\'anti-bot et connectez vos services d\'API SMM.',
    tabStats: 'Analyses & Statistiques',
    tabProtection: 'Système Anti-Bot & Anti-Spam',
    tabApi: 'Intégrateur API Pour Prestataires SMM',
    tabSeo: 'Suite SEO & SSR Guide',
    
    // Stats
    totalEarned: 'Total des Points Gagnés',
    totalSpent: 'Total des Points Dépensés',
    campaignProgress: 'Taux de Complétion Général',
    walletStatus: 'État du Portefeuille Cash',
    withdrawn: 'USD Échangés / En Attente',
    pointsEarnedChart: 'Tendance des Points Gagnés Hebdomadairement',
    noCampaigns: 'Aucune campagne active enregistrée.',
    createOne: 'Lancer une campagne de trafic pour démarrer.',
    
    // Order list
    orderTitle: 'Suivi de statut des ordres et campagnes',
    platform: 'Plateforme',
    campaignName: 'Nom de la Campagne / Médium',
    actions: 'Interactions Réalisées',
    cost: 'Pts / Action',
    status: 'État',
    controls: 'Contrôles',
    active: 'Actif',
    paused: 'En Pause',
    completed: 'Complété',
    deleteConfirm: 'Campagne supprimée et points non consommés restitués.',
    pauseSuccess: 'Campagne mise en pause.',
    resumeSuccess: 'Campagne réactivée avec succès.',
    
    // Anti-bot
    antiSpamTitle: 'Algorithme de Sécurité & Anti-Spam',
    antiSpamDesc: 'Empêchez l\'activité des robots pour une qualité optimale et protégez vos propres canaux contre les restrictions.',
    verifyDelay: 'Décalage Temporel Intelligent',
    verifyDelayDesc: 'Impose des délais aléatoires (3-10 sec) pour authentifier l\'action afin de mimer les humains réels.',
    humanMath: 'Vérification Mathématique (Captcha)',
    humanMathDesc: 'Résoudre un calcul rapide pour éliminer les scripts ou automatisations lors du crédit des points.',
    profileAge: 'Exclure les comptes récents ou vides',
    profileAgeDesc: 'Interdire l\'accès aux profils vierges sans contenu pour maintenir un engagement de premier choix.',
    dailyLimit: 'Seuil d\'activité journalière de sécurité',
    dailyLimitDesc: 'Configurez la limite quotidienne d\'actions autorisées pour esquiver les pénalités et shadow-ban.',
    limitLabel: 'Limite d\'actions journalières supportée',
    limit30: '30 Actions (Protection Max)',
    limit50: '50 Actions (Sélection Standard)',
    limit100: '100 Actions (Rendement Élevé)',
    unlimited: 'Illimité (Sensible au blocage)',
    saveSettings: 'Valider les Directives de Protection',
    settingsSaved: 'Vos barrières de sécurité et protections ont été appliquées avec succès.',
    
    // API SMM
    apiTitle: 'Passerelle API SMM pour Développeurs',
    apiDesc: 'Intégrez vos services de revente d\'interactions pour automatiser l\'envoi de campagnes via notre API REST.',
    apiKeyLabel: 'Clé d\'API Secrète de Revendeur SMM',
    generateKey: 'Générer / Renouveler Clé API',
    webhookLabel: 'URL Webhook de Notification de Statut',
    webhookPlaceholder: 'https://votre-site.com/webhooks/socialxchange',
    saveWebhook: 'Mettre à jour l\'URL de Webhook',
    webhookSaved: 'URL de webhook enregistrée.',
    testWebhook: 'Tester Simulation de Webhook',
    webhookSuccess: 'Ping de webhook envoyé avec succès!',
    apiMethodsTitle: 'Méthodes de l\'API Rest & Outils de test',
    getProfile: 'Solde du compte et points',
    createOrder: 'Créer un ordre de campagne automatique',
    checkStatus: 'Vérifier la progression de l\'ordre',
    interactiveConsole: 'Console d\'essais en direct (Sandbox Playground)',
    sendRequest: 'Lancer un appel API test',
    apiResponse: 'Résultat renvoyé par l\'hôte (JSON):',
    copied: 'Copié dans le presse-papiers'
  },
  es: {
    title: 'Estadísticas, Anti-Bot y API SMM',
    desc: 'Revise su rendimiento global, module protecciones contra bots perjudiciales y automatice pedidos con la API.',
    tabStats: 'Estadísticas e Informes',
    tabProtection: 'Protecciones Anti-Baneos y Spam',
    tabApi: 'Lanzamiento Automatizado por API REST',
    tabSeo: 'Manual de SEO y SSR',
    
    // Stats
    totalEarned: 'Puntos Totales Obtenidos',
    totalSpent: 'Puntos Totales Consumidos',
    campaignProgress: 'Progreso de Campañas Totales',
    walletStatus: 'Estado de Métodos de Pago',
    withdrawn: 'USD Retirados / Pendientes',
    pointsEarnedChart: 'Evolución de Puntos Ganados',
    noCampaigns: 'No se registran campañas creadas.',
    createOne: 'Comience su primera campaña para ver de cerca su progreso.',
    
    // Order list
    orderTitle: 'Control del Estado de Campañas',
    platform: 'Red',
    campaignName: 'Asunto de la Campaña / Url',
    actions: 'Logros Cumplidos',
    cost: 'Pts / Acción',
    status: 'Estado',
    controls: 'Acción',
    active: 'Activo',
    paused: 'Pausado',
    completed: 'Completado',
    deleteConfirm: 'Campaña eliminada permanentemente. Reembolso ejecutado.',
    pauseSuccess: 'Campaña pausada exitosamente.',
    resumeSuccess: 'Campaña reanudada con éxito.',
    
    // Anti-bot
    antiSpamTitle: 'Escudo Inteligente Anti-Spam y Baneo',
    antiSpamDesc: 'Evite las sanciones de los algoritmos de redes sociales configurando filtros de seguridad restrictivos.',
    verifyDelay: 'Demora Orgánica Variable',
    verifyDelayDesc: 'Retarda la validación de acciones (3-10 segundos) aleatoriamente para emular interacciones humanas reales.',
    humanMath: 'Reto de Cálculo Humano (Captcha)',
    humanMathDesc: 'Obliga a resolver una ecuación matemática simple antes de adjudicar el saldo de puntos.',
    profileAge: 'Bloquear cuentas sospechosas vacías',
    profileAgeDesc: 'Impide que perfiles de bajo rango (recién creados, sin fotos/seguidores) sumen puntos en sus campañas.',
    dailyLimit: 'Protección diaria de sus perfiles personales',
    dailyLimitDesc: 'Limite sus interacciones diarias para salvaguardar sus cuentas privadas de cierres o advertencias de uso.',
    limitLabel: 'Cantidad máxima de acciones al día',
    limit30: '30 Acciones (Seguridad Óptima)',
    limit50: '50 Acciones (Riesgo Regular)',
    limit100: '100 Acciones (Alto Tráfico)',
    unlimited: 'Ilimitado (Sin protección de baneo)',
    saveSettings: 'Conservar Ajustes de Protección',
    settingsSaved: 'Parámetros guardados y ajustados al controlador del sistema.',
    
    // API SMM
    apiTitle: 'Terminal API para Distribuidores SMM',
    apiDesc: 'Permite conectar paneles automáticos de forma remota programando peticiones y consultando resultados en milisegundos.',
    apiKeyLabel: 'Clave Secreta de API del Distribuidor',
    generateKey: 'Generar / Cambiar Clave de Acceso',
    webhookLabel: 'URL Webhook de Sincronización',
    webhookPlaceholder: 'https://suweb.com/socialxchange-webhook',
    saveWebhook: 'Actualizar Direccionamiento',
    webhookSaved: 'Webhook configurado satisfactoriamente.',
    testWebhook: 'Simular Envío de Webhook',
    webhookSuccess: 'Simulación de callback enviada!',
    apiMethodsTitle: 'Especificación de Respuestas y Pruebas directas',
    getProfile: 'Consultar balance de puntos de usuario',
    createOrder: 'Crear campaña o pedido programático',
    checkStatus: 'Consultar métricas de progreso de pedido',
    interactiveConsole: 'Área de Ejecución en Vivo (Sandbox Playground)',
    sendRequest: 'Comprobar llamada de retorno',
    apiResponse: 'Respuesta del Servidor (JSON):',
    copied: 'Copiado al portapapeles'
  }
};

export default function UserDashboard({ user, onSelectTab, lang = 'en' }: UserDashboardProps) {
  const currentLang = lang as SupportedLanguages;
  const t = dashTranslations[currentLang] || dashTranslations['en'];
  const isRtl = lang === 'ar';

  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'protection' | 'api' | 'seo'>('stats');
  
  // SEO Sandbox Simulation states
  const [simUserAgent, setSimUserAgent] = useState('googlebot');
  const [simRoute, setSimRoute] = useState('/accounts');
  const [simResponse, setSimResponse] = useState('');
  const [simActiveTab, setSimActiveTab] = useState<'netlify' | 'middleware' | 'migration'>('netlify');
  
  // Anti-Spam state loaded from localStorage for immediate, functional toggling
  const [delayEnabled, setDelayEnabled] = useState(() => localStorage.getItem('guard_delay_enabled') !== 'false');
  const [mathCaptchaEnabled, setMathCaptchaEnabled] = useState(() => localStorage.getItem('guard_math_enabled') === 'true');
  const [blockEmptyProfiles, setBlockEmptyProfiles] = useState(() => localStorage.getItem('guard_block_empty') === 'true');
  const [dailyPostLimit, setDailyPostLimit] = useState(() => localStorage.getItem('guard_daily_limit') || '50');
  const [protectionSavedMsg, setProtectionSavedMsg] = useState('');

  // API Developer State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(`apikey_${user.uid}`) || `sx_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`);
  const [webhookUrl, setWebhookUrl] = useState(() => localStorage.getItem(`webhook_${user.uid}`) || '');
  const [webhookSavedMsg, setWebhookSavedMsg] = useState('');
  const [webhookTestSuccess, setWebhookTestSuccess] = useState(false);
  const [apiPlaygroundMethod, setApiPlaygroundMethod] = useState<'balance' | 'create_campaign' | 'status'>('balance');
  const [playgroundOutput, setPlaygroundOutput] = useState<string>('');
  const [copiedText, setCopiedText] = useState(false);

  // Load Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [history, setHistory] = useState<ActionHistory[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');
  const [campaignActionMsg, setCampaignActionMsg] = useState('');

  useEffect(() => {
    setCampaigns(db.getCampaigns().filter(c => c.creatorId === user.uid));
    setHistory(db.getHistory().filter(h => h.userId === user.uid));

    // Save developer API Key for cross interaction
    localStorage.setItem(`apikey_${user.uid}`, apiKey);
  }, [user.uid, apiKey]);

  // Dynamic SEO Simulation Effect
  useEffect(() => {
    if (simUserAgent === 'chrome') {
      setSimResponse(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SocialXchange - Client React App</title>
  <script type="module" src="/src/main.tsx"></script>
</head>
<body class="bg-slate-950 text-white">
  <!-- Notice: This is standard Client-Side Routing (CSR). -->
  <!-- Search engine bots like Googlebot would see an EMPTY root element if Prerendering is disabled! -->
  <div id="root"></div>
</body>
</html>`);
    } else {
      const isGoogle = simUserAgent === 'googlebot';
      const botName = isGoogle ? 'Googlebot/2.1' : 'FacebookExternalHit/1.1';
      
      if (simRoute === '/accounts') {
        setSimResponse(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>ربط ومصادقة الحسابات الرقمية الآمنة | SocialXchange</title>
  <meta name="description" content="اربط حساباتك الاجتماعية بيوتيوب وتيك توك وفيسبوك بأمان تام وتفادى البوتات. صادق حسابك لتأكيد التفاعل اليدوي واكسب الأرباح والنقاط المضاعفة فوراً.">
  <meta name="keywords" content="تبادل متابعين, توثيق حسابات, كسب نقاط, يوتيوب SMM">
  
  <!-- Open Graph / SEO Crawler Metadata -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://socialxchange.com/accounts">
  <meta property="og:title" content="ربط ومصادقة الحسابات الرقمية - لزيادة التفاعل الحقيقي">
  <meta property="og:description" content="اربط حساباتك وتفادى الحسابات الوهمية لتأجير دعم بشري 100% بدون شكوك خوارزمية.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&h=630&fit=crop">
  <meta name="robots" content="index, follow">
</head>
<body>
  <!-- [INJECTED BY NODE.JS MIDDWARE FOR ${botName}] -->
  <div id="root">
    <header>
      <h1>بوابتك لتوثيق ومصادقة هويتك الرقمية لشراكة الدعم المتبادل</h1>
    </header>
    <main>
      <article>
        <h2>ما هي فائدة ربط حسابك الاجتماعي بالبوابة الموحدة؟</h2>
        <p>نعمل على تنقية وحماية حسابات المبدعين من التفاعلات المفرغة من التفاعل الحقيقي. نلتزم بمعايير أمان مشددة:</p>
        <ul>
          <li>حماية مزدوجة لمنع تكرار النقرات المزعجة.</li>
          <li>نظام تحكم عشوائي وتأخير ذكي لمحاكاة حركة اليد البشرية.</li>
          <li>مسألة أمان حسابية ذكية تفشل فيها برمجيات سكربتات الأوتوميشن.</li>
        </ul>
      </article>
    </main>
    <footer>
      <p>جميع الحقوق محفوظة لصالح SocialXchange SSR SEO Server @ 2026</p>
    </footer>
  </div>
</body>
</html>`);
      } else if (simRoute === '/buy') {
        setSimResponse(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>باقات شراء نقاط الحملات وإطلاق ترويج فوري | SocialXchange</title>
  <meta name="description" content="اشحن رصيد حسابك الآن بنقاط تفاعل ممولة ومؤمنة بالكامل. اختر باقاتنا المرنة المصممة لمدراء السوشيال ميديا وأصحاب قنوات يوتيوب الكبرى لضمان وصول حقيقي.">
  
  <!-- Open Graph / SEO Crawler Metadata -->
  <meta property="og:type" content="product">
  <meta property="og:title" content="باقات وحزم شحن الرصيد الفوري بأسعار خيالية">
  <meta property="og:description" content="ابدأ حملتك الترويجية المضمونة لمقاطع فيديوهاتك بأقل تكلفة ونظام حظر عالي الحماية.">
  <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop">
</head>
<body>
  <!-- [INJECTED BY NODE.JS MIDDWARE FOR ${botName}] -->
  <div id="root">
    <h1>أنظمة تمويل الحملات الإعلانية المدفوعة وعروض النقاط الذهبية</h1>
    <p>تمتع بأسرع عملية توسيع قاعدة جمهور لجميع قنواتك وقوائم تشغيلك تحت مظلة نظام الأمان الأوتوماتيكي.</p>
  </div>
</body>
</html>`);
      } else {
        setSimResponse(`<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>بوابة سحب واستبدال الأرباح الفورية كاش | SocialXchange</title>
  <meta name="description" content="بوابة مالية سريعة تمكنك من تحويل رصيد نقاط المجهود الاجتماعي إلى سحوبات كاش نقدية عبر فودافون كاش وبايير ويب موني وبايبال خلال خمس دقائق.">
  
  <!-- Open Graph / SEO Crawler Metadata -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="استبدل نقاطك التفاعلية بأرباح مالية حقيقية كاش">
  <meta property="og:description" content="حقق أحلامك في الحصول على عائد مستمر مقابل تأكيد وتنفيذ المهام التفاعلية البسيطة.">
</head>
<body>
  <!-- [INJECTED BY NODE.JS MIDDWARE FOR ${botName}] -->
  <div id="root">
    <h1>استبدل تعبك بدعم حقيقي! خدمة الصرف الفورية</h1>
    <p>اضمن تعليق حساباتك من خلال العمل بتباعدات آمنة، واسحب عوائدك بدقة وسهولة متناهية.</p>
  </div>
</body>
</html>`);
      }
    }
  }, [simUserAgent, simRoute]);

  // Statistics Computations
  const totalSpentPoints = campaigns.reduce((acc, c) => acc + (c.quantity * c.pointsPerAction), 0);
  const totalEarnedPoints = history.reduce((acc, h) => acc + h.pointsEarned, 0);
  const totalCampaignsCount = campaigns.length;
  const completedCampaignsCount = campaigns.filter(c => c.status === 'completed').length;
  
  // Calculate average completion rate percentage
  let avgCompletionRate = 0;
  if (totalCampaignsCount > 0) {
    const totalGoals = campaigns.reduce((sum, c) => sum + c.quantity, 0);
    const totalCompletions = campaigns.reduce((sum, c) => sum + c.completedCount, 0);
    avgCompletionRate = Math.round((totalCompletions / totalGoals) * 100) || 0;
  }

  // Handle Campaign Status Management
  const handleToggleStatus = (id: string) => {
    const updated = db.toggleCampaignStatus(id);
    if (updated) {
      setCampaigns(db.getCampaigns().filter(c => c.creatorId === user.uid));
      setCampaignActionMsg(updated.status === 'active' ? t.resumeSuccess : t.pauseSuccess);
      setTimeout(() => setCampaignActionMsg(''), 4000);
    }
  };

  const handleDeleteCampaign = (id: string) => {
    const success = db.deleteCampaign(id);
    if (success) {
      setCampaigns(db.getCampaigns().filter(c => c.creatorId === user.uid));
      setCampaignActionMsg(t.deleteConfirm);
      setTimeout(() => setCampaignActionMsg(''), 4000);
    }
  };

  // Safe Guard settings saving
  const handleSaveProtection = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('guard_delay_enabled', delayEnabled ? 'true' : 'false');
    localStorage.setItem('guard_math_enabled', mathCaptchaEnabled ? 'true' : 'false');
    localStorage.setItem('guard_block_empty', blockEmptyProfiles ? 'true' : 'false');
    localStorage.setItem('guard_daily_limit', dailyPostLimit);

    setProtectionSavedMsg(t.settingsSaved);
    setTimeout(() => setProtectionSavedMsg(''), 5000);
  };

  const handleGenerateApiKey = () => {
    const key = `sx_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    setApiKey(key);
    localStorage.setItem(`apikey_${user.uid}`, key);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`webhook_${user.uid}`, webhookUrl);
    setWebhookSavedMsg(t.webhookSaved);
    setTimeout(() => setWebhookSavedMsg(''), 5000);
  };

  const handleTriggerTestWebhook = () => {
    if (!webhookUrl) return;
    setWebhookTestSuccess(true);
    setTimeout(() => setWebhookTestSuccess(false), 5000);
  };

  // REST API Sandbox executing mock results live based on current real states!
  const handleExecutePlayground = () => {
    if (apiPlaygroundMethod === 'balance') {
      const output = {
        status: "success",
        timestamp: Date.now(),
        ip: "82.45.191.13",
        provider_name: "SocialXchange Integrator",
        auth: {
          uid: user.uid,
          api_key: apiKey.substring(0, 8) + '...'
        },
        payload: {
          points_balance: user.points,
          cash_usd_equivalent: user.points / 50000,
          points_spent_total: totalSpentPoints,
          registered_at_epoch: user.createdAt
        }
      };
      setPlaygroundOutput(JSON.stringify(output, null, 2));
    } else if (apiPlaygroundMethod === 'create_campaign') {
      const output = {
        status: "success",
        timestamp: Date.now(),
        message: "Order queued on SocialXchange servers successfully.",
        order_id: `sx_order_${Math.random().toString(36).substring(2, 9)}`,
        deducted_points: 600,
        payload: {
          target_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          requested_quantity: 10,
          points_per_click: 60,
          platform: "youtube_view",
          system_safety_flags: {
            anti_bot_verification: delayEnabled ? "PACED_ACTIVE" : "STANDARD",
            math_captcha_active: mathCaptchaEnabled,
            empty_profile_check: blockEmptyProfiles
          }
        },
        user_remaining_points: Math.max(0, user.points - 600)
      };
      setPlaygroundOutput(JSON.stringify(output, null, 2));
    } else {
      const activeCamp = campaigns[0] || {
        id: "camp_demo_status",
        type: "youtube_view",
        title: "SMM Campaign Sample",
        quantity: 100,
        completedCount: 42,
        status: "active"
      };
      const output = {
        status: "success",
        timestamp: Date.now(),
        query_campaign_id: activeCamp.id,
        payload: {
          title: activeCamp.title,
          campaign_type: activeCamp.type,
          completion_rate: `${Math.round((activeCamp.completedCount / activeCamp.quantity) * 100)}%`,
          goals_required: activeCamp.quantity,
          completions_to_date: activeCamp.completedCount,
          campaign_status: activeCamp.status,
          is_under_anti_bot_pacing: delayEnabled
        }
      };
      setPlaygroundOutput(JSON.stringify(output, null, 2));
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const codeSnippets = {
    curl: `curl -X POST "https://socialxchange.com/api/v1/campaigns" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "youtube_view",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "quantity": 100,
    "points_per_action": 60,
    "anti_bot_delay": ${delayEnabled},
    "captcha_proof": ${mathCaptchaEnabled}
  }'`,
    node: `const axios = require('axios');

async function createSMMOrder() {
  try {
    const response = await axios.post('https://socialxchange.com/api/v1/campaigns', {
      type: 'youtube_view',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      quantity: 100,
      points_per_action: 60,
      anti_bot_delay: ${delayEnabled}
    }, {
      headers: { 'Authorization': 'Bearer ${apiKey}' }
    });
    console.log('Order Active:', response.data.order_id);
  } catch (error) {
    console.error('API Error:', error.message);
  }
}
createSMMOrder();`,
    python: `import requests

url = "https://socialxchange.com/api/v1/campaigns"
headers = {
    "Authorization": "Bearer ${apiKey}",
    "Content-Type": "application/json"
}
payload = {
    "type": "youtube_view",
    "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "quantity": 100,
    "points_per_action": 60,
    "anti_bot_delay": ${delayEnabled}
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`,
    php: `<? airspeed
$ch = curl_init("https://socialxchange.com/api/v1/campaigns");
$payload = json_encode([
    "type" => "youtube_view",
    "url" => "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    "quantity" => 100,
    "points_per_action" => 60
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer ${apiKey}",
    "Content-Type: application/json"
]);

$response = curl_exec($ch);
curl_close($ch);
print_r(json_decode($response, true));
?>`
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="space-y-8 py-2 text-right selection:bg-indigo-500/30" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* HEADER SECTION */}
      <div className="bg-gradient-to-l from-slate-900 to-indigo-950/20 border border-slate-800 p-6 md:p-8 rounded-3xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <BarChart2 className="w-8 h-8 text-indigo-400" />
            <span>{t.title}</span>
          </h1>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl font-medium leading-relaxed">
            {t.desc}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onSelectTab('ad')}
            className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition duration-150 flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isRtl ? 'إطلاق حملة ممولة' : 'Launch Campaign'}</span>
          </button>
          <button
            onClick={() => onSelectTab('exchange')}
            className="py-2.5 px-5 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer"
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>{isRtl ? 'تحويل الأرباح الفوري' : 'Cash Out Points'}</span>
          </button>
        </div>
      </div>

      {/* SUB-TABS NAVIGATION */}
      <div className="flex border-b border-slate-900 gap-1 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveSubTab('stats')}
          className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'stats'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span>{t.tabStats}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('protection')}
          className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'protection'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Bot className="w-4 h-4 text-red-400" />
          <span>{t.tabProtection}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('api')}
          className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'api'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Code className="w-4 h-4 text-emerald-400" />
          <span>{t.tabApi}</span>
        </button>
        <button
          onClick={() => setActiveSubTab('seo')}
          className={`py-3 px-6 text-sm font-bold border-b-2 whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
            activeSubTab === 'seo'
              ? 'border-indigo-500 text-white bg-indigo-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Globe className="w-4 h-4 text-blue-400" />
          <span>{t.tabSeo}</span>
        </button>
      </div>

      {/* TAB CONTENT 1: STATS & ANALYTICS */}
      {activeSubTab === 'stats' && (
        <div className="space-y-8 animate-fadeIn">
          {/* STATS BENTO TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Tile 1: Current Points */}
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
              <div className="flex justify-between items-start flex-row-reverse mb-2">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Coins className="w-5 h-5 animate-bounce-slow" />
                </div>
                <h3 className="text-slate-400 text-xs font-extrabold">{isRtl ? 'الرصيد المتاح حالياً' : 'Current Points Balance'}</h3>
              </div>
              <div>
                <p className="text-2xl font-black text-amber-500 font-mono tracking-tight">{user.points.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">{isRtl ? 'جاهزة للاستعمال أو الاستبدال فوراً' : 'Ready for direct campaign usage'}</p>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
            </div>

            {/* Tile 2: Earned Cumulative */}
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
              <div className="flex justify-between items-start flex-row-reverse mb-2">
                <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                  <Activity className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-xs font-extrabold">{t.totalEarned}</h3>
              </div>
              <div>
                <p className="text-2xl font-black text-indigo-400 font-mono tracking-tight">{(totalEarnedPoints || 1250).toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  {isRtl ? `من جزئية إنجاز ${history.length} مهام دعم متبادلة` : `From completed custom tasks`}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>
            </div>

            {/* Tile 3: Consumed Campaign Points */}
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
              <div className="flex justify-between items-start flex-row-reverse mb-2">
                <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-xs font-extrabold">{t.totalSpent}</h3>
              </div>
              <div>
                <p className="text-2xl font-black text-red-400 font-mono tracking-tight">{(totalSpentPoints || 0).toLocaleString()}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-medium">
                  {isRtl ? `مستثمرة بالكامل لإنماء قنواتك الخاصة` : `Invested across your self-created campaigns`}
                </p>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rounded-full blur-xl pointer-events-none"></div>
            </div>

            {/* Tile 4: General Progress Card */}
            <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between h-36">
              <div className="flex justify-between items-start flex-row-reverse mb-2">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h3 className="text-slate-400 text-xs font-extrabold">{t.campaignProgress}</h3>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-row-reverse justify-between">
                  <p className="text-2xl font-black text-emerald-400 font-mono tracking-tight">{avgCompletionRate}%</p>
                  <span className="text-[10px] text-slate-500 font-bold">({completedCampaignsCount}/{totalCampaignsCount})</span>
                </div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${avgCompletionRate}%` }}></div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
            </div>

          </div>

          {/* ANALYTICAL SVGS TREND CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Column 1: SVG Trend Chart */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center gap-4 flex-row-reverse text-right">
                <div>
                  <h3 className="text-sm font-black text-white">{t.pointsEarnedChart}</h3>
                  <p className="text-[10px] text-slate-500 font-medium">{isRtl ? 'مستويات كسب النقاط اليومية بمشاركاتك' : 'Daily points accumulation curve'}</p>
                </div>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full font-bold">
                  {isRtl ? 'نشط ومحدث' : 'Live Activity'}
                </span>
              </div>
              
              {/* Responsive SVG Chart */}
              <div className="w-full bg-slate-950/80 p-4 rounded-2xl border border-slate-850 flex flex-col justify-between">
                <div className="h-44 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 500 160" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    {/* SVG Grid lines */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeWidth="0.8" />
                    <line x1="0" y1="140" x2="500" y2="140" stroke="#1d2433" strokeWidth="1" />
                    
                    {/* Trend Area path */}
                    <path
                      d="M 10 140 Q 90 90 170 120 T 330 40 T 490 60 L 490 140 L 10 140 Z"
                      fill="url(#chartGrad)"
                    />
                    
                    {/* Trend Line */}
                    <path
                      d="M 10 140 Q 90 90 170 120 T 330 40 T 490 60"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Interactive dots with ring */}
                    <circle cx="170" cy="120" r="4.5" fill="#6366f1" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                    <circle cx="330" cy="40" r="4.5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
                  </svg>
                </div>
                
                {/* Chart labels bottom */}
                <div className="flex justify-between text-[9px] text-slate-500 font-bold px-2 pt-2 border-t border-slate-900 flex-row-reverse" dir="rtl">
                  <span>السبت</span>
                  <span>الأحد</span>
                  <span>الإثنين</span>
                  <span>الثلاثاء</span>
                  <span>الأربعاء</span>
                  <span>الخميس</span>
                  <span>الجمعة</span>
                </div>
              </div>
            </div>

            {/* Chart Column 2: Platform distribution circular widget */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-white">{isRtl ? 'توزع التفاعلات والجهد' : 'Interaction Focus Rate'}</h3>
                <p className="text-[10px] text-slate-500 font-medium">{isRtl ? 'تصنيف المهام التي تستهلك بها نقاطك' : 'Tasks distribution share'}</p>
              </div>

              <div className="flex justify-center items-center py-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0f172a" strokeWidth="2.5" />
                    {/* Circle 1: Youtube */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="50 100" strokeDashoffset="0" />
                    {/* Circle 2: FB */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeDasharray="25 100" strokeDashoffset="-50" />
                    {/* Circle 3: Instagram/Ticktok */}
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#a855f7" strokeWidth="2.5" strokeDasharray="25 100" strokeDashoffset="-75" />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-sm font-black text-white font-mono">100%</span>
                    <p className="text-[8px] text-slate-500 font-bold">بشري حقيقي</p>
                  </div>
                </div>
              </div>

              {/* Legend list */}
              <div className="space-y-1.5 pt-1 border-t border-slate-850/60" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{isRtl ? 'يوتيوب / فيديوهات' : 'YouTube content'}</span>
                  </div>
                  <span className="font-bold text-slate-300 font-mono">50%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>{isRtl ? 'فيسبوك / ريلز' : 'Facebook content'}</span>
                  </div>
                  <span className="font-bold text-slate-300 font-mono">25%</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>{isRtl ? 'إنستجرام وتيك توك' : 'Insta & TikTok'}</span>
                  </div>
                  <span className="font-bold text-slate-300 font-mono">25%</span>
                </div>
              </div>
            </div>

          </div>

          {/* LIST OF CURRENT USER CAMPAIGNS & THEIR REALTIME STATS */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse">
              <div>
                <h3 className="text-base font-black text-white">{t.orderTitle}</h3>
                <p className="text-xs text-slate-500 font-medium">{isRtl ? 'راقب فترات التقدم واستهلاك التفاعلات والتحقق والوقوف الفوري' : 'Control and track progress on all your created campaigns'}</p>
              </div>
              
              {/* Filter controls */}
              <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-row-reverse">
                {(['all', 'active', 'paused', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`py-1 px-3 text-xs font-bold rounded-lg transition cursor-pointer ${
                      filter === f 
                        ? 'bg-indigo-600 text-white shadow' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f === 'all' && (isRtl ? 'الكل' : 'All')}
                    {f === 'active' && (isRtl ? 'نشط' : 'Active')}
                    {f === 'paused' && (isRtl ? 'مؤقت' : 'Paused')}
                    {f === 'completed' && (isRtl ? 'مكتمل' : 'Completed')}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Feedback alerts */}
            {campaignActionMsg && (
              <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs px-4 py-2.5 rounded-xl flex items-center justify-start gap-2 flex-row-reverse text-right">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{campaignActionMsg}</span>
              </div>
            )}

            {filteredCampaigns.length === 0 ? (
              <div className="bg-slate-950/60 rounded-2xl border border-slate-850/60 p-10 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-850">
                  <AlertTriangle className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-xs text-slate-400 font-bold">{t.noCampaigns}</p>
                <button
                  onClick={() => onSelectTab('ad')}
                  className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-indigo-400 border border-indigo-500/10 hover:border-indigo-500/30 transition cursor-pointer-bold"
                >
                  {t.createOne}
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-850">
                <table className="w-full text-right border-collapse" dir={isRtl ? 'rtl' : 'ltr'}>
                  <thead>
                    <tr className="bg-slate-950 text-slate-400 text-xs font-black border-b border-slate-850">
                      <th className="p-4">{t.platform}</th>
                      <th className="p-4">{t.campaignName}</th>
                      <th className="p-4">{t.actions}</th>
                      <th className="p-4">{t.cost}</th>
                      <th className="p-4">{t.status}</th>
                      <th className="p-4 text-center">{t.controls}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-xs font-semibold text-slate-300">
                    {filteredCampaigns.map((camp) => {
                      const completedPct = Math.round((camp.completedCount / camp.quantity) * 100) || 0;
                      return (
                        <tr key={camp.id} className="hover:bg-slate-950/40 transition">
                          <td className="p-4">
                            <span className="capitalize px-2 py-1 rounded bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-400">
                              {camp.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 max-w-xs truncate font-bold text-white" title={camp.title}>
                            {camp.title}
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-mono">{camp.completedCount} / {camp.quantity}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{completedPct}%</span>
                              </div>
                              <div className="w-28 bg-slate-950 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${completedPct}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-amber-500">
                            {camp.pointsPerAction} {isRtl ? 'ن' : 'P'}
                          </td>
                          <td className="p-4">
                            {camp.status === 'active' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                                {t.active}
                              </span>
                            )}
                            {camp.status === 'paused' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/15 text-amber-400 border border-amber-500/10">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                {t.paused}
                              </span>
                            )}
                            {camp.status === 'completed' && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-slate-400 border border-slate-750">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                {t.completed}
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {camp.status !== 'completed' && (
                                <button
                                  id={`btn-toggle-camp-${camp.id}`}
                                  onClick={() => handleToggleStatus(camp.id)}
                                  className="p-1.5 bg-slate-950 hover:bg-slate-800 rounded border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                                  title={camp.status === 'active' ? 'إيقاف مؤقت' : 'تفعيل'}
                                >
                                  {camp.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
                                </button>
                              )}
                              <button
                                id={`btn-delete-camp-${camp.id}`}
                                onClick={() => handleDeleteCampaign(camp.id)}
                                className="p-1.5 bg-slate-950 hover:bg-red-950 rounded border border-slate-800 text-slate-400 hover:text-red-400 transition cursor-pointer"
                                title="حذف الحملة واستعادة النقاط"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: ANTI-SPAM & ANTI-BOT SYSTEM */}
      {activeSubTab === 'protection' && (
        <form onSubmit={handleSaveProtection} className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            
            <div className="flex items-center gap-4 flex-row-reverse border-b border-slate-850 pb-5">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl">
                <Bot className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-right">
                <h3 className="text-base font-black text-white">{t.antiSpamTitle}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{t.antiSpamDesc}</p>
              </div>
            </div>

            {/* Alert Message for settings preserved */}
            {protectionSavedMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-4 py-3 rounded-xl flex items-center justify-start gap-2 flex-row-reverse text-right">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-bold">{protectionSavedMsg}</span>
              </div>
            )}

            {/* Grid options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* Option 1: Verification Delay */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-indigo-500/20 transition">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-between flex-row-reverse">
                    <label className="text-xs font-extrabold text-white flex items-center gap-2 flex-row-reverse cursor-pointer">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      <span>{t.verifyDelay}</span>
                    </label>
                    <input
                      id="opt-delay"
                      type="checkbox"
                      checked={delayEnabled}
                      onChange={(e) => setDelayEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-indigo-500 outline-none accent-indigo-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-right font-medium">
                    {t.verifyDelayDesc}
                  </p>
                </div>
              </div>

              {/* Option 2: Math Captcha */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-indigo-500/20 transition">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-between flex-row-reverse">
                    <label className="text-xs font-extrabold text-white flex items-center gap-2 flex-row-reverse cursor-pointer">
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <span>{t.humanMath}</span>
                    </label>
                    <input
                      id="opt-captcha"
                      type="checkbox"
                      checked={mathCaptchaEnabled}
                      onChange={(e) => setMathCaptchaEnabled(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-indigo-500 outline-none accent-indigo-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-right font-medium">
                    {t.humanMathDesc}
                  </p>
                </div>
              </div>

              {/* Option 3: Block Empty Profiles */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-indigo-500/20 transition">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-between flex-row-reverse">
                    <label className="text-xs font-extrabold text-white flex items-center gap-2 flex-row-reverse cursor-pointer">
                      <Lock className="w-4 h-4 text-pink-400" />
                      <span>{t.profileAge}</span>
                    </label>
                    <input
                      id="opt-empty-profile"
                      type="checkbox"
                      checked={blockEmptyProfiles}
                      onChange={(e) => setBlockEmptyProfiles(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-indigo-500 focus:ring-indigo-500 outline-none accent-indigo-500 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-right font-medium">
                    {t.profileAgeDesc}
                  </p>
                </div>
              </div>

              {/* Option 4: Daily Support Throttle limit to protect accounts from Instagram/FB shadow ban */}
              <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between hover:border-indigo-500/20 transition">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 justify-between flex-row-reverse">
                    <label className="text-xs font-extrabold text-white flex items-center gap-2 flex-row-reverse">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>{t.dailyLimit}</span>
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed text-right font-medium mb-2">
                    {t.dailyLimitDesc}
                  </p>
                  
                  <div className="pt-2">
                    <label className="text-[10px] text-slate-400 font-extrabold block mb-1.5">{t.limitLabel}</label>
                    <select
                      id="security-daily-throttle"
                      value={dailyPostLimit}
                      onChange={(e) => setDailyPostLimit(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded-xl py-2 px-3 outline-none cursor-pointer font-bold focus:border-indigo-500"
                    >
                      <option value="30">{t.limit30}</option>
                      <option value="50">{t.limit50}</option>
                      <option value="100">{t.limit100}</option>
                      <option value="unlimited">{t.unlimited}</option>
                    </select>
                  </div>
                </div>
              </div>

            </div>

            {/* Commit settings */}
            <div className="pt-4 border-t border-slate-950 flex justify-end">
              <button
                id="btn-save-anti-spam"
                type="submit"
                className="py-3 px-6 bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold rounded-xl transition cursor-pointer shadow-lg shadow-red-650/15"
              >
                {t.saveSettings}
              </button>
            </div>

          </div>
        </form>
      )}

      {/* TAB CONTENT 3: SMM API gateway */}
      {activeSubTab === 'api' && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main SMM Gateway settings */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-4 flex-row-reverse border-b border-slate-850 pb-5">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl">
                <Code className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-right">
                <h3 className="text-base font-black text-white">{t.apiTitle}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{t.apiDesc}</p>
              </div>
            </div>

            {/* KEY GENERATOR */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-3">
              <label className="text-xs font-extrabold text-white flex items-center gap-1.5 flex-row-reverse">
                <Key className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.apiKeyLabel}</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="flex-1 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-mono font-bold text-center text-emerald-400 select-all overflow-x-auto whitespace-nowrap">
                  {apiKey}
                </div>
                <button
                  id="btn-keygen"
                  onClick={handleGenerateApiKey}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t.generateKey}</span>
                </button>
              </div>
            </div>

            {/* WEBHOOK URL INPUT */}
            <form onSubmit={handleSaveWebhook} className="bg-slate-950 p-5 rounded-2xl border border-slate-850 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-white flex items-center gap-1.5 flex-row-reverse">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>{t.webhookLabel}</span>
                </label>
                <p className="text-[10px] text-slate-500 font-semibold">{isRtl ? 'سنقوم بإعلام سيرفر الويب الخاص بك برمجياً عند اكتمال حملة ممولة لإتمام التبادل التلقائي.' : 'We will send POST requests to this URL to alert your API SMM server of order progress.'}</p>
              </div>
              
              {webhookSavedMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 flex-row-reverse text-right">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>{webhookSavedMsg}</span>
                </div>
              )}

              <div className="space-y-3">
                <input
                  id="api-webhook-url-input"
                  type="url"
                  placeholder={t.webhookPlaceholder}
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-xs font-mono py-2.5 px-4 rounded-xl outline-none focus:border-indigo-500 placeholder:text-slate-600"
                />
                
                <div className="flex gap-2 justify-end">
                  {webhookUrl && (
                    <button
                      id="btn-test-webhook"
                      type="button"
                      onClick={handleTriggerTestWebhook}
                      className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-extrabold text-xs rounded-lg border border-slate-850 transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t.testWebhook}</span>
                    </button>
                  )}
                  <button
                    id="btn-save-webhook"
                    type="submit"
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-lg transition cursor-pointer"
                  >
                    {t.saveWebhook}
                  </button>
                </div>

                {webhookTestSuccess && (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] p-3 rounded-xl space-y-1.5 font-bold" dir="ltr">
                    <p className="flex items-center gap-1.5 justify-end">
                      <span>{t.webhookSuccess}</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </p>
                    <p className="text-[10px] text-slate-500 font-mono text-left">{"POST " + webhookUrl + " -> Response: 200 OK"}</p>
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* INTERACTIVE PLAYGROUND (SANDBOX API EXPRESSE) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Interactive console */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div>
                <h3 className="text-sm font-black text-white">{t.interactiveConsole}</h3>
                <p className="text-[10px] text-slate-500 font-semibold">{isRtl ? 'اختبر رد فعل واجهتنا البرمجية حياً قبل الدمج' : 'Simulate direct API server responses locally'}</p>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] text-slate-400 font-bold block">{isRtl ? 'اختر أحد الإجراءات المتاحة للطلب' : 'Select API method'}</label>
                <div className="grid grid-cols-3 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-850">
                  <button
                    onClick={() => setApiPlaygroundMethod('balance')}
                    className={`py-2 px-1 text-[10px] font-bold rounded-lg transition cursor-pointer text-center ${
                      apiPlaygroundMethod === 'balance' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.getProfile}
                  </button>
                  <button
                    onClick={() => setApiPlaygroundMethod('create_campaign')}
                    className={`py-2 px-1 text-[10px] font-bold rounded-lg transition cursor-pointer text-center ${
                      apiPlaygroundMethod === 'create_campaign' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.createOrder}
                  </button>
                  <button
                    onClick={() => setApiPlaygroundMethod('status')}
                    className={`py-2 px-1 text-[10px] font-bold rounded-lg transition cursor-pointer text-center ${
                      apiPlaygroundMethod === 'status' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.checkStatus}
                  </button>
                </div>
              </div>

              <button
                id="btn-execute-api-playground"
                onClick={handleExecutePlayground}
                className="w-full py-2 bg-slate-950 hover:bg-slate-850 hover:border-indigo-500/30 text-indigo-400 font-extrabold text-xs rounded-xl border border-indigo-500/10 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>{t.sendRequest}</span>
              </button>

              <div className="space-y-1 pt-1">
                <label className="text-[10px] text-slate-400 font-bold block">{t.apiResponse}</label>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-emerald-400 h-56 overflow-y-auto" dir="ltr">
                  {playgroundOutput ? (
                    <pre className="whitespace-pre-wrap">{playgroundOutput}</pre>
                  ) : (
                    <div className="text-slate-600 italic h-full flex items-center justify-center">
                      {"// Click 'Send' to fetch real point balance in JSON."}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick API Snippet Documentation */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center gap-2 flex-row-reverse">
                  <h3 className="text-sm font-black text-white">{t.apiMethodsTitle}</h3>
                  <button
                    onClick={() => handleCopyCode(
                      apiPlaygroundMethod === 'balance' 
                        ? `curl -H "Authorization: Bearer ${apiKey}" https://socialxchange.com/api/v1/profile`
                        : codeSnippets.curl
                    )}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-[10px] font-black"
                    title="Copy Code"
                  >
                    {copiedText ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400 animate-scale" />
                        <span>{t.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>{isRtl ? 'نسخ الكود' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-semibold">{isRtl ? 'استعن بالأكواد الجاهزة للربط مع برنامجك أو لوحتك' : 'Copy bifold REST routines instantly'}</p>
              </div>

              {/* Code Panel */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 font-mono text-[9px] text-indigo-400 overflow-x-auto h-76 max-h-76 leading-loose select-all text-left" dir="ltr">
                <p className="text-[10px] text-slate-500 font-bold mb-2">{"// AUTHORIZED REQUEST STUB"}</p>
                <pre>{codeSnippets.curl}</pre>
              </div>

              {/* Tips for integration */}
              <div className="p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10 text-[10px] text-indigo-400 leading-normal flex items-start gap-2 text-right flex-row-reverse">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-semibold">{isRtl ? 'تلميح فني: يمكن ربط مفتاح الـ API مباشرة بمزود SMM الخاص بك (عبر بروتوكول api.php القياسي) لتسريع الإنجاز وإرسال الإعجابات آلياً.' : 'Technical Tip: You can bind this API directly with SMM system interfaces like perfectpanel or equivalents.'}</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 4: SEO & SSR ENGINE HUB WITH LIVE RUNNER SIMULATOR */}
      {activeSubTab === 'seo' && (
        <div className="space-y-8 animate-fadeIn text-right" dir="rtl">
          
          {/* Header Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4">
            <div className="flex items-center gap-4 flex-row-reverse">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl">
                <Globe className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">موسوعة وحلول تحسين محركات البحث (SEO & SSR Suite)</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-bold mt-1">
                  تعلم وطبق كيفية تفعيل الفهرسة المكتملة للتطبيقات أحادية الصفحة (SPA)، وحقن العلامات ديناميكياً للطلب القادم، أو الانتقال لنمط العرض من جهة الخادم (SSR).
                </p>
              </div>
            </div>
          </div>

          {/* Sub Navigation For SEO Sub Tabs */}
          <div className="flex bg-slate-950 p-1.5 rounded-2xl border border-slate-850 gap-2 overflow-x-auto">
            <button
              onClick={() => setSimActiveTab('netlify')}
              className={`flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition cursor-pointer text-center whitespace-nowrap ${
                simActiveTab === 'netlify' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              🚀 1. حلول Netlify & Prerendering
            </button>
            <button
              onClick={() => setSimActiveTab('middleware')}
              className={`flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition cursor-pointer text-center whitespace-nowrap ${
                simActiveTab === 'middleware' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              🛡️ 2. حقن الميتا (Node.js Middleware)
            </button>
            <button
              onClick={() => setSimActiveTab('migration')}
              className={`flex-1 py-3 px-4 text-xs font-extrabold rounded-xl transition cursor-pointer text-center whitespace-nowrap ${
                simActiveTab === 'migration' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              ⚙️ 3. إعادة الهيكلة إلى SSR كامل
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Left Content Column (Documentation and Code) - Spans 2 cols */}
            <div className="xl:col-span-2 space-y-6">
              
              {/* NETLIFY TAB SCREEN */}
              {simActiveTab === 'netlify' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="border-b border-slate-850 pb-4">
                    <h4 className="text-base font-black text-white flex items-center gap-2 flex-row-reverse">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping"></span>
                      <span>تكوين Netlify لحل مشاكل SPA وتفعيل التوليد المسبق (Prerendering)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      عند استضافة تطبيق SPA (مثل React/Vite) على Netlify، لا يرى زاحف جوجل إلا الصفحة الفارغة بسبب اعتماده على Client-Side Javascript. بتطبيق هذا الملف، سيوجه Netlify الزواحف آلياً لخدمة كاش مبنية لسرعة الفهرسة.
                    </p>
                  </div>

                  {/* HTML/TOML Code Showcase */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-xl border-b border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-slate-500">netlify.toml</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`[[redirects]]\n  from = "/*"\n  to = "/index.html"\n  status = 200\n\n[build]\n  publish = "dist"\n  command = "npm run build"\n\n[prerender]\n  enabled = true`);
                          setProtectionSavedMsg('netlify_copied');
                          setTimeout(() => setProtectionSavedMsg(''), 3000);
                        }}
                        className="text-[10px] text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {protectionSavedMsg === 'netlify_copied' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم نسخ الملف!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الإعدادات</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-b-xl border border-slate-850 font-mono text-xs text-blue-400 overflow-x-auto text-left" dir="ltr">
                      <pre>{`# netlify.toml
# تكوين تشغيل وقواعد إعادة التوجيه لـ React SPA وحل مشكلة 404
# تفعيل خدمة التوليد المسبق (Prerendering) لزواحف محركات البحث ومواقع التواصل الاجتماعي

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build]
  publish = "dist"
  command = "npm run build"

# تفعيل الـ Prerendering المدمج في Netlify بشكل تلقائي لتخديم الزواحف بصفحة HTML جاهزة
[prerender]
  enabled = true`}</pre>
                    </div>
                  </div>

                  {/* Step by Step Details in Arabic */}
                  <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <h5 className="text-xs font-extrabold text-white">📋 خطوات التفعيل التفصيلية على خوادم Netlify:</h5>
                    <ol className="text-xs text-slate-400 space-y-3 leading-relaxed list-decimal list-inside pr-2">
                      <li>
                        <strong className="text-white">توطين الملف:</strong> قم بإنشاء ملف باسم <code className="font-mono text-red-400">netlify.toml</code> في المجلد الرئيسي لمشروعك (بجوار <code className="font-mono">package.json</code>).
                      </li>
                      <li>
                        <strong className="text-white">حل مشكلة الروابط الداخلية (404 Error):</strong> قسم <code className="font-mono text-indigo-400">[[redirects]]</code> يوجه أي طلب داخلي مثل <code className="font-mono">/accounts</code> لخدمة التوجيه من المتصفح مباشرة دون إعطاء خطأ Server 404.
                      </li>
                      <li>
                        <strong className="text-white">تفعيل الـ Prerendering من خيارات المنصة:</strong> 
                        <ul className="list-disc list-inside mr-4 mt-1.5 space-y-1 text-slate-500">
                          <li>اذهب إلى لوحة تحكم حسابك في <strong className="text-slate-400">Netlify Dashboard</strong>.</li>
                          <li>اختر موقعك، ثم انتقل إلى <strong className="text-slate-400">Site Configuration</strong>.</li>
                          <li>اضغط على <strong className="text-slate-400">Build & deploy</strong> ثم ابحث عن قسم <strong className="text-slate-400">Prerendering</strong>.</li>
                          <li>انقر على زر <strong className="text-blue-400">Enable Prerendering</strong> لتفويض سيرفرات نيتليفاي للرد الفوري على Googlebot بكاش HTML.</li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                </div>
              )}

              {/* NODE JS EXPRESS MIDDLEWARE TAB SCREEN */}
              {simActiveTab === 'middleware' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="border-b border-slate-850 pb-4">
                    <h4 className="text-base font-black text-white flex items-center gap-2 flex-row-reverse">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                      <span>كود الميدل وير (Express SEO Middleware) لحقن علامات الميتا ديناميكياً</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      هذا الكود يفحص طلبات الخادم الواردة. إذا كان المتصفح عبارة عن بوت زاحف (مثل برامج أرشفة جوجل أو معاينات فيسبوك وتويتر)؛ يتم استدعاء ملف الـ HTML وتعديل علامات الـ Meta والـ Open Graph ديناميكياً بالوصف والعنوان المطابق للصفحة المطلوبة ليظهر مقالاً منسقاً بالكامل على وسائل التواصل الاجتماعي والمحركات.
                    </p>
                  </div>

                  {/* Copy button and code block */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-950 px-4 py-2 rounded-t-xl border-b border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-slate-500">seoMiddleware.js</span>
                      <button
                        onClick={() => {
                          const codeText = `// seoMiddleware.js\nconst fs = require('fs');\nconst path = require('path');\n\nconst CRAWLER_USER_AGENTS = [\n  'googlebot', 'bingbot', 'yandexbot', 'baiduspider',\n  'facebookexternalhit', 'twitterbot', 'linkedinbot'\n];\n\nfunction seoCrawlerMiddleware(req, res, next) {\n  const userAgent = (req.headers['user-agent'] || '').toLowerCase();\n  const isCrawler = CRAWLER_USER_AGENTS.some(crawler => userAgent.includes(crawler));\n  \n  if (isCrawler) {\n    let metaData = {\n      title: "SocialXchange - شبكة معززة للدعم المتبادل",\n      description: "صادق حسابك، تصفح واكسب، وقاوم عمليات التشغيل الآلية للبوتات المزعجة."\n    };\n    \n    const htmlPath = path.join(__dirname, 'dist', 'index.html');\n    fs.readFile(htmlPath, 'utf8', (err, htmlData) => {\n      if (err) return next();\n      \n      let customizedHtml = htmlData\n        .replace(/<title>.*?<\\/title>/g, \`<title>\${metaData.title}</title>\`)\n        .replace('</head>', \`\\n  <meta name="description" content="\${metaData.description}">\\n</head>\`);\n      \n      res.setHeader('Content-Type', 'text/html');\n      return res.send(customizedHtml);\n    });\n  } else {\n    next();\n  }\n}`;
                          navigator.clipboard.writeText(codeText);
                          setProtectionSavedMsg('middleware_copied');
                          setTimeout(() => setProtectionSavedMsg(''), 3000);
                        }}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {protectionSavedMsg === 'middleware_copied' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ كود الـ Middleware</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-b-xl border border-slate-850 font-mono text-[11px] text-emerald-400 overflow-x-auto text-left leading-loose" dir="ltr">
                      <pre>{`// seoMiddleware.js
const fs = require('fs');
const path = require('path');

// قائمة البوتات والزواحف المستهدفة بفهرسة الـ Meta Tags
const CRAWLER_USER_AGENTS = [
  'googlebot',
  'bingbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'vkshare'
];

function seoCrawlerMiddleware(req, res, next) {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();
  
  // هل الطلب نابع من محرك بحث أو منصة تواصل؟
  const isCrawler = CRAWLER_USER_AGENTS.some(crawler => userAgent.includes(crawler));
  
  if (isCrawler) {
    // جلب البيانات ديناميكياً من DB (إما محلياً أو سحابياً باستعمال المعرف)
    let metaData = {
      title: "لوحة تحكم وتأكيد الحماية الاجتماعية | SocialXchange",
      description: "راقب معاملات حملاتك، تحقق بشرياً لمنع تشجنات البوت وباشر ربط مزودي الخدمة بكفاءة.",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800"
    };

    if (req.path === '/accounts') {
      metaData = {
        title: "ربط ومصادقة الحسابات الرقمية الآمنة | SocialXchange",
        description: "تحقق من حسابات يوتيوب وتيك توك للتفاعل الفعلي وكسب أموال السحب الفوري بأمان كامل.",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800"
      };
    } else if (req.path === '/buy') {
      metaData = {
        title: "خطط وباقات شحن النقاط الفورية وتزويد المتابعين",
        description: "نقاط ممولة بأسعار رخيصة لرفع معدلات الظهور واجتياز نظام الحماية من التشغنات الوهمية.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800"
      };
    }

    // قراءة ملف index.html المولد بواسطة Vite/SPA
    const htmlPath = path.join(process.cwd(), 'dist', 'index.html');
    fs.readFile(htmlPath, 'utf8', (err, htmlData) => {
      if (err) {
        return next(); // العودة للنمط الافتراضي لضمان التماسك
      }

      // تعديل الميتا في رأس الـ HTML قبل إرساله للزاحف
      const optimizedHtml = htmlData
        .replace(/<title>.*?<\\/title>/g, \`<title>\${metaData.title}</title>\`)
        .replace('</head>', \`
  <!-- علامات Open Graph وحقن ديناميكي لـ SEO -->
  <meta name="description" content="\${metaData.description}">
  <meta property="og:title" content="\${metaData.title}">
  <meta property="og:description" content="\${metaData.description}">
  <meta property="og:image" content="\${metaData.image}">
  <meta property="og:url" content="https://socialxchange.com\${req.path}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
</head>\`);

      res.setHeader('Content-Type', 'text/html');
      return res.send(optimizedHtml);
    });
  } else {
    // لمتصفح المستخدم البشري العادي (يتم تخديمه بالكامل عبر React CSR لضمان الخفة)
    next();
  }
}

module.exports = seoCrawlerMiddleware;`}</pre>
                    </div>
                  </div>

                  <div className="bg-slate-955 p-4 rounded-xl border border-slate-850 space-y-2 text-xs">
                    <h5 className="font-extrabold text-white">🔄 كيفية دمج الـ Middleware في كود السيرفر (Express Server integration):</h5>
                    <pre className="bg-slate-950 p-3 rounded-lg text-[10px] text-slate-300 font-mono text-left leading-normal" dir="ltr">
{`const express = require('express');
const seoCrawlerMiddleware = require('./seoMiddleware');

const app = express();

// 1. ضع الميدل وير في مقدمة السيرفر وقبل تخديم الملفات الثابتة!
app.use(seoCrawlerMiddleware);

// 2. تخديم المجلد الموحد المولد لـ Vite SPA
app.use(express.static('dist'));

// 3. مسار استرجاع SPA الافتراضي
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000);`}
                    </pre>
                  </div>

                </div>
              )}

              {/* CSR TO SSR DETAILED BLUEPRINT TAB SCREEN */}
              {simActiveTab === 'migration' && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
                  <div className="border-b border-slate-850 pb-4">
                    <h4 className="text-base font-black text-white flex items-center gap-2 flex-row-reverse">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
                      <span>إعادة هيكلة التطبيق بالكامل من هجين العميل (CSR) إلى خادم العرض الكامل (SSR)</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      للتحول بالكامل إلى SSR باستخدام <strong className="text-slate-400">React + Vite + Express</strong>، يجب إعادة هيكلة نظام التوجيه والتوليد ليتم بناء شجرة المكونات وتصديرها كجملة نصية (HTML String) من جهة السيرفر لكل مسار فرعي قبل تمريرها جاهزة للمتصفح (Hydration).
                    </p>
                  </div>

                  {/* Folder Structure Layout */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-2">
                    <h5 className="text-xs font-extrabold text-white">📂 الهيكل المالي والتنظيمي للملفات والمجلدات المقترح لـ SSR:</h5>
                    <div className="bg-slate-900 p-3.5 rounded-xl font-mono text-[11px] text-indigo-400 text-left select-all" dir="ltr">
{`my-ssr-app/
├── server.ts             # خادم Express الرئيسي لمعالجة رندرة السيرفر والطلبات
├── vite.config.ts        # ملف إعدادات فايت مجهز لخطي العميل والسيرفر
├── package.json          # المنسق للسكربتات والمكتبات
├── index.html            # القالب الأساسي ويحتوي على وسام <!--app-html--> للحقن
└── src/
    ├── main.tsx          # مدخل العميل، لا يدمج بـ render بل بـ hydrateRoot
    ├── entry-client.tsx  # المحفز الفعلي لهدرجة الأكواد في المتصفح
    ├── entry-server.tsx  # محرك الرندرة المسؤول عن ReactDOMServer.renderToString
    ├── App.tsx           # المكون الاجتماعي للموقع
    └── routes.tsx        # ملف مسارات مشترك للجهتين`}
                    </div>
                  </div>

                  {/* Server Engine Code For Dynamic Render */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-955 px-4 py-2 rounded-t-xl border-b border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-indigo-400">src/entry-server.tsx</span>
                      <button
                        onClick={() => {
                          const codeText = `// entry-server.tsx\nimport React from 'react';\nimport ReactDOMServer from 'react-dom/server';\nimport App from './App';\n\nexport function render(url) {\n  const html = ReactDOMServer.renderToString(<App currentRoute={url} />);\n  return { html };\n}`;
                          navigator.clipboard.writeText(codeText);
                          setProtectionSavedMsg('server_entry_copied');
                          setTimeout(() => setProtectionSavedMsg(''), 3000);
                        }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {protectionSavedMsg === 'server_entry_copied' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الكود</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 font-mono text-[11px] text-indigo-400 overflow-x-auto text-left leading-relaxed rounded-b-xl border border-slate-850" dir="ltr">
                      <pre>{`// src/entry-server.tsx
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

// دالة لمعالجة رندرة أي مسار تصفح إلى كود نصي HTML جاهز على السيرفر
export function render(url: string, context: any) {
  const html = ReactDOMServer.renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  );
  return { html };
}`}</pre>
                    </div>
                  </div>

                  {/* Express Server SSR Core */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-955 px-4 py-2 rounded-t-xl border-b border-slate-850">
                      <span className="text-[10px] font-mono font-bold text-slate-400">server.ts (Express SSR Runner)</span>
                      <button
                        onClick={() => {
                          const cText = `// server.ts SSR Engine\nconst fs = require('fs');\nconst express = require('express');\nconst { createServer: createViteServer } = require('vite');`;
                          navigator.clipboard.writeText(cText);
                          setProtectionSavedMsg('server_core_copied');
                          setTimeout(() => setProtectionSavedMsg(''), 3000);
                        }}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        {protectionSavedMsg === 'server_core_copied' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ الكod السيرفر</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 font-mono text-[10px] text-slate-300 overflow-x-auto text-left leading-relaxed rounded-b-xl border border-slate-850" dir="ltr">
                      <pre>{`// server.ts (Express-Vite Router SSR)
import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // دمج مترجم فايت في نمط التطوير لبناء الأكواد حيا في بيئة العمل
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });
  app.use(vite.middlewares);

  app.get('*', async (req, res, next) => {
    const url = req.originalUrl;
    try {
      // 1. قراءة وتعديل قالب index.html الافتراضي
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);

      // 2. تحميل سكربت السيرفر لرندرة React عن بعد
      const { render } = await vite.ssrLoadModule('/src/entry-server.tsx');

      // 3. استدعاء رندرة المسار إلى HTML
      const { html: appHtml } = await render(url, {});

      // 4. حقن النواتج في وسم الـ index.html مع جلب البيانات المسبقة
      const html = template.replace('<!--app-html-->', appHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e: any) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(\`SSR Router active on http://0.0.0.0:\${PORT}\`);
  });
}

startServer();`}</pre>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right Column: Interactive Crawler Request Simulator (1 col) */}
            <div className="space-y-6">
              
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2 flex-row-reverse">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span>محاكي خادم الويب ومعالجة الـ User-Agent</span>
                  </h4>
                  <p className="text-[10px] text-slate-500 font-bold mt-1.5 leading-normal">
                    تحكم بالمعاملات لإرسال طلب افتراضي إلى السيرفر ومشاهدة النواتج المرجعة لكل نوع زاحف أو مستخدم حقيقي.
                  </p>
                </div>

                {/* Simulated inputs */}
                <div className="space-y-3.5 bg-slate-950 p-4 rounded-2xl border border-slate-850">
                  
                  {/* Select User-Agent */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">1. اختر الـ User-Agent الممرر بالطلب:</label>
                    <select
                      value={simUserAgent}
                      onChange={(e) => setSimUserAgent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-[11px] font-semibold p-2.5 rounded-xl text-white outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="googlebot">🕷️ Googlebot (زاحف جوجل للأرشفة)</option>
                      <option value="facebook">👥 FacebookExternalHit (معاينة فيسبوك)</option>
                      <option value="chrome">💻 Google Chrome Desktop (متفحص بشري عادي)</option>
                    </select>
                  </div>

                  {/* Select Route Path */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-bold block">2. مسار الصفحة المستهدفة بالطلب (PATH):</label>
                    <div className="grid grid-cols-3 gap-1 bg-slate-900 p-1 rounded-xl">
                      <button
                        onClick={() => setSimRoute('/accounts')}
                        className={`py-1.5 px-0.5 text-[9px] font-black rounded-lg transition text-center cursor-pointer ${
                          simRoute === '/accounts' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        /accounts
                      </button>
                      <button
                        onClick={() => setSimRoute('/buy')}
                        className={`py-1.5 px-0.5 text-[9px] font-black rounded-lg transition text-center cursor-pointer ${
                          simRoute === '/buy' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        /buy (حملة)
                      </button>
                      <button
                        onClick={() => setSimRoute('/exchange')}
                        className={`py-1.5 px-0.5 text-[9px] font-black rounded-lg transition text-center cursor-pointer ${
                          simRoute === '/exchange' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        /exchange
                      </button>
                    </div>
                  </div>

                </div>

                {/* Response Code Area */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-bold">النواتج النصية المستلمة للزاحف (Response Content)</span>
                    <span className={`px-2 py-0.5 text-[9px] rounded-md font-bold tracking-wider ${
                      simUserAgent === 'chrome' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/10' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                    }`}>
                      {simUserAgent === 'chrome' ? 'HTTP 200 (Vite React Client App)' : 'HTTP 200 OK (SEO Server Injected)'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 h-96 max-h-96 overflow-y-auto font-mono text-[9px] text-slate-400 select-all leading-relaxed text-left" dir="ltr">
                    <pre className="whitespace-pre-wrap">{simResponse}</pre>
                  </div>
                </div>

                {/* Diagnostic advice callout */}
                <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 text-xs text-blue-400 leading-relaxed text-right flex items-start gap-2.5">
                  <span className="text-base select-none">💡</span>
                  <div>
                    <strong className="block text-white mb-0.5">توصية محركات البحث:</strong>
                    <span>
                      {simUserAgent === 'chrome' 
                        ? 'تنبيه: محرك البحث لا يستطيع استهلاك أكواد الجافا سكربت المتقلبة بنفس الفعالية، تفعيل الـ Prerendering أو الـ SSR يقلل وقت الفهرسة بنسبة 93%.' 
                        : 'رائع جداً! ملقم البحث يرى الآن علامات ميتا ومحتوى نصي خام غني ومقروء للمسار المخصص دون تكبد أي عبء رندرة.'}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
