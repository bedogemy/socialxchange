import React, { useState } from 'react';
import { db } from '../lib/db';
import { User, CampaignType, Campaign } from '../types';
import { 
  Play, 
  ThumbsUp, 
  UserPlus, 
  Link as LinkIcon, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2, 
  Pause, 
  Trash2, 
  PlusCircle, 
  Coins, 
  ExternalLink,
  Send,
  Pin
} from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

interface CreateCampaignProps {
  user: User;
  onCampaignCreated: () => void;
  lang?: string;
}

// Function to extract YouTube Video/Channel ID
export function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const campaignTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    balance: 'رصيدك: {points} نقطة',
    launchNew: 'إطلاق خطة إعلانية جديدة',
    typeLabel: 'نوع التفاعل المطلوب لحملتك',
    youtubeViews: 'مشاهدات يوتيوب',
    youtubeLikes: 'لايكات يوتيوب',
    youtubeSubs: 'اشتراك يوتيوب',
    fbFollows: 'فولو فيسبوك',
    fbLikes: 'لايك فيسبوك',
    igFollows: 'فولو انستجرام',
    igLikes: 'لايك انستجرام',
    tiktokFollows: 'متابعة تيك توك',
    tiktokLikes: 'لايك تيك توك',
    tgJoin: 'اشتراك تليجرام',
    durationLabel: 'مدة تصفح الإعلان المطلوبة للفيديو (بالثواني)',
    secUnit: 'ث',
    ptsUnit: 'ن',
    titleLabel: 'عنوان الإعلان',
    targetQty: 'الكمية المستهدفة (الأدنى 25)',
    rewardLabel: 'مكافأة الزائر الواحد',
    viewReward: 'مكافأة المشاهدة',
    subReward: 'مكافأة الاشتراك',
    likeReward: 'مكافأة اللايك',
    followReward: 'مكافأة المتابعة',
    actionReward: 'مكافأة التفاعل',
    ptsSuffix: 'نقطة',
    estTotal: 'الحساب الكلي التقديري:',
    planSummary: 'الباقة: {quantity} إجراء × {points} ن',
    decPoints: 'النقود المستقطعة:',
    confirmLaunch: 'تأكيد وإطلاق الخطة الإعلانية',
    loadingLaunch: 'جاري التحقق وإطلاق المبادرة...',
    activeAndCompleted: 'مراقبة حملاتك الإعلانية النشطة والمكتملة ({count})',
    noCampaigns: 'ليس لديك حملات معلنة حالياً',
    noCampaignsDesc: 'عندما تقوم بإدخال رابط يوتيوب والكمية وتأكيد الإطلاق سيبدأ تقدمها بالظهور هنا في الوقت الحقيقي.',
    statusActive: 'نشطة حالياً',
    statusPaused: 'متوقفة مؤقتاً',
    statusCompleted: 'مكتملة بالكامل',
    deleteTitle: 'حذف واسترداد النقاط غير المستعملة',
    openTarget: 'فتح الرابط المستهدف 🔗',
    videoLink: 'رابط الفيديو:',
    extraData: 'البيانات الإضافية المطلوبة للحملة:',
    currentProgress: 'تحقيق التفاعل الحالي: {progress}%',
    refillTitle: 'تزويد الحملة وإضافة تفاعلات جديدة:',
    actionCost: 'تكلفة التفاعل الواحد: {points} ن',
    refillBtn: 'تزويد بـ {quantity} تفاعل (بتكلفة {cost} ن)',
    tipTitle: '💡 فكرة شحن الحملات الإعلانية:',
    tipDesc: 'عند شحن حملة مكتملة، يتم فوراً إضافة المقدار المطلوب وتحويل حالتها مجدداً إلى نشطة لتظهر لكافة الأعضاء في لوحة المشاهدة أو التفاعلات.',
    confirmDelete: 'هل أنت متأكد من رغبتك في حذف هذه الحملة؟ سيتم إرجاع كافة النقاط المتبقية والخاصة بالإجراءات غير المنجزة إلى رصيد حسابك فوراً.',
    errEmptyTitle: 'يرجى إدخال عنوان الإعلان أو اسم القناة الموضح',
    errEmptyUrl: 'يرجى إدخال الرابط المطلوبة',
    errInvalidYt: 'صيغة رابط يوتيوب غير صالحة. يرجى إدخال رابط حقيقي للفيديو مثل: https://www.youtube.com/watch?v=...',
    errInvalidFb: 'يرجى إدخال رابط فيسبوك صحيح يحتوي على facebook.com',
    errInvalidIg: 'يرجى إدخال رابط انستجرام صحيح يحتوي على instagram.com',
    errInvalidTt: 'يرجى إدخال رابط تيك توك صحيح يحتوي على tiktok.com',
    errInvalidTg: 'يرجى إدخال رابط تليجرام صحيح يحتوي على t.me',
    errMinQty: 'أقل باقة متاحة للإطلاق هي 25 تفاعل',
    errNoPoints: 'نقاطك غير كافية لإنشاء هذه الحملة. الخطة تكلف {cost} نقطة، رصيدك الحالي هو {points} نقطة.',
    successLaunch: 'تم إنشاء حملتك الإعلانية بنجاح وبدأت في تجميع التفاعل الآن!',
    errRefillMin: 'يرجى تحديد كمية شحن صالحة لا تقل عن 1 إجراء',
    errRefillNoPoints: 'نقاطك غير كافية للشحن. باقة {quantity} إجراء تكلف {cost} نقطة، ورصيدك المتاح هو {points} نقطة.',
    successRefill: 'تم شحن وتفعيل الحملة بنجاح وزيادتها بـ {quantity} إجراء تفاعلي!',
    customUrlLabel: 'رابط الحساب أو المنشور على تطبيق {name}',
    fbUrlLabel: 'رابط المنشور أو الصفحة على فيسبوك',
    igUrlLabel: 'رابط الحساب الشخصي أو المنشور على انستجرام',
    ttUrlLabel: 'رابط الحساب الشخصي أو المنشور على تيك توك',
    tgUrlLabel: 'رابط القناة أو المجموعة على تليجرام',
    ytUrlLabel: 'رابط الفيديو أو القناة من يوتيوب',
    fbTitlePlaceholder: 'مثال: صفحة التقنية للتسويق',
    igTitlePlaceholder: 'مثال: حساب الأزياء والموضة',
    ttTitlePlaceholder: 'مثال: حساب تيك توك لبيع الهدايا',
    tgTitlePlaceholder: 'مثال: قناة العروض والتخفيضات تليجرام',
    ytTitlePlaceholder: 'مثال: كيف تصنع تطبيقات خرافية بالذكاء الاصطناعي'
  },
  en: {
    balance: 'Your Balance: {points} P',
    launchNew: 'Launch a New Campaign',
    typeLabel: 'Required Campaign Action',
    youtubeViews: 'YouTube Views',
    youtubeLikes: 'YouTube Likes',
    youtubeSubs: 'YouTube Subs',
    fbFollows: 'Facebook Follows',
    fbLikes: 'Facebook Likes',
    igFollows: 'Instagram Follows',
    igLikes: 'Instagram Likes',
    tiktokFollows: 'TikTok Follows',
    tiktokLikes: 'TikTok Likes',
    tgJoin: 'Telegram Subs',
    durationLabel: 'Required View Duration (Seconds)',
    secUnit: 's',
    ptsUnit: 'P',
    titleLabel: 'Campaign Title',
    targetQty: 'Target Quantity (Min 25)',
    rewardLabel: 'Reward Per Visitor',
    viewReward: 'View Reward',
    subReward: 'Subscription Reward',
    likeReward: 'Like Reward',
    followReward: 'Follow Reward',
    actionReward: 'Interaction Reward',
    ptsSuffix: 'Points',
    estTotal: 'Estimated Total Cost:',
    planSummary: 'Plan: {quantity} actions × {points} P',
    decPoints: 'Deducted Points:',
    confirmLaunch: 'Confirm & Launch Campaign',
    loadingLaunch: 'Verifying & launching campaign...',
    activeAndCompleted: 'Monitor Active & Completed Campaigns ({count})',
    noCampaigns: 'No active campaigns currently',
    noCampaignsDesc: 'Enter a valid URL and target quantity to launch your campaign. You will see real-time progress right here.',
    statusActive: 'Currently Active',
    statusPaused: 'Paused',
    statusCompleted: 'Completed',
    deleteTitle: 'Delete & refund uncompleted actions',
    openTarget: 'Open Target Link 🔗',
    videoLink: 'Video URL ID:',
    extraData: 'Additional Campaign Properties:',
    currentProgress: 'Engagement Progress: {progress}%',
    refillTitle: 'Refill Campaign & Add Actions:',
    actionCost: 'Cost per action: {points} P',
    refillBtn: 'Add {quantity} actions (costs {cost} P)',
    tipTitle: '💡 Tip on Campaign Refills:',
    tipDesc: 'When you refill a completed campaign, the added quantity is top-up instantly and its status changes to Active to show on active dashboards.',
    confirmDelete: 'Are you sure you want to delete this campaign? All remaining uncompleted action points will be immediately refunded to your balance.',
    errEmptyTitle: 'Please enter a campaign title or channel name',
    errEmptyUrl: 'Please enter the target campaign URL link',
    errInvalidYt: 'Invalid YouTube URL. Please provide a standard URL like: https://www.youtube.com/watch?v=...',
    errInvalidFb: 'Invalid Facebook URL. Must contain facebook.com',
    errInvalidIg: 'Invalid Instagram URL. Must contain instagram.com',
    errInvalidTt: 'Invalid TikTok URL. Must contain tiktok.com',
    errInvalidTg: 'Invalid Telegram URL. Must contain t.me',
    errMinQty: 'Minimum campaign size is 25 interactions',
    errNoPoints: 'Insufficient points. This campaign requires {cost} points, but you only have {points}.',
    successLaunch: 'Campaign created successfully! Users can now interact to support you.',
    errRefillMin: 'Please enter a valid refill amount (at least 1 action)',
    errRefillNoPoints: 'Insufficient points. Refilling {quantity} actions costs {cost} points, your current balance is {points}.',
    successRefill: 'Campaign successfully refilled and increased by {quantity} actions!',
    customUrlLabel: 'Profile or post link on {name}',
    fbUrlLabel: 'Facebook post or page URL',
    igUrlLabel: 'Instagram profile or post URL',
    ttUrlLabel: 'TikTok account or post URL',
    tgUrlLabel: 'Telegram channel or group URL',
    ytUrlLabel: 'YouTube video or channel URL',
    fbTitlePlaceholder: 'e.g., Marketing Tech Page',
    igTitlePlaceholder: 'e.g., Fashion & Modeling Account',
    ttTitlePlaceholder: 'e.g., TikTok Gift Store Channel',
    tgTitlePlaceholder: 'e.g., Telegram Sales & Offers Group',
    ytTitlePlaceholder: 'e.g., How to build awesome AI apps'
  },
  fr: {
    balance: 'Votre Solde: {points} Pts',
    launchNew: 'Lancer une nouvelle campagne',
    typeLabel: 'Action de campagne requise',
    youtubeViews: 'Vues YouTube',
    youtubeLikes: 'Likes YouTube',
    youtubeSubs: 'Abonnés YouTube',
    fbFollows: 'Abonnés Facebook',
    fbLikes: 'Likes Facebook',
    igFollows: 'Abonnés Instagram',
    igLikes: 'Likes Instagram',
    tiktokFollows: 'Abonnés TikTok',
    tiktokLikes: 'Likes TikTok',
    tgJoin: 'Abonnés Telegram',
    durationLabel: 'Durée de visionnage requise (secondes)',
    secUnit: 's',
    ptsUnit: 'Pts',
    titleLabel: 'Titre de la campagne',
    targetQty: 'Quantité cible (Min 25)',
    rewardLabel: 'Récompense par visiteur',
    viewReward: 'Récompense de vue',
    subReward: 'Récompense d\'abonnement',
    likeReward: 'Récompense de like',
    followReward: 'Récompense de suivi',
    actionReward: 'Récompense d\'action',
    ptsSuffix: 'Points',
    estTotal: 'Coût total estimé:',
    planSummary: 'Plan: {quantity} actions × {points} Pts',
    decPoints: 'Points déduits:',
    confirmLaunch: 'Confirmer & lancer la campagne',
    loadingLaunch: 'Vérification & lancement en cours...',
    activeAndCompleted: 'Suivre les campagnes actives & complétées ({count})',
    noCampaigns: 'Aucune campagne active actuellement',
    noCampaignsDesc: 'Entrez une URL de cible et une quantité pour lancer votre campagne. L\'avancement en temps réel s\'affichera ici.',
    statusActive: 'Actuellement active',
    statusPaused: 'En pause',
    statusCompleted: 'Complétée',
    deleteTitle: 'Supprimer & rembourser les actions non complétées',
    openTarget: 'Ouvrir le lien cible 🔗',
    videoLink: 'ID de l\'URL vidéo:',
    extraData: 'Propriétés de campagne supplémentaires:',
    currentProgress: 'Avancement de l\'engagement: {progress}%',
    refillTitle: 'Recharger la campagne & ajouter des actions:',
    actionCost: 'Coût par action: {points} Pts',
    refillBtn: 'Ajouter {quantity} actions (coûte {cost} Pts)',
    tipTitle: '💡 Conseil sur les recharges de campagne:',
    tipDesc: 'Lorsque vous rechargez une campagne complétée, la quantité ajoutée s\'applique immédiatement et l\'état redevient Actif.',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer cette campagne ? Tous les points restants pour les actions non complétées seront immédiatement remboursés.',
    errEmptyTitle: 'Veuillez entrer un titre de campagne ou nom de chaîne',
    errEmptyUrl: 'Veuillez saisir l\'URL cible de la campagne',
    errInvalidYt: 'URL YouTube invalide. Veuillez saisir une URL standard comme: https://www.youtube.com/watch?v=...',
    errInvalidFb: 'URL Facebook de profil invalide. Doit contenir facebook.com',
    errInvalidIg: 'URL Instagram de profil invalide. Doit contenir instagram.com',
    errInvalidTt: 'URL TikTok de profil invalide. Doit contenir tiktok.com',
    errInvalidTg: 'URL Telegram de profil invalide. Doit contenir t.me',
    errMinQty: 'La taille minimale de la campagne est de 25 interactions',
    errNoPoints: 'Points insuffisants. Cette campagne nécessite {cost} points, mais vous n\'en avez que {points}.',
    successLaunch: 'Campagne créée avec succès ! Les utilisateurs peuvent maintenant vous soutenir.',
    errRefillMin: 'Veuillez saisir une quantité de recharge valide (au moins 1 action)',
    errRefillNoPoints: 'Points insuffisants. Recharger {quantity} actions coûte {cost} points, votre solde actuel est de {points}.',
    successRefill: 'Campagne rechargée avec succès de {quantity} actions !',
    customUrlLabel: 'Lien de profil ou post sur {name}',
    fbUrlLabel: 'URL de post ou page Facebook',
    igUrlLabel: 'URL de profil ou post Instagram',
    ttUrlLabel: 'URL de compte ou post TikTok',
    tgUrlLabel: 'URL de canal ou groupe Telegram',
    ytUrlLabel: 'URL de vidéo ou chaîne YouTube',
    fbTitlePlaceholder: 'Ex., Page Tech Marketing',
    igTitlePlaceholder: 'Ex., Compte Mode & Beauté',
    ttTitlePlaceholder: 'Ex., Boutique Cadeaux TikTok',
    tgTitlePlaceholder: 'Ex., Groupe Telegram Ventes & Offres',
    ytTitlePlaceholder: 'Ex., Comment créer d\'excellentes d\'applications IA'
  },
  es: {
    balance: 'Su Saldo: {points} Pts',
    launchNew: 'Iniciar nueva campaña',
    typeLabel: 'Acción de campaña requerida',
    youtubeViews: 'Vistas de YouTube',
    youtubeLikes: 'Likes de YouTube',
    youtubeSubs: 'Suscriptores de YouTube',
    fbFollows: 'Seguidores de Facebook',
    fbLikes: 'Me Gusta de Facebook',
    igFollows: 'Seguidores de Instagram',
    igLikes: 'Me Gusta de Instagram',
    tiktokFollows: 'Seguidores de TikTok',
    tiktokLikes: 'Likes de TikTok',
    tgJoin: 'Suscriptores de Telegram',
    durationLabel: 'Duración de vista requerida (segundos)',
    secUnit: 's',
    ptsUnit: 'Pts',
    titleLabel: 'Título de la campaña',
    targetQty: 'Cantidad objetivo (mínimo 25)',
    rewardLabel: 'Recompensa por visitante',
    viewReward: 'Recompensa de visualización',
    subReward: 'Recompensa de suscripción',
    likeReward: 'Recompensa de me gusta',
    followReward: 'Recompensa de seguidor',
    actionReward: 'Recompensa de acción',
    ptsSuffix: 'Puntos',
    estTotal: 'Costo total estimado:',
    planSummary: 'Plan: {quantity} acciones × {points} Pts',
    decPoints: 'Puntos deducidos:',
    confirmLaunch: 'Confirmar e iniciar campaña',
    loadingLaunch: 'Comprobando e iniciando campaña...',
    activeAndCompleted: 'Monitorear campañas activas y completadas ({count})',
    noCampaigns: 'No hay campañas activas actualmente',
    noCampaignsDesc: 'Ingrese un enlace válido y la cantidad para iniciar su campaña. Verá el progreso aquí en tiempo real.',
    statusActive: 'Actualmente activa',
    statusPaused: 'Pausada',
    statusCompleted: 'Completada',
    deleteTitle: 'Eliminar y reembolsar acciones pendientes',
    openTarget: 'Abrir enlace de destino 🔗',
    videoLink: 'ID de enlace de vídeo:',
    extraData: 'Datos adicionales de campaña:',
    currentProgress: 'Progreso de interacción: {progress}%',
    refillTitle: 'Sumar saldo de campaña:',
    actionCost: 'Costo por acción: {points} Pts',
    refillBtn: 'Sumar {quantity} acciones (cuesta {cost} Pts)',
    tipTitle: '💡 Consejo sobre recargas de campaña:',
    tipDesc: 'Al recargar una campaña completada, la cantidad adicional se aplica inmediatamente y el estado vuelve a estar Activo.',
    confirmDelete: '¿Está seguro de querer eliminar esta campaña? Todos los puntos pendientes de acciones no realizadas serán devueltos inmediatamente.',
    errEmptyTitle: 'Ingrese un título de campaña o nombre de canal',
    errEmptyUrl: 'Ingrese el enlace URL de la campaña de destino',
    errInvalidYt: 'URL de YouTube no válida. Ingrese una como: https://www.youtube.com/watch?v=...',
    errInvalidFb: 'URL de Facebook no válida. Debe contener facebook.com',
    errInvalidIg: 'URL de Instagram no válida. Debe contener instagram.com',
    errInvalidTt: 'URL de TikTok no válida. Debe contener tiktok.com',
    errInvalidTg: 'URL de Telegram no válida. Debe contener t.me',
    errMinQty: 'La cantidad mínima es de 25 interacciones',
    errNoPoints: 'Puntos insuficientes. Esta campaña requiere {cost} puntos, pero solo tiene {points}.',
    successLaunch: '¡Campaña creada con éxito! Los usuarios ahora pueden interactuar para apoyarte.',
    errRefillMin: 'Ingrese una cantidad de recarga válida (al menos 1 acción)',
    errRefillNoPoints: 'Puntos insuficientes. Recargar {quantity} acciones cuesta {cost} puntos, su saldo actual es de {points}.',
    successRefill: '¡Campaña recargada con éxito de {quantity} acciones!',
    customUrlLabel: 'Enlace de perfil o post en {name}',
    fbUrlLabel: 'Enlace de post o página de Facebook',
    igUrlLabel: 'Enlace de perfil o post de Instagram',
    ttUrlLabel: 'Enlace de cuenta o post de TikTok',
    tgUrlLabel: 'Enlace de canal o grupo de Telegram',
    ytUrlLabel: 'Enlace de vídeo o canal de YouTube',
    fbTitlePlaceholder: 'ej., Página de Mercadotecnia',
    igTitlePlaceholder: 'ej., Cuenta de Moda e Instagram',
    ttTitlePlaceholder: 'ej., Tienda de Regalos de TikTok',
    tgTitlePlaceholder: 'ej., Grupo de Ventas y Ofertas en Telegram',
    ytTitlePlaceholder: 'ej., Cómo crear excelentes aplicaciones de IA'
  }
};

export default function CreateCampaign({ user, onCampaignCreated, lang = 'en' }: CreateCampaignProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<CampaignType>('view');
  const [duration, setDuration] = useState<number>(60); // only for views
  const [quantity, setQuantity] = useState<number>(25); // min 25
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Map to matching language key safely
  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = campaignTranslations[activeLang];

  // Top-up local state
  const [topUpQty, setTopUpQty] = useState<{ [campaignId: string]: number }>({});

  const userCampaigns = db.getCampaigns().filter(c => c.creatorId === user.uid);

  // Dynamic point configurations
  const settings = db.getAdminSettings();

  const getPointsPerAction = () => {
    if (settings.pointsPerActionConfig?.[type]) {
      return settings.pointsPerActionConfig[type].pointsPerAction;
    }
    
    const customPlat = (settings.customPlatforms || []).find(p => p.id === type);
    if (customPlat && customPlat.pointsPerAction !== undefined) {
      return customPlat.pointsPerAction;
    }

    if (type === 'website_view') {
      switch (duration) {
        case 60: return 30;
        case 120: return 60;
        case 200: return 180;
        case 300: return 240;
        default: return 30;
      }
    }

    if (type === 'like') return 60;
    if (type === 'subscribe') return 70;
    if (type === 'fb_like') return 50;
    if (type === 'fb_follow') return 50;
    if (type === 'ig_like') return 50;
    if (type === 'ig_follow') return 50;
    if (type === 'tiktok_like') return 50;
    if (type === 'tiktok_follow') return 50;
    if (type === 'x_follow') return 50;
    if (type === 'x_like') return 50;
    if (type === 'pinterest_follow') return 50;
    if (type === 'pinterest_like') return 50;
    if (type === 'tg_join') return 50;
    
    // View points based on duration
    switch (duration) {
      case 120: return 100;
      case 180: return 150;
      case 240: return 200;
      case 300: return 300;
      default: return 50; // 60s
    }
  };

  const getRewardPerActionStd = (campaignType: CampaignType, viewDuration: number) => {
    if (settings.pointsPerActionConfig?.[campaignType]) {
      return settings.pointsPerActionConfig[campaignType].rewardPerAction;
    }

    const customPlat = (settings.customPlatforms || []).find(p => p.id === campaignType);
    if (customPlat && customPlat.rewardPerAction !== undefined) {
      return customPlat.rewardPerAction;
    }

    if (campaignType === 'website_view') {
      switch (viewDuration) {
        case 60: return 20;
        case 120: return 40;
        case 200: return 100;
        case 300: return 200;
        default: return 20;
      }
    }

    if (campaignType === 'like') return 40;
    if (campaignType === 'subscribe') return 50;
    if (campaignType === 'fb_like') return 40;
    if (campaignType === 'fb_follow') return 40;
    if (campaignType === 'ig_like') return 40;
    if (campaignType === 'ig_follow') return 40;
    if (campaignType === 'tiktok_like') return 40;
    if (campaignType === 'tiktok_follow') return 40;
    if (campaignType === 'x_follow') return 40;
    if (campaignType === 'x_like') return 40;
    if (campaignType === 'pinterest_follow') return 40;
    if (campaignType === 'pinterest_like') return 40;
    if (campaignType === 'tg_join') return 40;

    switch (viewDuration) {
      case 120: return 80;
      case 180: return 130;
      case 240: return 160;
      case 300: return 250;
      default: return 40; // 60s
    }
  };

  const pointsPerAction = getPointsPerAction();
  const rewardPerAction = getRewardPerActionStd(type, duration);
  const totalCost = quantity * pointsPerAction;

  const getUrlLabel = () => {
    const customPlat = (settings.customPlatforms || []).find(p => p.id === type);
    if (customPlat && customPlat.urlLabel) return customPlat.urlLabel;
    if (customPlat) {
      return t.customUrlLabel.replace('{name}', customPlat.name);
    }
    if (type === 'website_view') {
      return activeLang === 'ar' ? 'رابط الموقع الإلكتروني المستهدف' : 'Target Website URL';
    }
    if (type === 'fb_like' || type === 'fb_follow') return t.fbUrlLabel;
    if (type === 'pinterest_follow' || type === 'pinterest_like') return activeLang === 'ar' ? 'رابط الحساب أو البورد أو المنشور على بنترست (Pinterest)' : 'Pinterest Profile, Board, or Pin URL';
    if (type === 'ig_like' || type === 'ig_follow') return t.igUrlLabel;
    if (type === 'tiktok_like' || type === 'tiktok_follow') return t.ttUrlLabel;
    if (type === 'x_follow' || type === 'x_like') return activeLang === 'ar' ? 'رابط الحساب الشخصي أو المنشور على منصة إكس (تويتر)' : 'X (Twitter) Profile or Post URL';
    if (type === 'tg_join') return t.tgUrlLabel;
    return t.ytUrlLabel;
  };

  const getUrlPlaceholder = () => {
    const customPlat = (settings.customPlatforms || []).find(p => p.id === type);
    if (customPlat && customPlat.urlPlaceholder) return customPlat.urlPlaceholder;
    if (type === 'website_view') return 'https://example.com';
    if (type === 'fb_like' || type === 'fb_follow') return 'https://www.facebook.com/...';
    if (type === 'pinterest_follow' || type === 'pinterest_like') return 'https://www.pinterest.com/...';
    if (type === 'ig_like' || type === 'ig_follow') return 'https://www.instagram.com/...';
    if (type === 'tiktok_like' || type === 'tiktok_follow') return 'https://www.tiktok.com/@...';
    if (type === 'x_follow' || type === 'x_like') return 'https://x.com/...';
    if (type === 'tg_join') return 'https://t.me/...';
    return 'https://www.youtube.com/watch?v=...';
  };

  const getTitlePlaceholder = () => {
    const customPlat = (settings.customPlatforms || []).find(p => p.id === type);
    if (customPlat && customPlat.titlePlaceholder) return customPlat.titlePlaceholder;
    if (type === 'website_view') return activeLang === 'ar' ? 'مثال: موقع لتصميم الجرافيك والخدمات' : 'Ex., Creative Graphic Design Website';
    if (type === 'fb_like' || type === 'fb_follow') return t.fbTitlePlaceholder;
    if (type === 'pinterest_follow' || type === 'pinterest_like') return activeLang === 'ar' ? 'مثال: حساب الأفكار والديكورات بنترست' : 'Ex., Pinterest Ideas & Decoration Account';
    if (type === 'ig_like' || type === 'ig_follow') return t.igTitlePlaceholder;
    if (type === 'tiktok_like' || type === 'tiktok_follow') return t.ttTitlePlaceholder;
    if (type === 'x_follow' || type === 'x_like') return activeLang === 'ar' ? 'مثال: متابعة حسابي لتصميم المواقع' : 'Ex., Follow my web design profile';
    if (type === 'tg_join') return t.tgTitlePlaceholder;
    return t.ytTitlePlaceholder;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Form validation
    if (!title.trim()) {
      setMessage({ text: t.errEmptyTitle, isError: true });
      return;
    }

    if (!url.trim()) {
      setMessage({ text: t.errEmptyUrl, isError: true });
      return;
    }

    let yid = '';
    const trimmedUrl = url.trim();

    if (type === 'view' || type === 'like' || type === 'subscribe') {
      const parsedYid = getYoutubeId(trimmedUrl);
      if (!parsedYid) {
        setMessage({ text: t.errInvalidYt, isError: true });
        return;
      }
      yid = parsedYid;
    } else if (type === 'website_view') {
      if (!trimmedUrl.toLowerCase().startsWith('http://') && !trimmedUrl.toLowerCase().startsWith('https://')) {
        setMessage({ 
          text: activeLang === 'ar' ? 'يرجى إدخال رابط موقع صحيح يبدأ بـ http:// أو https://' : 'Please enter a valid website URL starting with http:// or https://', 
          isError: true 
        });
        return;
      }
      yid = 'website';
    } else if (type === 'fb_like' || type === 'fb_follow') {
      if (!trimmedUrl.toLowerCase().includes('facebook.com') && !trimmedUrl.toLowerCase().includes('fb.com') && !trimmedUrl.toLowerCase().includes('fb.watch') && !trimmedUrl.toLowerCase().includes('facebook')) {
        setMessage({ text: t.errInvalidFb, isError: true });
        return;
      }
      yid = 'facebook';
    } else if (type === 'pinterest_follow' || type === 'pinterest_like') {
      if (!trimmedUrl.toLowerCase().includes('pinterest.com') && !trimmedUrl.toLowerCase().includes('pin.it') && !trimmedUrl.toLowerCase().includes('pinterest')) {
        setMessage({ 
          text: activeLang === 'ar' ? 'يرجى إدخال رابط بنترست صحيح يحتوي على pinterest.com' : 'Please enter a valid Pinterest URL containing pinterest.com', 
          isError: true 
        });
        return;
      }
      yid = 'pinterest';
    } else if (type === 'ig_like' || type === 'ig_follow') {
      if (!trimmedUrl.toLowerCase().includes('instagram.com') && !trimmedUrl.toLowerCase().includes('instagr.am') && !trimmedUrl.toLowerCase().includes('instagram')) {
        setMessage({ text: t.errInvalidIg, isError: true });
        return;
      }
      yid = 'instagram';
    } else if (type === 'tiktok_like' || type === 'tiktok_follow') {
      if (!trimmedUrl.toLowerCase().includes('tiktok.com')) {
        setMessage({ text: t.errInvalidTt, isError: true });
        return;
      }
      yid = 'tiktok';
    } else if (type === 'x_follow' || type === 'x_like') {
      if (!trimmedUrl.toLowerCase().includes('twitter.com') && !trimmedUrl.toLowerCase().includes('x.com')) {
        setMessage({ 
          text: activeLang === 'ar' ? 'يرجى إدخال رابط منصة إكس صحيح يحتوي على twitter.com أو x.com' : 'Please enter a valid X (Twitter) URL containing twitter.com or x.com', 
          isError: true 
        });
        return;
      }
      yid = 'x';
    } else if (type === 'tg_join') {
      if (!trimmedUrl.toLowerCase().includes('t.me') && !trimmedUrl.toLowerCase().includes('telegram.me') && !trimmedUrl.toLowerCase().includes('telegram.org')) {
        setMessage({ text: t.errInvalidTg, isError: true });
        return;
      }
      yid = 'telegram';
    } else {
      yid = type;
    }

    if (quantity < 25) {
      setMessage({ text: t.errMinQty, isError: true });
      return;
    }

    if (user.points < totalCost) {
      setMessage({ text: t.errNoPoints.replace('{cost}', totalCost.toString()).replace('{points}', user.points.toString()), isError: true });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Create campaign
      const result = db.addCampaign({
        creatorId: user.uid,
        creatorEmail: user.email,
        type,
        youtubeUrl: url.trim(),
        youtubeId: yid,
        title: title.trim(),
        duration: type === 'view' ? duration : 60,
        pointsPerAction,
        rewardPerAction,
        quantity
      });

      setLoading(false);
      if (typeof result === 'string') {
        setMessage({ text: result, isError: true });
      } else {
        setMessage({ text: t.successLaunch, isError: false });
        setUrl('');
        setTitle('');
        setQuantity(25);
        onCampaignCreated();
      }
    }, 1000);
  };

  const getRewardPerAction = (campaignType: CampaignType, viewDuration: number) => {
    if (campaignType === 'like') return 40;
    if (campaignType === 'subscribe') return 50;
    if (campaignType === 'fb_like') return 40;
    if (campaignType === 'fb_follow') return 40;
    if (campaignType === 'ig_like') return 40;
    if (campaignType === 'ig_follow') return 40;
    if (campaignType === 'tiktok_like') return 40;
    if (campaignType === 'tiktok_follow') return 40;
    if (campaignType === 'x_follow') return 40;
    if (campaignType === 'x_like') return 40;
    if (campaignType === 'pinterest_follow') return 40;
    if (campaignType === 'pinterest_like') return 40;
    if (campaignType === 'tg_join') return 40;

    switch (viewDuration) {
      case 120: return 80;
      case 180: return 130;
      case 240: return 160;
      case 300: return 250;
      default: return 40; // 60s
    }
  };

  // Actions
  const handleTopUp = (campaignId: string, currentPointsPerAction: number) => {
    const qty = topUpQty[campaignId] || 25;
    if (qty < 1) {
      setMessage({ text: t.errRefillMin, isError: true });
      return;
    }
    const cost = qty * currentPointsPerAction;
    if (user.points < cost) {
      setMessage({ 
        text: t.errRefillNoPoints.replace('{quantity}', qty.toString()).replace('{cost}', cost.toString()).replace('{points}', user.points.toString()), 
        isError: true 
      });
      return;
    }

    const result = db.topUpCampaign(campaignId, qty, user.uid);
    if (typeof result === 'string') {
      setMessage({ text: result, isError: true });
    } else {
      setMessage({ text: t.successRefill.replace('{quantity}', qty.toString()), isError: false });
      // Reset state for this campaign top-up quantity input
      setTopUpQty(prev => ({ ...prev, [campaignId]: 25 }));
      onCampaignCreated();
    }
  };

  const handleToggleState = (campId: string) => {
    db.toggleCampaignStatus(campId);
    onCampaignCreated();
  };

  const handleDeleteCamp = (campId: string) => {
    if (window.confirm(t.confirmDelete)) {
      db.deleteCampaign(campId);
      onCampaignCreated();
    }
  };

  const builtInPlatforms = [
    { id: 'view', label: t.youtubeViews, icon: Play, desc: `${settings.pointsPerActionConfig?.['view']?.pointsPerAction || 50} ${t.ptsUnit} / جولة` },
    { id: 'like', label: t.youtubeLikes, icon: ThumbsUp, desc: `${settings.pointsPerActionConfig?.['like']?.pointsPerAction || 60} ${t.ptsUnit}` },
    { id: 'subscribe', label: t.youtubeSubs, icon: UserPlus, desc: `${settings.pointsPerActionConfig?.['subscribe']?.pointsPerAction || 70} ${t.ptsUnit}` },
    { id: 'fb_follow', label: t.fbFollows, icon: UserPlus, desc: `${settings.pointsPerActionConfig?.['fb_follow']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'fb_like', label: t.fbLikes, icon: ThumbsUp, desc: `${settings.pointsPerActionConfig?.['fb_like']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'ig_follow', label: t.igFollows, icon: UserPlus, desc: `${settings.pointsPerActionConfig?.['ig_follow']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'ig_like', label: t.igLikes, icon: ThumbsUp, desc: `${settings.pointsPerActionConfig?.['ig_like']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'tiktok_follow', label: t.tiktokFollows, icon: UserPlus, desc: `${settings.pointsPerActionConfig?.['tiktok_follow']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'tiktok_like', label: t.tiktokLikes, icon: ThumbsUp, desc: `${settings.pointsPerActionConfig?.['tiktok_like']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'x_follow', label: activeLang === 'ar' ? 'متابعة إكس (X / Twitter)' : (activeLang === 'es' ? 'Seguir en X (Twitter)' : (activeLang === 'fr' ? 'Suivre sur X (Twitter)' : 'X (Twitter) Follow')), icon: UserPlus, desc: `${settings.pointsPerActionConfig?.['x_follow']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'x_like', label: activeLang === 'ar' ? 'لايك إكس (X / Twitter)' : (activeLang === 'es' ? 'Me gusta en X (Twitter)' : (activeLang === 'fr' ? 'Liker sur X (Twitter)' : 'X (Twitter) Like')), icon: ThumbsUp, desc: `${settings.pointsPerActionConfig?.['x_likes']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'pinterest_follow', label: activeLang === 'ar' ? 'متابعة بنترست (Pinterest Follow)' : (activeLang === 'es' ? 'Seguir en Pinterest' : (activeLang === 'fr' ? 'Suivre sur Pinterest' : 'Pinterest Follow')), icon: UserPlus, desc: `${settings.pointsPerActionConfig?.['pinterest_follow']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'pinterest_like', label: activeLang === 'ar' ? 'لايك بنترست (Pinterest Like)' : (activeLang === 'es' ? 'Me gusta en Pinterest' : (activeLang === 'fr' ? 'Liker sur Pinterest' : 'Pinterest Like')), icon: ThumbsUp, desc: `${settings.pointsPerActionConfig?.['pinterest_like']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'tg_join', label: t.tgJoin, icon: Send, desc: `${settings.pointsPerActionConfig?.['tg_join']?.pointsPerAction || 50} ${t.ptsUnit}` },
    { id: 'website_view', label: activeLang === 'ar' ? 'مشاهدة المواقع (Website Views)' : (activeLang === 'es' ? 'Visitas de Sitios' : (activeLang === 'fr' ? 'Vues de Sites' : 'Website Views')), icon: ExternalLink, desc: `30-240 ${t.ptsUnit} / جولة` }
  ];

  const customList = (settings.customPlatforms || []).map(p => ({
    id: p.id,
    label: p.name,
    icon: Sparkles,
    desc: `${settings.pointsPerActionConfig?.[p.id]?.pointsPerAction || p.pointsPerAction || 50} ${t.ptsUnit}`
  }));

  const allActivePlatforms = [...builtInPlatforms, ...customList];

  return (
    <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 w-full max-w-7xl mx-auto items-stretch ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* LEFT COLUMN: CAMPAIGN CREATOR */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-5 mb-6">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {t.balance.replace('{points}', user.points.toLocaleString())}
            </span>
            <h2 className="text-xl font-black text-white flex items-center gap-2 border-b-0">
              {t.launchNew}
              <Sparkles className="w-5 h-5 text-amber-500" />
            </h2>
          </div>

          {message && (
            <div className={`p-4 mb-6 rounded-2xl border flex items-start gap-3 transition-all ${
              message.isError 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              <div className="flex-1 text-sm leading-relaxed">
                {message.text}
              </div>
              {message.isError ? (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ad Type Target */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">{t.typeLabel}</label>
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
                {allActivePlatforms.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <button
                      id={`type-btn-${item.id}`}
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setType(item.id as CampaignType);
                        setDuration(60); // reset duration is safe for both views and website views
                        setMessage(null);
                      }}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        type === item.id 
                          ? 'bg-red-500/10 border-red-500 text-red-400 font-bold shadow-lg shadow-red-500/5' 
                          : 'bg-slate-950 border-slate-850 hover:border-slate-850 text-slate-500'
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${type === item.id ? 'text-red-500' : 'text-slate-500'}`} />
                      <span className="text-xs">{item.label}</span>
                      <span className="text-[9px] opacity-70 font-mono">{item.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dynamic configurations for Website Views duration */}
            {type === 'website_view' && (
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <label className="block text-xs font-bold text-slate-400 mb-2.5">{t.durationLabel}</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { time: 60, points: 30 },
                    { time: 120, points: 60 },
                    { time: 200, points: 180 },
                    { time: 300, points: 240 }
                  ].map((pkt) => (
                    <button
                      id={`website-duration-${pkt.time}`}
                      key={pkt.time}
                      type="button"
                      onClick={() => setDuration(pkt.time)}
                      className={`py-2 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        duration === pkt.time 
                          ? 'bg-red-500/10 border-red-500/50 text-red-400 font-bold' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 text-xs'
                      }`}
                    >
                      <span className="text-xs font-bold">{pkt.time}{t.secUnit}</span>
                      <span className="text-[9px] opacity-80 font-mono">{pkt.points}{t.ptsUnit}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic configurations for Views duration */}
            {type === 'view' && (
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-xl">
                <label className="block text-xs font-bold text-slate-400 mb-2.5">{t.durationLabel}</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[
                    { time: 60, points: 50 },
                    { time: 120, points: 100 },
                    { time: 180, points: 150 },
                    { time: 240, points: 200 },
                    { time: 300, points: 300 }
                  ].map((pkt) => (
                    <button
                      id={`duration-${pkt.time}`}
                      key={pkt.time}
                      type="button"
                      onClick={() => setDuration(pkt.time)}
                      className={`py-2 px-1 rounded-lg border text-center transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        duration === pkt.time 
                          ? 'bg-red-500/10 border-red-500/50 text-red-400 font-bold' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 text-xs'
                      }`}
                    >
                      <span className="text-xs font-bold">{pkt.time}{t.secUnit}</span>
                      <span className="text-[9px] opacity-80 font-mono">{pkt.points}{t.ptsUnit}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{t.titleLabel}</label>
                <input
                  id="camp-title-input"
                  type="text"
                  placeholder={getTitlePlaceholder()}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 text-xs outline-none transition ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2">{getUrlLabel()}</label>
                <div className="relative">
                  <input
                    id="camp-url-input"
                    type="url"
                    placeholder={getUrlPlaceholder()}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 text-xs outline-none transition text-left pl-11"
                    required
                  />
                  <LinkIcon className="absolute left-4 top-3 text-slate-500 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{t.targetQty}</label>
                  <input
                    id="camp-qty-input"
                    type="number"
                    min="25"
                    step="5"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                    className={`w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl focus:border-red-500 focus:ring-1 focus:ring-red-500 text-xs outline-none transition ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2">{t.rewardLabel}</label>
                  <div className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-350 text-xs pointer-events-none text-center font-bold">
                    {type === 'view' ? t.viewReward : 
                     type === 'subscribe' ? t.subReward : 
                     (type === 'like' || type === 'fb_like' || type === 'ig_like' || type === 'tiktok_like') ? t.likeReward : 
                     (type === 'fb_follow' || type === 'ig_follow' || type === 'tiktok_follow') ? t.followReward : 
                     t.actionReward}: <span className="text-emerald-400 font-extrabold">{rewardPerAction} {t.ptsSuffix}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculations widget */}
            <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-3">
              <div className="flex-1">
                <div className="text-[10px] text-slate-500 font-bold">{t.estTotal}</div>
                <div className="text-xs font-semibold text-slate-300 mt-1">
                  {t.planSummary.replace('{quantity}', quantity.toString()).replace('{points}', pointsPerAction.toString())}
                </div>
              </div>
              <div className="shrink-0">
                <div className="text-[10px] text-slate-500 font-bold">{t.decPoints}</div>
                <div className="text-base font-black text-red-500">{totalCost.toLocaleString()} {t.ptsSuffix}</div>
              </div>
            </div>

            {/* Submit */}
            <button
              id="camp-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? t.loadingLaunch : t.confirmLaunch}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT COLUMN: USER'S CURRENT PLANS & REFILL MODULE */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col shadow-xl">
        <div>
          <h3 className="text-xl font-black text-white flex items-center gap-2 border-b border-slate-800 pb-5 mb-6 justify-between flex-row">
            <span>{t.activeAndCompleted.replace('{count}', userCampaigns.length.toString())}</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </h3>

          {userCampaigns.length === 0 ? (
            <div className="text-center py-16 text-slate-500 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center border border-slate-800 text-slate-700">
                <Coins className="w-8 h-8 animate-pulse text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-200">{t.noCampaigns}</p>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  {t.noCampaignsDesc}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              {userCampaigns.map((camp) => {
                const progress = Math.min(100, Math.round((camp.completedCount / camp.quantity) * 100));
                const currentRefillQty = topUpQty[camp.id] || 25;
                const topUpCost = currentRefillQty * camp.pointsPerAction;

                return (
                  <div key={camp.id} className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex flex-col gap-3.5 hover:border-slate-850 transition text-right">
                    
                    {/* Header line of card */}
                    <div className="flex justify-between items-center flex-row">
                      {/* Name and type badges */}
                      <div className="flex items-center gap-2 flex-row">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          camp.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : camp.status === 'paused'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        }`}>
                          {camp.status === 'active' && t.statusActive}
                          {camp.status === 'paused' && t.statusPaused}
                          {camp.status === 'completed' && t.statusCompleted}
                        </span>
                        
                        <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                          {camp.type === 'view' && t.youtubeViews}
                          {camp.type === 'like' && t.youtubeLikes}
                          {camp.type === 'subscribe' && t.youtubeSubs}
                          {camp.type === 'fb_like' && t.fbLikes}
                          {camp.type === 'fb_follow' && t.fbFollows}
                          {camp.type === 'ig_like' && t.igLikes}
                          {camp.type === 'ig_follow' && t.igFollows}
                          {camp.type === 'tiktok_like' && t.tiktokLikes}
                          {camp.type === 'tiktok_follow' && t.tiktokFollows}
                          {camp.type === 'tg_join' && t.tgJoin}
                          {camp.type === 'x_follow' && (activeLang === 'ar' ? 'متابعة إكس (X Follow)' : 'X Follow')}
                          {camp.type === 'x_like' && (activeLang === 'ar' ? 'لايك إكس (X Like)' : 'X Like')}
                          {camp.type === 'website_view' && (activeLang === 'ar' ? 'مشاهدة المواقع (Website Views)' : 'Website Views')}
                        </span>
                      </div>

                      {/* Controls at card action */}
                      <div className="flex items-center gap-1.5">
                        <button
                          id={`delete-btn-${camp.id}`}
                          onClick={() => handleDeleteCamp(camp.id)}
                          className="p-1.5 bg-red-955/20 hover:bg-red-650 text-red-500 hover:text-white rounded-lg transition cursor-pointer"
                          title={t.deleteTitle}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {camp.status !== 'completed' && (
                          <button
                            id={`toggle-btn-${camp.id}`}
                            onClick={() => handleToggleState(camp.id)}
                            className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                              camp.status === 'active'
                                ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'
                                : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                            }`}
                          >
                            {camp.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress tracking information */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-100 line-clamp-1">{camp.title}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <a 
                          href={camp.youtubeUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-[10px] text-blue-400 hover:underline inline-flex items-center gap-0.5 font-mono max-w-full truncate"
                        >
                          {camp.type.startsWith('fb_') || camp.type.startsWith('ig_') || camp.type.startsWith('tiktok_') || camp.type.startsWith('x_') || camp.type === 'tg_join' || camp.type === 'website_view' ? t.openTarget : `${t.videoLink} ${camp.youtubeId}`}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>

                    {/* Render custom fields if they exist */}
                    {camp.customFields && camp.customFields.length > 0 && (
                      <div className="bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/60 text-right space-y-1 mt-1">
                        <p className="text-[9px] font-black uppercase text-indigo-400">{t.extraData}</p>
                        <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                          {camp.customFields.map((field) => (
                            <div key={field.id} className="bg-slate-950 px-2 py-1 rounded border border-slate-800/60 flex justify-between flex-row items-center">
                              <span className="text-slate-400 font-bold">{field.label}:</span>
                              <span className="text-indigo-200 font-mono select-text font-extrabold">{field.value || '-'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Progress slider info */}
                    <div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1 flex-row">
                        <span className="font-mono text-slate-300">{camp.completedCount} / {camp.quantity}</span>
                        <span>{t.currentProgress.replace('{progress}', progress.toString())}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            camp.status === 'completed' ? 'bg-blue-500/80' : 'bg-red-650'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* REFILL MODULE PORTAL */}
                    <div className="pt-3 border-t border-slate-900/60 mt-1 bg-slate-900/15 p-2 rounded-xl">
                      <div className="flex items-center justify-between flex-row mb-2">
                        <span className="text-[10px] font-bold text-slate-400">{t.refillTitle}</span>
                        <span className="text-[9px] font-mono text-slate-500">{t.actionCost.replace('{points}', camp.pointsPerAction.toString())}</span>
                      </div>
                      
                      <div className="flex gap-2 flex-row items-center">
                        <div className="relative w-28">
                          <input
                            id={`refill-qty-input-${camp.id}`}
                            type="number"
                            min="10"
                            step="5"
                            value={currentRefillQty}
                            onChange={(e) => {
                              const v = Math.max(1, parseInt(e.target.value) || 0);
                              setTopUpQty(prev => ({ ...prev, [camp.id]: v }));
                            }}
                            className="w-full text-xs px-2 py-2 bg-slate-950 border border-slate-800 rounded-lg outline-none text-right font-black text-white pl-8"
                          />
                        </div>

                        <button
                          id={`refill-submit-btn-${camp.id}`}
                          onClick={() => handleTopUp(camp.id, camp.pointsPerAction)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg py-2 px-3 text-xs font-black transition flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-emerald-900/10 flex-row"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>{t.refillBtn.replace('{quantity}', currentRefillQty.toString()).replace('{cost}', topUpCost.toString())}</span>
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800 text-xs text-slate-500 leading-relaxed">
          <p className="font-semibold text-emerald-500 mb-1">{t.tipTitle}</p>
          {t.tipDesc}
        </div>
      </div>

    </div>
  );
}
