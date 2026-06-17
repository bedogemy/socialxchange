import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../lib/db';
import { User } from '../types';
import { Share2, Loader2, AlertCircle, Mail, Lock, User as UserIcon, Eye, EyeOff, Shuffle, Coins, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile,
  signInAnonymously
} from 'firebase/auth';
import { SupportedLanguages } from '../lib/translations';
import { pricingPackages } from '../lib/pricing';

const authTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    adminSubheader: "بوابة التحكم والرقابة الإدارية لـ SocialXchange",
    userSubheader: "المنصة الرائدة لتبادل الدعم وتنشيط حسابات وقنوات السوشيال ميديا",
    adminTitle: "🛡️ تسجيل دخول غرفة التحكم الإداري",
    usernameLabel: "اسم المستخدم أو بريدك الخاص",
    usernamePlaceholder: "أدخل اسم الإداري أو البريد الإلكتروني الخاص بك",
    passwordLabel: "كلمة المرور (password)",
    submitAdmin: "دخول غرفة التحكم 🛡️",
    backToLogin: "العودة لتسجيل دخول الأعضاء والزوار",
    forgotPassTitle: "🔑 استعادة كلمة المرور الحالية",
    forgotPassSuccess: "📬 تم إرسال كلمة المرور بنجاح!",
    forgotPassSuccessDesc: "تم إرسال رسالة تفصيلية بريدية تحتوي على معلومات حسابك إلى البريد المسجل",
    forgotPassExtracted: "تم استخراج كلمة المرور الخاصة بك بنجاح:",
    forgotPassNote: "يرجى تدوين كلمة المرور واستخدامها لتسجيل الدخول الآن!",
    backToLoginBtn: "العودة لتسجيل الدخول",
    enterEmailLabel: "أدخل بريدك الإلكتروني المسجل",
    sendForgotBtn: "إرسال كلمة المرور الحالية 📬",
    cancelBtn: "إلغاء والعودة لتسجيل الدخول",
    signInTab: "تسجيل الدخول",
    signUpTab: "إنشاء حساب جديد",
    welcomeGift: "🎁 هدية ترحيبية فورية للمشتركين الجدد",
    welcomeGiftDesc: "سجل الآن واحصل على 1000 نقطة مجانية مباشرة لتطلق حملتك الأولى لزيادة مشاهدات ومشتركي يوتيوب مجاناً!",
    displayNameLabel: "اسم المستخدم",
    displayNamePlaceholder: "محمد أحمد",
    emailLabel: "البريد الإلكتروني",
    passwordLabelUser: "كلمة المرور",
    forgotPassLink: "نسيت كلمة المرور؟",
    signUpSubmit: "إنشاء حساب جديد وكسب 1000 نقطة",
    signInSubmit: "تسجيل الدخول",
    footerProtection: "نظام حماية ذكي لمنع التفاعلات والاشتراكات المزيفة لسلامة حساباتك وقنواتك على السوشيال ميديا.",
    footerNote: "موقع تبادل آمن بنسبة 100% • نظام حماية متكامل",
    adminNameReserved: "غير مسموح بكلمة admin كحساب مستخدم عام. يرجى الدخول من بوابة غرفة التحكم.",
    fieldsRequired: "يرجى ملء جميع الحقول المطلوبة.",
    displayNameRequired: "يرجى إدخال اسم المستخدم.",
    weakPassword: "يجب أن تكون كلمة المرور 6 أحرف على الأقل.",
    loadingText: "جاري التحميل...",
    wrongAdminCreds: "❌ الاسم أو كلمة المرور الخاصة بغرفة التحكم غير صحيحة!",
    adminAuthError: "حدث خطأ أثناء إجراء المصادقة مع الخادم لغرفة التحكم.",
    authErrorDefault: "حدث خطأ أثناء الاتصال بالخادم.",
    emailAlreadyInUse: "البريد الإلكتروني مستخدم بالفعل لحساب آخر.",
    invalidEmail: "البريد الإلكتروني المكتوب غير صالح.",
    wrongPassword: "خطأ في البريد الإلكتروني أو كلمة المرور، يرجى المحاولة مرة أخرى.",
    noAccount: "خطأ في البريد الإلكتروني أو كلمة المرور، أو أن الحساب غير مسجل حالياً. يرجى إنشاء حساب جديد.",
    languageLabel: "اللغة الرئيسية / Primary Language: ",
    statsTitle: "أرقام وإحصائيات المنصة المباشرة",
    statsSubtitle: "نشاط دائم وضمان تام للتبادل وحفظ الحقوق عبر الخوارزمية الفورية الذكية",
    statsUsers: "مستخدم نشط ومسجل بالمنصة",
    statsCampaigns: "حملة ترويجية وإعلانية مكتملة",
    statsPoints: "نقطة تبادل وإعلان متبادلة",
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navStats: "الإحصائيات",
    navBackHome: "العودة للرئيسية",
    navStart: "تسجيل الدخول / البدء الآن",
    adminPortal: "ولوج الإدارة 🛡️",
    heroBadge: "🚀 منصة التبادل والترويج الحقيقي والموثوق",
    heroTitle: "زد تفاعلك مجاناً وبسرعة الصاروخ مع ",
    heroDesc: "المنصة الأولى رقمياً لتبادل المتابعين واللايكات والمشاهدات الحقيقية والآمنة لجميع قنواتك وحساباتك الرقمية لرفع أهليتك وأرباحك مجاناً.",
    heroCTA1: "كسب الـ 1,000 نقطة المجانية والبدء الآن 🎁",
    heroCTA2: "استعراض الخدمات المتاحة 🛠️",
    servicesTitle: "الخدمات التفاعلية الممتازة بالمنصة",
    servicesSubtitle: "امتداد ترويجي شامل لجميع خدمات التواصل ومختلف بوابات كسب النقاط",
    igTitle: "متابعات إنستغرام",
    igDesc: "تطوير حسابات انستغرام وجذب آلاف المتابعين الحقيقيين والنشطين لرفع كفاءة تصفح حسابك وتنشيط ريلز.",
    fbTitle: "لايكات فيسبوك",
    fbDesc: "عزز مصداقية وتفاعل صفحتك أو منشوراتك على فيسبوك من خلال حشد معجبين ولايكات تفاعلية حقيقية فودافون كاش.",
    ytTitle: "ساعات يوتيوب",
    ytDesc: "زد ساعات المشاهدة بطرق شرعية آمنة بنسبة 100%، واحصد آلاف المشتركين واللايكات الفعالة لتفعيل الربح وسحب كاش.",
    tkTitle: "متابعة تيك توك",
    tkDesc: "ادخل الترند سريعاً عبر زيادة المتابعات ولايكات الإكسبلور العميقة لمقاطع التيك توك الخاصة بك بنقرات معدودة.",
    startNowBtn: "البدء الآن",
    footerRights: "منصة التبادل والترويج الحقيقي والموثوق © 2026 SocialXchange",
    footerSEO: "تم مواءمة الهوية والتصميم لتتناسب مع أحدث تفضيلات الأرشفة ومصادقة محركات البحث",
    purchasePackagesTitle: "باقات شراء النقاط (Purchase Points Packages)",
    purchasePackagesDesc: "اختر خطة الشحن المناسبة لتمويل حملاتك الترويجية وجلب آلاف المتفاعلين في ثوانٍ معدودة.",
    bestValueLabel: "الأكثر مبيعاً ⭐",
    buyNowLabel: "شراء الآن 🚀"
  },
  en: {
    adminSubheader: "Administrative Control Room Portal for SocialXchange",
    userSubheader: "The leading platform for support exchange and social account activation",
    adminTitle: "🛡️ Admin Control Room Sign In",
    usernameLabel: "Username or Administrative Email",
    usernamePlaceholder: "Enter your admin username or email address",
    passwordLabel: "Password",
    submitAdmin: "Enter Control Room 🛡️",
    backToLogin: "Back to Member & Visitor Login",
    forgotPassTitle: "🔑 Recover Current Password",
    forgotPassSuccess: "📬 Password recovered successfully!",
    forgotPassSuccessDesc: "A detailed message has been prepared for the registered email address",
    forgotPassExtracted: "Your password was successfully retrieved:",
    forgotPassNote: "Please write down this password and use it to sign in now!",
    backToLoginBtn: "Back to Sign In",
    enterEmailLabel: "Enter your registered email address",
    sendForgotBtn: "Retrieve Current Password 📬",
    cancelBtn: "Cancel & Return to Login",
    signInTab: "Sign In",
    signUpTab: "Create New Account",
    welcomeGift: "🎁 Instant Welcome Gift for New Members",
    welcomeGiftDesc: "Sign up now and get 1000 free reward points instantly to launch your first YouTube views or subscribers campaign!",
    displayNameLabel: "Username / Full Name",
    displayNamePlaceholder: "John Doe",
    emailLabel: "Email Address",
    passwordLabelUser: "Password",
    forgotPassLink: "Forgot your password?",
    signUpSubmit: "Create Account & Gain 1000 Pts",
    signInSubmit: "Sign In",
    footerProtection: "Smart protection system to prevent fake reactions for the security of your networks and profiles.",
    footerNote: "100% Secure Support Exchange • Advanced Protection Shield",
    adminNameReserved: "The 'admin' email/username is reserved. Please log in from the Admin Control Room portal.",
    fieldsRequired: "Please fill in all required fields.",
    displayNameRequired: "Please enter a username.",
    weakPassword: "Password must be at least 6 characters.",
    loadingText: "Loading...",
    wrongAdminCreds: "❌ Incorrect admin username or password!",
    adminAuthError: "An error occurred during administrative socket authorization.",
    authErrorDefault: "An error occurred while connecting to the server.",
    emailAlreadyInUse: "This email address is already registered to another account.",
    invalidEmail: "The email address entered is invalid.",
    wrongPassword: "Incorrect email or password, please try again.",
    noAccount: "Incorrect email/password or account not registered. Please create a new account.",
    languageLabel: "Language / اللغة: ",
    statsTitle: "Live Platform Statistics",
    statsSubtitle: "Continuous activity and complete guarantee of exchange and protection under our instant smart algorithm",
    statsUsers: "Active Registered Users",
    statsCampaigns: "Completed Marketing Campaigns",
    statsPoints: "Exchanged Engagement Points",
    navHome: "Home",
    navServices: "Services",
    navStats: "Stats",
    navBackHome: "Back to Home",
    navStart: "Sign In / Start Now",
    adminPortal: "Admin Access 🛡️",
    heroBadge: "🚀 Real & Trusted Support Exchange Platform",
    heroTitle: "Boost your engagement for free and rocket-fast with ",
    heroDesc: "The leading digital platform to exchange safe, real followers, likes, and views across all your profiles to grow your reach and monetization for free.",
    heroCTA1: "Claim 1,000 Free Points & Start Now 🎁",
    heroCTA2: "Explore Available Services 🛠️",
    servicesTitle: "Premium Platform Exchange Services",
    servicesSubtitle: "A comprehensive promotional suite for all social networks and reward-earning gateways",
    igTitle: "Instagram Followers",
    igDesc: "Grow your Instagram brand and capture thousands of organic, real followers to boost content exposure and reels reach.",
    fbTitle: "Facebook Likes",
    fbDesc: "Boost the credibility of your Facebook public pages or personal posts by rallying real, interactive post likes.",
    ytTitle: "YouTube Watch Time",
    ytDesc: "Increase your watch hours organically 100% safely, securing thousands of regular subscribers and likes to activate channel monetization.",
    tkTitle: "TikTok Engagement",
    tkDesc: "Quickly jump onto the popular trend pages by multiplying followers and high-retention explore video likes in clicks.",
    startNowBtn: "Start Now",
    footerRights: "Real & Trusted Support Exchange Platform © 2026 SocialXchange",
    footerSEO: "The design and identities have been tailored to perfectly conform to modern SEO indexing and search crawlers.",
    purchasePackagesTitle: "Purchase Points Packages",
    purchasePackagesDesc: "Select the perfect points package to instantly fuel your campaigns and reach thousands of users.",
    bestValueLabel: "Best Value ⭐",
    buyNowLabel: "Buy Now 🚀"
  },
  fr: {
    adminSubheader: "Portail de Contrôle Administratif pour SocialXchange",
    userSubheader: "La plateforme leader pour l'échange de support et réseaux sociaux",
    adminTitle: "🛡️ Connexion Espace Administration",
    usernameLabel: "Nom d'utilisateur ou E-mail Admin",
    usernamePlaceholder: "Entrez votre nom d'utilisateur ou e-mail",
    passwordLabel: "Mot de passe",
    submitAdmin: "Entrer dans la Cabine 🛡️",
    backToLogin: "Retour à la connexion des membres",
    forgotPassTitle: "🔑 Récupérer le mot de passe actuel",
    forgotPassSuccess: "📬 Mot de passe récupéré avec succès !",
    forgotPassSuccessDesc: "Un message a été généré pour l'e-mail enregistré",
    forgotPassExtracted: "Votre mot de passe a été extrait avec succès:",
    forgotPassNote: "Veuillez noter le mot de passe et l'utiliser pour vous connecter !",
    backToLoginBtn: "Retourner à la connexion",
    enterEmailLabel: "Entrez votre adresse e-mail enregistrée",
    sendForgotBtn: "Envoyer le mot de passe actuel 📬",
    cancelBtn: "Annuler & Retourner à la connexion",
    signInTab: "Connexion",
    signUpTab: "Créer un compte",
    welcomeGift: "🎁 Cadeau de bienvenue instantané",
    welcomeGiftDesc: "Inscrivez-vous maintenant et obtenez 1000 points gratuits pour lancer votre première campagne !",
    displayNameLabel: "Nom d'utilisateur / Nom complet",
    displayNamePlaceholder: "Jean Dupont",
    emailLabel: "Adresse E-mail",
    passwordLabelUser: "Mot de passe",
    forgotPassLink: "Mot de passe oublié ?",
    signUpSubmit: "Créer un compte & Recevoir 1000 Pts",
    signInSubmit: "Se Connecter",
    footerProtection: "Système de protection intelligent pour empêcher les fausses interactions pour la sécurité de vos profils.",
    footerNote: "Échange 100% Sécurisé • Bouclier de Protection Intégral",
    adminNameReserved: "L'e-mail/pseudo 'admin' est réservé. Veuillez vous connecter depuis l'Espace Admin.",
    fieldsRequired: "Veuillez remplir tous les champs requis.",
    displayNameRequired: "Veuillez saisir un nom d'utilisateur.",
    weakPassword: "Le mot de passe doit comporter au moins 6 caractères.",
    loadingText: "Chargement...",
    wrongAdminCreds: "❌ Identifiants d'administrateur incorrects !",
    adminAuthError: "Erreur d'authentification avec le serveur d'administration.",
    authErrorDefault: "Une erreur s'est produite lors de la connexion au serveur.",
    emailAlreadyInUse: "Cette adresse e-mail est déjà associée à un autre compte.",
    invalidEmail: "L'adresse e-mail saisie est invalide.",
    wrongPassword: "E-mail ou mot de passe incorrect, veuillez réessayer.",
    noAccount: "Compte non enregistré ou mot de passe incorrect. Veuillez créer un compte.",
    languageLabel: "Langue: ",
    statsTitle: "Statistiques de la Plateforme en Direct",
    statsSubtitle: "Activité continue et garantie totale d'échange de services sous notre algorithme intelligent instantané",
    statsUsers: "Utilisateurs Actifs Enregistrés",
    statsCampaigns: "Campagnes Marketing Terminées",
    statsPoints: "Points d'Engagement Échangés",
    navHome: "Accueil",
    navServices: "Services",
    navStats: "Statistiques",
    navBackHome: "Retour",
    navStart: "Connexion / Commencer",
    adminPortal: "Accès Admin 🛡️",
    heroBadge: "🚀 Plateforme d'échange de support réelle et fiable",
    heroTitle: "Boostez votre engagement gratuitement et ultra-rapidement avec ",
    heroDesc: "La première plateforme numérique pour échanger des followers, likes et vues réels et sécurisés sur tous vos réseaux sociaux afin d'augmenter vos revenus gratuitement.",
    heroCTA1: "Réclamer 1 000 Points Gratuits & Commencer 🎁",
    heroCTA2: "Explorer les Services Disponibles 🛠️",
    servicesTitle: "Services d'Échange Premium de la Plateforme",
    servicesSubtitle: "Une suite promotionnelle complète pour tous les réseaux sociaux et passerelles de points",
    igTitle: "Abonnés Instagram",
    igDesc: "Développez votre marque Instagram et attirez des milliers d'abonnés réels pour dynamiser vos réels et publications.",
    fbTitle: "Mentions J'aime Facebook",
    fbDesc: "Renforcez la crédibilité de vos pages et publications Facebook en cumulant des mentions j'aime réelles et interactives.",
    ytTitle: "Temps de Visionnage YouTube",
    ytDesc: "Augmentez vos heures de visionnage en toute sécurité, obtenez des abonnés et des likes réels pour activer la monétisation.",
    tkTitle: "Engagement TikTok",
    tkDesc: "Décrochez la tendance rapidement en multipliant vos abonnés et likes d'exploration à haute rétention en quelques clics.",
    startNowBtn: "Commencer",
    footerRights: "Plateforme d'échange de support réelle et fiable © 2026 SocialXchange",
    footerSEO: "L'identité et la mise en page sont optimisées pour s'aligner sur les exigences de référencement moderne.",
    purchasePackagesTitle: "Packages d'Achat de Points",
    purchasePackagesDesc: "Sélectionnez le pack idéal pour alimenter vos campagnes et toucher des milliers d'utilisateurs.",
    bestValueLabel: "Meilleure Offre ⭐",
    buyNowLabel: "Acheter Maintenant 🚀"
  },
  es: {
    adminSubheader: "Portal de Control Administrativo para SocialXchange",
    userSubheader: "La plataforma líder en intercambio de soporte y reactivación de redes sociales",
    adminTitle: "🛡️ Inicio de Sesión de Sala de Control de Administración",
    usernameLabel: "Usuario o Correo de Administración",
    usernamePlaceholder: "Ingrese su usuario o correo de administración",
    passwordLabel: "Contraseña",
    submitAdmin: "Entrar en Sala de Control 🛡️",
    backToLogin: "Volver a Inicio de Sesión de Miembros",
    forgotPassTitle: "🔑 Recuperar contraseña actual",
    forgotPassSuccess: "📬 ¡Contraseña recuperada con éxito!",
    forgotPassSuccessDesc: "Se ha enviado un mensaje detallado al correo electrónico registrado",
    forgotPassExtracted: "Su contraseña fue recuperada correctamente:",
    forgotPassNote: "¡Anote la contraseña y utilícela para iniciar sesión ahora!",
    backToLoginBtn: "Volver al Inicio de Sesión",
    enterEmailLabel: "Ingrese su dirección de correo registrada",
    sendForgotBtn: "Enviar contraseña actual 📬",
    cancelBtn: "Cancelar y volver al inicio de sesión",
    signInTab: "Iniciar Sesión",
    signUpTab: "Crear Cuenta Nueva",
    welcomeGift: "🎁 Regalo de Bienvenida Instantáneo",
    welcomeGiftDesc: "¡Regístrese ahora y obtenga 1000 puntos gratis al instante para lanzar su primera campaña de crecimiento!",
    displayNameLabel: "Nombre de Usuario / Nombre Real",
    displayNamePlaceholder: "Juan Pérez",
    emailLabel: "Dirección de Correo",
    passwordLabelUser: "Contraseña",
    forgotPassLink: "¿Olvidó su contraseña?",
    signUpSubmit: "Crear Cuenta y Reclamar 1000 Puntos",
    signInSubmit: "Iniciar Sesión",
    footerProtection: "Sistema de protección inteligente para evitar reacciones falsas para la seguridad de sus perfiles.",
    footerNote: "Intercambio 100% Seguro • Escudo de Protección Avanzado",
    adminNameReserved: "El correo/usuario 'admin' está reservado. Inicie sesión desde el Control Administrativo.",
    fieldsRequired: "Por favor, complete todos los campos requeridos.",
    displayNameRequired: "Por favor, ingrese un nombre de usuario.",
    weakPassword: "La contraseña debe tener al menos 6 caracteres.",
    loadingText: "Cargando...",
    wrongAdminCreds: "❌ ¡Usuario o contraseña de administración incorrectos!",
    adminAuthError: "Ocurrió un error de autenticación con el servidor de administración.",
    authErrorDefault: "Ocurrió un error al conectar con el servidor.",
    emailAlreadyInUse: "Este correo electrónico ya está registrado con otra cuenta.",
    invalidEmail: "La dirección de correo electrónico ingresada no es válida.",
    wrongPassword: "Correo o contraseña incorrectos, por favor intente de nuevo.",
    noAccount: "Correo/contraseña incorrectos o cuenta no registrada. Por favor cree una cuenta de usuario.",
    languageLabel: "Idioma: ",
    statsTitle: "Estadísticas de la Plataforma en Vivo",
    statsSubtitle: "Actividad continua y garantía total de intercambio bajo nuestro algoritmo inteligente e instantáneo",
    statsUsers: "Usuarios Activos Registrados",
    statsCampaigns: "Campagnes de Marketing Completadas",
    statsPoints: "Puntos de Participación Intercambiados",
    navHome: "Inicio",
    navServices: "Servicios",
    navStats: "Estadísticas",
    navBackHome: "Volver",
    navStart: "Iniciar sesión / Empezar",
    adminPortal: "Acceso Admin 🛡️",
    heroBadge: "🚀 Plataforma de intercambio de soporte real y confiable",
    heroTitle: "Aumente su compromiso gratis y súper rápido con ",
    heroDesc: "La plataforma digital líder para intercambiar seguidores, likes y vistas de forma segura y real en todas sus redes para aumentar su alcance y monetización gratis.",
    heroCTA1: "Reclamar 1,000 Puntos Gratis y Empezar 🎁",
    heroCTA2: "Explorar Servicios Disponibles 🛠️",
    servicesTitle: "Servicios de Intercambio Premium de la Plataforma",
    servicesSubtitle: "Una suite promocional completa para todas las redes sociales y pasarelas de puntos",
    igTitle: "Seguidores de Instagram",
    igDesc: "Haga crecer su marca de Instagram y atraiga miles de seguidores reales para impulsar el alcance de sus reels y publicaciones.",
    fbTitle: "Me Gusta de Facebook",
    fbDesc: "Aumente la credibilidad de sus páginas y publicaciones de Facebook acumulando me gusta reales e interactivos.",
    ytTitle: "Tiempo de Reproducción YouTube",
    ytDesc: "Aumente sus horas de reproducción de manera segura, obtenga suscriptores y me gusta reales para activar la monetización.",
    tkTitle: "Interacción de TikTok",
    tkDesc: "Aparezca en tendencias rápidamente multiplicando sus seguidores y me gusta de retención profunda en unos pocos clics.",
    startNowBtn: "Empezar",
    footerRights: "Plataforma de intercambio de soporte real y confiable © 2026 SocialXchange",
    footerSEO: "El diseño y la identidad han sido optimizados para adaptarse a las exigencias modernas del SEO.",
    purchasePackagesTitle: "Paquetes de Compra de Puntos",
    purchasePackagesDesc: "Seleccione el paquete de puntos ideal para financiar sus campañas y alcanzar a miles de usuarios.",
    bestValueLabel: "Más Vendido ⭐",
    buyNowLabel: "Comprar Ahora 🚀"
  }
};

function AnimatedCounter({ target, suffix = '', duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [beenVisible, setBeenVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBeenVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!beenVisible) return;
    
    let startTime: number | null = null;
    let animationFrameId: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };
    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [target, duration, beenVisible]);

  return (
    <span ref={elementRef} className="font-sans font-black bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
      {beenVisible ? count.toLocaleString() : "0"}{suffix}
    </span>
  );
}

interface ServiceCardType {
  id: string;
  path: string;
  emoji: string;
  glowColor: string;
  iconBorder: string;
  title: Record<SupportedLanguages, string>;
  desc: Record<SupportedLanguages, string>;
}

const landingServices: ServiceCardType[] = [
  {
    id: "youtube-views",
    path: "/services/youtube-views",
    emoji: "📺",
    glowColor: "hover:border-red-500/50 hover:shadow-[0_10px_30px_rgba(239,68,68,0.25)]",
    iconBorder: "border-red-500/20 bg-red-500/10 text-red-400",
    title: {
      ar: "مشاهدات يوتيوب",
      en: "YouTube Views",
      fr: "Vues YouTube",
      es: "Vistas de YouTube"
    },
    desc: {
      ar: "احصد آلاف المشاهدات الحقيقية والآمنة لمقاطع الفيديو الخاصة بك لزيادة فرصة ظهورها في المقترحات وتفعيل الأرباح.",
      en: "Gain thousands of real and secure views for your YouTube videos to boost algorithmic recommendations.",
      fr: "Obtenez des milliers de vues réelles et sécurisées pour booster vos vidéos dans l'algorithme.",
      es: "Consiga miles de reproducciones reales y seguras para posicionar sus videos en el buscador."
    }
  },
  {
    id: "youtube-subscribers",
    path: "/services/youtube-subscribers",
    emoji: "🔔",
    glowColor: "hover:border-red-600/50 hover:shadow-[0_10px_30px_rgba(220,38,38,0.25)]",
    iconBorder: "border-red-600/20 bg-red-600/10 text-red-500",
    title: {
      ar: "اشتراكات يوتيوب",
      en: "YouTube Subscribers",
      fr: "Abonnés YouTube",
      es: "Suscriptores de YouTube"
    },
    desc: {
      ar: "زد عدد المشتركين الحقيقيين في قناتك لبناء قاعدة جماهيرية متفاعلة بشكل آمن ومضمون.",
      en: "Grow active and loyal subscribers for your channel to support content sustainability.",
      fr: "Augmentez le nombre d'abonnés de confiance pour optimiser votre portée internationale.",
      es: "Multiplique los suscriptores activos para profesionalizar y monetizar su canal."
    }
  },
  {
    id: "youtube-likes",
    path: "/services/youtube-likes",
    emoji: "👍",
    glowColor: "hover:border-red-400/50 hover:shadow-[0_10px_30px_rgba(248,113,113,0.25)]",
    iconBorder: "border-red-400/20 bg-red-400/10 text-red-400",
    title: {
      ar: "لايكات يوتيوب",
      en: "YouTube Likes",
      fr: "Likes YouTube",
      es: "Me Gusta de YouTube"
    },
    desc: {
      ar: "عزز تقييم فيديوهاتك وامنحها المصداقية بالتفاعل الإيجابي عبر الإعجابات الحقيقية والآمنة.",
      en: "Increase likes on your videos to improve search metrics and social proof dynamically.",
      fr: "Maximisez les interactions positives pour signaler la qualité de votre contenu.",
      es: "Aumente la cantidad de me gusta para captar mayor atención del público."
    }
  },
  {
    id: "facebook-follow",
    path: "/services/facebook-follow",
    emoji: "👤",
    glowColor: "hover:border-blue-600/50 hover:shadow-[0_10px_30px_rgba(37,99,235,0.25)]",
    iconBorder: "border-blue-600/20 bg-blue-600/10 text-blue-600",
    title: {
      ar: "متابعات فيسبوك",
      en: "Facebook Followers",
      fr: "Abonnés Facebook",
      es: "Seguidores de Facebook"
    },
    desc: {
      ar: "زد عملاءك ومتابعي صفحتك أو حسابك الشخصي على فيسبوك لتوسيع رقعة تأثيرك الرقمي.",
      en: "Expand your digital audience by gaining quality followers for your Facebook pages and profiles.",
      fr: "Développez votre communauté en acquérant des abonnés actifs et engagés.",
      es: "Construya una audiencia sólida con seguidores auténticos para su marca en Facebook."
    }
  },
  {
    id: "facebook-likes",
    path: "/services/facebook-likes",
    emoji: "💙",
    glowColor: "hover:border-blue-500/50 hover:shadow-[0_10px_30px_rgba(59,130,246,0.25)]",
    iconBorder: "border-blue-500/20 bg-blue-500/10 text-blue-500",
    title: {
      ar: "لايكات فيسبوك",
      en: "Facebook Likes",
      fr: "Likes Facebook",
      es: "Me Gusta de Facebook"
    },
    desc: {
      ar: "احشد آلاف الإعجابات الحقيقية لمنشوراتك وصورك لتعزيز الثقة بالخدمات أو المنتجات المعروضة.",
      en: "Boost trust and visibility of your status updates and photos with real Facebook likes.",
      fr: "Stimulez l'intérêt autour de vos annonces et de vos photos avec des mentions j'aime.",
      es: "Logre mayor repercusión social con likes reales para sus postales o comunicados."
    }
  },
  {
    id: "instagram-follow",
    path: "/services/instagram-follow",
    emoji: "📸",
    glowColor: "hover:border-pink-500/50 hover:shadow-[0_10px_30px_rgba(236,72,153,0.25)]",
    iconBorder: "border-pink-500/20 bg-pink-500/10 text-pink-500",
    title: {
      ar: "متابعات انستجرام",
      en: "Instagram Followers",
      fr: "Abonnés Instagram",
      es: "Seguidores de Instagram"
    },
    desc: {
      ar: "أنشئ قاعدة معجبين واسعة على انستغرام لمواكبة المشاهير وصناع المحتوى البصري الفعال.",
      en: "Establish a stunning presence on Instagram by growing organic, interactive fans.",
      fr: "Devenez une figure d'autorité en attirant de vrais passionnés sur Instagram.",
      es: "Dé a conocer su perfil de Instagram a gran escala atrayendo miles de nuevos fans."
    }
  },
  {
    id: "instagram-likes",
    path: "/services/instagram-likes",
    emoji: "❤️",
    glowColor: "hover:border-pink-400/50 hover:shadow-[0_10px_30px_rgba(244,63,94,0.25)]",
    iconBorder: "border-pink-400/20 bg-pink-400/10 text-pink-400",
    title: {
      ar: "لايكات انستجرام",
      en: "Instagram Likes",
      fr: "Likes Instagram",
      es: "Me Gusta de Instagram"
    },
    desc: {
      ar: "ارفع معدل تفاعل الصور والفيديوهات والريلز للحصول على فرصل للظهور في الإكسبلور.",
      en: "Boost interactions on your photos and Reels to climb higher in exploration feeds.",
      fr: "Augmentez le taux d'engagement de vos bobines et publications préférées.",
      es: "Mejore el rendimiento y alcance de sus publicaciones y reels instantáneamente."
    }
  },
  {
    id: "tiktok-follow",
    path: "/services/tiktok-follow",
    emoji: "🎵",
    glowColor: "hover:border-teal-500/50 hover:shadow-[0_10px_30px_rgba(20,184,166,0.25)]",
    iconBorder: "border-teal-500/20 bg-teal-500/10 text-teal-400",
    title: {
      ar: "متابعات تيك توك",
      en: "TikTok Followers",
      fr: "Abonnés TikTok",
      es: "Seguidores de TikTok"
    },
    desc: {
      ar: "تعديل حركتك وزيادة عدد المتابعين للملف الشخصي للوصول للبث المباشر والشهرة السريعة.",
      en: "Unlock live-streaming milestones and boost profile authority with verified followers.",
      fr: "Débloquez les fonctionnalités de streaming en direct grâce à de fidèles abonnés.",
      es: "Alcance los requisitos de transmisión en vivo captando fans reales en minutos."
    }
  },
  {
    id: "tiktok-likes",
    path: "/services/tiktok-likes",
    emoji: "🔥",
    glowColor: "hover:border-teal-400/50 hover:shadow-[0_10px_30px_rgba(45,212,191,0.25)]",
    iconBorder: "border-teal-400/20 bg-teal-400/10 text-teal-400",
    title: {
      ar: "لايكات تيك توك",
      en: "TikTok Likes",
      fr: "Likes TikTok",
      es: "Me Gusta de TikTok"
    },
    desc: {
      ar: "احصد قلوباً حقيقية وتفاعلات عالية لتدخل مقاطع الفيديو الخاصة بك قائمة الترند والإكسبلور.",
      en: "Deliver real hearts to tell the TikTok algorithm to trigger explosive viewer trends.",
      fr: "Envoyez des coeurs sur vos vidéos pour signaler un taux d'interaction exceptionnel.",
      es: "Haga que sus clips de video sean recomendados para el feed para ti de la comunidad."
    }
  },
  {
    id: "x-follow",
    path: "/services/x-follow",
    emoji: "🐦",
    glowColor: "hover:border-slate-500/50 hover:shadow-[0_10px_30px_rgba(148,163,184,0.25)]",
    iconBorder: "border-slate-700/20 bg-slate-800 text-slate-300",
    title: {
      ar: "متابعات إكس (تويتر)",
      en: "X (Twitter) Followers",
      fr: "Abonnés X (Twitter)",
      es: "Seguidores de X (Twitter)"
    },
    desc: {
      ar: "زد التأثير الشخصي أو المؤسسي وبريق حسابك على منصة إكس من خلال متابعات من حسابات نشطة.",
      en: "Build social proof and target active audiences on the X (Twitter) platform with style.",
      fr: "Améliorez le score d'influence de votre compte professionnel et personnel sur X.",
      es: "Consiga seguidores activos y reales para elevar el prestigio de su perfil en X."
    }
  },
  {
    id: "x-like",
    path: "/services/x-like",
    emoji: "⚡",
    glowColor: "hover:border-slate-400/50 hover:shadow-[0_10px_30px_rgba(203,213,225,0.25)]",
    iconBorder: "border-slate-600/25 bg-slate-800 text-slate-300",
    title: {
      ar: "لايكات إكس (تويتر)",
      en: "X (Twitter) Likes",
      fr: "Likes X (Twitter)",
      es: "Me Gusta de X (Twitter)"
    },
    desc: {
      ar: "زد التفاعل على منشوراتك لضمان زيادة مداها ووصولها لكل المهتمين حول العالم بتبادل آمن.",
      en: "Get interactive post likes and favorites on X with precise decentralized actions.",
      fr: "Augmentez significativement la portée de vos publications et tweets avec des likes réels.",
      es: "Multiplique los likes y favoritos en sus posts para expandir el alcance de sus tweets."
    }
  },
  {
    id: "pinterest-follow",
    path: "/services/pinterest-follow",
    emoji: "📌",
    glowColor: "hover:border-red-500/50 hover:shadow-[0_10px_30px_rgba(239,68,68,0.25)]",
    iconBorder: "border-red-500/20 bg-red-500/10 text-red-400",
    title: {
      ar: "متابعة بنترست",
      en: "Pinterest Follow",
      fr: "Abonnés Pinterest",
      es: "Seguidores de Pinterest"
    },
    desc: {
      ar: "ضاعف عدد متابعي حساباتك ولوحاتك الفنية على بنترست للوصول إلى جمهور يثق بأفكارك وتصاميمك.",
      en: "Grow high-retention pins, board and profile followers on Pinterest to organically build your creative brand.",
      fr: "Boostez vos abonnés Pinterest pour développer la visibilité de vos créations et tableaux.",
      es: "Incremente sus seguidores de perfiles y tableros en Pinterest para difundir ideas creativas."
    }
  },
  {
    id: "pinterest-like",
    path: "/services/pinterest-like",
    emoji: "❤️",
    glowColor: "hover:border-rose-500/50 hover:shadow-[0_10px_30px_rgba(244,63,94,0.25)]",
    iconBorder: "border-red-550/20 bg-red-500/10 text-rose-450",
    title: {
      ar: "لايك بنترست",
      en: "Pinterest Like",
      fr: "Likes Pinterest",
      es: "Me Gusta de Pinterest"
    },
    desc: {
      ar: "احصل على آلاف اللايكات وحفظ الدبابيس (Saves) لصورك وتصاميمك لرفع نسب تفاعلها وتصدر الخوارزميات.",
      en: "Collect interactive likes, clicks, and saves on Pinterest Pins to reach massive visual design trends.",
      fr: "Accumulez les likes et les enregistrements (Saves) sur vos épingles Pinterest pour percer.",
      es: "Consiga likes y guardados interactivos en sus Pines para posicionarlos en las tendencias principales."
    }
  },
  {
    id: "website-views",
    path: "/services/website-views",
    emoji: "🌐",
    glowColor: "hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.25)]",
    iconBorder: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    title: {
      ar: "مشاهدة المواقع",
      en: "Website Views",
      fr: "Visites de Sites",
      es: "Visitas de Sitios"
    },
    desc: {
      ar: "احصل على زيارات حقيقية لموقعك، مدونتك أو متجرك الإلكتروني مع شاشات تفاعلية تضمن تصفحاً آمناً.",
      en: "Drive real, high-retention human traffic to your website, blog, or online ecosystem.",
      fr: "Générez du trafic de qualité et des séances réelles pour votre site ou boutique.",
      es: "Atraiga visitas reales retentivas a su blog, portal o tienda virtual."
    }
  }
];

const unusedPurchasePackages = [
  {
    id: "bronze",
    name: {
      ar: "الباقة البرونزية",
      en: "Bronze Package",
      fr: "Pack Bronze",
      es: "Paquete Bronce"
    },
    points: {
      ar: "30,000 نقطة",
      en: "30,000 Points",
      fr: "30 000 Points",
      es: "30,000 Puntos"
    },
    price: "$5.00",
    features: {
      ar: [
        "دعم فني سريع",
        "نقاط لا تنتهي وصالحة للأبد",
        "إطلاق حملات تفاعل غير محدودة",
        "حماية متكاملة للحسابات"
      ],
      en: [
        "Fast technical support",
        "Lifetime points validity",
        "Unlimited custom campaigns",
        "Full organic bot protection"
      ],
      fr: [
        "Support technique rapide",
        "Validité des points à vie",
        "Campagnes sur mesure illimitées",
        "Défense anti-bot organique"
      ],
      es: [
        "Soporte técnico ágil",
        "Puntos sin vencimiento",
        "Campañas personalizadas ilimitadas",
        "Garantía total contra bots"
      ]
    },
    badgeColor: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(249,115,22,0.15)] hover:border-orange-500/40",
    btnColorBg: "bg-orange-600 hover:bg-orange-500 shadow-orange-500/20"
  },
  {
    id: "silver",
    name: {
      ar: "الباقة الفضية",
      en: "Silver Package",
      fr: "Pack Argent",
      es: "Paquete Plata"
    },
    points: {
      ar: "50,000 نقطة",
      en: "50,050 Points",
      fr: "50 000 Points",
      es: "50,000 Puntos"
    },
    price: "$7.00",
    features: {
      ar: [
        "دعم فني عالي الأولوية",
        "نقاط لا تنتهي وصالحة للأبد",
        "إطلاق حملات تفاعل غير محدودة",
        "أولوية ظهور التفاعل +10%"
      ],
      en: [
        "Priority customer support",
        "Lifetime points validity",
        "Unlimited custom campaigns",
        "Priority network exposure +10%"
      ],
      fr: [
        "Support client prioritaire",
        "Validité des points à vie",
        "Campagnes sur mesure illimitées",
        "Exposition prioritaire +10%"
      ],
      es: [
        "Soporte al cliente prioritario",
        "Puntos sin vencimiento",
        "Campañas personalizadas ilimitadas",
        "Exposición preferencial +10%"
      ]
    },
    badgeColor: "bg-slate-400/10 text-slate-300 border-slate-400/20",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(148,163,184,0.15)] hover:border-slate-400/40",
    btnColorBg: "bg-slate-600 hover:bg-slate-500 shadow-slate-500/20"
  },
  {
    id: "gold",
    name: {
      ar: "الباقة الذهبية",
      en: "Gold Package",
      fr: "Pack Or",
      es: "Paquete Oro"
    },
    points: {
      ar: "100,000 نقطة",
      en: "100,000 Points",
      fr: "100 000 Points",
      es: "100,000 Puntos"
    },
    price: "$10.00",
    isBestValue: true,
    features: {
      ar: [
        "دعم فني فوري ذو أولوية VIP",
        "نقاط لا تنتهي وصالحة للأبد",
        "إطلاق حملات تفاعل غير محدودة",
        "أولوية ظهور التفاعل +25%",
        "ميزة الترويج الفوري السريع للحملات"
      ],
      en: [
        "VIP Instant customer support",
        "Lifetime points validity",
        "Unlimited custom campaigns",
        "Priority network exposure +25%",
        "Express campaign booster badge"
      ],
      fr: [
        "Support technique instantané VIP",
        "Validité des points à vie",
        "Campagnes sur mesure illimitées",
        "Exposition prioritaire +25%",
        "Badge amplificateur express"
      ],
      es: [
        "Soporte técnico inmediato VIP",
        "Puntos sin vencimiento",
        "Campañas personalizadas ilimitadas",
        "Exposición preferencial +25%",
        "Acelerador de campañas express"
      ]
    },
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    glowColor: "shadow-[0_0_35px_rgba(245,158,11,0.25)] border-amber-500/50 hover:border-amber-400/70",
    btnColorBg: "bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 shadow-amber-500/30"
  },
  {
    id: "super",
    name: {
      ar: "الباقة الخارقة",
      en: "Super Package",
      fr: "Pack Super",
      es: "Paquete Súper"
    },
    points: {
      ar: "150,000 نقطة",
      en: "150,000 Points",
      fr: "150 000 Points",
      es: "150,000 Puntos"
    },
    price: "$15.00",
    features: {
      ar: [
        "مدير حساب شخصي متكامل",
        "نقاط لا تنتهي وصالحة للأبد",
        "أولوية ظهور ترويجي +40%",
        "خصم توفير حصري للمروجين"
      ],
      en: [
        "Account manager integration",
        "Lifetime points validity",
        "Priority network exposure +40%",
        "Exclusive promoter discounts"
      ],
      fr: [
        "Gestion de compte dédiée",
        "Validité des points à vie",
        "Exposition prioritaire +40%",
        "Offre spéciale de réduction"
      ],
      es: [
        "Gestión de cuenta asignada",
        "Puntos sin vencimiento",
        "Exposición preferencial +40%",
        "Descuento de promotor único"
      ]
    },
    badgeColor: "bg-rose-500/10 text-rose-450 border-rose-500/20",
    glowColor: "group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] hover:border-rose-400/40",
    btnColorBg: "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
  }
];

interface AuthPageProps {
  onLoginSuccess: (user: User, isNewUser?: boolean) => void;
  defaultToAdmin?: boolean;
  lang?: SupportedLanguages;
  onLanguageChange?: (lang: SupportedLanguages) => void;
}

export default function AuthPage({ onLoginSuccess, defaultToAdmin = false, lang = 'en', onLanguageChange }: AuthPageProps) {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [isAdminLogin, setIsAdminLogin] = useState<boolean>(defaultToAdmin);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    completedCampaigns: 0,
    totalExchangedPoints: 0
  });

  useEffect(() => {
    // Try Netlify serverless function first, then fall back to backend local stats API
    fetch('/.netlify/functions/get-stats')
      .then((res) => {
        if (!res.ok) throw new Error('Netlify function not OK');
        return res.json();
      })
      .catch((err) => {
        console.log('Netlify function unavailable, trying local /api/stats fallback:', err.message);
        return fetch('/api/stats').then((res) => res.json());
      })
      .then((data) => {
        if (data && typeof data.totalUsers === 'number') {
          setLiveStats({
            totalUsers: data.totalUsers,
            completedCampaigns: data.completedCampaigns ?? 0,
            totalExchangedPoints: data.totalExchangedPoints ?? 0
          });
        }
      })
      .catch((err) => console.error('Failed to fetch dynamic stats:', err));
  }, []);

  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const t = authTranslations[lang] || authTranslations['en'];
  const isRtl = lang === 'ar';

  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    if (currentPath === '/register' || currentPath.startsWith('/services/')) {
      setIsRegister(true);
    } else if (currentPath === '/login') {
      setIsRegister(false);
    }
  }, [currentPath]);

  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // If Admin Control Room Login Screen is Active
    if (isAdminLogin) {
      const isMasterAdmin = adminUsername.trim().toLowerCase() === 'thelegendgamer2022@gmail.com' && adminPassword === '123BEDOgemy!@fx';
      if (!isMasterAdmin) {
        setError(t.wrongAdminCreds);
        setLoading(false);
        return;
      }

      try {
        const targetEmail = 'thelegendgamer2022@gmail.com';
        let fireUser: any = null;
        try {
          const result = await signInWithEmailAndPassword(auth, targetEmail, adminPassword);
          fireUser = result.user;
        } catch (signInErr: any) {
          if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential' || signInErr.code === 'auth/wrong-password') {
            try {
              const result = await createUserWithEmailAndPassword(auth, targetEmail, adminPassword);
              fireUser = result.user;
              if (fireUser) {
                await updateProfile(fireUser, {
                  displayName: 'المدير العام (The Legend)'
                });
              }
            } catch (createErr) {
              console.warn("Unable to register admin on Firebase, attempting anonymous login:", createErr);
              try {
                const anonResult = await signInAnonymously(auth);
                fireUser = anonResult.user;
              } catch (anonErr) {
                fireUser = { uid: 'admin_master_thelegend', email: targetEmail, displayName: 'المدير العام (The Legend)' };
              }
            }
          } else {
            console.warn("Admin sign-in error, falling back to anonymous:", signInErr);
            try {
              const anonResult = await signInAnonymously(auth);
              fireUser = anonResult.user;
            } catch (anonErr) {
              fireUser = { uid: 'admin_master_thelegend', email: targetEmail, displayName: 'المدير العام (The Legend)' };
            }
          }
        }

        let userObj = await db.syncUserWithCloud(fireUser.uid);
        if (!userObj) {
          userObj = db.getUser(fireUser.uid);
        }
        if (!userObj) {
          const allUsers = db.getUsers();
          const existingAdmin = allUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
          if (existingAdmin) {
            userObj = existingAdmin;
          } else {
            userObj = await db.registerGoogleUser(
              fireUser.uid,
              'المدير العام (The Legend)',
              targetEmail
            );
          }
        }
        userObj.passwordText = adminPassword;
        db.updateUserProfile(userObj);

        db.setCurrentUser(userObj.uid);
        onLoginSuccess(userObj, false);
      } catch (e: any) {
        console.error("Admin Authentication Error:", e);
        setError(t.adminAuthError);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Normal Member Login / Registration Screen
    if (!email || !password) {
      setError(t.fieldsRequired);
      setLoading(false);
      return;
    }

    if (isRegister && !displayName) {
      setError(t.displayNameRequired);
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t.weakPassword);
      setLoading(false);
      return;
    }

    try {
      let targetEmail = email.trim();
      if (targetEmail.toLowerCase() === 'admin') {
        setError(t.adminNameReserved);
        setLoading(false);
        return;
      }

      if (isRegister) {
        let fireUser: any = null;
        try {
          const result = await createUserWithEmailAndPassword(auth, targetEmail, password);
          fireUser = result.user;
          await updateProfile(fireUser, {
            displayName: displayName.trim()
          });
        } catch (createErr: any) {
          console.warn("Firebase Auth registration failed, trying local sync/anonymous fallback:", createErr);
          const allUsers = db.getUsers();
          const existingUser = allUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
          if (existingUser) {
            setError(t.emailAlreadyInUse);
            setLoading(false);
            return;
          }

          try {
            const anonResult = await signInAnonymously(auth);
            fireUser = anonResult.user;
          } catch (anonErr) {
            const randomId = 'user_' + Math.random().toString(36).substring(2, 11);
            fireUser = { uid: randomId, email: targetEmail, displayName: displayName.trim() };
          }
        }

        let userObj = await db.syncUserWithCloud(fireUser.uid);
        if (!userObj) {
          userObj = await db.registerGoogleUser(
            fireUser.uid,
            displayName.trim(),
            fireUser.email || targetEmail
          );
        }

        userObj.passwordText = password;
        db.updateUserProfile(userObj);

        db.setCurrentUser(userObj.uid);
        onLoginSuccess(userObj, true); // It is a register success -> isNewUser = true!
      } else {
        let fireUser: any = null;
        try {
          const result = await signInWithEmailAndPassword(auth, targetEmail, password);
          fireUser = result.user;
        } catch (signInErr: any) {
          console.warn("Firebase Auth sign-in failed, checking custom local DB custom session:", signInErr);
          const allUsers = db.getUsers();
          const found = allUsers.find(u => u.email.toLowerCase() === targetEmail.toLowerCase());
          
          if (found) {
            if (found.passwordText === password) {
              try {
                await signInAnonymously(auth);
              } catch (e) {}
              db.setCurrentUser(found.uid);
              onLoginSuccess(found, false);
              return;
            } else {
              setError(t.wrongPassword);
              setLoading(false);
              return;
            }
          } else {
            setError(t.noAccount);
            setLoading(false);
            return;
          }
        }

        let userObj = await db.syncUserWithCloud(fireUser.uid);
        if (!userObj) {
          userObj = db.getUser(fireUser.uid);
        }
        if (!userObj) {
          userObj = await db.registerGoogleUser(
            fireUser.uid,
            fireUser.displayName || 'مشترك جديد',
            fireUser.email || targetEmail
          );
        }

        userObj.passwordText = password;
        db.updateUserProfile(userObj);

        db.setCurrentUser(userObj.uid);
        onLoginSuccess(userObj, false);
      }
    } catch (e: any) {
      console.error("Authentication Error:", e);
      let errorMsg = e.message;
      
      if (e.code === 'auth/email-already-in-use') {
        errorMsg = t.emailAlreadyInUse;
      } else if (e.code === 'auth/invalid-email') {
        errorMsg = t.invalidEmail;
      } else if (e.code === 'auth/weak-password') {
        errorMsg = t.weakPassword;
      } else if (e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential') {
        errorMsg = t.wrongPassword;
      } else if (e.code === 'auth/operation-not-allowed') {
        errorMsg = 'PROVIDER_DISABLED';
      }
      
      setError(errorMsg || t.authErrorDefault);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-container" className="min-h-screen bg-[#070b15] text-white flex flex-col relative overflow-hidden font-sans pb-12" dir={isRtl ? "rtl" : "ltr"}>
      {/* Background Decorative Circles */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-3/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header / Navigation Bar */}
      <header className="w-full border-b border-indigo-950/40 bg-slate-950/70 backdrop-blur-md sticky top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleNavigate('/')}>
            <div className="relative w-10 h-10 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] group-hover:scale-105 transition-all duration-300 border border-white/10">
              <div className="absolute inset-0 bg-indigo-500 rounded-xl blur-sm opacity-30 group-hover:opacity-60 transition-opacity"></div>
              <Shuffle className="w-5 h-5 text-white relative z-10 animate-spin" style={{ animationDuration: '12s' }} />
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight font-sans">
              Social<span className="text-white">X</span>change
            </span>
          </div>
          
          {/* Links (desktop view) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-350">
            <button onClick={() => handleNavigate('/')} className="hover:text-white transition cursor-pointer font-bold">{t.navHome || "الرئيسية"}</button>
            <button onClick={() => {
              handleNavigate('/');
              setTimeout(() => {
                document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} className="hover:text-white transition cursor-pointer font-bold">{t.navServices || "الخدمات"}</button>
            <button onClick={() => {
              handleNavigate('/');
              setTimeout(() => {
                document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} className="hover:text-white transition cursor-pointer font-bold">{lang === 'ar' ? "باقات النقاط" : "Points Packages"}</button>
            <button onClick={() => {
              handleNavigate('/');
              setTimeout(() => {
                document.getElementById('stats-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} className="hover:text-white transition cursor-pointer font-bold">{t.navStats || "الإحصائيات"}</button>
          </nav>

          <div className="flex items-center gap-3">
            {/* Language Selector */}
            {onLanguageChange && (
              <div className="bg-slate-900/80 border border-slate-800/85 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                <select 
                  value={lang} 
                  onChange={(e) => onLanguageChange(e.target.value as SupportedLanguages)}
                  className="bg-transparent text-white font-bold text-xs outline-none cursor-pointer"
                >
                  <option value="en" className="bg-slate-900 text-slate-200">English 🇺🇸</option>
                  <option value="ar" className="bg-slate-900 text-slate-200">العربية 🇸🇦</option>
                  <option value="fr" className="bg-slate-900 text-slate-200">Français 🇫🇷</option>
                  <option value="es" className="bg-slate-900 text-slate-200">Español 🇪🇸</option>
                </select>
              </div>
            )}

            {/* Glowing / Sticky Button */}
            { (currentPath === '/login' || currentPath === '/register' || currentPath.startsWith('/services/')) ? (
              <button 
                onClick={() => handleNavigate('/')}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 transition duration-300 cursor-pointer"
              >
                {t.navBackHome || "العودة للرئيسية"}
              </button>
            ) : (
              <button 
                onClick={() => handleNavigate('/login')}
                className="relative group overflow-hidden px-5 py-2.5 rounded-xl font-bold text-xs text-white transition duration-300 shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] cursor-pointer"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl"></span>
                <span className="relative z-10 flex items-center gap-1">
                  <span>{t.navStart || "تسجيل الدخول / البدء الآن"}</span>
                  <span>⚡</span>
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          { (currentPath === '/login' || currentPath === '/register' || currentPath.startsWith('/services/')) ? (
            <motion.div 
              key="auth-gate-form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md mx-auto py-12"
            >
              <div className={`w-full bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10 ${isRtl ? 'text-right' : 'text-left'}`}>
                {/* Logo and Header */}
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center p-4.5 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-3xl mb-4 shadow-xl shadow-indigo-500/20 border border-white/10 relative group">
                    <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition-opacity"></div>
                    <Shuffle className="w-10 h-10 text-white relative z-10 animate-spin" style={{ animationDuration: '8s' }} />
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent cursor-pointer" onClick={() => handleNavigate('/')}>
                    SocialXchange
                  </h1>
                  <p className="text-slate-400 mt-2 text-xs font-medium font-sans">
                    {isAdminLogin ? t.adminSubheader : t.userSubheader}
                  </p>
                </div>

                {/* Active service callout */}
                {(() => {
                  const activeServiceForGate = landingServices.find(s => s.path === currentPath);
                  if (activeServiceForGate) {
                    return (
                      <div className="mb-6 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 text-center text-xs animate-pulse">
                        <span className="text-2xl mb-1.5 block">{activeServiceForGate.emoji}</span>
                        <p className="font-bold text-slate-100 mb-1">
                          {lang === 'ar' 
                            ? `مرحباً بك! للبدء في استخدام خدمة "${activeServiceForGate.title.ar}" ومكافآتها، يرجى إنشاء حساب مجاني الآن والحصول على 1,000 نقطة ترحيبية مجاناً! 🎁`
                            : `Welcome! To start using our "${activeServiceForGate.title[lang] || activeServiceForGate.title.en}" service and its rewards, please create a free account to redeem your 1,000 bonus points! 🎁`}
                        </p>
                      </div>
                    );
                  }
                  return null;
                })()}

                {isAdminLogin ? (
                  /* ADMIN/CONTROL ROOM SPECIAL FORM */
                  <div className="space-y-6">
                    <div className="text-center pb-2 border-b border-slate-800">
                      <span className="text-xs font-black text-red-400 bg-red-950/45 px-4 py-1.5 rounded-full border border-red-900/40 inline-flex items-center gap-1.5">
                        <span>{t.adminTitle}</span>
                      </span>
                    </div>

                    {error && (
                      <div className={`p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-center gap-2 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'} font-bold`}>
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span className="flex-1">{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">{t.usernameLabel}</label>
                        <div className="relative">
                          <input
                            id="admin-form-username"
                            type="text"
                            placeholder={t.usernamePlaceholder}
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            className={`w-full py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-650 focus:outline-none focus:border-red-500/50 transition-all text-sm font-semibold ${isRtl ? 'pl-4 pr-11 text-right' : 'pr-4 pl-11 text-left'}`}
                            required
                          />
                          <UserIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 ${isRtl ? 'right-4' : 'left-4'}`} />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">{t.passwordLabel}</label>
                        <div className="relative">
                          <input
                            id="admin-form-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            className={`w-full py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-650 focus:outline-none focus:border-red-500/50 transition-all text-sm font-extrabold ${isRtl ? 'pl-12 pr-11 text-right' : 'pr-12 pl-11 text-left'}`}
                            style={{ direction: 'ltr' }}
                            required
                          />
                          <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 ${isRtl ? 'right-4' : 'left-4'}`} />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer ${isRtl ? 'left-4' : 'right-4'}`}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-6 mt-6 bg-red-650 hover:bg-red-600 text-white font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 text-sm shadow-xl active:scale-98 disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? (
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                          <span>{t.submitAdmin}</span>
                        )}
                      </button>
                    </form>

                    <button
                      id="back-to-member-login"
                      type="button"
                      onClick={() => {
                        setIsAdminLogin(false);
                        setError(null);
                        setIsForgotPassword(false);
                      }}
                      className="w-full py-2.5 bg-transparent hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 font-bold rounded-2xl text-xs transition cursor-pointer"
                    >
                      {t.backToLogin}
                    </button>
                  </div>
                ) : isForgotPassword ? (
                  /* FORGOT PASSWORD FORM */
                  <div className="space-y-6">
                    <div className="text-center pb-2 border-b border-slate-800">
                      <span className="text-xs font-black text-amber-400 bg-amber-950/45 px-4 py-1.5 rounded-full border border-amber-900/40 inline-flex items-center gap-1.5">
                        <span>{t.forgotPassTitle}</span>
                      </span>
                    </div>

                    {error && (
                      <div className={`p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-center gap-2 ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'} font-bold`}>
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span className="flex-1">{error}</span>
                      </div>
                    )}

                    {forgotSuccess ? (
                      <div className={`p-4 bg-emerald-500/10 border border-emerald-500/20 text-slate-200 text-xs rounded-2xl leading-relaxed space-y-3 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <p className="font-extrabold text-emerald-400 text-sm">{t.forgotPassSuccess}</p>
                        <p>
                          {t.forgotPassSuccessDesc} <strong> {forgotEmail} </strong>.
                        </p>
                        <div className="p-3 bg-slate-950 border border-slate-850 rounded-2xl text-center font-mono text-emerald-400 font-black text-xs space-y-2">
                          <div className="text-[10px] text-slate-500">{t.forgotPassExtracted}</div>
                          <div className="text-sm font-black bg-emerald-500/10 py-1 rounded inline-block px-3 border border-emerald-500/20 text-emerald-400 select-all">{forgotSuccess}</div>
                        </div>
                        <p className="text-[10px] text-slate-400 text-center">
                          {t.forgotPassNote}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(false);
                            setError(null);
                            setForgotSuccess(null);
                          }}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 rounded-xl font-bold transition text-xs cursor-pointer"
                        >
                          {t.backToLoginBtn}
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          setError(null);
                          setLoading(true);
                          setTimeout(() => {
                            const users = db.getUsers();
                            const target = forgotEmail.trim().toLowerCase();
                            const matchedUser = users.find(u => u.email.trim().toLowerCase() === target);
                            
                            if (matchedUser) {
                              const pass = matchedUser.passwordText || '123BEDOgemy!@fx';
                              setForgotSuccess(pass);
                            } else {
                              setError(lang === 'ar' ? '❌ عذراً، هذا البريد الإلكتروني غير مسجل بموقعنا!' : '❌ Sorry, this email address is not registered!');
                            }
                            setLoading(false);
                          }, 1200);
                        }}
                        className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}
                      >
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-2">{t.enterEmailLabel}</label>
                          <div className="relative">
                            <input
                              type="email"
                              placeholder="example@gmail.com"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              className={`w-full py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-650 focus:outline-none focus:border-amber-500/50 transition-all text-sm font-bold ${isRtl ? 'pl-4 pr-11 text-right' : 'pr-4 pl-11 text-left'}`}
                              style={{ direction: 'ltr' }}
                              required
                            />
                            <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 ${isRtl ? 'right-4' : 'left-4'}`} />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 text-sm shadow-xl disabled:opacity-50 cursor-pointer"
                        >
                          {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <span>{t.sendForgotBtn}</span>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsForgotPassword(false);
                            setError(null);
                          }}
                          className="w-full py-2.5 bg-transparent hover:bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 font-bold rounded-2xl text-xs transition cursor-pointer"
                        >
                          {t.cancelBtn}
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  /* STANDARD SIGN UP / LOG IN FORM */
                  <>
                    {/* Mode Selector */}
                    <div className="flex border-b border-slate-800 mb-6 font-bold">
                      <button
                        onClick={() => { 
                          handleNavigate('/login');
                          setError(null); 
                        }}
                        className={`flex-1 pb-3 text-center transition-all cursor-pointer ${
                          !isRegister 
                            ? 'text-red-500 border-b-2 border-red-500 font-extrabold' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t.signInTab}
                      </button>
                      <button
                        onClick={() => { 
                          handleNavigate('/register');
                          setError(null); 
                        }}
                        className={`flex-1 pb-3 text-center transition-all cursor-pointer ${
                          isRegister 
                            ? 'text-red-500 border-b-2 border-red-500 font-extrabold' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t.signUpTab}
                      </button>
                    </div>

                    {/* Informative Welcome Points Note */}
                    <div className="p-3.5 mb-6 bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-300 text-xs leading-relaxed flex flex-col gap-1">
                      <div className={`font-bold text-amber-500 flex items-center gap-1 ${isRtl ? 'justify-end flex-row' : 'justify-start flex-row-reverse'}`}>
                        <span>{t.welcomeGift}</span>
                      </div>
                      <div className="text-slate-400 text-center">
                        {t.welcomeGiftDesc}
                      </div>
                    </div>

                    {/* Dynamic Alerts */}
                    {error && error === 'PROVIDER_DISABLED' && (
                      <div className="p-4 mb-5 bg-amber-500/10 border border-amber-500/20 text-slate-300 text-xs rounded-2xl text-right leading-relaxed flex flex-col gap-3">
                        <div className="flex items-center gap-2 flex-row-reverse font-extrabold text-amber-500 text-sm">
                          <AlertCircle className="w-5 h-5 shrink-0" />
                          <span>مطلوب تفعيل تسجيل الدخول بالبريد الإلكتروني في Firebase</span>
                        </div>
                        <div>
                          لتتمكن من إنشاء حساب جديد أو تسجيل الدخول باسم مستخدم وكلمة مرور، يرجى تفعيل طريقة تسجيل الدخول هذه في لوحة تحكم مشروعك على Firebase باتباع الخطوات التالية:
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-slate-400">
                          <li>افتح <a href="https://console.firebase.google.com/project/gen-lang-client-0620333157/authentication/providers" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline font-semibold hover:text-amber-300">صفحة إعدادات الهوية (Authentication) هنا</a>.</li>
                          <li>اضغط على زر <span className="text-slate-200">"Add new provider"</span> (إضافة موفر جديد).</li>
                          <li>اختر <span className="text-slate-200">"Email/Password"</span> (البريد الإلكتروني/كلمة المرور).</li>
                          <li>قم بتفعيل خيار <span className="text-slate-200">"Email/Password"</span> ثم اضغط <span className="text-slate-200">"Save"</span> (حفظ).</li>
                        </ol>
                        <div className="text-slate-400 pt-1 border-t border-slate-800 text-[10px]">
                          بعد حفظ الإعدادات، يرجى إعادة تحميل هذه الصفحة ومحاولة التسجيل مجدداً!
                        </div>
                      </div>
                    )}

                    {error && error !== 'PROVIDER_DISABLED' && (
                      <div className={`p-3 mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : 'flex-row'}`}>
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                        <span className="flex-1">{error}</span>
                      </div>
                    )}

                    {/* Form Inputs */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {isRegister && (
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-2">{t.displayNameLabel}</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder={t.displayNamePlaceholder}
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              className={`w-full py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-650 focus:outline-none focus:border-red-500/50 transition-all text-sm ${isRtl ? 'pl-4 pr-11 text-right' : 'pr-4 pl-11 text-left'}`}
                              required
                            />
                            <UserIcon className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 ${isRtl ? 'right-4' : 'left-4'}`} />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-400 mb-2">{t.emailLabel}</label>
                        <div className="relative">
                          <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-650 focus:outline-none focus:border-red-500/50 transition-all text-sm font-medium ${isRtl ? 'pl-4 pr-11 text-right' : 'pr-4 pl-11 text-left'}`}
                            style={{ direction: 'ltr' }}
                            required
                          />
                          <Mail className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 ${isRtl ? 'right-4' : 'left-4'}`} />
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-semibold text-slate-400 mb-2 flex justify-between items-center ${isRtl ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                          <span>{t.passwordLabelUser}</span>
                          {!isRegister && (
                            <button
                              type="button"
                              onClick={() => {
                                setIsForgotPassword(true);
                                setError(null);
                                setForgotSuccess(null);
                              }}
                              className="text-[11px] text-amber-500 hover:text-amber-400 transition font-bold"
                            >
                              {t.forgotPassLink}
                            </button>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full py-3 bg-slate-950 border border-slate-800 rounded-2xl text-white placeholder-slate-650 focus:outline-none focus:border-red-500/50 transition-all text-sm ${isRtl ? 'pl-12 pr-11 text-right' : 'pr-12 pl-11 text-left'}`}
                            style={{ direction: 'ltr' }}
                            required
                          />
                          <Lock className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 ${isRtl ? 'right-4' : 'left-4'}`} />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-300 focus:outline-none cursor-pointer ${isRtl ? 'left-4' : 'right-4'}`}
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-6 mt-6 bg-gradient-to-r from-red-650 to-amber-650 hover:from-red-600 hover:to-amber-605 text-white font-extrabold rounded-2xl transition-all flex items-center justify-center gap-3 text-base shadow-xl active:scale-98 disabled:opacity-50 cursor-pointer"
                      >
                        {loading ? (
                          <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                          <span>{isRegister ? t.signUpSubmit : t.signInSubmit}</span>
                        )}
                      </button>
                    </form>
                  </>
                )}

                <div className="text-center mt-6 text-slate-500 text-xs leading-relaxed font-sans">
                  {t.footerProtection}
                </div>
              </div>
              
              {/* Extra Support or Admin Login */}
              <div className="flex justify-between items-center mt-6 px-4">
                <button
                  type="button"
                  onClick={() => setIsAdminLogin(true)}
                  className="text-xs text-slate-500 hover:text-indigo-400 transition font-bold cursor-pointer"
                >
                  ولوج الإدارة 🛡️
                </button>
                <div className="text-slate-500 text-xs flex items-center gap-1 font-semibold font-sans">
                  <span>{t.footerNote}</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="landing-page-blocks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="w-full"
            >
              {/* HERO SECTION */}
              <section className="relative overflow-hidden py-16 lg:py-24 max-w-5xl mx-auto text-center px-4">
                <div className="relative z-10 flex flex-col items-center">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-full text-xs font-bold border border-indigo-500/20 mb-6 animate-pulse">
                    <span>{t.heroBadge || "🚀 منصة التبادل والترويج الحقيقي والموثوق"}</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight tracking-tight mb-6 max-w-4xl">
                    {t.heroTitle || "زد تفاعلك مجاناً وبسرعة الصاروخ مع "}
                    <span className="block mt-2 bg-gradient-to-r from-sky-450 via-indigo-400 to-fuchsia-450 bg-clip-text text-transparent">SocialXchange</span>
                  </h1>

                  <p className="text-base sm:text-xl text-slate-350 max-w-2xl leading-relaxed mb-8 font-medium">
                    {t.heroDesc || "المنصة الأولى رقمياً لتبادل المتابعين واللايكات والمشاهدات الحقيقية والآمنة لجميع قنواتك وحساباتك الرقمية لرفع أهليتك وأرباحك مجاناً."}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => handleNavigate('/register')}
                      className="px-8 py-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-fuchsia-600 hover:from-indigo-400 hover:to-purple-550 transition-all duration-300 shadow-[0_4px_25px_rgba(99,102,241,0.55)] cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
                    >
                      {t.heroCTA1 || "كسب الـ 1,000 نقطة المجانية والبدء الآن 🎁"}
                    </button>
                    <button 
                      onClick={() => {
                        document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-8 py-4 rounded-2xl font-bold text-sm bg-slate-900/95 hover:bg-slate-805 border border-slate-800 text-slate-300 transition duration-300 hover:text-white cursor-pointer"
                    >
                      {t.heroCTA2 || "استعراض الخدمات المتاحة 🛠️"}
                    </button>
                  </div>
                </div>
              </section>

              {/* SERVICES GRID */}
              <section id="services-section" className={`py-16 max-w-7xl mx-auto px-4 border-t border-indigo-950/40 mt-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="text-center mb-12">
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">{t.servicesTitle || "الخدمات التفاعلية الممتازة بالمنصة"}</h2>
                  <p className="text-xs sm:text-sm text-slate-400">{t.servicesSubtitle || "امتداد ترويجي شامل لجميع خدمات التواصل ومختلف بوابات كسب النقاط"}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {landingServices.map((service) => {
                    const serviceTitle = service.title[lang] || service.title.en;
                    const serviceDesc = service.desc[lang] || service.desc.en;
                    return (
                      <div 
                        key={service.id}
                        onClick={() => handleNavigate(service.path)}
                        className={`group bg-slate-900/30 backdrop-blur-xl border border-slate-800/65 rounded-2xl p-6 transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between cursor-pointer ${service.glowColor}`}
                      >
                        <div>
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition duration-300 border ${service.iconBorder}`}>
                            {service.emoji}
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-400 transition duration-200">{serviceTitle}</h3>
                          <p className="text-slate-400 text-xs leading-relaxed">{serviceDesc}</p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNavigate(service.path);
                          }} 
                          className={`mt-6 text-xs font-bold text-slate-350 group-hover:text-white flex items-center gap-1 cursor-pointer transition-colors duration-200 ${isRtl ? 'justify-end' : 'justify-start'}`}
                        >
                          <span>{t.startNowBtn || "البدء الآن"}</span>
                          <span>{isRtl ? '←' : '→'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* PURCHASE POINTS PACKAGES SECTION */}
              <section id="pricing-section" className={`py-16 max-w-7xl mx-auto px-4 border-t border-indigo-950/40 mt-12 ${isRtl ? 'text-right' : 'text-left'}`}>
                <div className="text-center mb-12">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-[10px] font-black border border-amber-500/20 mb-3 uppercase tracking-wide">
                    <Coins className="w-3 h-3 text-amber-500" />
                    <span>{t.purchasePackagesTitle || "باقات شراء النقاط (Purchase Points Packages)"}</span>
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                    {lang === 'ar' ? "امتلك آلاف النقاط بأسعار مذهلة ⚡" : "Redeem Massive Points Packages instantly ⚡"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-normal">
                    {t.purchasePackagesDesc || "خطة الشحن الأمثل لتمويل سريع لحساباتك وحملاتك وجلب آلاف المتابعين واللايكات في ثوانٍ معدودة."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                  {pricingPackages.map((pack) => {
                    const isBestValue = pack.isBestValue;
                    const featuresList = pack.features[lang] || pack.features['en'] || [];
                    const packName = pack.name[lang] || pack.name['en'] || "";
                    
                    return (
                      <div
                        key={pack.id}
                        className={`group relative rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden bg-slate-900/40 backdrop-blur-md border ${
                          isBestValue
                            ? 'border-amber-500/80 bg-slate-900/80 sm:scale-[1.03] lg:scale-[1.05] z-10 shadow-[0_0_35px_rgba(245,158,11,0.25)] ring-2 ring-amber-500/20'
                            : 'border-slate-800 hover:border-indigo-500/40 hover:shadow-[0_0_25px_rgba(99,102,241,0.15)] bg-slate-950/20 backdrop-blur-md'
                        }`}
                      >
                        {/* Neon Ambient lights inside the cards */}
                        <div className="absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl rounded-full pointer-events-none group-hover:from-indigo-500/20 duration-300" />
                        
                        {isBestValue && (
                          <div className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 text-[9px] font-black px-2.5 py-1 rounded-full border border-amber-400/20 uppercase tracking-wide flex items-center gap-1 shadow-md shadow-amber-500/25 animate-pulse`}>
                            {lang === 'ar' ? 'الأكثر مبيعاً' : 'Best Seller'}
                          </div>
                        )}

                        <div className="space-y-5">
                          <div className={`${isRtl ? 'text-right' : 'text-left'}`}>
                            {/* Package badge */}
                            <span className={`inline-block text-[10px] uppercase font-black px-2.5 py-1 rounded-full border mb-3 ${pack.badgeColor}`}>
                              {packName}
                            </span>

                            {/* Points Header */}
                            <h3 className="text-xl font-black text-white leading-tight flex items-center gap-1.5 pt-1">
                              <Coins className="w-5 h-5 text-amber-500 shrink-0" />
                              <span>
                                {lang === 'ar' 
                                  ? `${pack.points.toLocaleString()} نقطة` 
                                  : `${pack.points.toLocaleString()} Points`}
                              </span>
                            </h3>
                          </div>

                          {/* Price */}
                          <div className={`flex items-baseline gap-1 py-1.5 border-b border-slate-850 ${isRtl ? 'justify-end' : 'justify-start'}`}>
                            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-200">${pack.price.toFixed(2)}</span>
                            <span className="text-[10px] text-slate-500 font-bold">/ {lang === 'ar' ? 'دفعة واحدة' : 'one-time'}</span>
                          </div>

                          {/* Features */}
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

                        {/* Action button */}
                        <button
                          onClick={() => {
                            localStorage.setItem('pending_package_purchase', pack.id);
                            handleNavigate('/register');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-full py-3 px-4 rounded-xl mt-6 text-xs text-white font-black text-center duration-200 cursor-pointer shadow-lg transition-all border border-transparent ${pack.btnColorBg}`}
                        >
                          {lang === 'ar' ? 'شراء الآن ⚡' : 'Buy Now ⚡'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* LIVE STATS SECTION */}
              <section id="stats-section" className="py-16 max-w-5xl mx-auto px-4 border-t border-indigo-950/40 mt-12 text-center pb-24">
                <div className="mb-12">
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3">
                    {t.statsTitle || "أرقام وإحصائيات المنصة المباشرة"}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {t.statsSubtitle || "نشاط دائم وضمان تام للتبادل وحفظ الحقوق عبر الخوارزمية الفورية الذكية"}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-900/35 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition">
                    <div className="text-4xl sm:text-5xl font-black mb-2 flex justify-center">
                      <AnimatedCounter target={liveStats.totalUsers} suffix="+" />
                    </div>
                    <div className="text-sm font-bold text-slate-400 mt-2">
                      {t.statsUsers || "مستخدم نشط ومسجل بالمنصة"}
                    </div>
                  </div>

                  <div className="bg-slate-900/35 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition">
                    <div className="text-4xl sm:text-5xl font-black mb-2 flex justify-center">
                      <AnimatedCounter target={liveStats.completedCampaigns} suffix="+" />
                    </div>
                    <div className="text-sm font-bold text-slate-400 mt-2">
                      {t.statsCampaigns || "حملة ترويجية وإعلانية مكتملة"}
                    </div>
                  </div>

                  <div className="bg-slate-900/35 border border-slate-800/80 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-indigo-500/30 transition">
                    <div className="text-4xl sm:text-5xl font-black mb-2 flex justify-center">
                      <AnimatedCounter target={liveStats.totalExchangedPoints} suffix="+" />
                    </div>
                    <div className="text-sm font-bold text-slate-400 mt-2">
                      {t.statsPoints || "نقطة تبادل وإعلان متبادلة"}
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Production Footer */}
      <footer className="w-full border-t border-slate-900/80 bg-slate-950 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2 text-center">
          <div>{t.footerRights || "منصة التبادل والترويج الحقيقي والموثوق © 2026 SocialXchange"}</div>
          <div className="text-[11px] text-slate-500">{t.footerSEO || "تم مواءمة الهوية والتصميم لتتناسب مع أحدث تفضيلات الأرشفة ومصادقة محركات البحث"}</div>
        </div>
      </footer>
    </div>
  );
}
