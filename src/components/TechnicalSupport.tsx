import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { User, UserReview, UserComplaint } from '../types';
import { 
  Mail, 
  Facebook, 
  Star, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Send, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink,
  Users,
  Sparkles,
  Heart,
  Youtube,
  Instagram,
  Flame,
  Phone,
  MessageCircle,
  Link2
} from 'lucide-react';
import { SupportedLanguages } from '../lib/translations';

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Facebook': return <Facebook className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />;
    case 'Mail': return <Mail className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />;
    case 'Send': return <Send className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />;
    case 'Youtube': return <Youtube className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />;
    case 'Instagram': return <Instagram className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />;
    case 'Flame': return <Flame className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />;
    case 'Phone': return <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />;
    case 'MessageCircle': return <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />;
    case 'ShieldCheck': return <ShieldCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />;
    default: return <Link2 className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />;
  }
};

interface TechnicalSupportProps {
  user: User;
  lang?: string;
}

const supportTranslations: Record<SupportedLanguages, Record<string, string>> = {
  ar: {
    smartPlatform: 'تعرّف على منصتنا الذكية',
    brandHeading: 'منصة {brand} الرائدة',
    brandDesc: 'نحن نقدم منظومة متقدمة وآمنة بنسبة 100% لمساعدة أصحاب الأعمال والمسوقين وصناع المحتوى على توسيع دائرة وصولهم وزيادة التفاعل على حساباتهم وقنواتهم الاجتماعية عبر تبادل التفاعلات والاشتراكات بشكل حقيقي ونزيه وبأيدي أفراد حقيقيين دون بوتات أو تحايل.',
    fairExchangeTitle: 'نظام تبادل عادل ومؤمن',
    fairExchangeDesc: 'كشف ذكي وتلقائي لمحاولات الإلغاء أو التلاعب لضمان حقوقك ونقاطك.',
    allPlatformsTitle: 'دعم جميع المنصات',
    allPlatformsDesc: 'تبادل التفاعل لمقاطع ويوتيوب، فيسبوك، انستغرام وتيك توك في واجهة موحدة.',
    directContacts: 'قنوات التواصل المباشر',
    directContactsDesc: 'إذا واجهت أي استفسار أو مشكلة في المنصة، تواصل معنا فوراً عبر القنوات الرسمية التالية:',
    reviewTitle: 'شاركنا رأيك والتقييم',
    reviewDesc: 'آراؤكم تساعدنا على تطوير مستمر للمنصة وإضافة ميزات جديدة',
    reviewSuccessMsg: 'تم نشر تقييمك ورأيك بنجاح! شكراً لكلماتك الداعمة.',
    reviewErrorMsg: 'يرجى كتابة تعليق مناسب قبل الإرسال.',
    ratingLabel: 'اختر تقييم الموقع:',
    commentPlaceholder: 'رأيك بخصوص سرعة الدعم، سهولة تجميع النقاط، والتبادل الحقيقي...',
    commentLabel: 'أكتب رأيك أو تعليقك:',
    submitReviewBtn: 'إضافة تقييم والتعليق',
    reviewsHeading: 'آراء وتقييمات الأعضاء ({count})',
    noReviews: 'لا تعليقات منشورة بعد. كن أول من يكتب تعليقه!',
    complaintTitle: 'إرسال شكوى للدعم الفني',
    complaintSuccessMsg: 'تم إرسال شكواك بنجاح وسيتواصل معك مشرف الدعم قريباً عبر إيميلك.',
    complaintErrorMsg: 'يرجى كتابة الرسالة قبل الإرسال.',
    complaintDesc: 'سيتم استقبال الشكوى والرد عليها فوراً ومتابعتها إدارياً',
    subjectLabel: 'موضوع الشكوى أو الاستفسار:',
    subjectPlaceholder: 'مثال: مشكلة في شحن نقاط الباقة الثانية',
    messageLabel: 'تفاصيل الرسالة أو الشكوى الكاملة:',
    messagePlaceholder: 'أكتب تفاصيل المشكلة هنا، أرقام المعاملات إن وجدت أو رابط القناة لحل مشكلتك بسرعة...',
    submitComplaintBtn: 'إرسال الشكوى فورياً',
    historyTitle: 'تاريخ شكواك السابقة ({count})',
    noComplaints: 'ليس لديك شكاوى معلّقة أو سابقة في الحساب الحالي.',
    ticketStatus: 'مستلمة بالدعم',
    unknownUser: 'مستخدم مجهول',
    reviewSubmitError: 'حدث خطأ أثناء إرسال تقييمك، يرجى المحاولة لاحقاً.',
    complaintSubjectError: 'يرجى تحديد موضوع الشكوى.',
    complaintMessageError: 'يرجى كتابة تفاصيل رسالتك أو شكواك.',
    complaintSubmitError: 'حدث خطأ أثناء إرسال الشكوى، يرجى إعادة المحاولة.'
  },
  en: {
    smartPlatform: 'Discover Our Smart Platform',
    brandHeading: 'The Leading {brand} Exchange',
    brandDesc: 'We offer an advanced and 100% secure system to help business owners, marketers, and creators expand reach and increase engagement. Real accounts and manual actions protect your page with anti-fraud rules.',
    fairExchangeTitle: 'Fair & Secured Exchange Platform',
    fairExchangeDesc: 'Smart detection mechanisms audit actions, ensuring unsubscription behaviors return points to creators instantly.',
    allPlatformsTitle: 'Full Omnichannel Support',
    allPlatformsDesc: 'Gain watch time, channel subscriptions, profile likes, and follows for YouTube, Facebook, Instagram, and TikTok.',
    directContacts: 'Direct Technical Helpdesk',
    directContactsDesc: 'Facing any difficulty or have general requests? Reach out to us directly through the following checked links:',
    reviewTitle: 'Share Your Rating & Feedback',
    reviewDesc: 'Your insights help our engineering team continuously upgrade servers and add features.',
    reviewSuccessMsg: 'Your review and rating was posted successfully! Thank you for the support.',
    reviewErrorMsg: 'Please write a valid comment before submitting.',
    ratingLabel: 'Choose Rating Stars:',
    commentPlaceholder: 'Your experience with support speed, point accumulation, and real exchanges...',
    commentLabel: 'Write Your Detailed Review:',
    submitReviewBtn: 'Submit Rating & Feedback',
    reviewsHeading: 'Member Ratings & Reviews ({count})',
    noReviews: 'No active reviews posted currently. Be the first to write yours!',
    complaintTitle: 'Open Support Complaint Ticket',
    complaintSuccessMsg: 'Your ticket has been sent successfully. Support manager will answer your registered email shortly.',
    complaintErrorMsg: 'Please fill out fields before submitting.',
    complaintDesc: 'Open tickets are directly reviewed by system administrators to maintain active support.',
    subjectLabel: 'Complaint Subject:',
    subjectPlaceholder: 'e.g., Credit balance update issue',
    messageLabel: 'Full Message & Support Details:',
    messagePlaceholder: 'Describe the issue, include transaction IDs or targeted channel links so we can asset you fast...',
    submitComplaintBtn: 'Send Complaint Instantly',
    historyTitle: 'Your Support History ({count})',
    noComplaints: 'No active or archived complaints registered for this account.',
    ticketStatus: 'Received by Helpdesk',
    unknownUser: 'Anonymous User',
    reviewSubmitError: 'An error occurred while submitting. Please try again later.',
    complaintSubjectError: 'Please provide a subject line.',
    complaintMessageError: 'Please write your message or issue details.',
    complaintSubmitError: 'Could not send ticket. Please check connection and try again.'
  },
  fr: {
    smartPlatform: 'Découvrez notre plateforme intelligente',
    brandHeading: 'L\'Échange Leader de {brand}',
    brandDesc: 'Nous proposons une solution avancée et 100% sécurisée pour vous aider à étendre la visibilité sur vos réseaux sociaux. Obtenez de vrais abonnements de notre communauté active.',
    fairExchangeTitle: 'Échange Équitable & Audité',
    fairExchangeDesc: 'Contrôle automatique d\'interactions et pénalités d\'unsubscription pour garantir vos points.',
    allPlatformsTitle: 'Support multi-plateforme',
    allPlatformsDesc: 'Configurez des objectifs d\'abonnés, partages, et likes pour YouTube, Facebook, Instagram, et TikTok.',
    directContacts: 'Canaux d\'Assistance Directe',
    directContactsDesc: 'Si vous avez la moindre question, n\'hésitez pas à nouer contact avec les canaux ci-dessous:',
    reviewTitle: 'Donnez votre avis',
    reviewDesc: 'Votre opinion compte pour nous pour inventer de meilleures routes d\'interaction.',
    reviewSuccessMsg: 'Votre évaluation est en ligne ! Merci pour votre confiance !',
    reviewErrorMsg: 'Veuillez saisir un commentaire avant de cliquer sur le bouton.',
    ratingLabel: 'Sélectionnez des Étoiles:',
    commentPlaceholder: 'Partagez votre avis sur les délais, le support, et la rapidité...',
    commentLabel: 'Votre Commentaire:',
    submitReviewBtn: 'Enregistrer mon Avis',
    reviewsHeading: 'Avis & Témoignages des Membres ({count})',
    noReviews: 'Aucun avis disponible pour l\'instant. Rédigez le premier !',
    complaintTitle: 'Soumettre une Réclamation d\'Assistance',
    complaintSuccessMsg: 'Ticket envoyé avec succès. Un modérateur vous contactera rapidement via courriel.',
    complaintErrorMsg: 'Veuillez remplir les champs obligatoires.',
    complaintDesc: 'Tous les signalements et réclamations techniques sont gérés par priorité.',
    subjectLabel: 'Sujet du Message:',
    subjectPlaceholder: 'Ex: Erreur lors du rechargement de points de la formule 2',
    messageLabel: 'Détails ou Signalement d\'erreur:',
    messagePlaceholder: 'Expliquez votre problème ici en détail (notamment l\'ID de transaction)...',
    submitComplaintBtn: 'Soumettre le Ticket',
    historyTitle: 'Historique de Tickets ({count})',
    noComplaints: 'Aucune réclamation enregistrée à ce jour.',
    ticketStatus: 'Reçu par le Support',
    unknownUser: 'Membre Anonyme',
    reviewSubmitError: 'Erreur lors du dépôt de votre avis. Réessayez.',
    complaintSubjectError: 'Saisissez le sujet.',
    complaintMessageError: 'Décrivez précisément votre problème.',
    complaintSubmitError: 'Envoi impossible de fiche technique de ticket. Réessayez.'
  },
  es: {
    smartPlatform: 'Conozca Nuestra Plataforma Inteligente',
    brandHeading: 'El Intercambio Líder de {brand}',
    brandDesc: 'Proveemos una solución moderna y 150% garantizada para maximizar su reputación en redes sociales mediante el apoyo mutuo de forma honesta, segura y real.',
    fairExchangeTitle: 'Regulación y Respeto Absoluto',
    fairExchangeDesc: 'Métodos automáticos previenen fraudes y restan saldo al detectar cancelaciones maliciosas.',
    allPlatformsTitle: 'Soporte Completo de Redes',
    allPlatformsDesc: 'Consiga interacciones, seguidores u horas de visualización para cuentas de YouTube, FB, IG, y TikTok.',
    directContacts: 'Asistencia Humana Directa',
    directContactsDesc: '¿Problemas con cargues de saldo o uso de canales? Escríbanos directamente mediante estos enlaces:',
    reviewTitle: 'Su Opinión es un Activo Valioso',
    reviewDesc: 'Apreciamos sus reseñas constructivas para innovar y mejorar las tarifas del sitio.',
    reviewSuccessMsg: '¡Su calificación ha sido publicada con éxito! Gracias por ser parte.',
    reviewErrorMsg: 'Escriba una opinión sólida antes de enviar.',
    ratingLabel: 'Su Calificación:',
    commentPlaceholder: 'Háblenos de la facilidad de canje, resolución de soporte y calidad de campañas...',
    commentLabel: 'Redacte su Reseña:',
    submitReviewBtn: 'Publicar Calificación',
    reviewsHeading: 'Comentarios de la Comunidad ({count})',
    noReviews: 'No se han publicado opiniones. ¡Sea el primero!',
    complaintTitle: 'Abrir Incidencia en Soporte Técnico',
    complaintSuccessMsg: 'Su incidencia se ha registrado de forma correcta. Responderemos a su dirección de correo.',
    complaintErrorMsg: 'Verifique los campos antes de continuar.',
    complaintDesc: 'Las quejas son revisadas por administradores para restablecer cobros fallidos o reclamos.',
    subjectLabel: 'Asunto de Incidencia:',
    subjectPlaceholder: 'ej., Retardo en carga de puntos con criptomonedas',
    messageLabel: 'Descripción Detallada:',
    messagePlaceholder: 'Escriba los pormenores del caso, ID de transacción, etc.',
    submitComplaintBtn: 'Enviar Incidencia',
    historyTitle: 'Mis Incidencias Registradas ({count})',
    noComplaints: 'No existen tickets registrados bajo este perfil de usuario.',
    ticketStatus: 'Recibido por Soporte',
    unknownUser: 'Colaborador Anónimo',
    reviewSubmitError: 'Error en base de datos al subir reseña.',
    complaintSubjectError: 'Debe ingresar un título.',
    complaintMessageError: 'Explique su anomalía técnica.',
    complaintSubmitError: 'Servicio técnico ocupado. Intente pronto.'
  }
};

export default function TechnicalSupport({ user, lang = 'en' }: TechnicalSupportProps) {
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [complaints, setComplaints] = useState<UserComplaint[]>([]);
  const [adminSettings, setAdminSettings] = useState(db.getAdminSettings());

  const activeLang: SupportedLanguages = (lang === 'ar' || lang === 'en' || lang === 'fr' || lang === 'es') ? (lang as SupportedLanguages) : 'en';
  const t = supportTranslations[activeLang];

  // Review Form States
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Complaint Form States
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [complaintSuccess, setComplaintSuccess] = useState<boolean>(false);
  const [complaintError, setComplaintError] = useState<string | null>(null);

  // Load reviews, complaints, and settings
  const loadData = () => {
    setReviews(db.getReviews().sort((a,b) => b.createdAt - a.createdAt));
    setComplaints(db.getComplaints().filter(c => c.userId === user.uid).sort((a,b) => b.createdAt - a.createdAt));
    setAdminSettings(db.getAdminSettings());
  };

  useEffect(() => {
    loadData();

    const handleReviewsUpdated = () => {
      setReviews(db.getReviews().sort((a,b) => b.createdAt - a.createdAt));
    };

    const handleComplaintsUpdated = () => {
      setComplaints(db.getComplaints().filter(c => c.userId === user.uid).sort((a,b) => b.createdAt - a.createdAt));
    };

    const handleSettingsUpdated = () => {
      setAdminSettings(db.getAdminSettings());
    };

    window.addEventListener('ytsocial_reviews_updated', handleReviewsUpdated);
    window.addEventListener('ytsocial_complaints_updated', handleComplaintsUpdated);
    window.addEventListener('ytsocial_settings_updated', handleSettingsUpdated);

    return () => {
      window.removeEventListener('ytsocial_reviews_updated', handleReviewsUpdated);
      window.removeEventListener('ytsocial_complaints_updated', handleComplaintsUpdated);
      window.removeEventListener('ytsocial_settings_updated', handleSettingsUpdated);
    };
  }, [user.uid]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setReviewSuccess(false);

    if (!comment.trim()) {
      setReviewError(t.reviewErrorMsg);
      return;
    }

    try {
      db.submitReview({
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName || t.unknownUser,
        userPhotoURL: user.photoURL,
        rating,
        comment: comment.trim()
      });

      setComment('');
      setRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err: any) {
      setReviewError(t.reviewSubmitError);
    }
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComplaintError(null);
    setComplaintSuccess(false);

    if (!subject.trim()) {
      setComplaintError(t.complaintSubjectError);
      return;
    }
    if (!message.trim()) {
      setComplaintError(t.complaintMessageError);
      return;
    }

    try {
      db.submitComplaint({
        userId: user.uid,
        userEmail: user.email,
        displayName: user.displayName || t.unknownUser,
        subject: subject.trim(),
        message: message.trim()
      });

      setSubject('');
      setMessage('');
      setComplaintSuccess(true);
      setTimeout(() => setComplaintSuccess(false), 5000);
    } catch (err: any) {
      setComplaintError(t.complaintSubmitError);
    }
  };

  return (
    <div className={`space-y-10 ${activeLang === 'ar' ? 'text-right' : 'text-left'}`} dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Intro Header Card */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-8 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className={`relative z-10 flex flex-col md:flex-row gap-8 items-center ${activeLang === 'ar' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 text-xs font-bold leading-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.smartPlatform}</span>
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-white">
              {t.brandHeading.replace('{brand}', 'SocialXchange')}
            </h1>
            
            <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {t.brandDesc}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 flex items-start gap-3 flex-row">
                <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{t.fairExchangeTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t.fairExchangeDesc}</p>
                </div>
              </div>

              <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/30 flex items-start gap-3 flex-row">
                <div className="bg-pink-500/10 p-2 rounded-xl text-pink-400 shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">{t.allPlatformsTitle}</h3>
                  <p className="text-xs text-slate-400 mt-1">{t.allPlatformsDesc}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-2xl p-6 border border-slate-700/40 space-y-4 shadow-xl">
            <HelpCircle className="w-10 h-10 text-indigo-400 animate-bounce" />
            <h2 className="text-xl font-bold text-white">{t.directContacts}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.directContactsDesc}
            </p>
            
            <div className="space-y-3 pt-2">
              {(adminSettings.supportPlatforms || [
                {
                  id: 'facebook',
                  name: activeLang === 'ar' ? 'صفحة الفيس بوك الرسمية' : 'Official Facebook Page',
                  url: adminSettings.facebookPageUrl || 'https://facebook.com/SocialXchange',
                  icon: 'Facebook',
                  isActive: true
                },
                {
                  id: 'support_email',
                  name: activeLang === 'ar' ? 'البريد الإلكتروني للدعم الفني' : 'Technical Support Email',
                  url: `mailto:${adminSettings.supportEmail || 'support@socialxchange.com'}`,
                  icon: 'Mail',
                  isActive: true
                }
              ])
                .filter(p => p.isActive !== false)
                .map((p) => {
                  const isMail = p.url.startsWith('mailto:');
                  return (
                    <a 
                      key={p.id}
                      href={p.url} 
                      target={isMail ? undefined : "_blank"} 
                      rel={isMail ? undefined : "noopener noreferrer"}
                      className="flex items-center gap-3 bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-800 hover:border-indigo-500/30 transition-all text-sm font-semibold text-slate-200 group flex-row"
                    >
                      {getIconComponent(p.icon)}
                      <span className="truncate flex-1">{p.name}</span>
                      {!isMail && <ExternalLink className="w-3.5 h-3.5 text-slate-500" />}
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Form and Reviews Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* RIGHT COLUMN: Review Form & Reviews List */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 flex-row">
              <div className="w-10 h-10 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
                <Star className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.reviewTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t.reviewDesc}</p>
              </div>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {reviewSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-sm flex-row">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{t.reviewSuccessMsg}</span>
                </div>
              )}

              {reviewError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-sm flex-row">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{reviewError}</span>
                </div>
              )}

              {/* Star Rating Picker */}
              <div className="bg-slate-800/30 p-3 rounded-xl border border-slate-700/20 flex items-center justify-between flex-row">
                <span className="text-sm font-bold text-slate-300">{t.ratingLabel}</span>
                <div className="flex gap-1 flex-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="p-1 focus:outline-none transition-transform hover:scale-125"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating !== null ? hoverRating : rating)
                            ? 'text-amber-500 fill-current' 
                            : 'text-slate-600'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">{t.commentLabel}</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t.commentPlaceholder}
                  rows={3}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center justify-center gap-2 flex-row"
              >
                <Send className="w-4 h-4" />
                <span>{t.submitReviewBtn}</span>
              </button>
            </form>
          </div>

          {/* User Reviews Feed */}
          <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 flex-row">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>{t.reviewsHeading.replace('{count}', reviews.length.toString())}</span>
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-8 bg-slate-800/10 rounded-2xl border border-slate-800/20">
                <p className="text-slate-500 text-sm">{t.noReviews}</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/60 space-y-2">
                    <div className="flex items-center justify-between flex-row">
                      <div className="flex items-center gap-2.5 flex-row">
                        <img 
                          src={rev.userPhotoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(rev.displayName)}`}
                          alt={rev.displayName}
                          className="w-8 h-8 rounded-full bg-slate-800 border border-indigo-500/10"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">{rev.displayName}</h4>
                          <span className="text-[10px] text-slate-500">{new Date(rev.createdAt).toLocaleDateString(activeLang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-0.5 flex-row">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating ? 'text-amber-500 fill-current' : 'text-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans pr-1">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* LEFT COLUMN: Complaint Submission Box */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 flex-row">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{t.complaintTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{t.complaintDesc}</p>
              </div>
            </div>

            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              {complaintSuccess && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3 text-sm flex-row">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>{t.complaintSuccessMsg}</span>
                </div>
              )}

              {complaintError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-sm flex-row">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{complaintError}</span>
                </div>
              )}

              {/* Subject Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">{t.subjectLabel}</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t.subjectPlaceholder}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400">{t.messageLabel}</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.messagePlaceholder}
                  rows={5}
                  className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors resize-none ${activeLang === 'ar' ? 'text-right' : 'text-left'}`}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 flex-row"
              >
                <Send className="w-4 h-4" />
                <span>{t.submitComplaintBtn}</span>
              </button>
            </form>
          </div>

          {/* Your Complaint History */}
          <div className="bg-slate-900/20 border border-slate-800/40 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300">{t.historyTitle.replace('{count}', complaints.length.toString())}</h3>
            {complaints.length === 0 ? (
              <p className="text-xs text-slate-500">{t.noComplaints}</p>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {complaints.map((comp) => (
                  <div key={comp.id} className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/50 space-y-1">
                    <div className="flex justify-between items-center flex-row">
                      <span className="text-xs font-bold text-indigo-400">{comp.subject}</span>
                      <span className="text-[9px] text-slate-500">{new Date(comp.createdAt).toLocaleDateString(activeLang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{comp.message}</p>
                    <div className="flex justify-start pt-1">
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 leading-none">{t.ticketStatus}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
