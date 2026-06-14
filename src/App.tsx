import { useState, useEffect } from 'react';
import { db, auth } from './lib/db';
import { User } from './types';
import AuthPage from './components/AuthPage';
import CreateCampaign from './components/CreateCampaign';
import WatchVideos from './components/WatchVideos';
import WatchWebsites from './components/WatchWebsites';
import SubscribeChannels from './components/SubscribeChannels';
import LikeVideos from './components/LikeVideos';
import LikeFacebook from './components/LikeFacebook';
import FollowFacebook from './components/FollowFacebook';
import FollowInstagram from './components/FollowInstagram';
import LikeInstagram from './components/LikeInstagram';
import LikeTikTok from './components/LikeTikTok';
import FollowTikTok from './components/FollowTikTok';
import FollowX from './components/FollowX';
import LikeX from './components/LikeX';
import FollowPinterest from './components/FollowPinterest';
import LikePinterest from './components/LikePinterest';
import BuyPoints from './components/BuyPoints';
import AdminPanel from './components/AdminPanel';
import TechnicalSupport from './components/TechnicalSupport';
import HomePortal from './components/HomePortal';
import LinkAccounts from './components/LinkAccounts';
import SubscribeTelegram from './components/SubscribeTelegram';
import SettingsPanel from './components/SettingsPanel';
import ExchangePanel from './components/ExchangePanel';
import UserDashboard from './components/UserDashboard';
import { translations, SupportedLanguages } from './lib/translations';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Youtube, 
  Sparkles, 
  Eye, 
  UserPlus, 
  ThumbsUp, 
  Coins, 
  ShieldAlert, 
  ShieldCheck,
  LogOut, 
  User as UserIcon, 
  Award,
  Share2,
  Shuffle,
  LifeBuoy,
  Compass,
  Send,
  Sliders,
  BarChart2,
  Globe,
  ExternalLink,
  Pin
} from 'lucide-react';

const routesMap: Record<string, { tab: string; title: string; desc: string }> = {
  '/home': {
    tab: 'home',
    title: 'الصفحة الرئيسية - لوحة المعلومات | SocialXchange',
    desc: 'تطوير حسابات التواصل الاجتماعي وتبادل الدعم المجاني الفوري للحصول على متابعين ومشاهدات وجماهير حقيقية لصفحتك وقناتك.'
  },
  '/services/Analysis': {
    tab: 'home',
    title: 'الصفحة الرئيسية - لوحة المعلومات | SocialXchange',
    desc: 'تطوير حسابات التواصل الاجتماعي وتبادل الدعم المجاني الفوري للحصول على متابعين ومشاهدات وجماهير حقيقية لصفحتك وقناتك.'
  },
  '/services/Accountverification': {
    tab: 'accounts',
    title: 'ربط ومصادقة الحسابات الرقمية | SocialXchange',
    desc: 'قم بربط حساباتك التبادلية على منصات يوتيوب، تيك توك، انستغرام وفيسبوك لضمان المصادقة وحماية بياناتك التبادلية.'
  },
  '/services/youtube-views': {
    tab: 'views',
    title: 'مشاهدة فيديوهات يوتيوب وكسب نقاط | SocialXchange',
    desc: 'شاهد الفيديوهات المميزة لليوتيوبرز والناشرين لتبادل المشاهدات وجني نقاط التبادل الآمنة وبشكل شرعي.'
  },
  '/services/youtube-subscribers': {
    tab: 'subs',
    title: 'اشتراكات يوتيوب الحقيقية والآمنة | SocialXchange',
    desc: 'اشترك في قنوات يوتيوب نشطة لزيادة مشتركين قناتك، وكسب نقاط الرعاية لرفع الإسقاط البصري لمحتواك.'
  },
  '/services/youtube-likes': {
    tab: 'likes',
    title: 'لايكات وإعجابات يوتيوب مجانية | SocialXchange',
    desc: 'تفاعل بوضع لايكات لفيديوهات يوتيوب المنوعة للحصول على إعجابات حقيقية وتنشيط محرك البحث يوتيوب لفيديوهاتك.'
  },
  '/services/facebook-follow': {
    tab: 'fb_follows',
    title: 'زيادة متابعين ومعجبين فيسبوك حقيقيين | SocialXchange',
    desc: 'احصل على متابعين وإعجابات لصفحتك الشخصية أو العامة على فيسبوك من حسابات حقيقية ونشطة لزيادة تفاعلك وزيادة المصداقية.'
  },
  '/services/facebook-likes': {
    tab: 'fb_likes',
    title: 'زيادة لايكات وتفاعل فيسبوك | SocialXchange',
    desc: 'احصل على لايكات فيسبوك حقيقية لصفحاتك ومنشوراتك لتعزيز حضورك الرقمي وبناء المصداقية الجماهيرية.'
  },
  '/services/instagram-follow': {
    tab: 'ig_follows',
    title: 'متابعون انستغرام حقيقيون لصفحتك | SocialXchange',
    desc: 'متابعة مستخدمي انستغرام الحصريين وتكبير قاعدة الجماهير لملفك الشخصي بسرعة وموثوقية عالية.'
  },
  '/services/instagram-likes': {
    tab: 'ig_likes',
    title: 'لايكات وتوجيه إعجابات انستغرام | SocialXchange',
    desc: 'اكشف النقاب عن لايكات حقيقية لصورك ومنشوراتك على انستقرام لتبادل القبول ورفع مستوى الوصول المجاني.'
  },
  '/services/tiktok-follow': {
    tab: 'tiktok_follows',
    title: 'متابعة وزيادة معجبين تيك توك | SocialXchange',
    desc: 'تفاعل مع صناع المحتوى على تيك توك لرفع أعداد الفولو والمتابعين لملفك الشخصي وزيادة الشهرة وحركة الإكسبلور.'
  },
  '/services/tiktok-likes': {
    tab: 'tiktok_likes',
    title: 'زيادة لايكات وإعجابات تيك توك | SocialXchange',
    desc: 'زد مئات الإعجابات الحقيقية والآمنة لمقاطع تيك توك التابعة لك لرفع التداول البصري وتفعيل الحسابات.'
  },
  '/services/x-follow': {
    tab: 'x_follow',
    title: 'متابعة وزيادة معجبين منصة إكس (Twitter) | SocialXchange',
    desc: 'احصل على متابعين وإعجابات حقيقية لحسابك الشخصي أو العام على منصة إكس (تويتر) لزيادة شعبيتك وحضورك الرقمي.'
  },
  '/services/x-like': {
    tab: 'x_like',
    title: 'لايكات وتفاعل منصة إكس (Twitter) | SocialXchange',
    desc: 'تبادل التفاعل لزيادة عدد اللايكات والتغريدات على منصة إكس (تويتر) لرفع مستوى حضورك الرقمي.'
  },
  '/services/pinterest-follow': {
    tab: 'pinterest_follow',
    title: 'متابعون بنترست حقيقيون لحسابك | SocialXchange',
    desc: 'احصل على متابعين وإعجابات لحسابك الشخصي أو العام على بنترست لزيادة شعبيتك وحضورك البصري.'
  },
  '/services/pinterest-like': {
    tab: 'pinterest_like',
    title: 'لايكات وتفاعل دبابيس بنترست | SocialXchange',
    desc: 'احصل على لايكات وحفظ حقيقي لدبابيسك على بنترست لرفع رواج تصاميمك وأفكارك برواج خوارزمي.'
  },
  '/services/website-views': {
    tab: 'website_views',
    title: 'تصفح وزيارة المواقع وكسب نقاط | SocialXchange',
    desc: 'قم بزيارة وتصفح مواقع الرعاية الموثوقة للحصول على نقاط ترويجية مجانية وأرباح نقدية حقيقية.'
  },
  '/services/telegramfollowers': {
    tab: 'tg_join',
    title: 'متابعون ومشتركون تليجرام حقيقيون | SocialXchange',
    desc: 'اشترك وانضم للقنوات والمجموعات النشطة والممتعة على تليجرام لزيادة أعضاء مجموعتك مجاناً وبأمان.'
  },
  '/buy-points': {
    tab: 'buy',
    title: 'شراء باقات النقاط الأرخص للترويج | SocialXchange',
    desc: 'اشترِ باقات نقاط فائقة بأسعار مخفضة للبدء فوراً بتمويل حملاتك الترويجية وجلب آلاف المتفاعلين في ثوانٍ معدودة.'
  },
  '/checkout': {
    tab: 'buy',
    title: 'شراء باقات النقاط الأرخص للترويج | SocialXchange',
    desc: 'اشترِ باقات نقاط فائقة بأسعار مخفضة للبدء فوراً بتمويل حملاتك الترويجية وجلب آلاف المتفاعلين في ثوانٍ معدودة.'
  },
  '/services/buypoints': {
    tab: 'buy',
    title: 'شراء باقات النقاط الأرخص للترويج | SocialXchange',
    desc: 'اشترِ باقات نقاط فائقة بأسعار مخفضة للبدء فوراً بتمويل حملاتك الترويجية وجلب آلاف المتفاعلين في ثوانٍ معدودة.'
  },
  '/services/advertise': {
    tab: 'ad',
    title: 'إطلاق حملة ترويجية جديدة وزيادة التفاعل | SocialXchange',
    desc: 'قم بتمويل وإطلاق حملتك الترويجية لزيادة المتابعين، المشاهدات، واللايكات الحقيقية والآمنة على قنواتك وحساباتك الرقمية.'
  },
  '/services/withdraw': {
    tab: 'exchange',
    title: 'تحويل النقاط وسحب الأرباح النقدية | SocialXchange',
    desc: 'بوابتك المالية الآمنة والموثوقة: حوّل نقاط التبادل الفائضة لديك إلى دولارات واسحب كاش لجميع المحافظ الإلكترونية.'
  },
  '/services/settings': {
    tab: 'settings',
    title: 'تخصيص إعدادات الحساب والملف | SocialXchange',
    desc: 'إدارة وتحديث بياناتك الشخصية، كلمات المرور، تفضيلات لغة العرض، وطرق التحقق التلقائي لحسابك.'
  },
  '/services/technicalsupport': {
    tab: 'support',
    title: 'مركز الدعم الفني وتلقي الشكاوى | SocialXchange',
    desc: 'تواصل مباشرة مع مهندسي الدعم الفني لإرسال الملاحظات، الشكاوى وحل مشاكل الحملات والسحوبات الفورية.'
  },
  '/services/admin': {
    tab: 'admin',
    title: 'غرفة التحكم والإدارة الشاملة | SocialXchange',
    desc: 'منصة الإدارة الداخلية لإدارة الحملات والمستخدمين وتدقيق سحوبات الأموال وإعداد باقات النقاط وتنمية الموقع.'
  },
  // Legacy aliases for backwards compatibility
  '/services/youtubeviews': {
    tab: 'views',
    title: 'مشاهدة فيديوهات يوتيوب وكسب نقاط | SocialXchange',
    desc: 'شاهد الفيديوهات المميزة لليوتيوبرز والناشرين لتبادل المشاهدات وجني نقاط التبادل الآمنة وبشكل شرعي.'
  },
  '/services/websiteviews': {
    tab: 'website_views',
    title: 'تصفح وزيارة المواقع وكسب نقاط | SocialXchange',
    desc: 'قم بزيارة وتصفح مواقع الرعاية الموثوقة للحصول على نقاط ترويجية مجانية وأرباح نقدية حقيقية.'
  },
  '/services/youtubesubscription': {
    tab: 'subs',
    title: 'اشتراكات يوتيوب الحقيقية والآمنة | SocialXchange',
    desc: 'اشترك في قنوات يوتيوب نشطة لزيادة مشتركين قناتك، وكسب نقاط الرعاية لرفع الإسقاط البصري لمحتواك.'
  },
  '/services/youtubelikes': {
    tab: 'likes',
    title: 'لايكات وإعجابات يوتيوب مجانية | SocialXchange',
    desc: 'تفاعل بوضع لايكات لفيديوهات يوتيوب المنوعة للحصول على إعجابات حقيقية وتنشيط محرك البحث يوتيوب لفيديوهاتك.'
  },
  '/services/facebooklikes': {
    tab: 'fb_likes',
    title: 'زيادة لايكات وتفاعل فيسبوك | SocialXchange',
    desc: 'احصل على لايكات فيسبوك حقيقية لصفحاتك ومنشوراتك لتعزيز حضورك الرقمي وبناء المصداقية الجماهيرية.'
  },
  '/services/facebookfollowers': {
    tab: 'fb_follows',
    title: 'زيادة متابعين ومعجبين فيسبوك حقيقيين | SocialXchange',
    desc: 'احصل على متابعين وإعجابات لصفحتك الشخصية أو العامة على فيسبوك من حسابات حقيقية ونشطة لزيادة تفاعلك وزيادة المصداقية.'
  },
  '/services/instagramfollowers': {
    tab: 'ig_follows',
    title: 'متابعون انستغرام حقيقيون لصفحتك | SocialXchange',
    desc: 'متابعة مستخدمي انستغرام الحصريين وتكبير قاعدة الجماهير لملفك الشخصي بسرعة وموثوقية عالية.'
  },
  '/services/instagramlikes': {
    tab: 'ig_likes',
    title: 'لايكات وتوجيه إعجابات انستغرام | SocialXchange',
    desc: 'اكشف النقاب عن لايكات حقيقية لصورك ومنشوراتك على انستقرام لتبادل القبول ورفع مستوى الوصول المجاني.'
  },
  '/services/tiktokfollowers': {
    tab: 'tiktok_follows',
    title: 'متابعة وزيادة معجبين تيك توك | SocialXchange',
    desc: 'تفاعل مع صناع المحتوى على تيك توك لرفع أعداد الفولو والمتابعين لملفك الشخصي وزيادة الشهرة وحركة الإكسبلور.'
  },
  '/services/likes': {
    tab: 'tiktok_likes',
    title: 'زيادة لايكات وإعجابات تيك توك | SocialXchange',
    desc: 'زد مئات الإعجابات الحقيقية والآمنة لمقاطع تيك توك التابعة لك لرفع التداول البصري وتفعيل الحسابات.'
  }
};

const getTabFromPath = (path: string): string => {
  const route = Object.entries(routesMap).find(([rPath]) => rPath.toLowerCase() === path.toLowerCase());
  return route ? route[1].tab : '';
};

const getPathFromTab = (tabId: string): string => {
  const route = Object.entries(routesMap).find(([_, rVal]) => rVal.tab === tabId);
  return route ? route[0] : '';
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>(() => {
    // Attempt to match the current URL path first
    const pathTab = getTabFromPath(window.location.pathname);
    if (pathTab) return pathTab;

    const saved = localStorage.getItem('ytsocial_active_tab');
    if (saved) return saved;
    return 'home';
  }); // 'home' | 'views' | 'likes' | 'subs' | 'ad' | 'accounts' | 'buy' | 'admin'

  // Sync state when typing or clicking back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const pathTab = getTabFromPath(window.location.pathname);
      if (pathTab) {
        setActiveTab(pathTab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update window path and custom Meta Tags according to the active tab configuration
  useEffect(() => {
    const currentPath = window.location.pathname;
    const targetPath = getPathFromTab(activeTab);

    if (targetPath && currentPath !== targetPath) {
      window.history.pushState({ tab: activeTab }, '', targetPath);
    } else if (!targetPath && activeTab === 'views' && currentPath !== '/services/youtubeviews') {
      window.history.pushState({ tab: 'views' }, '', '/services/youtubeviews');
    } else if (!targetPath && activeTab === 'website_views' && currentPath !== '/services/websiteviews') {
      window.history.pushState({ tab: 'website_views' }, '', '/services/websiteviews');
    } else if (!targetPath && activeTab === 'home' && currentPath !== '/home') {
      window.history.pushState({ tab: 'home' }, '', '/home');
    }

    localStorage.setItem('ytsocial_active_tab', activeTab);

    // Dynmically inject or update Meta Title and Description for supreme SEO & SSR simulated experiences
    let activeRoute = Object.values(routesMap).find(r => r.tab === activeTab);
    if (activeTab === 'views') {
      activeRoute = routesMap['/services/youtubeviews'];
    } else if (activeTab === 'website_views') {
      activeRoute = routesMap['/services/websiteviews'];
    }

    if (activeRoute) {
      document.title = activeRoute.title;
      // Inject / update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', activeRoute.desc);
    }
  }, [activeTab]);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [adminLoginPrefill, setAdminLoginPrefill] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [lang, setLang] = useState<SupportedLanguages>(() => {
    const saved = localStorage.getItem('ytlang');
    if (saved === 'ar' || saved === 'en' || saved === 'fr' || saved === 'es') {
      return saved as SupportedLanguages;
    }
    return 'en';
  });

  const handleLanguageChange = (newLang: SupportedLanguages) => {
    setLang(newLang);
    localStorage.setItem('ytlang', newLang);
  };

  const ads = db.getAds();

  // Helper to render Ads by position
  const renderAdsByPosition = (position: 'header' | 'sidebar' | 'footer') => {
    // Hidden inside admin panel to maximize administrator focus
    if (activeTab === 'admin') return null;

    const activeAds = ads.filter(ad => ad.position === position);
    if (activeAds.length === 0) return null;

    return (
      <div className={`flex flex-col gap-4 items-center justify-center my-4 ${position === 'sidebar' ? 'px-4 mb-4' : 'w-full'}`}>
        {activeAds.map(ad => (
          <a
            id={`ad-${position}-${ad.id}`}
            key={ad.id}
            href={ad.targetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-1 transition-all hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/5"
          >
            <span className="absolute top-2 right-2 z-10 bg-slate-900/80 px-2 py-0.5 rounded font-black text-[9px] text-slate-400 border border-slate-800">
              إعلان رعاة
            </span>
            <img
              referrerPolicy="no-referrer"
              src={ad.imageUrl}
              alt={ad.title}
              className={`rounded-xl object-cover transition-all duration-300 group-hover:scale-[1.01] ${
                position === 'sidebar' ? 'w-full h-auto max-h-[220px]' : 'h-[90px] w-full max-w-[728px]'
              }`}
            />
            {ad.title && (
              <div className="p-1 px-2 text-right">
                <p className="text-[10px] font-bold text-slate-400 line-clamp-1 group-hover:text-white transition">
                  {ad.title}
                </p>
              </div>
            )}
          </a>
        ))}
      </div>
    );
  };

  // Initialize DB and load session user on mount
  useEffect(() => {
    db.initialize();
    
    // Wire up standard onAuthStateChanged observer to sync with current user state
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // Find existing user locally or register them
        const localUser = db.getUser(firebaseUser.uid);
        if (localUser) {
          setCurrentUser(localUser);
          db.setCurrentUser(firebaseUser.uid);
        } else {
          const userObj = db.registerGoogleUser(
            firebaseUser.uid,
            firebaseUser.displayName || 'Google User',
            firebaseUser.email || '',
            firebaseUser.photoURL || undefined
          );
          setCurrentUser(userObj);
          db.setCurrentUser(userObj.uid);
        }
      } else {
        setCurrentUser(null);
        db.setCurrentUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, [refreshTrigger]);

  const handlePointChange = () => {
    // Increment trigger to reload active user stats
    setRefreshTrigger(prev => prev + 1);
  };

  const handleLogout = () => {
    setAdminLoginPrefill(false);
    auth.signOut().then(() => {
      db.setCurrentUser(null);
      setCurrentUser(null);
      setActiveTab('views');
    });
  };

  const handleGoToAdminLogin = () => {
    setAdminLoginPrefill(true);
    auth.signOut().then(() => {
      db.setCurrentUser(null);
      setCurrentUser(null);
    });
  };

  const handleLoginSuccess = (user: User, isNewUser?: boolean) => {
    setCurrentUser(user);
    setAdminLoginPrefill(false);
    
    const isUserAdmin = user.email === 'thelegendgamer2022@gmail.com' || user.email === 'bedogemy20144@gmail.com' || user.email === 'admin@ytsocial.com' || user.email === 'admin@exsocial.com' || user.email === 'admin@socialxchange.com';
    
    const pendingBuy = localStorage.getItem('pending_package_purchase');
    if (pendingBuy) {
      localStorage.removeItem('pending_package_purchase');
      setActiveTab('buy');
    } else if (isUserAdmin) {
      setActiveTab('admin'); // auto-redirect admin
    } else if (isNewUser) {
      setActiveTab('accounts'); // New registration directs to LinkAccounts as requested!
    } else {
      setActiveTab('home'); // Returning user goes directly to home main portal as requested!
    }
  };

  // Determine if active user is administrator
  const isUserAdmin = currentUser?.email === 'thelegendgamer2022@gmail.com' || currentUser?.email === 'bedogemy20144@gmail.com' || currentUser?.email === 'admin@ytsocial.com' || currentUser?.email === 'admin@exsocial.com' || currentUser?.email === 'admin@socialxchange.com';

  const renderTabContent = () => {
    if (!currentUser) return null;

    switch (activeTab) {
      case 'home':
        return <HomePortal user={currentUser} onSelectTab={setActiveTab} lang={lang} />;
      case 'dashboard':
        return <UserDashboard user={currentUser} onSelectTab={setActiveTab} lang={lang} />;
      case 'ad':
        return <CreateCampaign user={currentUser} onCampaignCreated={handlePointChange} lang={lang} />;
      case 'accounts':
        return <LinkAccounts user={currentUser} onSelectTab={setActiveTab} lang={lang} />;
      case 'likes':
        return <LikeVideos user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'fb_likes':
        return <LikeFacebook user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'fb_follows':
        return <FollowFacebook user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'ig_follows':
        return <FollowInstagram user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'ig_likes':
        return <LikeInstagram user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'tiktok_likes':
        return <LikeTikTok user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'tiktok_follows':
        return <FollowTikTok user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'x_follow':
        return <FollowX user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'x_like':
        return <LikeX user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'pinterest_follow':
        return <FollowPinterest user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'pinterest_like':
        return <LikePinterest user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'subs':
        return <SubscribeChannels user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'tg_join':
        return <SubscribeTelegram user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'buy':
        return <BuyPoints user={currentUser} onPaymentSubmitted={handlePointChange} lang={lang} />;
      case 'exchange':
        return <ExchangePanel user={currentUser} onExchangeDone={handlePointChange} lang={lang} />;
      case 'settings':
        return <SettingsPanel user={currentUser} onProfileUpdated={handlePointChange} lang={lang} />;
      case 'support':
        return <TechnicalSupport user={currentUser} lang={lang} />;
      case 'admin':
        return <AdminPanel onAdminActionDone={handlePointChange} lang={lang} />;
      case 'website_views':
        return <WatchWebsites user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      case 'views':
        return <WatchVideos user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
      default:
        return <WatchVideos user={currentUser} onPointsEarned={handlePointChange} lang={lang} />;
    }
  };

  // Render loading state during initial Firebase session detection to avoid login screen flashing
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-400 font-sans">
            {lang === 'ar' ? 'تحميل بيانات الحساب... برجاء الانتظار' : 'Loading account details... Please wait'}
          </p>
        </div>
      </div>
    );
  }

  // Render auth gate if user is not signed in
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} defaultToAdmin={adminLoginPrefill} lang={lang} onLanguageChange={handleLanguageChange} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row-reverse select-none relative">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-slate-900 border-b md:border-b-0 md:border-l border-slate-800 flex flex-col shrink-0 text-right">
        {/* Brand container */}
        <div className="p-6 flex items-center justify-between md:justify-start gap-4 flex-row-reverse border-b border-slate-800/40">
          <div className="flex items-center gap-3 flex-row-reverse">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-white/10">
              <Shuffle className="w-5 h-5 text-white animate-spin-slow" style={{ animationDuration: '6s' }} />
            </div>
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">SocialXchange</span>
          </div>
          {/* Mobile indicator or small logo text */}
          <span className="text-[10px] text-slate-300 font-extrabold block md:hidden bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/10">SocialXchange</span>
        </div>
        {/* Nav list - visible on desktop, custom styling */}
        <nav className="hidden md:flex flex-col flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {[
            { id: 'home', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: Compass },
            { id: 'accounts', label: lang === 'ar' ? 'ربط ومصادقة الحسابات' : 'Link Accounts', icon: ShieldCheck },
            { id: 'ad', label: translations[lang].tabAd, icon: Sparkles },
            { id: 'website_views', label: translations[lang].tabWebsiteViews, icon: Globe },
            { id: 'views', label: translations[lang].tabViews, icon: Eye },
            { id: 'subs', label: translations[lang].tabSubs, icon: UserPlus },
            { id: 'likes', label: translations[lang].tabLikes, icon: ThumbsUp },
            { id: 'fb_follows', label: translations[lang].tabFbFollows, icon: UserPlus },
            { id: 'fb_likes', label: translations[lang].tabFbLikes, icon: ThumbsUp },
            { id: 'ig_follows', label: translations[lang].tabIgFollows, icon: UserPlus },
            { id: 'ig_likes', label: translations[lang].tabIgLikes, icon: ThumbsUp },
            { id: 'tiktok_follows', label: translations[lang].tabTtFollows, icon: UserPlus },
            { id: 'tiktok_likes', label: translations[lang].tabTtLikes, icon: ThumbsUp },
            { id: 'x_follow', label: translations[lang].tabXFollow, icon: UserPlus },
            { id: 'x_like', label: translations[lang].tabXLikes, icon: ThumbsUp },
            { id: 'pinterest_follow', label: lang === 'ar' ? 'متابعة بنترست' : lang === 'fr' ? 'Abonnés Pinterest' : lang === 'es' ? 'Seguidores de Pinterest' : 'Pinterest Follows', icon: Pin },
            { id: 'pinterest_like', label: lang === 'ar' ? 'لايك بنترست' : lang === 'fr' ? 'Likes Pinterest' : lang === 'es' ? 'Me gusta de Pinterest' : 'Pinterest Likes', icon: ThumbsUp },
            { id: 'tg_join', label: translations[lang].tabTgJoin, icon: Send },
            { id: 'buy', label: translations[lang].tabBuy, icon: Coins },
            { id: 'exchange', label: lang === 'ar' ? 'تبديل النقاط وسحب الأرباح' : 'Exchange & Withdraw', icon: Coins },
            { id: 'settings', label: lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings', icon: Sliders },
            { id: 'support', label: translations[lang].tabSupport, icon: LifeBuoy },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                id={`tab-nav-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-sm font-semibold cursor-pointer flex-row-reverse text-right ${
                  isSelected 
                    ? 'bg-slate-850 text-white border-slate-700/50 shadow-md scale-98' 
                    : 'text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <IconComp className="w-5 h-5 shrink-0 text-current" />
                <span className="flex-1">{tab.label}</span>
              </button>
            );
          })}

          {/* Admin link inside navigation for desktop */}
          {isUserAdmin && (
            <button
              id={`tab-nav-admin`}
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-sm font-semibold cursor-pointer flex-row-reverse text-right ${
                activeTab === 'admin'
                  ? 'bg-red-955/25 text-red-500 border-red-900/60 shadow-lg shadow-red-500/5'
                  : 'text-slate-400 border-slate-900/10 hover:bg-red-955/20 hover:text-red-400 hover:border-red-500/20'
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span className="flex-1 text-right">{translations[lang].adminControl}</span>
            </button>
          )}
        </nav>

        {/* Dynamic Sidebar Sponsor Ads */}
        {currentUser && renderAdsByPosition('sidebar')}

        {/* User Badge Info inside Sidebar at the bottom */}
        <div className="p-4 border-t border-slate-800/80 hidden md:block">
          <div className="flex items-center gap-3 p-3 bg-slate-950 rounded-2xl border border-slate-800 flex-row-reverse text-right">
            <img 
              src={currentUser.photoURL} 
              alt={currentUser.displayName} 
              className="w-10 h-10 rounded-full bg-slate-800 border border-slate-800"
            />
            <div className="overflow-hidden flex-1 select-text">
              <p className="text-xs font-bold truncate text-white">{currentUser.displayName}</p>
              <p className="text-[10px] text-slate-500 truncate">{currentUser.email}</p>
            </div>
            <button
              id="signout-button-sidebar"
              onClick={handleLogout}
              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-950 rounded-lg transition"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tabs - only shown on <= md screens */}
        <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-slate-900 border-t border-slate-800 gap-2 scrollbar-none flex-row-reverse items-center">
          {[
            { id: 'home', label: lang === 'ar' ? 'الرئيسية' : 'Home', icon: Compass },
            { id: 'accounts', label: lang === 'ar' ? 'ربط الحسابات' : 'Link Accounts', icon: ShieldCheck },
            { id: 'website_views', label: lang === 'ar' ? 'مشاهدة المواقع' : lang === 'fr' ? 'Sites Web' : lang === 'es' ? 'Sitios Web' : 'Websites', icon: Globe },
            { id: 'views', label: lang === 'ar' ? 'مشاهدة يوتيوب' : lang === 'fr' ? 'Vue' : lang === 'es' ? 'Ver' : 'Watch', icon: Eye },
            { id: 'subs', label: lang === 'ar' ? 'اشتراك يوتيوب' : lang === 'fr' ? 'S\'Abonner' : lang === 'es' ? 'Suscribir' : 'Subscribe', icon: UserPlus },
            { id: 'likes', label: lang === 'ar' ? 'لايك يوتيوب' : lang === 'fr' ? 'Aimer' : lang === 'es' ? 'Me gusta' : 'Like', icon: ThumbsUp },
            { id: 'fb_follows', label: lang === 'ar' ? 'فولو فيسبوك' : lang === 'fr' ? 'Suivre FB' : lang === 'es' ? 'Seguir FB' : 'FB Follows', icon: UserPlus },
            { id: 'fb_likes', label: lang === 'ar' ? 'لايك فيسبوك' : lang === 'fr' ? 'Likes FB' : lang === 'es' ? 'Likes FB' : 'FB Likes', icon: ThumbsUp },
            { id: 'ig_follows', label: lang === 'ar' ? 'فولو انستاجرام' : lang === 'fr' ? 'Suivre IG' : lang === 'es' ? 'Seguir IG' : 'IG Follows', icon: UserPlus },
            { id: 'ig_likes', label: lang === 'ar' ? 'لايك انستجرام' : lang === 'fr' ? 'Likes IG' : lang === 'es' ? 'Likes IG' : 'IG Likes', icon: ThumbsUp },
            { id: 'tiktok_follows', label: lang === 'ar' ? 'متابعة تيك توك' : lang === 'fr' ? 'Abonnés TT' : lang === 'es' ? 'Seguir TT' : 'TikTok Follows', icon: UserPlus },
            { id: 'tiktok_likes', label: lang === 'ar' ? 'لايك تيك توك' : lang === 'fr' ? 'Likes TT' : lang === 'es' ? 'Likes TT' : 'TikTok Likes', icon: ThumbsUp },
            { id: 'x_follow', label: translations[lang].tabXFollow, icon: UserPlus },
            { id: 'x_like', label: translations[lang].tabXLikes, icon: ThumbsUp },
            { id: 'pinterest_follow', label: lang === 'ar' ? 'متابعة بنترست' : lang === 'fr' ? 'Abonnés Pinterest' : lang === 'es' ? 'Seguidores de Pinterest' : 'Pinterest Follows', icon: Pin },
            { id: 'pinterest_like', label: lang === 'ar' ? 'لايك بنترست' : lang === 'fr' ? 'Likes Pinterest' : lang === 'es' ? 'Me gusta de Pinterest' : 'Pinterest Likes', icon: ThumbsUp },
            { id: 'tg_join', label: lang === 'ar' ? 'اشتراك تليجرام' : lang === 'fr' ? 'S\'Abonner Telegram' : lang === 'es' ? 'Seguir Telegram' : 'Telegram Subs', icon: Send },
            { id: 'ad', label: lang === 'ar' ? 'إعلان' : lang === 'fr' ? 'Créer' : lang === 'es' ? 'Lanzar' : 'Campaign', icon: Sparkles },
            { id: 'buy', label: lang === 'ar' ? 'شراء' : lang === 'fr' ? 'Acheter' : lang === 'es' ? 'Comprar' : 'Buy', icon: Coins },
            { id: 'exchange', label: lang === 'ar' ? 'تبديل النقاط' : 'Exchange', icon: Coins },
            { id: 'settings', label: lang === 'ar' ? 'الإعدادات' : 'Settings', icon: Sliders },
            { id: 'support', label: lang === 'ar' ? 'الدعم الفني' : lang === 'fr' ? 'Support' : lang === 'es' ? 'Soporte' : 'Support', icon: LifeBuoy },
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            const IconComp = tab.icon;
            return (
              <button
                id={`tab-nav-mob-${tab.id}`}
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition text-xs font-bold whitespace-nowrap flex-row-reverse ${
                  isSelected 
                    ? 'bg-red-500/15 border border-red-500/30 text-red-400' 
                    : 'bg-transparent border border-transparent text-slate-400 hover:text-slate-100'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}

          {/* Admin link inside mobile tabs */}
          {isUserAdmin && (
            <button
              id={`tab-nav-mob-admin`}
              onClick={() => setActiveTab('admin')}
              className={`py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition text-xs font-bold whitespace-nowrap flex-row-reverse ${
                activeTab === 'admin'
                  ? 'bg-red-955/40 border border-red-500/40 text-red-400 font-extrabold'
                  : 'bg-transparent border border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>{translations[lang].adminControl}</span>
            </button>
          )}

          {/* Quick Signout for mobile */}
          <button
            id="signout-button-mobile"
            onClick={handleLogout}
            className="py-2 px-3 bg-transparent text-slate-500 hover:text-red-400 text-xs font-bold rounded-xl flex items-center flex-row-reverse gap-1 ml-auto"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        
        {/* HEADER */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 md:px-8 shrink-0 flex-row-reverse text-right">
          <div className="flex items-center gap-2 flex-row-reverse">
            <h2 className="text-sm md:text-base font-bold text-white">
              {activeTab === 'home' && (lang === 'ar' ? 'لوحة المعلومات الرئيسية وتبادل الدعم' : 'Home Dashboard & Support Network')}
              {activeTab === 'dashboard' && (lang === 'ar' ? 'لوحة تحكم التحليلات، نظام الحماية وربط الـ API' : 'Analytics Dashboard, Anti-Bot & REST API System')}
              {activeTab === 'accounts' && (lang === 'ar' ? 'ربط ومصادقة الحسابات الرقمية' : 'Link Social Accounts')}
              {activeTab === 'views' && translations[lang].headerViewsExchange}
              {activeTab === 'website_views' && translations[lang].headerWebsiteViewsExchange}
              {activeTab === 'subs' && translations[lang].headerSubsExchange}
              {activeTab === 'likes' && translations[lang].headerLikesExchange}
              {activeTab === 'fb_likes' && translations[lang].headerFbLikesExchange}
              {activeTab === 'fb_follows' && translations[lang].headerFbFollowsExchange}
              {activeTab === 'ig_follows' && translations[lang].headerIgFollowsExchange}
              {activeTab === 'ig_likes' && translations[lang].headerIgLikesExchange}
              {activeTab === 'tiktok_follows' && translations[lang].headerTtFollowsExchange}
              {activeTab === 'tiktok_likes' && translations[lang].headerTtLikesExchange}
              {activeTab === 'x_follow' && translations[lang].headerXFollowExchange}
              {activeTab === 'x_like' && translations[lang].headerXLikesExchange}
              {activeTab === 'pinterest_like' && (lang === 'ar' ? 'تبادل لايكات وحفظ دبابيس بنترست لرفع التفاعل' : 'Exchange Pinterest likes and board pin saves')}
              {activeTab === 'pinterest_follow' && (lang === 'ar' ? 'تبادل متابعات واشتراكات حسابات وألواح بنترست لشهرة سريعة' : 'Exchange Pinterest follows and pins board subscriptions')}
              {activeTab === 'tg_join' && translations[lang].headerTgJoinExchange}
              {activeTab === 'ad' && translations[lang].headerAdSetup}
              {activeTab === 'buy' && translations[lang].headerBuyPoints}
              {activeTab === 'exchange' && (lang === 'ar' ? 'تبديل النقاط وسحب الأرباح النقدية كاش' : 'Exchange Points & USD Cash Out')}
              {activeTab === 'settings' && (lang === 'ar' ? 'إعدادات الحساب الشخصي والملف' : 'Account Settings & Credentials')}
              {activeTab === 'support' && translations[lang].headerSupport}
              {activeTab === 'admin' && translations[lang].headerAdminPanel}
            </h2>
          </div>

          <div className="flex items-center gap-4 flex-row-reverse">
            {/* LANGUAGE SELECTOR */}
            <div className="relative inline-block text-left mr-2">
              <select
                id="language-select"
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguages)}
                className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer hover:border-red-500/40 transition-colors focus:ring-1 focus:ring-red-500 font-sans"
              >
                <option value="ar">العربية 🇸🇦</option>
                <option value="en">English 🇺🇸</option>
                <option value="fr">Français 🇫🇷</option>
                <option value="es">Español 🇪🇸</option>
              </select>
            </div>

            {/* LEDGER WALLET BADGE */}
            <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 flex-row-reverse">
              <span className="text-amber-500 font-black tracking-tight text-sm">{currentUser.points.toLocaleString()}</span>
              <span className="text-[10px] text-amber-500/80 uppercase tracking-widest font-extrabold">{translations[lang].points}</span>
            </div>

            {/* USD BALANCE BADGE */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full flex items-center gap-2 flex-row-reverse" title={lang === 'ar' ? 'أرباحك المحولة بالدولار' : 'Converted USD profit'}>
              <span className="text-emerald-400 font-black tracking-tight text-sm">${(currentUser.dollars || 0).toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400/80 uppercase tracking-widest font-extrabold">{lang === 'ar' ? 'دولار' : 'USD'}</span>
            </div>

            {/* Admin toggle shortcut right in header */}
            {isUserAdmin && activeTab !== 'admin' && (
              <button
                id="header-admin-shortcut"
                onClick={() => setActiveTab('admin')}
                className="text-xs font-black text-red-500 hover:text-red-400 transition cursor-pointer font-sans"
              >
                {translations[lang].adminControl}
              </button>
            )}

            {/* Mobile-only avatar and user indicators next to head */}
            <div className="flex md:hidden items-center gap-2 select-all text-xs">
              <img 
                src={currentUser.photoURL} 
                alt={currentUser.displayName} 
                className="w-7 h-7 rounded-full bg-slate-800"
              />
            </div>
          </div>
        </header>

        {/* PRIMARY TRANSITIONAL BODY FRAME */}
        <div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto">
          {renderAdsByPosition('header')}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + refreshTrigger}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Footer Ads */}
        {renderAdsByPosition('footer')}

        {/* FOOTER */}
        <footer className="mt-auto border-t border-slate-900/50 py-4 text-center text-slate-600 text-[11px] gap-1 flex flex-col">
          <p className="font-semibold text-slate-500">{translations[lang].footerCopyright}</p>
          <p className="text-[9px] text-slate-700">{translations[lang].footerDisclaimer}</p>
        </footer>
      </main>

    </div>
  );
}
