import { User, Campaign, ActionHistory, CryptoPayment, AdminSettings, Advertisement, CampaignType, UserReview, UserComplaint, WithdrawalRequest, TaskVerification } from '../types';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// --- Firestore Error Handlers ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Default Admin Settings
const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  btcAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  ethAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  dogeAddress: 'DH5yaieqoD7EE6AKCcofVuePV648mC23Cr',
  trxAddress: 'TY9YhUvX9Q2rE2B6H5MHe5kPjXGvG2281u',
  usdtAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F (ERC20 / TRC20)',
  vodafoneCash: '01012345678',
  etisalatCash: '01112345678',
  orangeCash: '01212345678',
  weCash: '01512345678',
  instapay: 'username@instapay',
  supportEmail: 'support@socialxchange.com',
  facebookPageUrl: 'https://facebook.com/SocialXchange',
  socialLinkPlatforms: [
    {
      id: 'youtube',
      name: 'يوتيوب (YouTube API)',
      desc: 'لمصادقة الاشتراكات ومطابقة تفعيل زر الجرس والتحقق التلقائي الآمن.',
      place: '@username أو رابط القناة المفتوحة للتبادل',
      icon: 'Youtube',
      isActive: true
    },
    {
      id: 'facebook',
      name: 'فيسبوك (Facebook Sync)',
      desc: 'لإثبات ومطابقة لايكات المنشورات والصفحات على فيسبوك تلقائياً.',
      place: 'اسم المستخدم أو رابط الملف التعريفي الشخصي',
      icon: 'Facebook',
      isActive: true
    },
    {
      id: 'instagram',
      name: 'انستغرام (Instagram Connect)',
      desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات في بضع ثوانٍ غيبياً.',
      place: '@username أو رابط البروفايل',
      icon: 'Instagram',
      isActive: true
    },
    {
      id: 'tiktok',
      name: 'تيك توك (TikTok Verifier)',
      desc: 'لكشف الإعجابات والمتابعات الفورية لحسابات وصناع محتوى تيك توك.',
      place: '@username الخاص بالتيك توك الخاص بك',
      icon: 'Flame',
      isActive: true
    },
    {
      id: 'x',
      name: 'إكس / تويتر (X / Twitter Portal)',
      desc: 'لمصادقة والتحقق من متابعات ولايكات منشورات وحسابات منصة إكس تلقائياً.',
      place: 'اسم المستخدم لمنصة إكس الخاص بك (مثل: @username)',
      icon: 'Compass',
      isActive: true
    },
    {
      id: 'pinterest',
      name: 'بنترست (Pinterest Connect)',
      desc: 'للتحقق من إتمام الفولو والمتابعات واللايكات لمنصة بنترست تلقائياً وبأمان.',
      place: 'اسم المستخدم لمنصة بنترست الخاص بك (مثل: @username)',
      icon: 'Pin',
      isActive: true
    },
    {
      id: 'telegram',
      name: 'تليجرام (Telegram Sync)',
      desc: 'لمطابقة والتحقق من اشتراكات وانضمام قنوات ومجموعات تليجرام تلقائياً.',
      place: 'اسم المستخدم للتليجرام الخاص بك (مثل: @username)',
      icon: 'Send',
      isActive: true
    }
  ],
  supportPlatforms: [
    {
      id: 'facebook',
      name: 'صفحة الفيس بوك الرسمية',
      url: 'https://facebook.com/SocialXchange',
      icon: 'Facebook',
      isActive: true
    },
    {
      id: 'support_email',
      name: 'البريد الإلكتروني للدعم الفني',
      url: 'mailto:support@socialxchange.com',
      icon: 'Mail',
      isActive: true
    }
  ],
  exchangeRates: [
    { points: 50000, dollars: 1, label: 'مستوى برونزي' },
    { points: 100000, dollars: 2, label: 'مستوى فضي' },
    { points: 150000, dollars: 4, label: '🔥 مستوى ذهبي (مكافأة +$1)' },
    { points: 200000, dollars: 6, label: '💎 بطل المنصة (مكافأة +$2)' }
  ],
  purchasePackages: [
    { id: 'pack1', name: 'الباقة الفضية', points: 30000, price: 5, desc: 'الباقة الفضية الأكثر تداولاً للبداية السريعة' },
    { id: 'pack2', name: 'الباقة الذهبية', points: 100005, price: 10, desc: 'الباقة الذهبية للمحترفين والمروجين' },
    { id: 'pack3', name: 'الباقة العملاقة', points: 200000, price: 18, desc: 'الباقة العملاقة بأعلى انتشار ورعاية' },
    { id: 'pack4', name: 'الباقة الاحترافية', points: 1000000, price: 60, desc: 'الباقة الاحترافية لمسؤولي الحملات الضخمة' }
  ]
};

// Initial realistic campaigns for a rich start
export const DEFAULT_CAMPAIGNS: Campaign[] = [];
export const OLD_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_1',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
    youtubeId: '5qap5aO4i9A',
    title: 'موسيقى هادئة للاسترخاء والدراسة - Lofi Beats 🎧',
    duration: 60,
    pointsPerAction: 50,
    rewardPerAction: 40,
    quantity: 100,
    completedCount: 42,
    status: 'active',
    createdAt: Date.now() - 3600000 * 24
  },
  {
    id: 'camp_2',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=9S6b_pizYg0',
    youtubeId: '9S6b_pizYg0',
    title: 'مناظر طبيعية خلابة بجودة 4K لتصفية الذهن 🏔️',
    duration: 120,
    pointsPerAction: 100,
    rewardPerAction: 80,
    quantity: 50,
    completedCount: 15,
    status: 'active',
    createdAt: Date.now() - 3600000 * 12
  },
  {
    id: 'camp_3',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=w9Z6gYvO3vA',
    youtubeId: 'w9Z6gYvO3vA',
    title: 'رحلة إلى الفضاء الخارجي وعجائب الكون المذهلة 🌌',
    duration: 180,
    pointsPerAction: 150,
    rewardPerAction: 130,
    quantity: 80,
    completedCount: 22,
    status: 'active',
    createdAt: Date.now() - 3600000 * 18
  },
  {
    id: 'camp_4',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=aqG_rVfpxaQ',
    youtubeId: 'aqG_rVfpxaQ',
    title: 'بيانو هادئ للمساعدة على النوم العميق والتخلص من التوتر 🎹',
    duration: 60,
    pointsPerAction: 50,
    rewardPerAction: 40,
    quantity: 120,
    completedCount: 10,
    status: 'active',
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'camp_5',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=7YVEpA63_iY',
    youtubeId: '7YVEpA63_iY',
    title: 'جولة سحرية في ريف سويسرا وجبال الألب الخلابة 🇨🇭',
    duration: 120,
    pointsPerAction: 100,
    rewardPerAction: 80,
    quantity: 60,
    completedCount: 8,
    status: 'active',
    createdAt: Date.now() - 3600000 * 15
  },
  {
    id: 'camp_6',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=pD8f4-272OQ',
    youtubeId: 'pD8f4-272OQ',
    title: 'فن الخط العربي وكتابة آيات قرآنية بشكل جمالي مذهل ✍️',
    duration: 60,
    pointsPerAction: 50,
    rewardPerAction: 40,
    quantity: 200,
    completedCount: 35,
    status: 'active',
    createdAt: Date.now() - 3600000 * 9
  },
  {
    id: 'camp_7',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=UfI6vN-Yg-4',
    youtubeId: 'UfI6vN-Yg-4',
    title: 'موسيقى جاز هادئة لتوفير جو رائع للتركيز والعمل ☕',
    duration: 180,
    pointsPerAction: 150,
    rewardPerAction: 130,
    quantity: 90,
    completedCount: 20,
    status: 'active',
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'camp_8',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=X_q5mK0nC-k',
    youtubeId: 'X_q5mK0nC-k',
    title: 'تعلم أساسيات البرمجة للمبتدئين بلغة بسيطة جداً 💻',
    duration: 120,
    pointsPerAction: 100,
    rewardPerAction: 80,
    quantity: 40,
    completedCount: 2,
    status: 'active',
    createdAt: Date.now() - 3600000 * 20
  },
  {
    id: 'camp_9',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=O_qG7T_m8h8',
    youtubeId: 'O_qG7T_m8h8',
    title: 'أجمل الأناشيد الروحانية بصوت عذب يبعث على الراحة  🕊️',
    duration: 60,
    pointsPerAction: 50,
    rewardPerAction: 40,
    quantity: 150,
    completedCount: 15,
    status: 'active',
    createdAt: Date.now() - 3600000 * 30
  },
  {
    id: 'camp_10',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    title: 'طريقة عمل أشهى الكعكات الشرقية بطبقات الكريمة والشكولاتة 🍰',
    duration: 120,
    pointsPerAction: 100,
    rewardPerAction: 80,
    quantity: 70,
    completedCount: 11,
    status: 'active',
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'camp_11',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'view',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    title: 'أفضل الأجهزة التقنية والهواتف الذكية المنتظرة في العام الجديد 📱',
    duration: 60,
    pointsPerAction: 50,
    rewardPerAction: 40,
    quantity: 100,
    completedCount: 4,
    status: 'active',
    createdAt: Date.now() - 3600050
  },

  // LIKE CAMPAIGNS (11 Items)
  {
    id: 'camp_l1',
    creatorId: 'user_test_2',
    creatorEmail: 'ahmed.dev@gmail.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z4b4VAtE82U',
    youtubeId: 'Z4b4VAtE82U',
    title: 'شرح رائع لتعلم لغة بايثون في ساعة واحدة فقط! 🐍',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 30,
    completedCount: 8,
    status: 'active',
    createdAt: Date.now() - 3600000 * 6
  },
  {
    id: 'camp_l2',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=H388YFhW3N0',
    youtubeId: 'H388YFhW3N0',
    title: 'دليل شامل لتعلم لغة تايب سكريبت الحديثة بتمارين تفاعلية 💎',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 50,
    completedCount: 15,
    status: 'active',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'camp_l3',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
    youtubeId: 'Ke90Tje7VS0',
    title: 'تعلم بناء تطبيقات ويب تفاعلية مذهلة باستخدام مكتبة React 18 ⚛️',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 40,
    completedCount: 9,
    status: 'active',
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'camp_l4',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=-p931S1R7B4',
    youtubeId: '-p931S1R7B4',
    title: 'تصميم واجهة مستخدم احترافية لتطبيقات الهواتف المذهلة 📱',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 80,
    completedCount: 12,
    status: 'active',
    createdAt: Date.now() - 3600000 * 2
  },
  {
    id: 'camp_l5',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=Yv_O_1nE-gE',
    youtubeId: 'Yv_O_1nE-gE',
    title: 'خارطة طريق الأمن السيبراني وحماية البيانات من الاختراقات 🛡️',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 60,
    completedCount: 30,
    status: 'active',
    createdAt: Date.now() - 3600000 * 7
  },
  {
    id: 'camp_l6',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=vjf7yXS1qG8',
    youtubeId: 'vjf7yXS1qG8',
    title: 'احترف السيرفرات الخلفية وقواعد البيانات باستخدام Node.JS ⚡',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 50,
    completedCount: 4,
    status: 'active',
    createdAt: Date.now() - 3600000 * 6
  },
  {
    id: 'camp_l7',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=l1m8mS1xP7k',
    youtubeId: 'l1m8mS1xP7k',
    title: 'أفضل أدوات ومواقع برمجية يحتاجها كل مطور ويب حالياً 🛠️',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 65,
    completedCount: 20,
    status: 'active',
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'camp_l8',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=rXDSz_vE5Sg',
    youtubeId: 'rXDSz_vE5Sg',
    title: 'شرح مبسط لقدرات CSS Flexbox لتصميم شاشات متجاوبة بالكامل 🎨',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 90,
    completedCount: 50,
    status: 'active',
    createdAt: Date.now() - 3600000 * 9
  },
  {
    id: 'camp_l9',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=g39v4_8sW7A',
    youtubeId: 'g39v4_8sW7A',
    title: 'مقدمة سريعة ومفهومة جداً لحاويات دوكر Docker وكيفية استخدامها 🐳',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 110,
    completedCount: 5,
    status: 'active',
    createdAt: Date.now() - 3600000 * 11
  },
  {
    id: 'camp_l10',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'like',
    youtubeUrl: 'https://www.youtube.com/watch?v=M2uX7-t5S_g',
    youtubeId: 'M2uX7-t5S_g',
    title: 'تعلم استخدام جيت وجيت هاب لإدارة وتخزين مشاريعك البرمجية 🐈🐈‍⬛',
    duration: 60,
    pointsPerAction: 60,
    rewardPerAction: 40,
    quantity: 120,
    completedCount: 80,
    status: 'active',
    createdAt: Date.now() - 3600000 * 12
  },

  // SUBSCRIBE CAMPAIGNS (11 Items)
  {
    id: 'camp_4',
    creatorId: 'user_test_3',
    creatorEmail: 'mona.beauty@gmail.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    youtubeId: 'ScMzIvxBSi4',
    title: 'قناة مونا للطهي والحلويات الشرقية - اشترك الآن! 🍰',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 40,
    completedCount: 12,
    status: 'active',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'camp_s2',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=H388YFhW3N0',
    youtubeId: 'H388YFhW3N0',
    title: 'اشترك في قناة عالم التقنية والهواتف الذكية لمتابعة كل جديد 📱',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 30,
    completedCount: 5,
    status: 'active',
    createdAt: Date.now() - 3600000 * 3
  },
  {
    id: 'camp_s3',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
    youtubeId: 'Ke90Tje7VS0',
    title: 'قناة أكاديمية الكود العربي - دروس يومية في الويب 💻',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 50,
    completedCount: 10,
    status: 'active',
    createdAt: Date.now() - 3600000 * 6
  },
  {
    id: 'camp_s4',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=-p931S1R7B4',
    youtubeId: '-p931S1R7B4',
    title: 'قناة رواد التصميم وفنون الجرافيك - دروس اليستريتور وفوتوشوب 🎨',
    duration: 65,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 45,
    completedCount: 22,
    status: 'active',
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'camp_s5',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=Yv_O_1nE-gE',
    youtubeId: 'Yv_O_1nE-gE',
    title: 'قناة خبراء الذكاء الاصطناعي - تعلم الآلة وتقنيات المستقبل 🤖',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 55,
    completedCount: 19,
    status: 'active',
    createdAt: Date.now() - 3600000 * 8
  },
  {
    id: 'camp_s6',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=vjf7yXS1qG8',
    youtubeId: 'vjf7yXS1qG8',
    title: 'قناة مدرب السفر والترحال - استكشف دول العالم بأقل التكاليف ✈️',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 60,
    completedCount: 6,
    status: 'active',
    createdAt: Date.now() - 3600000 * 4
  },
  {
    id: 'camp_s7',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=l1m8mS1xP7k',
    youtubeId: 'l1m8mS1xP7k',
    title: 'قناة الثراء المعرفي وبودكاست تنمية المهارات وتطوير الذات 🧠',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 70,
    completedCount: 40,
    status: 'active',
    createdAt: Date.now() - 3600000 * 10
  },
  {
    id: 'camp_s8',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=rXDSz_vE5Sg',
    youtubeId: 'rXDSz_vE5Sg',
    title: 'قناة صحة ورشاقة - تمارين رياضية وأسلوب غذاء متكامل وجديد 🍎',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 50,
    completedCount: 20,
    status: 'active',
    createdAt: Date.now() - 3600000 * 9
  },
  {
    id: 'camp_s9',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=g39v4_8sW7A',
    youtubeId: 'g39v4_8sW7A',
    title: 'قناة عالم الروايات والملخصات الصوتية لأفضل الكتب العالمية 📚',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 80,
    completedCount: 30,
    status: 'active',
    createdAt: Date.now() - 3600000 * 14
  },
  {
    id: 'camp_s10',
    creatorId: 'admin_sys',
    creatorEmail: 'system@ytsocial.com',
    type: 'subscribe',
    youtubeUrl: 'https://www.youtube.com/watch?v=M2uX7-t5S_g',
    youtubeId: 'M2uX7-t5S_g',
    title: 'قناة الفن الجمالي والتصوير الطبيعي لرحاب الطبيعة الخلابة 📷',
    duration: 60,
    pointsPerAction: 70,
    rewardPerAction: 50,
    quantity: 75,
    completedCount: 15,
    status: 'active',
    createdAt: Date.now() - 3600000 * 11
  }
];

// Seed ads
const DEFAULT_ADS: Advertisement[] = [
  {
    id: 'ad_default_1',
    title: 'تعلن منصة يوتيوب الرسمية عن شروط تفعيل الأرباح لعام 2026',
    imageUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60',
    targetUrl: 'https://youtube.com',
    position: 'header',
    widthClass: 'max-w-[728px]',
    heightClass: 'h-[90px]',
    createdAt: Date.now() - 3600000 * 5
  },
  {
    id: 'ad_default_2',
    title: 'احصل على نقاط أكثر مجاناً عند استكمال المهام اليومية بموقعنا',
    imageUrl: 'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=800&auto=format&fit=crop&q=60',
    targetUrl: '#',
    position: 'sidebar',
    widthClass: 'max-w-full',
    heightClass: 'h-[250px]',
    createdAt: Date.now() - 3600000 * 3
  }
];

// Seed users
const DEFAULT_USERS: User[] = [
  {
    uid: 'bedogemy20144_uid',
    displayName: 'Bedo Gemy',
    email: 'bedogemy20144@gmail.com',
    photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Bedo',
    points: 15000,
    createdAt: Date.now() - 3600000 * 48
  },
  {
    uid: 'user_test_2',
    displayName: 'أحمد محمود',
    email: 'ahmed.dev@gmail.com',
    photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Ahmed',
    points: 2450,
    createdAt: Date.now() - 3600000 * 20
  },
  {
    uid: 'user_test_3',
    displayName: 'منى كريم',
    email: 'mona.beauty@gmail.com',
    photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mona',
    points: 120,
    createdAt: Date.now() - 3600000 * 10
  }
];

const STORAGE_KEYS = {
  USERS: 'ytsocial_users',
  CAMPAIGNS: 'ytsocial_campaigns',
  HISTORY: 'ytsocial_history',
  PAYMENTS: 'ytsocial_payments',
  SETTINGS: 'ytsocial_settings',
  ADS: 'ytsocial_ads',
  CURRENT_USER_ID: 'ytsocial_current_uid',
  REVIEWS: 'ytsocial_reviews',
  COMPLAINTS: 'ytsocial_complaints'
};

// Helper to asynchronously update public, real-time aggregate stats counters in Firestore
export async function updateGlobalStatsInFirestore() {
  try {
    const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
    const campaignsStr = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY);

    const usersList = usersStr ? JSON.parse(usersStr) : [];
    const campaignsList = campaignsStr ? JSON.parse(campaignsStr) : [];
    const historyList = historyStr ? JSON.parse(historyStr) : [];

    const totalUsers = usersList.length;
    const completedCampaigns = campaignsList.filter((c: any) => c.status === 'completed').length;
    const totalExchangedPoints = historyList.reduce((sum: number, h: any) => sum + (h.pointsEarned || 0), 0);

    if (totalUsers > 0 || completedCampaigns > 0 || totalExchangedPoints > 0) {
      // Write to the public counters document
      await setDoc(doc(firestoreDb, 'global_stats', 'counters'), {
        totalUsers,
        completedCampaigns,
        totalExchangedPoints,
        lastUpdatedAt: Date.now()
      }, { merge: true });
    }
  } catch (e) {
    console.warn("Could not update global stats in firestore:", e);
  }
}

// Guard status
let isFirebaseListenersInitialized = false;

// Initialize DB helper
export const db = {
  initialize() {
    // 1. Initial Local Storage Seeding
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CAMPAIGNS)) {
      localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(DEFAULT_CAMPAIGNS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADS)) {
      localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(DEFAULT_ADS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify([]));
    }
    if (!localStorage.getItem('ytsocial_verifications')) {
      localStorage.setItem('ytsocial_verifications', JSON.stringify([]));
    }

    // 2. Real-time Firebase Synchronization
    if (!isFirebaseListenersInitialized) {
      isFirebaseListenersInitialized = true;
      
      auth.onAuthStateChanged((user) => {
        if (!user) {
          return;
        }

        // Dynamic continuous snap-sync of remote data -> local storage cache
        onSnapshot(collection(firestoreDb, 'users'), (snapshot) => {
          const ulist: User[] = [];
          snapshot.forEach((d) => {
            const data = d.data();
            ulist.push(data as User);
          });
          if (ulist.length > 0) {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(ulist));
            updateGlobalStatsInFirestore();
          } else {
            // Seed online Database on first boot only if authorized admin is logged in
            const currentUserEmail = user?.email || '';
            const isUserAdmin = currentUserEmail === 'bedogemy20144@gmail.com' || currentUserEmail === 'admin@ytsocial.com' || currentUserEmail === 'thelegendgamer2022@gmail.com';
            if (isUserAdmin) {
              DEFAULT_USERS.forEach((u) => {
                setDoc(doc(firestoreDb, 'users', u.uid), u).catch(e => {
                  console.error("User seed error:", e);
                });
              });
            }
          }
        }, (error) => {
          console.warn("User onSnapshot permission / offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'campaigns'), (snapshot) => {
          const clist: Campaign[] = [];
          snapshot.forEach((d) => {
            clist.push(d.data() as Campaign);
          });
          if (clist.length > 0) {
            localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(clist));
            window.dispatchEvent(new Event('ytsocial_campaigns_updated'));
            updateGlobalStatsInFirestore();
          }
        }, (error) => {
          console.warn("Campaign onSnapshot permission / offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'history'), (snapshot) => {
          const hlist: ActionHistory[] = [];
          snapshot.forEach((d) => {
            hlist.push(d.data() as ActionHistory);
          });
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(hlist));
          updateGlobalStatsInFirestore();
        }, (error) => {
          console.warn("History onSnapshot permission / offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'payments'), (snapshot) => {
          const plist: CryptoPayment[] = [];
          snapshot.forEach((d) => {
            plist.push(d.data() as CryptoPayment);
          });
          localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(plist));
        }, (error) => {
          console.warn("Payments onSnapshot permission / offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'settings'), (snapshot) => {
          let hasSett = false;
          snapshot.forEach((d) => {
            if (d.id === 'admin') {
              hasSett = true;
              localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(d.data()));
            }
          });
          if (!hasSett) {
            // Seed defaults
            setDoc(doc(firestoreDb, 'settings', 'admin'), DEFAULT_ADMIN_SETTINGS).catch(e => {
              console.error("Settings seed error:", e);
            });
          }
        }, (error) => {
          console.warn("Settings onSnapshot permission / offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'ads'), (snapshot) => {
          const alist: Advertisement[] = [];
          snapshot.forEach((d) => {
            alist.push(d.data() as Advertisement);
          });
          // Only override locally if there's actual sync from Firestore to avoid wiping initial ads
          if (alist.length > 0) {
            localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(alist));
            window.dispatchEvent(new Event('ytsocial_ads_updated'));
          } else {
            // Seed online Database with default ads on first run only if authorized admin is logged in
            const currentUserEmail = user?.email || '';
            const isUserAdmin = currentUserEmail === 'bedogemy20144@gmail.com' || currentUserEmail === 'admin@ytsocial.com' || currentUserEmail === 'thelegendgamer2022@gmail.com';
            if (isUserAdmin) {
              DEFAULT_ADS.forEach((a) => {
                setDoc(doc(firestoreDb, 'ads', a.id), a).catch(e => {
                  console.error("Ads seed error:", e);
                });
              });
            }
          }
        }, (error) => {
          console.warn("Ads onSnapshot permission / offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'reviews'), (snapshot) => {
          const rlist: UserReview[] = [];
          snapshot.forEach((d) => {
            rlist.push(d.data() as UserReview);
          });
          localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(rlist));
          window.dispatchEvent(new Event('ytsocial_reviews_updated'));
        }, (error) => {
          console.warn("Reviews onSnapshot offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'complaints'), (snapshot) => {
          const clist: UserComplaint[] = [];
          snapshot.forEach((d) => {
            clist.push(d.data() as UserComplaint);
          });
          localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(clist));
          window.dispatchEvent(new Event('ytsocial_complaints_updated'));
        }, (error) => {
          console.warn("Complaints onSnapshot offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'withdrawals'), (snapshot) => {
          const wlist: WithdrawalRequest[] = [];
          snapshot.forEach((d) => {
            wlist.push(d.data() as WithdrawalRequest);
          });
          localStorage.setItem('ytsocial_withdrawals', JSON.stringify(wlist));
          window.dispatchEvent(new Event('ytsocial_withdrawals_updated'));
        }, (error) => {
          console.warn("Withdrawals onSnapshot offline warn:", error.message);
        });

        onSnapshot(collection(firestoreDb, 'verifications'), (snapshot) => {
          const vlist: TaskVerification[] = [];
          snapshot.forEach((d) => {
            vlist.push(d.data() as TaskVerification);
          });
          localStorage.setItem('ytsocial_verifications', JSON.stringify(vlist));
          window.dispatchEvent(new Event('ytsocial_verifications_updated'));
        }, (error) => {
          console.warn("Verifications onSnapshot offline warn:", error.message);
        });
      });
    }
  },

  // USERS
  getUsers(): User[] {
    this.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  getUser(uid: string): User | undefined {
    return this.getUsers().find(u => u.uid === uid);
  },

  async syncUserWithCloud(uid: string): Promise<User | null> {
    try {
      const docRef = doc(firestoreDb, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cloudUser = snap.data() as User;
        const users = this.getUsers();
        const idx = users.findIndex(u => u.uid === uid);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...cloudUser };
        } else {
          users.push(cloudUser);
        }
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return cloudUser;
      }
    } catch (e) {
      console.warn("syncUserWithCloud error:", e);
    }
    return null;
  },

  getCurrentUser(): User | null {
    this.initialize();
    const uid = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!uid) return null;
    return this.getUser(uid) || null;
  },

  setCurrentUser(uid: string | null) {
    if (uid) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, uid);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  },

  createUser(displayName: string, email: string, photoURL?: string): User {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }

    const newUser: User = {
      uid: 'user_' + Math.random().toString(36).substring(2, 11),
      displayName,
      email,
      photoURL: photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`,
      points: 1000, // starting gift points updated to 1000
      createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Async push to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'users', newUser.uid), newUser).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `users/${newUser.uid}`);
      });
    }

    return newUser;
  },

  async registerGoogleUser(uid: string, displayName: string, email: string, photoURL?: string): Promise<User> {
    // Check cloud database first to prevent overwriting an existing user's data!
    try {
      const docRef = doc(firestoreDb, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cloudUser = snap.data() as User;
        const users = this.getUsers();
        const idx = users.findIndex(u => u.uid === uid);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...cloudUser };
        } else {
          users.push(cloudUser);
        }
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
        return cloudUser;
      }
    } catch (e) {
      console.warn("Cloud check in registerGoogleUser failed or was denied:", e);
    }

    const users = this.getUsers();
    let existing = users.find(u => u.uid === uid || u.email.toLowerCase() === email.toLowerCase());
    
    if (existing) {
      existing.displayName = displayName;
      existing.email = email;
      if (photoURL) existing.photoURL = photoURL;
      
      if (existing.uid !== uid) {
        const cleanUsers = users.filter(u => u.uid !== existing!.uid);
        existing.uid = uid;
        cleanUsers.push(existing);
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(cleanUsers));
      } else {
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
      
      if (auth.currentUser) {
        setDoc(doc(firestoreDb, 'users', uid), existing).catch((error) => {
          handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
        });
      }
      
      return existing;
    }

    const startingPoints = 1000; // All new registered users get exactly 1000 points!

    const newUser: User = {
      uid,
      displayName,
      email,
      photoURL: photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(displayName)}`,
      points: startingPoints,
      createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'users', uid), newUser).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
      });
    }

    return newUser;
  },

  updateUserProfile(updatedUser: User) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.uid === updatedUser.uid);
    if (idx !== -1) {
      // Use existing or update
      users[idx] = { ...users[idx], ...updatedUser };
    } else {
      users.push(updatedUser);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    
    // Sync to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'users', updatedUser.uid), users[idx] || updatedUser).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `users/${updatedUser.uid}`);
      });
    }
    
    window.dispatchEvent(new Event('ytsocial_users_updated'));
  },

  updateUserPoints(uid: string, pointsChange: number): number {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.uid === uid);
    if (userIndex === -1) return 0;

    const newPoints = Math.max(0, users[userIndex].points + pointsChange);
    users[userIndex].points = newPoints;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // Async update to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'users', uid), users[userIndex]).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
      });
    }

    return newPoints;
  },

  // CAMPAIGNS
  getCampaigns(): Campaign[] {
    this.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');
  },

  addCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'completedCount' | 'status'>): Campaign | string {
    const campaigns = this.getCampaigns();
    const creator = this.getUser(campaignData.creatorId);

    if (!creator) {
      return 'المستخدم غير موجود';
    }

    const totalCost = campaignData.quantity * campaignData.pointsPerAction;
    if (creator.points < totalCost) {
      return 'نقاطك غير كافية لإنشاء هذه الحملة. تحتاج إلى ' + totalCost + ' نقطة.';
    }

    // Deduct points from creator
    this.updateUserPoints(campaignData.creatorId, -totalCost);

    const newCampaign: Campaign = {
      ...campaignData,
      id: 'camp_' + Math.random().toString(36).substring(2, 11),
      completedCount: 0,
      status: 'active',
      createdAt: Date.now()
    };

    campaigns.push(newCampaign);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    window.dispatchEvent(new Event('ytsocial_campaigns_updated'));

    // Async push to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'campaigns', newCampaign.id), newCampaign).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `campaigns/${newCampaign.id}`);
      });
    }

    return newCampaign;
  },

  addAdminCampaign(campaignData: Omit<Campaign, 'id' | 'createdAt' | 'completedCount' | 'status' | 'creatorId' | 'creatorEmail'>): Campaign {
    const campaigns = this.getCampaigns();

    const newCampaign: Campaign = {
      ...campaignData,
      id: 'camp_' + Math.random().toString(36).substring(2, 11),
      creatorId: 'admin_sys',
      creatorEmail: 'system@ytsocial.com',
      completedCount: 0,
      status: 'active',
      createdAt: Date.now()
    };

    campaigns.push(newCampaign);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    window.dispatchEvent(new Event('ytsocial_campaigns_updated'));

    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'campaigns', newCampaign.id), newCampaign).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `campaigns/${newCampaign.id}`);
      });
    }

    return newCampaign;
  },

  toggleCampaignStatus(id: string): Campaign | undefined {
    const campaigns = this.getCampaigns();
    const idx = campaigns.findIndex(c => c.id === id);
    if (idx === -1) return undefined;

    const current = campaigns[idx].status;
    const nextStatus = current === 'active' ? 'paused' : 'active';
    campaigns[idx].status = nextStatus;
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    window.dispatchEvent(new Event('ytsocial_campaigns_updated'));

    // Async push status modify to cloud
    const updated = campaigns[idx];
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'campaigns', id), updated).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `campaigns/${id}`);
      });
    }

    return updated;
  },

  topUpCampaign(id: string, extraQuantity: number, userId: string): Campaign | string {
    const campaigns = this.getCampaigns();
    const idx = campaigns.findIndex(c => c.id === id);
    if (idx === -1) return 'الحملة الإعلانية غير موجودة';

    const campaign = campaigns[idx];
    if (campaign.creatorId !== userId) {
      return 'ليس لديك صلاحية لتعديل هذه الحملة';
    }

    const creator = this.getUser(userId);
    if (!creator) {
      return 'المستخدم غير موجود';
    }

    const totalCost = extraQuantity * campaign.pointsPerAction;
    if (creator.points < totalCost) {
      return 'نقاطك غير كافية للشحن. تحتاج إلى ' + totalCost + ' نقطة.';
    }

    // Deduct points from creator
    this.updateUserPoints(userId, -totalCost);

    // Update quantities and status
    campaign.quantity += extraQuantity;
    if (campaign.status === 'completed') {
      campaign.status = 'active';
    }

    campaigns[idx] = campaign;
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    window.dispatchEvent(new Event('ytsocial_campaigns_updated'));

    // Sync back to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'campaigns', id), campaign).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `campaigns/${id}`);
      });
    }

    return campaign;
  },

  deleteCampaign(id: string): boolean {
    const campaigns = this.getCampaigns();
    const idx = campaigns.findIndex(c => c.id === id);
    if (idx === -1) return false;

    // Refund points for remaining quantity if active/paused
    const campaign = campaigns[idx];
    if (campaign.status !== 'completed') {
      const remaining = campaign.quantity - campaign.completedCount;
      if (remaining > 0) {
        const refundPoints = remaining * campaign.pointsPerAction;
        this.updateUserPoints(campaign.creatorId, refundPoints);
      }
    }

    campaigns.splice(idx, 1);
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    window.dispatchEvent(new Event('ytsocial_campaigns_updated'));

    // Async delete from cloud
    if (auth.currentUser) {
      deleteDoc(doc(firestoreDb, 'campaigns', id)).catch((error) => {
        handleFirestoreError(error, OperationType.DELETE, `campaigns/${id}`);
      });
    }

    return true;
  },

  updateCampaign(campaign: Campaign): boolean {
    const campaigns = this.getCampaigns();
    const idx = campaigns.findIndex(c => c.id === campaign.id);
    if (idx === -1) return false;
    campaigns[idx] = campaign;
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
    window.dispatchEvent(new Event('ytsocial_campaigns_updated'));

    // Sync back to cloud
    setDoc(doc(firestoreDb, 'campaigns', campaign.id), campaign).catch((error) => {
      handleFirestoreError(error, OperationType.WRITE, `campaigns/${campaign.id}`);
    });
    return true;
  },

  // ACTIONS HISTORY (for exchanges)
  getHistory(): ActionHistory[] {
    this.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]');
  },

  hasUserInteracted(userId: string, campaignId: string): boolean {
    return this.getHistory().some(h => h.userId === userId && h.campaignId === campaignId);
  },

  recordInteraction(userId: string, campaignId: string, type: CampaignType, reward: number, profileHandle?: string, isAdminApproval: boolean = false): boolean {
    if (type !== 'view' && type !== 'website_view' && !isAdminApproval) {
      // Points for everything else are frozen until manual admin approval
      return true;
    }

    if (this.hasUserInteracted(userId, campaignId)) {
      return false; // already done
    }

    const campaigns = this.getCampaigns();
    const campIndex = campaigns.findIndex(c => c.id === campaignId);
    if (campIndex === -1 || campaigns[campIndex].status !== 'active') {
      return false; // inactive or missing
    }

    const compCount = campaigns[campIndex].completedCount + 1;
    campaigns[campIndex].completedCount = compCount;

    if (compCount >= campaigns[campIndex].quantity) {
      campaigns[campIndex].status = 'completed';
    }

    // Save campaign updates locally
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));

    // Award points to the user who performed it locally
    this.updateUserPoints(userId, reward);

    // Sync task completion inside the Daily Bonus system safely
    try {
      fetch('/.netlify/functions/daily-bonus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          action: 'complete_task'
        })
      }).catch(e => console.error('Silent daily tasks sync fail:', e));
    } catch (err) {
      console.error('Daily tasks tracking connection fail:', err);
    }

    // Save interaction log locally
    const history = this.getHistory();
    const newLog: ActionHistory = {
      id: `${userId}_${campaignId}`,
      userId,
      campaignId,
      type,
      pointsEarned: reward,
      createdAt: Date.now(),
      profileHandle: profileHandle || ''
    };
    history.push(newLog);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));

    // Async batch execution to store synchronous updates atomically on Firebase Cloud!
    try {
      const batch = writeBatch(firestoreDb);
      batch.set(doc(firestoreDb, 'history', newLog.id), newLog);
      batch.set(doc(firestoreDb, 'campaigns', campaignId), campaigns[campIndex]);
      batch.commit().catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `history_atomic_commit/${newLog.id}`);
      });
    } catch (e) {
      console.error("Batch push fail, offline fallback used:", e);
    }

    return true;
  },

  // PAYMENTS & COIN BUYING
  getPayments(): CryptoPayment[] {
    this.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
  },

  submitPayment(paymentData: Omit<CryptoPayment, 'id' | 'status' | 'createdAt'>): CryptoPayment {
    const payments = this.getPayments();
    const newPayment: CryptoPayment = {
      ...paymentData,
      id: 'pay_' + Math.random().toString(36).substring(2, 11),
      status: 'pending',
      createdAt: Date.now()
    };
    payments.push(newPayment);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    // Async push to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'payments', newPayment.id), newPayment).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `payments/${newPayment.id}`);
      });
    }

    return newPayment;
  },

  approvePayment(paymentId: string): boolean {
    const payments = this.getPayments();
    const idx = payments.findIndex(p => p.id === paymentId);
    if (idx === -1 || payments[idx].status !== 'pending') return false;

    payments[idx].status = 'approved';
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    // Actually award user points!
    this.updateUserPoints(payments[idx].userId, payments[idx].packagePoints);

    // Sync status change to Cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'payments', paymentId), payments[idx]).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `payments/${paymentId}`);
      });
    }

    return true;
  },

  rejectPayment(paymentId: string, rejectReason?: string): boolean {
    const payments = this.getPayments();
    const idx = payments.findIndex(p => p.id === paymentId);
    if (idx === -1 || payments[idx].status !== 'pending') return false;

    payments[idx].status = 'rejected';
    if (rejectReason) {
      payments[idx].rejectReason = rejectReason;
    }
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

    // Sync status change to Cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'payments', paymentId), payments[idx]).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `payments/${paymentId}`);
      });
    }

    return true;
  },

  // WALLETS SETTINGS (ADMIN ONLY)
  getAdminSettings(): AdminSettings {
    this.initialize();
    const settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || JSON.stringify(DEFAULT_ADMIN_SETTINGS)) as AdminSettings;
    if (settings.socialLinkPlatforms) {
      const defaultPlats = DEFAULT_ADMIN_SETTINGS.socialLinkPlatforms || [];
      defaultPlats.forEach(defPlat => {
        if (!settings.socialLinkPlatforms.some(p => p.id === defPlat.id)) {
          settings.socialLinkPlatforms.push(defPlat);
        }
      });
    }
    if (settings.customPlatforms) {
      settings.customPlatforms = settings.customPlatforms.filter(p => p.id !== 'custom_mqar8ytj');
    }
    return settings;
  },

  saveAdminSettings(settings: AdminSettings) {
    if (settings.customPlatforms) {
      settings.customPlatforms = settings.customPlatforms.filter(p => p.id !== 'custom_mqar8ytj');
    }
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

    // Async push to settings/admin mapping
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'settings', 'admin'), settings).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, 'settings/admin');
      });
    }
  },

  // REVIEWS & COMPLAINTS METHODS
  getReviews(): UserReview[] {
    this.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]');
  },

  submitReview(reviewData: Omit<UserReview, 'id' | 'createdAt'>): UserReview {
    const reviews = this.getReviews();
    const newReview: UserReview = {
      ...reviewData,
      id: 'rev_' + Math.random().toString(36).substring(2, 11),
      createdAt: Date.now()
    };
    reviews.push(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    window.dispatchEvent(new Event('ytsocial_reviews_updated'));

    // Sync to firestore
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'reviews', newReview.id), newReview).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `reviews/${newReview.id}`);
      });
    }

    return newReview;
  },

  getComplaints(): UserComplaint[] {
    this.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLAINTS) || '[]');
  },

  submitComplaint(complaintData: Omit<UserComplaint, 'id' | 'createdAt'>): UserComplaint {
    const complaints = this.getComplaints();
    const newComplaint: UserComplaint = {
      ...complaintData,
      id: 'comp_' + Math.random().toString(36).substring(2, 11),
      createdAt: Date.now()
    };
    complaints.push(newComplaint);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
    window.dispatchEvent(new Event('ytsocial_complaints_updated'));

    // Sync to firestore
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'complaints', newComplaint.id), newComplaint).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `complaints/${newComplaint.id}`);
      });
    }

    return newComplaint;
  },

  // ADS METHODS
  getAds(): Advertisement[] {
    this.initialize();
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADS) || '[]');
  },

  addAdminAd(adData: Omit<Advertisement, 'id' | 'createdAt'>): Advertisement {
    const ads = this.getAds();
    const newAd: Advertisement = {
      ...adData,
      id: 'ad_' + Math.random().toString(36).substring(2, 11),
      createdAt: Date.now()
    };
    ads.push(newAd);
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
    window.dispatchEvent(new Event('ytsocial_ads_updated'));

    // Sync to firestore
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'ads', newAd.id), newAd).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `ads/${newAd.id}`);
      });
    }

    return newAd;
  },

  deleteAdminAd(id: string): boolean {
    const ads = this.getAds();
    const idx = ads.findIndex(a => a.id === id);
    if (idx === -1) return false;

    ads.splice(idx, 1);
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(ads));
    window.dispatchEvent(new Event('ytsocial_ads_updated'));

    // Sync deletion to firestore
    if (auth.currentUser) {
      deleteDoc(doc(firestoreDb, 'ads', id)).catch((error) => {
        handleFirestoreError(error, OperationType.DELETE, `ads/${id}`);
      });
    }

    return true;
  },

  // WITHDRAWALS (Exchange Points to USD & Withdraw Cash)
  getWithdrawals(): WithdrawalRequest[] {
    this.initialize();
    return JSON.parse(localStorage.getItem('ytsocial_withdrawals') || '[]');
  },

  submitWithdrawal(withdrawalData: Omit<WithdrawalRequest, 'id' | 'status' | 'createdAt'>): WithdrawalRequest {
    const list = this.getWithdrawals();
    const newRequest: WithdrawalRequest = {
      ...withdrawalData,
      id: 'with_' + Math.random().toString(36).substring(2, 11),
      status: 'pending',
      createdAt: Date.now()
    };
    list.push(newRequest);
    localStorage.setItem('ytsocial_withdrawals', JSON.stringify(list));

    if (newRequest.type === 'withdrawal') {
      // Deduct USD dollars from user immediately (to lock it for pending approval)
      const userObj = this.getUser(withdrawalData.userId);
      if (userObj) {
        userObj.dollars = Math.max(0, (userObj.dollars || 0) - withdrawalData.dollarsEarned);
        localStorage.setItem('ytsocial_users', JSON.stringify(this.getUsers().map(u => u.uid === userObj.uid ? userObj : u)));
        if (auth.currentUser) {
          setDoc(doc(firestoreDb, 'users', userObj.uid), userObj).catch((e) => console.error(e));
        }
      }
    } else {
      // It is a points-to-usd conversion request: Deduct points immediately
      this.updateUserPoints(withdrawalData.userId, -withdrawalData.pointsExchanged);
    }

    // Sync to firestore
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'withdrawals', newRequest.id), newRequest).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `withdrawals/${newRequest.id}`);
      });
    }

    window.dispatchEvent(new Event('ytsocial_withdrawals_updated'));
    return newRequest;
  },

  approveWithdrawal(withdrawalId: string): boolean {
    const list = this.getWithdrawals();
    const idx = list.findIndex(w => w.id === withdrawalId);
    if (idx === -1 || list[idx].status !== 'pending') return false;

    list[idx].status = 'approved';
    localStorage.setItem('ytsocial_withdrawals', JSON.stringify(list));

    const req = list[idx];
    if (req.type !== 'withdrawal') {
      // Points conversion: Add converted dollars to user's profile upon approval
      const userObj = this.getUser(req.userId);
      if (userObj) {
        userObj.dollars = (userObj.dollars || 0) + req.dollarsEarned;
        localStorage.setItem('ytsocial_users', JSON.stringify(this.getUsers().map(u => u.uid === userObj.uid ? userObj : u)));
        if (auth.currentUser) {
          setDoc(doc(firestoreDb, 'users', userObj.uid), userObj).catch((e) => console.error(e));
        }
      }
    } else {
      // Cash withdrawal approval: the money has already been deducted, so we just finalize it!
      // No extra user balance change needed.
    }

    // Sync status back to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'withdrawals', withdrawalId), list[idx]).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `withdrawals/${withdrawalId}`);
      });
    }

    window.dispatchEvent(new Event('ytsocial_withdrawals_updated'));
    return true;
  },

  rejectWithdrawal(withdrawalId: string): boolean {
    const list = this.getWithdrawals();
    const idx = list.findIndex(w => w.id === withdrawalId);
    if (idx === -1 || list[idx].status !== 'pending') return false;

    list[idx].status = 'rejected';
    localStorage.setItem('ytsocial_withdrawals', JSON.stringify(list));

    const req = list[idx];
    if (req.type === 'withdrawal') {
      // Cash withdrawal rejected: Refund USD dollars to user's balance!
      const userObj = this.getUser(req.userId);
      if (userObj) {
        userObj.dollars = (userObj.dollars || 0) + req.dollarsEarned;
        localStorage.setItem('ytsocial_users', JSON.stringify(this.getUsers().map(u => u.uid === userObj.uid ? userObj : u)));
        if (auth.currentUser) {
          setDoc(doc(firestoreDb, 'users', userObj.uid), userObj).catch((e) => console.error(e));
        }
      }
    } else {
      // Points conversion rejected: Refund points to user!
      this.updateUserPoints(req.userId, req.pointsExchanged);
    }

    // Sync status back to cloud
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'withdrawals', withdrawalId), list[idx]).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `withdrawals/${withdrawalId}`);
      });
    }

    window.dispatchEvent(new Event('ytsocial_withdrawals_updated'));
    return true;
  },

  // Dev Tools
  resetDatabase() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(DEFAULT_CAMPAIGNS));
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_ADMIN_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.ADS, JSON.stringify(DEFAULT_ADS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'bedogemy20144_uid');

    // Reset cloud by rewriting seed datasets directly!
    if (auth.currentUser) {
      DEFAULT_USERS.forEach((u) => {
        setDoc(doc(firestoreDb, 'users', u.uid), u).catch(e => console.error(e));
      });
      DEFAULT_CAMPAIGNS.forEach((c) => {
        setDoc(doc(firestoreDb, 'campaigns', c.id), c).catch(e => console.error(e));
      });
      setDoc(doc(firestoreDb, 'settings', 'admin'), DEFAULT_ADMIN_SETTINGS).catch(e => console.error(e));
      DEFAULT_ADS.forEach((a) => {
        setDoc(doc(firestoreDb, 'ads', a.id), a).catch(e => console.error(e));
      });
    }
  },

  getVerifications(): TaskVerification[] {
    this.initialize();
    return JSON.parse(localStorage.getItem('ytsocial_verifications') || '[]');
  },

  hasPendingOrApprovedVerification(userId: string, campaignId: string): boolean {
    return this.getVerifications().some(h => h.userId === userId && h.campaignId === campaignId && (h.status === 'pending' || h.status === 'approved'));
  },

  submitTaskVerification(verificationData: Omit<TaskVerification, 'id' | 'status' | 'createdAt'>): TaskVerification {
    const list = this.getVerifications();

    // Auto-resolve taskUrl fallback if missing or empty
    let finalTaskUrl = verificationData.taskUrl || '';
    if (!finalTaskUrl && verificationData.campaignId) {
      const camp = this.getCampaigns().find(c => c.id === verificationData.campaignId);
      if (camp) {
        finalTaskUrl = camp.youtubeUrl || '';
      }
    }

    const newRequest: TaskVerification = {
      ...verificationData,
      taskUrl: finalTaskUrl,
      id: 'ver_' + Math.random().toString(36).substring(2, 11),
      status: 'pending',
      createdAt: Date.now()
    };
    list.push(newRequest);
    localStorage.setItem('ytsocial_verifications', JSON.stringify(list));

    // Sync to firestore
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'verifications', newRequest.id), newRequest).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `verifications/${newRequest.id}`);
      });
    }

    window.dispatchEvent(new Event('ytsocial_verifications_updated'));
    return newRequest;
  },

  approveTaskVerification(verificationId: string): boolean {
    const list = this.getVerifications();
    const idx = list.findIndex(v => v.id === verificationId);
    if (idx === -1 || list[idx].status !== 'pending') return false;

    list[idx].status = 'approved';
    localStorage.setItem('ytsocial_verifications', JSON.stringify(list));

    const req = list[idx];

    // Award points and record interaction with isAdminApproval = true
    this.recordInteraction(req.userId, req.campaignId, req.campaignType, req.rewardPoints, req.profileHandle, true);

    // Sync status back to firestore
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'verifications', verificationId), list[idx]).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `verifications/${verificationId}`);
      });
    }

    window.dispatchEvent(new Event('ytsocial_verifications_updated'));
    return true;
  },

  rejectTaskVerification(verificationId: string): boolean {
    const list = this.getVerifications();
    const idx = list.findIndex(v => v.id === verificationId);
    if (idx === -1 || list[idx].status !== 'pending') return false;

    list[idx].status = 'rejected';
    localStorage.setItem('ytsocial_verifications', JSON.stringify(list));

    // Sync status back to firestore
    if (auth.currentUser) {
      setDoc(doc(firestoreDb, 'verifications', verificationId), list[idx]).catch((error) => {
        handleFirestoreError(error, OperationType.WRITE, `verifications/${verificationId}`);
      });
    }

    window.dispatchEvent(new Event('ytsocial_verifications_updated'));
    return true;
  }
};

