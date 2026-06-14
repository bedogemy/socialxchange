import React from 'react';
import { User } from '../types';
import { db } from '../lib/db';
import { 
  Youtube, 
  Facebook, 
  Instagram, 
  Flame, 
  Sparkles, 
  Coins, 
  Eye, 
  ThumbsUp, 
  UserPlus, 
  LifeBuoy, 
  ArrowLeftRight, 
  TrendingUp,
  ShieldCheck,
  Compass,
  Send,
  Globe,
  ExternalLink,
  HelpCircle,
  Check,
  Pin
} from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';
import { pricingPackages } from '../lib/pricing';

interface HomePortalProps {
  user: User;
  onSelectTab: (tabId: string) => void;
  lang?: SupportedLanguages;
}

const homeTranslations: Record<SupportedLanguages, Record<string, any>> = {
  ar: {
    heroBadge: "نظام التبادل التفاعلي العربي الرائد",
    welcomeBack: "مرحباً بك مجدداً في",
    platformDesc: "تنشيط حسابات وقنوات السوشيال ميديا بتبادل آمن وتفاعلات حقيقية 100% بأيدي معلنين وزوار حقيقيين مثلك تماماً دون بوتات أو تحايل. تجميع النقاط والنمو الرقمي يبدأ من هنا.",
    launchCampaignBtn: "إطلاق حملة ترويجية جديدة",
    buyPointsBtn: "شحن رصيد نقاط الدعم",
    profileTitle: "الملف الشخصي",
    pointsBalanceLabel: "رصيد النقاط",
    activeCampaignsLabel: "الحملات النشطة",
    outOf: "من أصل",
    
    feat1Title: "التحقق الرقمي الثنائي المطور",
    feat1Desc: "نظام مطابقة مخرجات تفاعل فائق الدقة يفحص حالة البقاء ونشاط الصفحة لضمان جدية ومصداقية التفاعل.",
    
    feat2Title: "تنمية ذكية ونمو طبيعي",
    feat2Desc: "تفاعلات من أشخاص حقيقيين يطالعون بنفس الشغف وبذلك لا تضر حساباتك وتتوافق مع شروط المنصات.",
    
    feat3Title: "عادل بنسبة 100% ودائم",
    feat3Desc: "أنت تفعل لايك لغيرك لتكسب نقاطاً، وتطلق حملتك بالنقاط ليقوم الآخرين بالتفاعل معك فوراً.",
    
    servicesHubTitle: "الخدمات وباقات الدعم التبادلي المتاحة",
    servicesHubDesc: "اختر أحد منصات الدعم بالأسفل لكسب النقاط",
    activeStatus: "نشطة",
    guaranteeLabel: "تحت الرقابة والضمان",
    
    supportSectionTitle: "هل تواجه مشكلة أو لديك استفسار؟",
    supportSectionDesc: "قسم الدعم الفني متوفر على مدار 24 ساعة للمساعدة في مراجعة كشوف النقاط، حل نزاعات الحملات الإعلانية ومشاكل معالجة الدفع السريع.",
    supportContactBtn: "تواصل مع الدعم الفني 📞",
    premiumServicesTitle: "الخدمات التفاعلية الممتازة بالمنصة",
    premiumServicesDesc: "بوابتك السريعة لزيادة المتابعين والتفاعل بـ 14 خدمة حقيقية بأيدي أشخاص حقيقيين 100%. انقر على أي خدمة للبدء فوراً.",
    purchasePackagesTitle: "باقات شراء النقاط (Purchase Points Packages)",
    purchasePackagesDesc: "اختر خطة الشحن المناسبة لتمويل حملاتك الترويجية وجلب آلاف المتفاعلين في ثوانٍ معدودة.",
    bestValueLabel: "الأكثر مبيعاً ⭐",
    buyNowLabel: "شراء الآن 🚀"
  },
  en: {
    heroBadge: "The World's Leading Support & Exchange Network",
    welcomeBack: "Welcome back to",
    platformDesc: "Boost your social media profiles and channels with 100% secure, organic, real human actions. Earn points and grow your digital presence safely with user-to-user support exchange.",
    launchCampaignBtn: "Launch Selected Campaign",
    buyPointsBtn: "Top Up Quick Support Points",
    profileTitle: "Your Profile",
    pointsBalanceLabel: "Points Balance",
    activeCampaignsLabel: "Active Campaigns",
    outOf: "out of",
    
    feat1Title: "Advanced Double-Check Tech",
    feat1Desc: "Cryptographic activity check algorithms monitor duration and channel states to verify legitimate actions automatically.",
    
    feat2Title: "Organic Social Media Growth",
    feat2Desc: "Interactions come purely from actual users of our platform, complying 100% with standard platform guidelines.",
    
    feat3Title: "100% Fair Reward Loop",
    feat3Desc: "Perform support actions for other developers to gain points, then use your points to boost your own assets instantly.",
    
    servicesHubTitle: "Available Interactive Support Exchanges",
    servicesHubDesc: "Select from the active categories below to start earning points",
    activeStatus: "Active",
    guaranteeLabel: "Insured & Clean Traffic",
    
    supportSectionTitle: "Encountered an issue or have suggestions?",
    supportSectionDesc: "Our support agents are available 24/7 to solve potential logging bugs, campaign errors, or quick payment verification.",
    supportContactBtn: "Contact Help Desk 📞",
    premiumServicesTitle: "Premium Interactive Services",
    premiumServicesDesc: "Launch your presence with 14 organic, top-tier interactions powered by live users. Tap any service to begin.",
    purchasePackagesTitle: "Purchase Points Packages",
    purchasePackagesDesc: "Select the perfect points package to instantly fuel your campaigns and reach thousands of users.",
    bestValueLabel: "Best Value ⭐",
    buyNowLabel: "Buy Now 🚀"
  },
  fr: {
    heroBadge: "Le premier réseau mondial d'échange et de support",
    welcomeBack: "Bienvenue de retour à",
    platformDesc: "Boostez vos profils avec des interactions 100% réelles. Gagnez des points et développez votre présence numérique en toute sécurité avec l'échange d'engagement d'utilisateur à utilisateur.",
    launchCampaignBtn: "Lancer la Campagne",
    buyPointsBtn: "Acheter des Points d'Appui",
    profileTitle: "Votre Profil",
    pointsBalanceLabel: "Solde des points",
    activeCampaignsLabel: "Campagnes Actives",
    outOf: "sur",
    
    feat1Title: "Algorithme de Vérification Avancé",
    feat1Desc: "Contrôle en arrière-plan pour valider les actions, empêchant les robots et assurant un échange juste.",
    
    feat2Title: "Croissance Organique Réelle",
    feat2Desc: "Interactions s'effectuant uniquement avec de vrais utilisateurs, éliminant les spams ou comptes bidons.",
    
    feat3Title: "Équitable à 100%",
    feat3Desc: "Aimez et suivez pour gagner des points, et dépensez-les pour obtenir des abonnés et likes de la communauté.",
    
    servicesHubTitle: "Plateformes d'Échange Actives",
    servicesHubDesc: "Choisissez l'un des services pour commencer à accumuler des points",
    activeStatus: "Actif",
    guaranteeLabel: "Garanti & Monitorisé",
    
    supportSectionTitle: "Une question ou un problème rencontré ?",
    supportSectionDesc: "Notre helpdesk est ouvert 24h/24 pour assister la résolution des soldes de points, réclamations ou paiements.",
    supportContactBtn: "Contacter le Support 📞",
    premiumServicesTitle: "Services Classés Premium",
    premiumServicesDesc: "Activez votre trafic social instantanément avec 14 services d'échange réels. Cliquez sur une catégorie.",
    purchasePackagesTitle: "Packages d'Achat de Points",
    purchasePackagesDesc: "Sélectionnez le pack idéal pour alimenter vos campagnes et toucher des milliers d'utilisateurs.",
    bestValueLabel: "Meilleure Offre ⭐",
    buyNowLabel: "Acheter Maintenant 🚀"
  },
  es: {
    heroBadge: "La Red Global Líder en Crecimiento e Intercambio",
    welcomeBack: "Bienvenido de nuevo a",
    platformDesc: "Aumente el impacto de sus canales con un intercambio 100% seguro. Gane puntos y desarrolle su presencia de manera orgánica mediante el soporte entre usuarios reales.",
    launchCampaignBtn: "Lanzar Campaña Nueva",
    buyPointsBtn: "Comprar Puntos de Soporte",
    profileTitle: "Su Perfil",
    pointsBalanceLabel: "Saldo de Puntos",
    activeCampaignsLabel: "Campañas Activas",
    outOf: "de",
    
    feat1Title: "Doble Verificación Algorítmica",
    feat1Desc: "Sistemas avanzados autentican el tiempo promedio de visualización y estado para acreditar incentivos con honestidad.",
    
    feat2Title: "Crecimiento Social Orgánico",
    feat2Desc: "Todas las acciones provienen de personas reales con intereses comunes, evitando bots para proteger sus canales.",
    
    feat3Title: "Ciclo de Recompensa Equitativo",
    feat3Desc: "Apoye campañas de otros para reclamar recompensas y utilícelas para potenciar sus propios contenidos hoy mismo.",
    
    servicesHubTitle: "Categorías de Intercambio Disponibles",
    servicesHubDesc: "Seleccione un servicio para comenzar a acumular puntos de apoyo",
    activeStatus: "Activo",
    guaranteeLabel: "Bajo Garantía y Control",
    supportSectionTitle: "¿Tiene alguna duda o inconveniente?",
    supportSectionDesc: "El centro de asistencia técnica está disponible las 24 horas para guiarle con la liquidación de puntos y campañas.",
    supportContactBtn: "Establecer Contacto con Soporte 📞",
    premiumServicesTitle: "Servicios Interactivos de Alta Calidad",
    premiumServicesDesc: "Despliega tu potencial digital en la red con nuestras 14 categorías premium. Pulsa para empezar hoy directo.",
    purchasePackagesTitle: "Paquetes de Compra de Puntos",
    purchasePackagesDesc: "Seleccione el paquete de puntos ideal para financiar sus campañas y alcanzar a miles de usuarios.",
    bestValueLabel: "Más Vendido ⭐",
    buyNowLabel: "Comprar Ahora 🚀"
  }
};

const lucideIconMap: Record<string, React.ComponentType<any>> = {
  Youtube,
  Facebook,
  Instagram,
  Flame,
  Sparkles,
  Coins,
  Eye,
  ThumbsUp,
  UserPlus,
  LifeBuoy,
  ArrowLeftRight,
  TrendingUp,
  ShieldCheck,
  Compass,
  Send,
  Globe,
  ExternalLink,
  Pin
};

function getIconComponent(iconName: string) {
  return lucideIconMap[iconName] || HelpCircle;
}

const premiumServicesList = [
  {
    id: "youtube-views",
    tabId: "views",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: Eye,
    borderColor: "border-red-500/10 hover:border-red-500/40 hover:shadow-[0_8px_25px_rgba(239,68,68,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-red-500/10 text-red-500 border border-red-500/20",
    badgeLabel: { ar: "يوتيوب", en: "YouTube", fr: "YouTube", es: "YouTube" },
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/20",
    title: { ar: "مشاهدات يوتيوب", en: "YouTube Views", fr: "Vues YouTube", es: "Vistas de YouTube" },
    desc: {
      ar: "شاهد الفيديوهات المميزة للأعضاء لكسب نقاط تبادل حقيقية بشكل آمن.",
      en: "Watch premium member videos to claim authentic exchange points.",
      fr: "Regardez de superbes vidéos de membres pour collecter des points.",
      es: "Vea videos de alta retención para ganar recompensas inmediatas."
    }
  },
  {
    id: "youtube-subscribers",
    tabId: "subs",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: UserPlus,
    borderColor: "border-red-600/10 hover:border-red-600/40 hover:shadow-[0_8px_25px_rgba(220,38,38,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-red-650/10 text-red-500 border border-red-600/20",
    badgeLabel: { ar: "يوتيوب", en: "YouTube", fr: "YouTube", es: "YouTube" },
    badgeBg: "bg-red-600/10 text-red-400 border-red-600/20",
    title: { ar: "اشتراكات يوتيوب", en: "YouTube Subscribers", fr: "Abonnés YouTube", es: "Suscriptores de YouTube" },
    desc: {
      ar: "اشترك في القنوات المقترحة لتكبير قاعدة متابعيك بالمنصة مجاناً.",
      en: "Subscribe to active channels to grow mutual subscriptions.",
      fr: "Abonnez-vous à des chaînes actives pour booster l'engagement.",
      es: "Suscríbase a canales recomendados para potenciar su alcance."
    }
  },
  {
    id: "youtube-likes",
    tabId: "likes",
    points: { ar: "كسب 40ن+", en: "Earn +40P", fr: "+40 Pts", es: "+40 Pts" },
    icon: ThumbsUp,
    borderColor: "border-red-400/10 hover:border-red-400/40 hover:shadow-[0_8px_25px_rgba(248,113,113,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-red-400/10 text-red-450 border border-red-400/20",
    badgeLabel: { ar: "يوتيوب", en: "YouTube", fr: "YouTube", es: "YouTube" },
    badgeBg: "bg-red-400/10 text-red-450 border-red-400/20",
    title: { ar: "لايكات يوتيوب", en: "YouTube Likes", fr: "Likes YouTube", es: "Me Gusta de YouTube" },
    desc: {
      ar: "تفاعل بوضع لايكات لفيديوهات يوتيوب المنوعة للحصول على إعجابات.",
      en: "Interact by liking diverse YouTube videos to gain rewards easily.",
      fr: "Interagissez en aimant des vidéos pour obtenir des points.",
      es: "Dé me gusta a videos interesantes para ganar puntos hoy."
    }
  },
  {
    id: "facebook-follow",
    tabId: "fb_follows",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: UserPlus,
    borderColor: "border-blue-600/10 hover:border-blue-600/40 hover:shadow-[0_8px_25px_rgba(37,99,235,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-blue-600/10 text-blue-500 border border-blue-600/20",
    badgeLabel: { ar: "فيسبوك", en: "Facebook", fr: "Facebook", es: "Facebook" },
    badgeBg: "bg-blue-600/10 text-blue-400 border-blue-600/20",
    title: { ar: "متابعات فيسبوك", en: "Facebook Followers", fr: "Abonnés Facebook", es: "Seguidores de Facebook" },
    desc: {
      ar: "تابع حسابات وصفحات فيسبوك المقترحة لكسب نقاط ترويجية فورية.",
      en: "Follow proposed Facebook channels and profiles to earn points.",
      fr: "Suivez des chaînes et profils Facebook pour gagner des points.",
      es: "Siga perfiles de Facebook sugeridos para ganar créditos al instante."
    }
  },
  {
    id: "facebook-likes",
    tabId: "fb_likes",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: ThumbsUp,
    borderColor: "border-blue-500/10 hover:border-blue-500/40 hover:shadow-[0_8px_25px_rgba(59,130,246,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
    badgeLabel: { ar: "فيسبوك", en: "Facebook", fr: "Facebook", es: "Facebook" },
    badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    title: { ar: "لايكات فيسبوك", en: "Facebook Likes", fr: "Likes Facebook", es: "Me Gusta de Facebook" },
    desc: {
      ar: "تفاعل بوضع لايكات للمنشورات والصور لكسب رصيد دعم عالي.",
      en: "Like Facebook updates and photos to claim solid growth assets.",
      fr: "Aimez des publications Facebook pour booster votre solde.",
      es: "Reaccione a publicaciones de Facebook para obtener recompensas."
    }
  },
  {
    id: "instagram-follow",
    tabId: "ig_follows",
    points: { ar: "كسب 40ن+", en: "Earn +40P", fr: "+40 Pts", es: "+40 Pts" },
    icon: UserPlus,
    borderColor: "border-pink-500/10 hover:border-pink-500/40 hover:shadow-[0_8px_25px_rgba(236,72,153,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-pink-500/10 text-pink-500 border border-pink-500/20",
    badgeLabel: { ar: "انستغرام", en: "Instagram", fr: "Instagram", es: "Instagram" },
    badgeBg: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    title: { ar: "متابعات انستجرام", en: "Instagram Followers", fr: "Abonnés Instagram", es: "Seguidores de Instagram" },
    desc: {
      ar: "تابع حسابات انستغرام وتصفح باقات الأصدقاء لتبادل المتابعات.",
      en: "Follow visual creators on Instagram to grow your reach globally.",
      fr: "Suivez des comptes Instagram de qualité pour échanger des abonnés.",
      es: "Siga creadores visuales destacados para intercambiar seguidores."
    }
  },
  {
    id: "instagram-likes",
    tabId: "ig_likes",
    points: { ar: "كسب 45ن+", en: "Earn +45P", fr: "+45 Pts", es: "+45 Pts" },
    icon: ThumbsUp,
    borderColor: "border-pink-400/10 hover:border-pink-400/40 hover:shadow-[0_8px_25px_rgba(244,63,94,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-pink-400/10 text-pink-400 border border-pink-400/20",
    badgeLabel: { ar: "انستغرام", en: "Instagram", fr: "Instagram", es: "Instagram" },
    badgeBg: "bg-pink-400/10 text-pink-400 border-pink-400/20",
    title: { ar: "لايكات انستجرام", en: "Instagram Likes", fr: "Likes Instagram", es: "Me Gusta de Instagram" },
    desc: {
      ar: "أعرب عن إعجابك ببوستات وريلز انستقرام لكسب نقاط دعم دقيقة.",
      en: "React with likes to amazing posts and Reels to collect support points.",
      fr: "Aimez des publications et des Reels pour cumuler des points.",
      es: "Dé me gusta a fotos y reels sensacionales para juntar puntos."
    }
  },
  {
    id: "tiktok-follow",
    tabId: "tiktok_follows",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: UserPlus,
    borderColor: "border-teal-500/10 hover:border-teal-500/40 hover:shadow-[0_8px_25px_rgba(20,184,166,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-teal-500/10 text-teal-400 border border-teal-500/20",
    badgeLabel: { ar: "تيك توك", en: "TikTok", fr: "TikTok", es: "TikTok" },
    badgeBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    title: { ar: "متابعات تيك توك", en: "TikTok Followers", fr: "Abonnés TikTok", es: "Seguidores de TikTok" },
    desc: {
      ar: "نمّ حركة المتابعين المعجبين ببروفايلات تيك توك للحصول على دعم.",
      en: "Boost your TikTok profile with real followers using rapid mutual actions.",
      fr: "Développez votre profil TikTok avec de véritables abonnés.",
      es: "Incremente sus seguidores de TikTok con interacciones rápidas."
    }
  },
  {
    id: "tiktok-likes",
    tabId: "tiktok_likes",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: Flame,
    borderColor: "border-teal-400/10 hover:border-teal-400/40 hover:shadow-[0_8px_25px_rgba(45,212,191,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-teal-400/10 text-teal-400 border border-teal-400/20",
    badgeLabel: { ar: "تيك توك", en: "TikTok", fr: "TikTok", es: "TikTok" },
    badgeBg: "bg-teal-400/10 text-teal-400 border-teal-400/20",
    title: { ar: "لايكات تيك توك", en: "TikTok Likes", fr: "Likes TikTok", es: "Me Gusta de TikTok" },
    desc: {
      ar: "ضع قلوباً حقيقية لمقاطع التيك توك لرفع التفاعل وحركة الإكسبلور.",
      en: "Deliver real hearts to tell the TikTok algorithm to trigger trends.",
      fr: "Envoyez des cœurs sur vos courtes vidéos créatives sur TikTok.",
      es: "Regale reacciones de corazón para potenciar el alcance de videos."
    }
  },
  {
    id: "x-follow",
    tabId: "x_follow",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: UserPlus,
    borderColor: "border-slate-700/15 hover:border-slate-500/40 hover:shadow-[0_8px_25px_rgba(148,163,184,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-slate-800 text-slate-300 border border-slate-700/60",
    badgeLabel: { ar: "إكس (X)", en: "X Platform", fr: "Plateforme X", es: "Plataforma X" },
    badgeBg: "bg-slate-805/85 text-slate-300 border-slate-700/65",
    title: { ar: "متابعات إكس (تويتر)", en: "X (Twitter) Followers", fr: "Abonnés X", es: "Seguidores de X" },
    desc: {
      ar: "تابع حسابات الآخرين على منصة إكس لكسب رصيد تبادل مميز.",
      en: "Follow active profiles on X Platform to claim quality exchange assets.",
      fr: "Suivez des comptes sur X pour réclamer des points d'échange.",
      es: "Siga perfiles activos en la plataforma X para ganar créditos."
    }
  },
  {
    id: "x-like",
    tabId: "x_like",
    points: { ar: "كسب 50ن+", en: "Earn +50P", fr: "+50 Pts", es: "+50 Pts" },
    icon: ThumbsUp,
    borderColor: "border-slate-600/15 hover:border-slate-400/45 hover:shadow-[0_8px_25px_rgba(203,213,225,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-slate-700 text-slate-200 border border-slate-600/60",
    badgeLabel: { ar: "إكس (X)", en: "X Platform", fr: "Plateforme X", es: "Plataforma X" },
    badgeBg: "bg-slate-805/85 text-slate-300 border-slate-705/65",
    title: { ar: "لايكات إكس (تويتر)", en: "X (Twitter) Likes", fr: "Likes X (Twitter)", es: "Me Gusta de X" },
    desc: {
      ar: "ضع لايكات لمنشورات الأعضاء التفاعلية على منصة إكس لكسب نقاط ترويج سريعة.",
      en: "Like interactive member updates and tweets on X to collect points instantly.",
      fr: "Interagissez en aimant des publications sur X pour obtenir des points.",
      es: "Reaccione con me gusta a publicaciones en X para ganar créditos rápido."
    }
  },
  {
    id: "pinterest-follow",
    tabId: "pinterest_follow",
    points: { ar: "كسب 40ن+", en: "Earn +40P", fr: "+40 Pts", es: "+40 Pts" },
    icon: Pin,
    borderColor: "border-red-500/10 hover:border-red-500/40 hover:shadow-[0_8px_25px_rgba(239,68,68,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-red-500/10 text-red-500 border border-red-500/20",
    badgeLabel: { ar: "بنترست", en: "Pinterest", fr: "Pinterest", es: "Pinterest" },
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/20",
    title: { ar: "متابعة بنترست", en: "Pinterest Follow", fr: "Abonnés Pinterest", es: "Seguidores de Pinterest" },
    desc: {
      ar: "تابع حسابات ولوحات الأعضاء على بنترست لجمع نقاط مكافأة حقيقية وسهلة.",
      en: "Follow active pins boards and profiles of other members to earn points.",
      fr: "Suivez des profils et tableaux Pinterest pour accumuler des récompenses.",
      es: "Siga tableros y perfiles en Pinterest para obtener créditos de intercambio."
    }
  },
  {
    id: "pinterest-like",
    tabId: "pinterest_like",
    points: { ar: "كسب 40ن+", en: "Earn +40P", fr: "+40 Pts", es: "+40 Pts" },
    icon: ThumbsUp,
    borderColor: "border-rose-500/10 hover:border-rose-500/40 hover:shadow-[0_8px_25px_rgba(244,63,94,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-red-500/10 text-rose-550 border border-red-500/20",
    badgeLabel: { ar: "بنترست", en: "Pinterest", fr: "Pinterest", es: "Pinterest" },
    badgeBg: "bg-red-500/10 text-red-400 border-red-500/20",
    title: { ar: "لايك بنترست", en: "Pinterest Like", fr: "Likes Pinterest", es: "Me Gusta de Pinterest" },
    desc: {
      ar: "تفاعل بوضع الإعجابات وتفاعل Saves لدبابيس بنترست للحصول على نقاط دعم.",
      en: "React with likes and saves on Pinterest Pins to retrieve point payouts.",
      fr: "Aimez et sauvegardez des épingles d'autres membres pour gagner.",
      es: "Dé liked y guardados a pines sugeridos para sumar puntos hoy."
    }
  },
  {
    id: "website-traffic",
    tabId: "website_views",
    points: { ar: "كسب 60ن+", en: "Earn +60P", fr: "+60 Pts", es: "+60 Pts" },
    icon: Globe,
    borderColor: "border-emerald-500/10 hover:border-emerald-500/40 hover:shadow-[0_8px_25px_rgba(16,185,129,0.12)] bg-slate-950/20 backdrop-blur-md",
    iconBg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    badgeLabel: { ar: "زيارات المواقع", en: "Web Traffic", fr: "Trafic Web", es: "Tráfico Web" },
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    title: { ar: "مشاهدة وزيارة المواقع", en: "Website Views", fr: "Visites de Sites", es: "Visitas de Sitios" },
    desc: {
      ar: "زيارة المواقع الشريكة وتصفح المدونات لكسب رصيد رائع.",
      en: "Browse verified sponsor secure pages and blogs with duration counters.",
      fr: "Visitez et explorez des blogs partenaires qualitatifs.",
      es: "Navega de forma segura por portales verificados con cronometro."
    }
  }
];

export default function HomePortal({ user, onSelectTab, lang = 'en' }: HomePortalProps) {
  const userCampaigns = db.getCampaigns().filter(c => c.creatorId === user.uid);
  const activeCampaignsCount = userCampaigns.filter(c => c.status === 'active').length;

  const t = homeTranslations[lang] || homeTranslations['en'];
  const isRtl = lang === 'ar';

  const adminSettings = db.getAdminSettings();
  const renderedPackages = adminSettings.purchasePackages && adminSettings.purchasePackages.length > 0
    ? adminSettings.purchasePackages.map(p => ({
        id: p.id,
        name: { ar: p.name, en: p.name, fr: p.name, es: p.name },
        points: { 
          ar: `${p.points.toLocaleString()} نقطة`, 
          en: `${p.points.toLocaleString()} Points`, 
          fr: `${p.points.toLocaleString()} Points`, 
          es: `${p.points.toLocaleString()} Puntos` 
        },
        price: `$${p.price.toFixed(2)}`,
        features: {
          ar: p.features || ["دعم فني عالي الأولوية", "نقاط لا تنتهي وصالحة للأبد", "إطلاق حملات تفاعل غير محدودة"],
          en: p.features || ["Priority customer support", "Lifetime points validity", "Unlimited custom campaigns"],
          fr: p.features || ["Support client prioritaire", "Validité des points à vie", "Campagnes sur mesure illimitées"],
          es: p.features || ["Soporte al cliente prioritario", "Puntos sin vencimiento", "Campañas personalizadas ilimitadas"]
        },
        badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        glowColor: "group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] hover:border-amber-500/40",
        btnColorBg: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20",
        isBestValue: p.price >= 10 && p.price <= 18
      }))
    : pricingPackages.map(p => ({
        id: p.id,
        name: p.name,
        points: {
          ar: `${p.points.toLocaleString()} نقطة`,
          en: `${p.points.toLocaleString()} Points`,
          fr: `${p.points.toLocaleString()} Points`,
          es: `${p.points.toLocaleString()} Puntos`
        },
        price: `$${p.price.toFixed(2)}`,
        features: p.features,
        badgeColor: p.badgeColor,
        glowColor: p.glowColor,
        btnColorBg: p.btnColorBg,
        isBestValue: p.isBestValue
      }));

  const [services, setServices] = React.useState<any[]>([]);

  React.useEffect(() => {
    let active = true;

    // Local synchronous fallback list to render instantly before async API fetch finishes
    const fallbackServices = [
      {
        category: lang === 'ar' ? 'منصة اليوتيوب (YouTube)' : 'YouTube Platform',
        color: 'from-red-650/15 to-red-600/5 border-red-500/20 text-red-500 hover:border-red-500/50',
        badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
        icon: Youtube,
        items: [
          { 
            id: 'views', 
            label: lang === 'ar' ? 'مشاهدات يوتيوب حقيقية' : 'YouTube Real Views', 
            desc: lang === 'ar' ? 'تبادل فترات بقاء حقيقية لمشاهدات الفيديوهات لتصدر نتائج البحث' : 'Exchange watch-time actions to excel in recommendation algorithms', 
            icon: Eye, 
            points: lang === 'ar' ? 'كسب 50+ ن' : 'Earn +50P' 
          },
          { 
            id: 'subs', 
            label: lang === 'ar' ? 'اشتراكات قنوات يوتيوب' : 'YouTube Channel Subs', 
            desc: lang === 'ar' ? 'قنوات مقترحة للأعضاء لكسب المشتركين بشكل طبيعي وآمن' : 'Recommended quality channels for users to subscribe naturally', 
            icon: UserPlus, 
            points: lang === 'ar' ? 'كسب 50ن' : 'Earn +50P' 
          },
          { 
            id: 'likes', 
            label: lang === 'ar' ? 'لايكات وإعجابات يوتيوب' : 'YouTube Video Likes', 
            desc: lang === 'ar' ? 'زيادة تفاعلات الإعجاب بالفيديو وتحسين التقييم والمقترحات' : 'Get genuine likes on your public videos to satisfy parameters', 
            icon: ThumbsUp, 
            points: lang === 'ar' ? 'كسب 40ن' : 'Earn +40P' 
          }
        ]
      },
      {
        category: lang === 'ar' ? 'تبادل زيارات المواقع (Traffic Exchange)' : 'Website Traffic Exchange',
        color: 'from-indigo-650/15 to-indigo-600/5 border-indigo-500/20 text-indigo-400 hover:border-indigo-500/50',
        badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        icon: Globe,
        items: [
          {
            id: 'website_views',
            label: lang === 'ar' ? 'مشاهدة المواقع وزيارتها' : 'Browse Websites & Earn',
            desc: lang === 'ar' ? 'تصفح وزيارة مواقع الرعاية الموثوقة للحصول على نقاط ترويجية' : 'Browse sponsor websites to accumulate promotional points and rewards',
            icon: ExternalLink,
            points: lang === 'ar' ? 'كسب 30-240 ن' : 'Earn 30-240P'
          }
        ]
      }
    ];

    setServices(fallbackServices);

    // Fetch dynamic platforms from the REST backend endpoint
    fetch('/api/platforms')
      .then(res => res.json())
      .then(data => {
        if (active && Array.isArray(data)) {
          const formatted = data.map(platform => ({
            category: lang === 'ar' ? platform.categoryAr :
                      lang === 'fr' ? platform.categoryFr :
                      lang === 'es' ? platform.categoryEs : platform.categoryEn,
            color: platform.color,
            badgeColor: platform.badgeColor,
            icon: getIconComponent(platform.iconName),
            items: platform.items.map((item: any) => ({
              id: item.id,
              label: lang === 'ar' ? item.labelAr :
                     lang === 'fr' ? item.labelFr :
                     lang === 'es' ? item.labelEs : item.labelEn,
              desc: lang === 'ar' ? item.descAr :
                    lang === 'fr' ? item.descFr :
                    lang === 'es' ? item.descEs : item.descEn,
              icon: getIconComponent(item.iconName),
              points: lang === 'ar' ? item.pointsAr :
                      lang === 'fr' ? item.pointsFr :
                      lang === 'es' ? item.pointsEs : item.pointsEn
            }))
          }));
          setServices(formatted);
        }
      })
      .catch(err => {
        console.error("Failed to dynamically load active platforms list:", err);
      });

    return () => {
      active = false;
    };
  }, [lang]);

  return (
    <div className="space-y-10 py-2 relative" dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* GLOWING AMBIENT BACKGROUND DECORATIONS */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* HERO BANNER */}
      <div className={`relative rounded-3xl overflow-hidden bg-gradient-to-l from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center gap-8 ${isRtl ? 'text-right' : 'text-left'}`}>
        
        {/* Dynamic mesh border light */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-cyan-500 opacity-60"></div>
        
        {/* Texts */}
        <div className="flex-1 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-indigo-500/10 text-indigo-400 font-extrabold text-xs px-3.5 py-1.5 rounded-full border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
            <span>{t.heroBadge}</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {t.welcomeBack} <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">SocialXchange</span> 🎉
          </h1>
          
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl font-medium">
            {t.platformDesc}
          </p>

          <div className={`flex flex-wrap gap-3 pt-2 ${isRtl ? 'justify-start' : 'justify-start'}`}>
            <button
              onClick={() => onSelectTab('ad')}
              className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-500/15 flex items-center gap-2 duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{t.launchCampaignBtn}</span>
            </button>
            <button
              onClick={() => onSelectTab('buy')}
              className="py-3 px-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-black text-xs rounded-xl duration-200 cursor-pointer flex items-center gap-2"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>{t.buyPointsBtn}</span>
            </button>
          </div>
        </div>

        {/* User Card Showcase */}
        <div className={`w-full md:w-80 shrink-0 bg-slate-950/60 backdrop-blur-md border border-slate-800/80 p-6 rounded-2xl space-y-5 relative overflow-hidden ${isRtl ? 'text-right' : 'text-left'}`}>
          <div className={`absolute top-0 bg-indigo-500/10 text-[9px] font-black text-indigo-400 px-3 py-1 border-indigo-500/10 ${isRtl ? 'left-0 rounded-br-2xl border-r border-b' : 'right-0 rounded-bl-2xl border-l border-b'}`}>
            {t.profileTitle}
          </div>
          
          <div className={`flex items-center gap-3.5 pb-4 border-b border-slate-900 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <img 
              src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'} 
              alt={user.displayName} 
              className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900 shadow-md shadow-indigo-500/5 object-cover"
            />
            <div className="overflow-hidden">
              <h4 className="font-extrabold text-white text-sm truncate">{user.displayName}</h4>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900/80">
              <p className="text-[9px] text-slate-500 font-bold mb-0.5">{t.pointsBalanceLabel}</p>
              <p className={`text-sm font-black text-amber-500 flex items-center gap-1 font-mono ${isRtl ? 'justify-end' : 'justify-start'}`}>
                {user.points.toLocaleString()}
                <Coins className="w-3.5 h-3.5" />
              </p>
            </div>
            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900/80">
              <p className="text-[9px] text-slate-500 font-bold mb-0.5">{t.activeCampaignsLabel}</p>
              <p className="text-sm font-black text-indigo-400 font-mono">
                {activeCampaignsCount} <span className="text-[9px] text-slate-500 font-normal">{t.outOf} {userCampaigns.length}</span>
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* CORE FEATURES STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
          <div className="p-3 bg-red-500/10 text-red-500 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white mb-1">{t.feat1Title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t.feat1Desc}
            </p>
          </div>
        </div>

        <div className={`bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white mb-1">{t.feat2Title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t.feat2Desc}
            </p>
          </div>
        </div>

        <div className={`bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex items-start gap-4 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white mb-1">{t.feat3Title}</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {t.feat3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* PREMIUM INTERACTIVE SERVICES GRID */}
      <div className="space-y-6">
        <div className={`p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-indigo-950/10 border border-slate-800/80 flex flex-col md:flex-row items-center gap-4 justify-between ${isRtl ? 'md:flex-row-reverse text-right' : 'md:flex-row text-left'}`}>
          <div className="space-y-1.5 flex-1">
            <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}>
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <h3 className="text-base font-black text-white hover:text-indigo-400 transition-colors">
                {t.premiumServicesTitle}
              </h3>
            </div>
            <p className="text-[12px] text-slate-400 leading-relaxed max-w-2xl">
              {t.premiumServicesDesc}
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono">
            <div className="flex -space-x-2 overflow-hidden rtl:space-x-reverse">
              <span className="inline-block h-8 w-8 rounded-full border-2 border-slate-900 bg-red-650 flex items-center justify-center text-xs font-bold text-white">Y</span>
              <span className="inline-block h-8 w-8 rounded-full border-2 border-slate-900 bg-blue-600 flex items-center justify-center text-xs font-bold text-white">F</span>
              <span className="inline-block h-8 w-8 rounded-full border-2 border-slate-900 bg-pink-500 flex items-center justify-center text-xs font-bold text-white">I</span>
              <span className="inline-block h-8 w-8 rounded-full border-2 border-slate-900 bg-teal-500 flex items-center justify-center text-xs font-bold text-white">T</span>
              <span className="inline-block h-8 w-8 rounded-full border-2 border-slate-900 bg-slate-850 flex items-center justify-center text-xs font-bold text-white">X</span>
            </div>
            <span className="text-[10px] text-indigo-400 font-extrabold bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
              100% Real Traffic
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {premiumServicesList.map((service) => {
            const IconComp = service.icon;
            const pointsVal = service.points[lang] || service.points['en'];
            const titleVal = service.title[lang] || service.title['en'];
            const descVal = service.desc[lang] || service.desc['en'];
            const bVal = service.badgeLabel[lang] || service.badgeLabel['en'];

            return (
              <button
                key={service.id}
                onClick={() => onSelectTab(service.tabId)}
                className={`group relative text-right flex flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/40 to-slate-950 p-5 border text-slate-100 ${service.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {/* Decorative hover glow */}
                <span className="absolute top-0 right-0 h-[2px] w-0 bg-gradient-to-l from-indigo-500 to-purple-500 group-hover:w-full transition-all duration-500" />
                
                <div className="w-full">
                  <div className={`flex items-center justify-between mb-3.5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${service.badgeBg}`}>
                      {bVal}
                    </span>
                    <span className="text-[10px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full flex items-center gap-1 font-mono">
                      {pointsVal}
                      <Coins className="w-3 h-3 text-amber-400" />
                    </span>
                  </div>

                  <div className={`flex items-start gap-3 mb-2.5 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`p-2.5 rounded-xl border border-slate-800 shrink-0 ${service.iconBg}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className={isRtl ? 'text-right' : 'text-left'}>
                      <h4 className="text-xs font-black text-white group-hover:text-indigo-400 transition-colors">
                        {titleVal}
                      </h4>
                    </div>
                  </div>

                  <p className={`text-[11px] text-slate-500 leading-normal mb-2 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {descVal}
                  </p>
                </div>

                <div className={`w-full pt-2.5 mt-2 border-t border-slate-900/60 flex items-center justify-between ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[9px] text-slate-600 font-bold tracking-wider uppercase">
                    ID: {service.id}
                  </span>
                  <span className="text-[10px] text-indigo-400 font-extrabold group-hover:underline flex items-center gap-1">
                    {lang === 'ar' ? 'ابدأ الآن 🚀' : 'Start Exchange 🚀'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SERVICES HUB SECTIONS */}
      <div className="space-y-8">
        <div className={`border-b border-slate-850 pb-3 flex items-center justify-between gap-4 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
            <Coins className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-black text-white">{t.purchasePackagesTitle}</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-bold bg-slate-900 border border-slate-850 px-3.5 py-1 rounded-full text-center">
            {t.purchasePackagesDesc}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">
          {renderedPackages.map((pack) => {
            const isBestValue = pack.isBestValue;
            const featuresList = pack.features[lang] || pack.features['en'] || [];
            return (
              <div
                key={pack.id}
                className={`group relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-slate-900/30 backdrop-blur-xl border ${
                  isBestValue
                    ? 'border-amber-500/50 bg-slate-900/80 sm:scale-[1.02] lg:scale-[1.04] z-10 shadow-[0_0_35px_rgba(245,158,11,0.12)]'
                    : 'border-slate-850 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]'
                }`}
              >
                {/* Visual Ambient Light glow backdrops */}
                <div className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl rounded-full pointer-events-none group-hover:from-indigo-500/20 duration-300`} />
                
                {isBestValue && (
                  <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-full border border-amber-400/20 uppercase tracking-wide flex items-center gap-1 shadow-md shadow-amber-500/25`}>
                    {t.bestValueLabel}
                  </div>
                )}

                <div className="space-y-5">
                  <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                    {/* Package Name Badge */}
                    <span className={`inline-block text-[10px] uppercase font-black px-2.5 py-1 rounded-full border mb-3 ${pack.badgeColor}`}>
                      {pack.name[lang] || pack.name['en']}
                    </span>

                    {/* Points Count */}
                    <h3 className="text-xl font-black text-white leading-tight flex items-center gap-1.5 pt-1">
                      <Coins className="w-5 h-5 text-amber-500 shrink-0" />
                      <span>{pack.points[lang] || pack.points['en']}</span>
                    </h3>
                  </div>

                  {/* Price info block */}
                  <div className={`flex items-baseline gap-1 py-1.5 border-b border-slate-850 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">{pack.price}</span>
                    <span className="text-[10px] text-slate-500 font-bold">/ {lang === 'ar' ? 'دفعة واحدة' : 'one-time'}</span>
                  </div>

                  {/* Hand-crafted features list */}
                  <ul className="space-y-2.5 pt-1">
                    {featuresList.map((feat: string, fIndex: number) => (
                      <li key={fIndex} className={`flex items-start gap-2 text-xs text-slate-400 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                        <div className={`mt-0.5 p-0.5 rounded-full ${isBestValue ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20'} shrink-0`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="leading-relaxed font-semibold text-slate-300 text-[11px]">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Purchase Trigger Button */}
                <button
                  onClick={() => onSelectTab('buy')}
                  className={`w-full py-3 px-4 rounded-xl mt-6 text-xs text-white font-black text-center duration-200 cursor-pointer shadow-lg transition-all border border-transparent ${pack.btnColorBg}`}
                >
                  {t.buyNowLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* QUICK SERVICES & DECK BUILDER LINK */}
      <div className={`bg-gradient-to-tr from-slate-900 to-indigo-950/20 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 ${isRtl ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}>
        <div className="space-y-1">
          <h3 className="text-sm font-extrabold text-white">{t.supportSectionTitle}</h3>
          <p className="text-xs text-slate-500 leading-normal max-w-xl">
            {t.supportSectionDesc}
          </p>
        </div>

        <button
          onClick={() => onSelectTab('support')}
          className="w-full md:w-auto py-2.5 px-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-extrabold text-xs rounded-xl shadow transition duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <LifeBuoy className="w-4 h-4" />
          <span>{t.supportContactBtn}</span>
        </button>
      </div>

    </div>
  );
}
