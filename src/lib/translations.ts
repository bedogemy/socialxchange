export type SupportedLanguages = 'ar' | 'en' | 'fr' | 'es';

export interface TranslationDictionary {
  langLabel: string;
  brand: string;
  platformDesc: string;
  points: string;
  pointsSuffix: string;
  balanceLabel: string;
  logout: string;
  adminControl: string;
  activeCampaigns: string;
  warningRealUsers: string;
  
  // Tabs
  tabAd: string;
  tabViews: string;
  tabWebsiteViews: string;
  tabSubs: string;
  tabLikes: string;
  tabFbLikes: string;
  tabFbFollows: string;
  tabIgFollows: string;
  tabIgLikes: string;
  tabTtFollows: string;
  tabTtLikes: string;
  tabXFollow: string;
  tabXLikes: string;
  tabTgJoin: string;
  tabBuy: string;
  tabSupport: string;

  // Header Titles
  headerViewsExchange: string;
  headerWebsiteViewsExchange: string;
  headerSubsExchange: string;
  headerLikesExchange: string;
  headerFbLikesExchange: string;
  headerFbFollowsExchange: string;
  headerIgFollowsExchange: string;
  headerIgLikesExchange: string;
  headerTtFollowsExchange: string;
  headerTtLikesExchange: string;
  headerXFollowExchange: string;
  headerXLikesExchange: string;
  headerTgJoinExchange: string;
  headerAdSetup: string;
  headerBuyPoints: string;
  headerSupport: string;
  headerAdminPanel: string;

  // Footer
  footerCopyright: string;
  footerDisclaimer: string;
}

export const translations: Record<SupportedLanguages, TranslationDictionary> = {
  ar: {
    langLabel: 'العربية',
    brand: 'SocialXchange',
    platformDesc: 'المنصة الرائدة لتبادل الدعم وتنشيط حسابات وقنوات السوشيال ميديا',
    points: 'نقطة',
    pointsSuffix: 'ن',
    balanceLabel: 'رصيدك الحالي',
    logout: 'تسجيل الخروج',
    adminControl: 'غرفة التحكم',
    activeCampaigns: 'مراقبة حملاتك الإعلانية الحالية',
    warningRealUsers: 'تنبيه: جميع التفاعلات والاشتراكات تتم بأيدي مستخدمين حقيقيين 100% بنظام حماية ضد البوتات.',
    
    tabAd: 'إطلاق حملة جديدة',
    tabViews: 'مشاهدة يوتيوب',
    tabWebsiteViews: 'مشاهدة المواقع',
    tabSubs: 'اشتراك يوتيوب',
    tabLikes: 'لايك يوتيوب',
    tabFbLikes: 'لايك فيسبوك',
    tabFbFollows: 'متابعة فيسبوك',
    tabIgFollows: 'متابعة انستجرام',
    tabIgLikes: 'لايك انستجرام',
    tabTtFollows: 'متابعة تيك توك',
    tabTtLikes: 'لايك تيك توك',
    tabXFollow: 'متابعة إكس (X)',
    tabXLikes: 'لايك إكس (X)',
    tabTgJoin: 'اشتراك تليجرام',
    tabBuy: 'شراء نقاط',
    tabSupport: 'الدعم الفني والآراء',

    headerViewsExchange: 'لوحة تبادل المشاهدات والزيارات للفت الانتباه',
    headerWebsiteViewsExchange: 'لوحة تصفح المواقع الإلكترونية والزيارات المباشرة',
    headerSubsExchange: 'قنوات يوتيوب المقترحة للأعضاء للاشتراك بالحب',
    headerLikesExchange: 'تبادل لايكات وإعجابات يوتيوب لرفع التقييم',
    headerFbLikesExchange: 'تبادل لايكات وتفاعلات منشورات فيسبوك الحقيقية',
    headerFbFollowsExchange: 'تبادل متابعات وإعجابات صفحات فيسبوك الآمنة',
    headerIgFollowsExchange: 'تبادل فولو ومتابعات انستجرام لنمو الجمهور',
    headerIgLikesExchange: 'تبادل لايكات وإعجابات منشورات انستجرام',
    headerTtFollowsExchange: 'تبادل فولو ومتابعات بروفايل تيك توك ومضاعفة الشهرة',
    headerTtLikesExchange: 'تبادل لايكات وتفاعل منشورات تيك توك النشيطة',
    headerXFollowExchange: 'تبادل متابعات واشتراكات حسابات إكس لتعزيز التواجد الرقمي',
    headerXLikesExchange: 'تبادل لايكات وتفاعلات منشورات إكس لرفع النطاق مجاناً',
    headerTgJoinExchange: 'تبادل اشتراكات وانضمامات قنوات ومجموعات تليجرام',
    headerAdSetup: 'تجهيز وإطلاق حملة تسويقية لقناتك وحسابك',
    headerBuyPoints: 'باقات الشراء ونقاط الدعم السريع بالعملات الرقمية',
    headerSupport: 'قسم الدعم الفني، تقييمات الأعضاء وتقديم الشكاوى والمقترحات',
    headerAdminPanel: 'غرفة تحكم ومراقبة الإدارة الكاملة',

    footerCopyright: '© 2026 SocialXchange - منصة تبادل الدعم وتنشيط السوشيال ميديا',
    footerDisclaimer: 'تنبيه: جميع التفاعلات والاشتراكات تتم بأيدي مستخدمين حقيقيين 100% بنظام حماية ضد البوتات والتحايل.'
  },
  en: {
    langLabel: 'English',
    brand: 'SocialXchange',
    platformDesc: 'Social Media & Networks Engagement Exchange Platform',
    points: 'Points',
    pointsSuffix: 'P',
    balanceLabel: 'Your Balance',
    logout: 'Sign Out',
    adminControl: 'Admin Panel',
    activeCampaigns: 'Monitor Your Active Campaigns',
    warningRealUsers: 'Warning: All actions are performed by 100% real users under strict anti-cheat layers.',
    
    tabAd: 'Launch Campaign',
    tabViews: 'Watch & Earn',
    tabWebsiteViews: 'Website Views',
    tabSubs: 'Subscribe & Earn',
    tabLikes: 'Like & Earn',
    tabFbLikes: 'FB Likes',
    tabFbFollows: 'FB Follows',
    tabIgFollows: 'IG Follows',
    tabIgLikes: 'IG Likes',
    tabTtFollows: 'TikTok Follows',
    tabTtLikes: 'TikTok Likes',
    tabXFollow: 'X (Twitter) Follows',
    tabXLikes: 'X (Twitter) Likes',
    tabTgJoin: 'Telegram Subs',
    tabBuy: 'Buy Points',
    tabSupport: 'Support & Feedback',

    headerViewsExchange: 'YouTube Views & Traffic Exchange Board',
    headerWebsiteViewsExchange: 'Websites Traffic & Viewing Exchange Board',
    headerSubsExchange: 'Suggested YouTube Channels to Subscribe & Support',
    headerLikesExchange: 'YouTube Video Likes Exchange to Boost Ranking',
    headerFbLikesExchange: 'Real Facebook Likes & Reactions Exchange Hub',
    headerFbFollowsExchange: 'Direct Facebook Pages & Profiles Followers Exchange',
    headerIgFollowsExchange: 'Real Instagram Profile Followers & Growth Exchange',
    headerIgLikesExchange: 'Real Instagram Photo & Video Likes Boost',
    headerTtFollowsExchange: 'TikTok Real Profiles Followers & Growth Platform',
    headerTtLikesExchange: 'TikTok Post Likes & Video Hearts Engagement Board',
    headerXFollowExchange: 'X (Twitter) Active Followers & Growth Exchange',
    headerXLikesExchange: 'X (Twitter) Post Likes & Interaction Boost Panel',
    headerTgJoinExchange: 'Real Telegram Channels & Groups Subscription Exchange',
    headerAdSetup: 'Configure & Launch Media Campaign to Boost Your Audience',
    headerBuyPoints: 'Fast Cryptocurrencies Secure Channels to Top Up Points',
    headerSupport: 'Technical Support Helpdesk, User Reviews & Complaint Center',
    headerAdminPanel: 'Master Administrator Secure Dashboard Panel',

    footerCopyright: '© 2026 SocialXchange - Social Growth & Support Network',
    footerDisclaimer: 'Disclaimer: All subscriptions and reactions are generated by 100% real human members under anti-fraud audit.'
  },
  fr: {
    langLabel: 'Français',
    brand: 'SocialXchange',
    platformDesc: 'Plateforme de croissance et d\'échange d\'engagement sur les réseaux sociaux',
    points: 'Points',
    pointsSuffix: 'Pts',
    balanceLabel: 'Votre Solde',
    logout: 'Déconnexion',
    adminControl: 'Panneau Admin',
    activeCampaigns: 'Suivre vos campagnes actives',
    warningRealUsers: 'Attention: Toutes les interactions sont faites par de vrais utilisateurs avec anti-triche.',
    
    tabAd: 'Lancer Campagne',
    tabViews: 'Regarder & Gagner',
    tabWebsiteViews: 'Vues de Sites Web',
    tabSubs: 'S\'abonner & Gagner',
    tabLikes: 'Aimer & Gagner',
    tabFbLikes: 'Likes FB',
    tabFbFollows: 'Abonnés FB',
    tabIgFollows: 'Abonnés IG',
    tabIgLikes: 'Likes IG',
    tabTtFollows: 'Abonnés TikTok',
    tabTtLikes: 'Likes TikTok',
    tabXFollow: 'Suivre sur X (Twitter)',
    tabXLikes: 'Likes sur X (Twitter)',
    tabTgJoin: 'Abonnés Telegram',
    tabBuy: 'Acheter des Points',
    tabSupport: 'Support Technique',

    headerViewsExchange: 'Tableau d\'Échange de Vues et Trafic YouTube',
    headerWebsiteViewsExchange: 'Échange de Trafic et Vues de Sites Web',
    headerSubsExchange: 'Chaînes YouTube Recommandées à S\'abonner & Soutenir',
    headerLikesExchange: 'Échange de Mentions J\'aime Vidéos YouTube pour le Classement',
    headerFbLikesExchange: 'Centre d\'Échange de Vues & J\'aime Réels sur Facebook',
    headerFbFollowsExchange: 'Échange direct d\'Abonnements pour Pages & Profils Facebook',
    headerIgFollowsExchange: 'Croissance Réelle de Abonnés pour Profils Instagram',
    headerIgLikesExchange: 'Boost de J\'aime Réels pour Photos & Vidéos Instagram',
    headerTtFollowsExchange: 'Croissance Réelle de Abonnés TikTok et Notoriété Accrue',
    headerTtLikesExchange: 'Échange de Likes et Coeurs sur Publications TikTok réelles',
    headerXFollowExchange: 'Échange de abonnés de profils réels sur la plateforme X',
    headerXLikesExchange: 'Échange de likes réels sur vos publications et tweets de la plateforme X',
    headerTgJoinExchange: 'Échange d\'abonnés réels pour chaînes et groupes Telegram',
    headerAdSetup: 'Configurer & Lancer une Campagne pour Booster votre Audience',
    headerBuyPoints: 'Acheter des Points de Support avec Cryptomonnaies Sécurisées',
    headerSupport: 'Assistance Technique, Avis des Membres et Centre de Plaintes',
    headerAdminPanel: 'Panneau de Contrôle de l\'Administrateur Principal',

    footerCopyright: '© 2026 SocialXchange - Réseau d\'Échange Social',
    footerDisclaimer: 'Remarque: Toutes les actions et abonnements proviennent de vrais humains sous contrôle anti-fraude.'
  },
  es: {
    langLabel: 'Español',
    brand: 'SocialXchange',
    platformDesc: 'Plataforma para interactuar e intercambiar Me Gusta y seguidores sociales',
    points: 'Puntos',
    pointsSuffix: 'Pts',
    balanceLabel: 'Tu Saldo',
    logout: 'Cerrar Sesión',
    adminControl: 'Control Admin',
    activeCampaigns: 'Monitorear tus campañas activas',
    warningRealUsers: 'Aviso: Todas las interacciones provienen de usuarios 100% reales con medidas anti-trampas.',
    
    tabAd: 'Lanzar Campaña',
    tabViews: 'Ver y Ganar',
    tabWebsiteViews: 'Visitas de Sitios Web',
    tabSubs: 'Abonarse y Ganar',
    tabLikes: 'Dar Like y Ganar',
    tabFbLikes: 'Me gusta FB',
    tabFbFollows: 'Seguir en FB',
    tabIgFollows: 'Seguir en IG',
    tabIgLikes: 'Me gusta IG',
    tabTtFollows: 'Seguir en TikTok',
    tabTtLikes: 'Likes de TikTok',
    tabXFollow: 'Seguir en X (Twitter)',
    tabXLikes: 'Me gusta en X (Twitter)',
    tabTgJoin: 'Abonados Telegram',
    tabBuy: 'Comprar Puntos',
    tabSupport: 'Soporte Técnico',

    headerViewsExchange: 'Tabla de Intercambio de Vistas e Interacciones YouTube',
    headerWebsiteViewsExchange: 'Panel de Intercambio de Tráfico y Visitas Web',
    headerSubsExchange: 'Canales Recomendados de YouTube para Suscribirse y Apoyar',
    headerLikesExchange: 'Intercambio de Likes en Videos de YouTube para Posicionamiento',
    headerFbLikesExchange: 'Centro de Intercambio de Likes y Reacciones Reales en Facebook',
    headerFbFollowsExchange: 'Intercambio Directo de Seguidores para Páginas y Perfiles FB',
    headerIgFollowsExchange: 'Crecimiento de Seguidores Reales para Perfiles Instagram',
    headerIgLikesExchange: 'Impulso de Likes Reales en Fotos & Vídeos de Instagram',
    headerTtFollowsExchange: 'Crecimiento de Seguidores Reales de Cuentas de TikTok',
    headerTtLikesExchange: 'Intercambio de Likes y Corazones en Publicaciones de TikTok',
    headerXFollowExchange: 'Intercambio de seguidores reales y activos para redes X (Twitter)',
    headerXLikesExchange: 'Intercambio de Me Gusta y favoritos reales para posts de X (Twitter)',
    headerTgJoinExchange: 'Intercambio de seguidores reales para canales y grupos de Telegram',
    headerAdSetup: 'Preparar y Lanzar Campaña para Impulsar tus Redes Sociales',
    headerBuyPoints: 'Métodos Seguros en Criptomonedas para Carga de Puntos Rápida',
    headerSupport: 'Soporte de Ayuda Técnica, Opiniones de Usuarios y Reclamaciones',
    headerAdminPanel: 'Panel del Administrador de Control Principal',

    footerCopyright: '© 2026 SocialXchange - Red de Intercambio para Soporte Social',
    footerDisclaimer: 'Alerta: Todas las suscripciones e interacciones de la plataforma proceden de personas reales.'
  }
};
