import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase limit because base64 images can be quite large
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // API Route for Screenshot Verification
  app.post('/api/verify-screenshot', async (req, res) => {
    try {
      const { imageBase64, campaignType, campaignTitle } = req.body;

      if (!imageBase64) {
        return res.status(400).json({
          verified: false,
          explanation: 'لم يتم إرسال الصورة بشكل صحيح. يرجى إعادة المحاولة.',
        });
      }

      // Check if API key is configured
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn('GEMINI_API_KEY is not defined in server environment!');
        // Fallback for testing/offline or first initialization before key gets set
        return res.json({
          verified: true,
          confidence: 0.95,
          explanation: 'تم التحقق بنجاح (وضع التجربة نشط، قم بتعيين مفتاح GEMINI_API_KEY في صفحة الأسرار لتككين التدقيق الفعلي بالذكاء الاصطناعي).'
        });
      }

      // Initialize Gemini SDK with telemetry header
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      // Clean base64 data to remove prefixes (like "data:image/png;base64,")
      let cleanBase64 = imageBase64;
      let mimeType = 'image/png';
      if (imageBase64.includes(';base64,')) {
        const parts = imageBase64.split(';base64,');
        mimeType = parts[0].split(':')[1] || 'image/png';
        cleanBase64 = parts[1];
      }

      // Determine platform and action
      let platform = 'Social Media';
      let action = 'Interaction';

      const typeL = (campaignType || '').toLowerCase();
      if (typeL.includes('fb') || typeL.includes('facebook')) {
        platform = 'Facebook (فيسبوك)';
      } else if (typeL.includes('ig') || typeL.includes('instagram')) {
        platform = 'Instagram (انستجرام)';
      } else if (typeL.includes('tiktok')) {
        platform = 'TikTok (تيك توك)';
      } else if (typeL.includes('tg') || typeL.includes('telegram')) {
        platform = 'Telegram (تليجرام)';
      } else if (typeL.includes('youtube') || typeL.includes('video') || typeL.includes('subscribe') || typeL.includes('channel')) {
        platform = 'YouTube (يوتيوب)';
      }

      if (typeL.includes('like')) {
        action = 'Like / Love (إعجاب)';
      } else if (typeL.includes('sub') || typeL.includes('follow')) {
        action = 'Subscribe / Follow (اشتراك ومتابعة)';
      } else if (typeL.includes('watch') || typeL.includes('view')) {
        action = 'Watch / View (مشاهدة وزيارة)';
      }

      const promptText = `أنت خبير ذكاء اصطناعي متخصص في مراجعة لقطات الشاشة (Screenshots) والتحقق من صحتها وتطابقها لمواقع التواصل الاجتماعي.
مهمتك هي فحص ومراجعة لقطة الشاشة المرفقة لتأكيد ما إذا كان المستخدم قد قام بإجراء التفاعل المطلوب بنجاح أم لا.

تفاصيل المهمة المطلوبة:
1. المنصة المستهدفة: ${platform}
2. الإجراء المطلوب: ${action}
3. عنوان المحتوى/القناة/الصفحة: ${campaignTitle || 'غير محدد'}

التعليمات الفنية الضرورية:
- تفحص بدقة ما إذا كانت الصورة عبارة عن لقطة شاشة ملتقطة لمنصة ${platform} على الجوال أو المتصفح.
- ابحث عن مؤشر تفاعلي واضح يثبت إتمام المطلوب:
  * لمهام الإعجاب (Like/Love): تفقد ما إذا كان زر اللايك أو القلب أو الإعجاب مفعلاً أو نشطاً وبلون مغاير (توهج أزرق على فيسبوك، قلب أحمر على انستجرام / تيك توك، زر إعجاب مفعل على يوتيوب).
  * لمهام المتابعة أو الاشتراك (Subscribe/Follow): تفقد ما إذا كان زر "متابعة" أو "مشترك" أو "اشتراك" يعكس إتمام العملية (مثل "متابع"، "Following"، "مشترك"، "تم الاشتراك"، "Subscribed"، "Joined"، "تمت المتابعة").
- اضبط النتيجة كـ JSON دقيق جداً بالتنسيق الفني الموصوف في المخطط.
- يجب كتابة جملة الشرح التوضيحية (explanation) باللغة العربية بأسلوب راقٍ ومقنع يوضح ما لاحظته في الصورة لتأكيد القبول أو الرفض.`;

      // Call Gemini API on gemini-3.5-flash
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verified: {
                type: Type.BOOLEAN,
                description: 'True if the screenshot shows that the required action (like or subscribe/follow) is fully completed, false otherwise.',
              },
              confidence: {
                type: Type.NUMBER,
                description: 'Confidence value of the verification from 0.0 to 1.0.',
              },
              explanation: {
                type: Type.STRING,
                description: 'Brief, friendly explanation in Arabic of what was found or not found in the image (e.g. "تم العثور على زر الاشتراك مفعل بنجاح" or "لم يتم العثور على زر إعجاب مفعّل").',
              },
            },
            required: ['verified', 'confidence', 'explanation'],
          },
        },
      });

      const responseText = response?.text || '';
      console.log('Gemini verification raw response:', responseText);
      
      const result = JSON.parse(responseText.trim());
      return res.json(result);

    } catch (error: any) {
      console.error('Error in screenshot verification endpoint:', error);
      return res.status(500).json({
        verified: false,
        explanation: 'حدث خطأ أثناء معالجة لقطة الشاشة بالذكاء الاصطناعي: ' + (error.message || 'خطأ فني في الاتصال بالخادم'),
      });
    }
  });

  // API Route for Live Platform Stats
  app.get('/api/stats', async (req, res) => {
    try {
      // Load firebase configuration dynamically
      const fs = await import('fs');
      const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      // Initialize Firebase for server instance (safe name to avoid DEFAULT conflicts)
      const { initializeApp: serverInitApp, getApp: serverGetApp } = await import('firebase/app');
      const { getFirestore: serverGetFirestore, doc: serverDoc, getDoc: serverGetDoc } = await import('firebase/firestore');
      
      let fbApp;
      try {
        fbApp = serverGetApp('backend-app');
      } catch (e) {
        fbApp = serverInitApp(firebaseConfig, 'backend-app');
      }
      
      const firestoreDb = serverGetFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

      // Retrieve public aggregated statistics counters
      const docRef = serverDoc(firestoreDb, 'global_stats', 'counters');
      const docSnap = await serverGetDoc(docRef);

      let totalUsers = 0;
      let completedCampaigns = 0;
      let totalExchangedPoints = 0;

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data) {
          totalUsers = typeof data.totalUsers === 'number' ? data.totalUsers : 0;
          completedCampaigns = typeof data.completedCampaigns === 'number' ? data.completedCampaigns : 0;
          totalExchangedPoints = typeof data.totalExchangedPoints === 'number' ? data.totalExchangedPoints : 0;
        }
      } else {
        // Fallback to active seeded counts on brand new database installation
        totalUsers = 15;
        completedCampaigns = 4;
        totalExchangedPoints = 480;
      }

      return res.json({
        totalUsers,
        completedCampaigns,
        totalExchangedPoints,
        raw: {
          users: totalUsers,
          completedCampaigns: completedCampaigns,
          exchangedPoints: totalExchangedPoints
        }
      });
    } catch (error: any) {
      console.error('Error in /api/stats endpoint:', error);
      // Fallback response with clean defaults if DB connection is completely down
      return res.json({
        totalUsers: 15,
        completedCampaigns: 4,
        totalExchangedPoints: 480,
        error: error.message || 'Internal connection issue'
      });
    }
  });

  // Dynamic Platfoms API Endpoint for SocialXchange Premium Interactive Services Hub
  app.get('/api/platforms', (req, res) => {
    const platformsList = [
      {
        id: "youtube",
        categoryAr: "منصة اليوتيوب (YouTube)",
        categoryEn: "YouTube Platform",
        categoryFr: "Plateforme YouTube",
        categoryEs: "Plataforma YouTube",
        color: "from-red-650/15 to-red-600/5 border-red-500/20 text-red-500 hover:border-red-500/50",
        badgeColor: "bg-red-500/10 text-red-400 border-red-500/20",
        iconName: "Youtube",
        items: [
          {
            id: "views",
            labelAr: "مشاهدات يوتيوب حقيقية",
            labelEn: "YouTube Real Views",
            labelFr: "Vues YouTube Réelles",
            labelEs: "Vistas Reales de YouTube",
            descAr: "تبادل فترات بقاء حقيقية لمشاهدات الفيديوهات لتصدر نتائج البحث",
            descEn: "Exchange watch-time actions to excel in recommendation algorithms",
            descFr: "Échange de visionnage pour exceller dans les algorithmes de recommandation",
            descEs: "Intercambio de tiempo de visualización para sobresalir en algoritmos de recomendación",
            iconName: "Eye",
            pointsAr: "كسب 50+ ن",
            pointsEn: "Earn +50P",
            pointsFr: "+50 Pts",
            pointsEs: "+50 Pts"
          },
          {
            id: "subs",
            labelAr: "اشتراكات قنوات يوتيوب",
            labelEn: "YouTube Channel Subs",
            labelFr: "Abonnements Chaînes YouTube",
            labelEs: "Subscripciones de YouTube",
            descAr: "قنوات مقترحة للأعضاء لكسب المشتركين بشكل طبيعي وآمن",
            descEn: "Recommended quality channels for users to subscribe naturally",
            descFr: "Chaînes de qualité recommandées pour s'abonner naturellement",
            descEs: "Canales recomendados para suscribirse de forma natural y orgánica",
            iconName: "UserPlus",
            pointsAr: "كسب 50ن",
            pointsEn: "Earn +50P",
            pointsFr: "+50 Pts",
            pointsEs: "+50 Pts"
          },
          {
            id: "likes",
            labelAr: "لايكات وإعجابات يوتيوب",
            labelEn: "YouTube Video Likes",
            labelFr: "Mentions J'aime YouTube",
            labelEs: "Me Gusta de YouTube",
            descAr: "زيادة تفاعلات الإعجاب بالفيديو وتحسين التقييم والمقترحات",
            descEn: "Get genuine likes on your public videos to satisfy parameters",
            descFr: "Obtenez de vrais j'aime sur vos vidéos publiques pour satisfaire les paramètres",
            descEs: "Obtenga me gusta legítimos en sus videos para potenciar el algoritmo",
            iconName: "ThumbsUp",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          }
        ]
      },
      {
        id: "traffic_exchange",
        categoryAr: "تبادل زيارات المواقع (Traffic Exchange)",
        categoryEn: "Website Traffic Exchange",
        categoryFr: "Échange de Trafic Web",
        categoryEs: "Intercambio de Tráfico Web",
        color: "from-indigo-650/15 to-indigo-600/5 border-indigo-500/20 text-indigo-400 hover:border-indigo-500/50",
        badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        iconName: "Globe",
        items: [
          {
            id: "website_views",
            labelAr: "مشاهدة المواقع وزيارتها",
            labelEn: "Browse Websites & Earn",
            labelFr: "Visites de Sites Web",
            labelEs: "Visitas de Sitios Web",
            descAr: "تصفح وزيارة مواقع الرعاية الموثوقة للحصول على نقاط ترويجية",
            descEn: "Browse sponsor websites to accumulate promotional points and rewards",
            descFr: "Naviguez sur les sites des sponsors pour gagner de gros points",
            descEs: "Navegue por páginas recomendadas para ganar valiosos puntos",
            iconName: "ExternalLink",
            pointsAr: "كسب 30-240 ن",
            pointsEn: "Earn 30-240P",
            pointsFr: "30-240 Pts",
            pointsEs: "30-240 Pts"
          }
        ]
      },
      {
        id: "facebook",
        categoryAr: "منصة الفيسبوك (Facebook)",
        categoryEn: "Facebook Platform",
        categoryFr: "Plateforme Facebook",
        categoryEs: "Plataforma Facebook",
        color: "from-blue-655/15 to-blue-600/5 border-blue-500/20 text-blue-500 hover:border-blue-500/50",
        badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        iconName: "Facebook",
        items: [
          {
            id: "fb_follows",
            labelAr: "متابعات صفحات فيسبوك",
            labelEn: "Facebook Page Follows",
            labelFr: "Abonnés Pages Facebook",
            labelEs: "Seguidores de Páginas FB",
            descAr: "تنمية جمهور وسرعة انتشار لصفحتك العامة أو بروفايلك",
            descEn: "Expand your public network presence and community circles",
            descFr: "Développez votre audience sur vos pages professionnelles",
            descEs: "Haga crecer sus páginas de Facebook sumando seguidores auténticos",
            iconName: "UserPlus",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          },
          {
            id: "fb_likes",
            labelAr: "متابعات لايكات فيسبوك",
            labelEn: "Facebook Followers & Likes",
            labelFr: "Mentions J'aime Facebook",
            labelEs: "Me Gusta de Facebook",
            descAr: "لايكات وتفاعلات أمنة للمنشورات لرفع تفاعلك الطبيعي",
            descEn: "Gain quality engagements and likes on specified feeds",
            descFr: "Obtenez des appréciations de qualité sur vos publications",
            descEs: "Reciba me gusta genuinos en sus publicaciones de Facebook",
            iconName: "ThumbsUp",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          }
        ]
      },
      {
        id: "instagram",
        categoryAr: "منصة الانستجرام (Instagram)",
        categoryEn: "Instagram Platform",
        categoryFr: "Plateforme Instagram",
        categoryEs: "Plataforma Instagram",
        color: "from-pink-550/15 to-purple-650/5 border-purple-500/20 text-purple-400 hover:border-purple-500/50",
        badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        iconName: "Instagram",
        items: [
          {
            id: "ig_follows",
            labelAr: "متابعات وليكات إنستغرام",
            labelEn: "Instagram Followers & Likes",
            labelFr: "Abonnés Instagram Réels",
            labelEs: "Seguidores de Instagram",
            descAr: "فولو سريع لزيادة عدد المتابعين وتوثيق حسابك بالأرقام",
            descEn: "Follow profiles to scale user engagement metrics instantly",
            descFr: "Augmentez le nombre de vos abonnés sur Instagram",
            descEs: "Siga cuentas o consiga seguidores en su perfil de Instagram",
            iconName: "UserPlus",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          },
          {
            id: "ig_likes",
            labelAr: "لايكات منشورات انستجرام",
            labelEn: "Instagram Photo Likes",
            labelFr: "Mentions J'aime Instagram",
            labelEs: "Me Gusta en Instagram",
            descAr: "إعجابات للصور، الفيديوهات أو الريلز لمضاعفة حضورك",
            descEn: "Likes on beautiful posts or trending reels to double impact",
            descFr: "J'aime sur vos photos ou réels tendance pour doubler l'engagement",
            descEs: "Consiga likes en fotos, videos o Reels de Instagram",
            iconName: "ThumbsUp",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          }
        ]
      },
      {
        id: "tiktok",
        categoryAr: "منصة التيك توك (TikTok)",
        categoryEn: "TikTok Platform",
        categoryFr: "Plateforme TikTok",
        categoryEs: "Plataforma TikTok",
        color: "from-cyan-550/15 to-slate-950/5 border-cyan-500/20 text-cyan-400 hover:border-cyan-500/50",
        badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
        iconName: "Flame",
        items: [
          {
            id: "tiktok_follows",
            labelAr: "متابعات و ليكات تيك توك",
            labelEn: "TikTok Followers & Likes",
            labelFr: "Abonnements Profils TikTok",
            labelEs: "Seguidores de TikTok",
            descAr: "متابعات سريعة للملف الشخصي للوصول لشرط البث والانتشار",
            descEn: "Follow creators to unlock visual live broadcasts and popularity",
            descFr: "Suivez des créateurs pour débloquer les streams en direct",
            descEs: "Siga perfiles de creadores de contenido para dinamizar su cuenta",
            iconName: "UserPlus",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          },
          {
            id: "tiktok_likes",
            labelAr: "لايكات فيديوهات تيك توك",
            labelEn: "TikTok Video Likes",
            labelFr: "Mentions J'aime Vidéos TikTok",
            labelEs: "Me Gusta de TikTok",
            descAr: "إعجابات حقيقية للفيديوهات والريلز لتصدر الـ For You",
            descEn: "Direct loves on interactive uploads to excel on standard feeds",
            descFr: "Obtenez des coeurs sur vos vidéos pour percer la page For You",
            descEs: "Me gusta reales para sus cargas de videos de TikTok",
            iconName: "ThumbsUp",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          }
        ]
      },
      {
        id: "twitter_x",
        categoryAr: "منصة إكس (Twitter/X)",
        categoryEn: "X Platform",
        categoryFr: "Plateforme X",
        categoryEs: "Plataforma X",
        color: "from-slate-750/15 to-slate-950/5 border-slate-700/20 text-slate-300 hover:border-slate-500/50",
        badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
        iconName: "Compass",
        items: [
          {
            id: "x_follow",
            labelAr: "متابعات و ليكات إكس (X)",
            labelEn: "X Followers & Likes",
            labelFr: "Abonnés Profil X",
            labelEs: "Seguidores de Cuenta X",
            descAr: "متابعة حسابات الأعضاء والنشطاء لرفع التأثير والنمو المعزز متبادلاً",
            descEn: "Follow active profiles to grow organic audience and credibility",
            descFr: "Suivez des profils authentiques pour élargir votre présence",
            descEs: "Suma followers reales en X (Twitter)",
            iconName: "UserPlus",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          },
          {
            id: "x_like",
            labelAr: "لايكات منشورات وتغريدات إكس",
            labelEn: "X Post Likes",
            labelFr: "Mentions J'aime X",
            labelEs: "Me Gusta de X",
            descAr: "لايكات تفاعلية للتغريدات والمنشورات لترشيحها ضمن الهشتاقات الرائدة",
            descEn: "Likes and engagement on tweets to promote content visibility",
            descFr: "Mentions j'aime sur vos tweets pour maximiser le focus",
            descEs: "Me gusta reales en tus tweets y publicaciones",
            iconName: "ThumbsUp",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          }
        ]
      },
      {
        id: "telegram",
        categoryAr: "منصة التليجرام (Telegram)",
        categoryEn: "Telegram Platform",
        categoryFr: "Plateforme Telegram",
        categoryEs: "Plataforma Telegram",
        color: "from-sky-550/15 to-slate-950/5 border-sky-500/20 text-sky-400 hover:border-sky-500/50",
        badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
        iconName: "Send",
        items: [
          {
            id: "tg_join",
            labelAr: "اشتراكات تليجرام",
            labelEn: "Telegram Channel Members",
            labelFr: "Membres Télégram",
            labelEs: "Miembros de Telegram",
            descAr: "انضمام لقنوات ومجموعات تليجرام حقيقية لزيادة نشاط وسرعة نمو قناتك تليجرام",
            descEn: "Join public channels or groups to build permanent audience bases",
            descFr: "Inscrivez-vous sur les canaux publics pour maximiser les vues",
            descEs: "Únase a canales y grupos públicos de Telegram",
            iconName: "UserPlus",
            pointsAr: "كسب 40ن",
            pointsEn: "Earn +40P",
            pointsFr: "+40 Pts",
            pointsEs: "+40 Pts"
          }
        ]
      }
    ];
    return res.json(platformsList);
  });

    // Local Emulation for Netlify Function: auth.js
  app.post('/.netlify/functions/auth', async (req, res) => {
    try {
      const { action, email, password, displayName, userId } = req.body;

      const targetEmail = (email || '').toLowerCase().trim();
      if (!targetEmail) {
        return res.status(400).json({ error: 'العنوان البريدي مطلوب.' });
      }

      const targetUserId = userId || `vanilla_${targetEmail}`;

      // Dynamic load firebase configurations
      const fs = await import('fs');
      const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      const { initializeApp: serverInitApp, getApp: serverGetApp } = await import('firebase/app');
      const { getFirestore: serverGetFirestore, doc: serverDoc, getDoc: serverGetDoc, setDoc: serverSetDoc } = await import('firebase/firestore');

      let fbApp;
      try {
        fbApp = serverGetApp('server-auth');
      } catch (e) {
        fbApp = serverInitApp(firebaseConfig, 'server-auth');
      }
      const firestoreDb = serverGetFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

      const userDocRef = serverDoc(firestoreDb, 'users', targetUserId);
      const userDocSnapshot = await serverGetDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (action === 'login' || !action) {
          // Check password if developer passed one and user has password
          if (password && userData?.password && userData.password !== password) {
            return res.status(401).json({ error: 'كلمة المرور المدخلة غير صحيحة.' });
          }
        }

        return res.json({
          success: true,
          message: 'تم تسجيل الدخول أو استرداد البيانات بنجاح.',
          user: {
            email: userData?.email || targetEmail,
            displayName: userData?.displayName || targetEmail.split('@')[0],
            points: typeof userData?.points === 'number' ? userData.points : 1000
          }
        });
      } else {
        if (action === 'login') {
          return res.status(404).json({ error: 'هذا البريد الإلكتروني غير مسجل. يرجى إنشاء حساب جديد أولاً.' });
        }

        const defaultPoints = 1000;
        const newUser = {
          email: targetEmail,
          displayName: (displayName || targetEmail.split('@')[0]).trim(),
          password: password || '123456',
          points: defaultPoints,
          createdAt: Date.now()
        };

        await serverSetDoc(userDocRef, newUser);

        return res.status(201).json({
          success: true,
          message: 'تم تسجيل الحساب بنجاح وتم منحك 1000 نقطة ترحيبية!',
          user: {
            email: newUser.email,
            displayName: newUser.displayName,
            points: newUser.points
          }
        });
      }

    } catch (err: any) {
      console.error('Error in local auth simulation:', err);
      return res.status(500).json({ error: 'فشل معالجة المصادقة: ' + err.message });
    }
  });

  // Local Emulation for Netlify Function: login.js
  app.post('/.netlify/functions/login', async (req, res) => {
    try {
      const { userId, email } = req.body;

      const targetEmail = (email || '').toLowerCase().trim();
      if (!targetEmail) {
        return res.status(400).json({ error: 'العنوان البريدي مطلوب.' });
      }

      const targetUserId = userId || `vanilla_${targetEmail}`;

      // Dynamic load firebase configurations
      const fs = await import('fs');
      const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      const { initializeApp: serverInitApp, getApp: serverGetApp } = await import('firebase/app');
      const { getFirestore: serverGetFirestore, doc: serverDoc, getDoc: serverGetDoc, setDoc: serverSetDoc } = await import('firebase/firestore');

      let fbApp;
      try {
        fbApp = serverGetApp('server-login');
      } catch (e) {
        fbApp = serverInitApp(firebaseConfig, 'server-login');
      }
      const firestoreDb = serverGetFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

      const userDocRef = serverDoc(firestoreDb, 'users', targetUserId);
      const userDocSnapshot = await serverGetDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        return res.json({
          message: "Login successful",
          user: {
            ...userData,
            email: userData?.email || targetEmail,
            points: typeof userData?.points === 'number' ? userData.points : 1000
          }
        });
      } else {
        const newUser = {
          email: targetEmail,
          displayName: targetEmail.split('@')[0],
          points: 1000,
          createdAt: new Date().toISOString()
        };

        await serverSetDoc(userDocRef, newUser);

        return res.status(201).json({
          message: "User created",
          user: newUser
        });
      }

    } catch (err: any) {
      console.error('Error in local login simulation:', err);
      return res.status(500).json({ error: err.message });
    }
  });

  // Local Emulation for Netlify Function: transaction.js
  app.post('/.netlify/functions/transaction', async (req, res) => {
    try {
      const { email, serviceId, cost } = req.body;

      if (!email || !serviceId || cost === undefined || cost <= 0) {
        return res.status(400).json({ error: 'بيانات الطلب غير مكتملة أو غير صالحة.' });
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Dynamic load firebase configurations
      const fs = await import('fs');
      const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      const { initializeApp: serverInitApp, getApp: serverGetApp } = await import('firebase/app');
      const { getFirestore: serverGetFirestore, doc: serverDoc, getDoc: serverGetDoc, setDoc: serverSetDoc } = await import('firebase/firestore');

      let fbApp;
      try {
        fbApp = serverGetApp('server-transaction');
      } catch (e) {
        fbApp = serverInitApp(firebaseConfig, 'server-transaction');
      }
      const firestoreDb = serverGetFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

      const userDocRef = serverDoc(firestoreDb, 'users', `vanilla_${normalizedEmail}`);
      const userSnapshot = await serverGetDoc(userDocRef);

      if (!userSnapshot.exists()) {
        return res.status(404).json({ error: 'المستخدم غير موجود بقاعدة البيانات.' });
      }

      const userData = userSnapshot.data();
      const currentPoints = userData?.points || 0;

      if (currentPoints < cost) {
        return res.status(400).json({
          error: `عذراً، رصيدك غير كافٍ. تحتاج إلى ${cost} نقطة بينما رصيدك الحالي هو ${currentPoints} نقطة.`,
          currentPoints
        });
      }

      const remainingPoints = currentPoints - cost;
      const updatedUser = {
        ...userData,
        points: remainingPoints
      };

      await serverSetDoc(userDocRef, updatedUser);

      return res.json({
        success: true,
        message: `تم تنفيذ خدمة "${serviceId}" بنجاح! تم خصم ${cost} نقطة.`,
        newPoints: remainingPoints
      });

    } catch (err: any) {
      console.error('Error in local transaction simulation:', err);
      return res.status(500).json({ error: 'حدث خطأ غير متوقع أثناء معالجة العملية: ' + err.message });
    }
  });

  // Local Emulation for Netlify Function: daily-bonus.js
  app.post('/.netlify/functions/daily-bonus', async (req, res) => {
    try {
      const { email, action, userId } = req.body;

      let targetUserId = '';
      if (userId) {
        targetUserId = userId;
      } else if (email) {
        const normalizedEmail = email.toLowerCase().trim();
        targetUserId = `vanilla_${normalizedEmail}`;
      } else {
        return res.status(400).json({ error: 'البريد الإلكتروني أو معرف المستخدم (userId) مطلوب لتنفيذ هذا الإجراء.' });
      }

      // Compute central date parameters (UTC YYYY-MM-DD)
      const serverDate = new Date();
      const todayStr = serverDate.toISOString().split('T')[0];
      const nowTimestamp = Date.now();

      // Dynamic load firebase configurations
      const fs = await import('fs');
      const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
      const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

      const { initializeApp: serverInitApp, getApp: serverGetApp } = await import('firebase/app');
      const { getFirestore: serverGetFirestore, doc: serverDoc, getDoc: serverGetDoc, updateDoc: serverUpdateDoc, increment: serverIncrement } = await import('firebase/firestore');

      let fbApp;
      try {
        fbApp = serverGetApp('server-daily-bonus');
      } catch (e) {
        fbApp = serverInitApp(firebaseConfig, 'server-daily-bonus');
      }
      const firestoreDb = serverGetFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

      const userDocRef = serverDoc(firestoreDb, 'users', targetUserId);
      const docSnap = await serverGetDoc(userDocRef);

      if (!docSnap.exists()) {
        return res.status(404).json({ error: 'المستخدم غير مسجل بالنظام.' });
      }

      const userData = docSnap.data();

      let tasksCompletedToday = typeof userData.tasksCompletedToday === 'number' ? userData.tasksCompletedToday : 0;
      let lastTaskDate = userData.lastTaskDate || '';
      let lastBonusClaimed = userData.lastBonusClaimed || 0;
      let points = typeof userData.points === 'number' ? userData.points : 1000;

      // Check if a new day has arrived relative to server clock
      if (lastTaskDate !== todayStr) {
        tasksCompletedToday = 0;
        lastTaskDate = todayStr;

        await serverUpdateDoc(userDocRef, {
          tasksCompletedToday: 0,
          lastTaskDate: todayStr
        });
      }

      // Action A: Get Status
      if (action === 'get_status') {
        const msSinceLastClaim = nowTimestamp - lastBonusClaimed;
        const hoursToWaitNum = 24;
        const canClaimBonusTime = lastBonusClaimed === 0 || msSinceLastClaim >= hoursToWaitNum * 60 * 60 * 1000;
        const timeRemainingMs = Math.max(0, (hoursToWaitNum * 60 * 60 * 1000) - msSinceLastClaim);

        return res.json({
          success: true,
          points,
          tasksCompletedToday,
          lastTaskDate,
          lastBonusClaimed,
          canClaimBonusTime,
          timeRemainingMs,
          today: todayStr,
          requiredTasks: 50
        });
      }

      // Action B: Complete Task
      if (action === 'complete_task') {
        const incrementVal = 1;
        const newTasksCompletedToday = tasksCompletedToday + incrementVal;

        await serverUpdateDoc(userDocRef, {
          tasksCompletedToday: serverIncrement(incrementVal),
          lastTaskDate: todayStr
        });

        return res.json({
          success: true,
          message: 'تم تسجيل إنجاز المهمة الترويجية بنجاح بنظام المكافآت.',
          tasksCompletedToday: newTasksCompletedToday,
          today: todayStr
        });
      }

      // Action C: Claim Bonus
      if (action === 'claim_bonus') {
        const taskThreshold = 50;
        if (tasksCompletedToday < taskThreshold) {
          return res.status(400).json({
            error: `لم تكمل شروط المكافأة اليومية بعد. لقد أنجزت ${tasksCompletedToday} مهمة فقط اليوم، تتبقى لك ${taskThreshold - tasksCompletedToday} من المهام المطلوبة لتفعيل فرصة سحب الـ 1000 نقطة.`
          });
        }

        const hoursToWaitNum = 24;
        const msSinceLastClaim = nowTimestamp - lastBonusClaimed;
        if (lastBonusClaimed !== 0 && msSinceLastClaim < hoursToWaitNum * 60 * 60 * 1000) {
          const remainingMs = (hoursToWaitNum * 60 * 60 * 1000) - msSinceLastClaim;
          const remHours = Math.floor(remainingMs / (60 * 60 * 1000));
          const remMinutes = Math.floor((remainingMs % (60 * 60 * 1000)) / (60 * 1000));

          return res.status(400).json({
            error: `عذراً، لقد استلمت مكافأتك اليومية بالفعل. تتبقى لك فترة انتظار: ${remHours} ساعة و ${remMinutes} دقيقة قبل السحب القادم.`
          });
        }

        const rewardPoints = 1000;
        const finalPoints = points + rewardPoints;

        await serverUpdateDoc(userDocRef, {
          points: serverIncrement(rewardPoints),
          lastBonusClaimed: nowTimestamp
        });

        return res.json({
          success: true,
          message: 'مبارك! حصلت على جائزتك اليومية بقيمة 1000 نقطة مجانية بنجاح تم إيداعها بمحفظتك.',
          newPoints: finalPoints,
          lastBonusClaimed: nowTimestamp
        });
      }

      return res.status(400).json({ error: 'العملية المطلوبة غير صحيحة.' });

    } catch (err: any) {
      console.error('Error in local daily-bonus simulation:', err);
      return res.status(500).json({ error: 'حدث خطأ غير متوقع أثناء معالجة المكافأة اليومية بالنظام: ' + err.message });
    }
  });

  // Serve Vite in development, static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://0.0.0.0:${PORT}`);
  });
}

startServer();
