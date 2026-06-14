<?php
/**
 * SocialXchange - Front Controller & SSR Hybrid Rendering System
 * Supports clean paths routing, dynamically injects custom SEO Meta Tags, 
 * pre-renders all Interactive Forms and Dashboards to ensure robust SEO indexing,
 * and links Vite's built CSS/JS production assets.
 */

// 1. Resolve request URI & parse clean path routes
$requestUri = $_SERVER['REQUEST_URI'];
$basePath = strtok($requestUri, '?'); // strip query parameters
$basePath = rtrim($basePath, '/');    // strip trailing slash

// Default path fallback to /home
if (empty($basePath) || $basePath === '') {
    $basePath = '/home';
}

// 2. Comprehensive metadata routes map with tabs
$routesMap = [
    '/home' => [
        'tab' => 'home',
        'title' => 'الصفحة الرئيسية - لوحة المعلومات | SocialXchange',
        'desc' => 'تطوير حسابات التواصل الاجتماعي وتبادل الدعم المجاني الفوري للحصول على متابعين ومشاهدات وجماهير حقيقية لصفحتك وقناتك.',
        'header_title' => 'لوحة التحكم والتبادل الاجتماعي',
        'icon' => '🏠'
    ],
    '/services/analysis' => [
        'tab' => 'dashboard',
        'title' => 'التحليلات الاستراتيجية ومتابعة الطلبات | SocialXchange',
        'desc' => 'تحليلات شاملة وسريعة لحملاتك الإعلانية، ونظام تتبع الطلبات الجارية والمكتملة مع إحصائيات معززة.',
        'header_title' => 'التحليلات الاستراتيجية والمتابعة',
        'icon' => '📈'
    ],
    '/services/accountverification' => [
        'tab' => 'accounts',
        'title' => 'ربط ومصادقة الحسابات الرقمية | SocialXchange',
        'desc' => 'قم بربط حساباتك التبادلية على منصات يوتيوب، تيك توك، انستغرام وفيسبوك لضمان المصادقة وحماية بياناتك التبادلية.',
        'header_title' => 'ربط ومصادقة حسابات المنصات',
        'icon' => '🔐'
    ],
    '/services/youtubeviews' => [
        'tab' => 'views',
        'title' => 'مشاهدة فيديوهات يوتيوب وكسب نقاط | SocialXchange',
        'desc' => 'شاهد الفيديوهات المميزة لليوتيوبرز والناشرين لتبادل المشاهدات وجني نقاط التبادل الآمنة وبشكل شرعي.',
        'header_title' => 'تبادل مشاهدات يوتيوب',
        'icon' => '🎥'
    ],
    '/services/youtubesubscription' => [
        'tab' => 'subs',
        'title' => 'اشتراكات يوتيوب الحقيقية والآمنة | SocialXchange',
        'desc' => 'اشترك في قنوات يوتيوب نشطة لزيادة مشتركين قناتك، وكسب نقاط الرعاية لرفع الإسقاط البصري لمحتواك.',
        'header_title' => 'زيادة مشتركي قنوات يوتيوب',
        'icon' => '🔔'
    ],
    '/services/youtubelikes' => [
        'tab' => 'likes',
        'title' => 'لايكات وإعجابات يوتيوب مجانية | SocialXchange',
        'desc' => 'تفاعل بوضع لايكات لفيديوهات يوتيوب المنوعة للحصول على إعجابات حقيقية وتنشيط محرك البحث يوتيوب لفيديوهاتك.',
        'header_title' => 'تبادل إعجابات لايكات يوتيوب',
        'icon' => '👍'
    ],
    '/services/facebooklikes' => [
        'tab' => 'fb_likes',
        'title' => 'زيادة لايكات وتفاعل فيسبوك | SocialXchange',
        'desc' => 'احصل على لايكات فيسبوك حقيقية لصفحاتك ومنشوراتك لتعزيز حضورك الرقمي وبناء المصداقية الجماهيرية.',
        'header_title' => 'تبادل لايكات وإعجابات فيسبوك',
        'icon' => '👥'
    ],
    '/services/facebookfollowers' => [
        'tab' => 'fb_follows',
        'title' => 'زيادة متابعين ومعجبين فيسبوك حقيقيين | SocialXchange',
        'desc' => 'احصل على متابعين وإعجابات لصفحتك الشخصية أو العامة على فيسبوك من حسابات حقيقية ونشطة لزيادة تفاعلك وزيادة المصداقية.',
        'header_title' => 'زيادة معجبي ومتابعي فيسبوك',
        'icon' => '📈'
    ],
    '/services/instagramfollowers' => [
        'tab' => 'ig_follows',
        'title' => 'متابعون انستغرام حقيقيون لصفحتك | SocialXchange',
        'desc' => 'متابعة مستخدمي انستغرام الحصريين وتكبير قاعدة الجماهير لملفك الشخصي بسرعة وموثوقية عالية.',
        'header_title' => 'متابعي انستقرام الحقيقيين',
        'icon' => '📸'
    ],
    '/services/instagramlikes' => [
        'tab' => 'ig_likes',
        'title' => 'لايكات وتوجيه إعجابات انستغرام | SocialXchange',
        'desc' => 'اكشف النقاب عن لايكات حقيقية لصورك ومنشوراتك على انستقرام لتبادل القبول ورفع مستوى الوصول المجاني.',
        'header_title' => 'لايكات وإعجابات انستقرام',
        'icon' => '💖'
    ],
    '/services/tiktokfollowers' => [
        'tab' => 'tiktok_follows',
        'title' => 'متابعة وزيادة معجبين تيك توك | SocialXchange',
        'desc' => 'تفاعل مع صناع المحتوى على تيك توك لرفع أعداد الفولو والمتابعين لملفك الشخصي وزيادة الشهرة وحركة الإكسبلور.',
        'header_title' => 'متابعين وتكبير حسابات تيك توك',
        'icon' => '🎵'
    ],
    '/services/likes' => [
        'tab' => 'tiktok_likes',
        'title' => 'زيادة لايكات وإعجابات تيك توك | SocialXchange',
        'desc' => 'زد مئات الإعجابات الحقيقية والآمنة لمقاطع تيك توك التابعة لك لرفع التداول البصري وتفعيل الحسابات.',
        'header_title' => 'لايكات وإكسسبلور تيك توك',
        'icon' => '⚡'
    ],
    '/services/telegramfollowers' => [
        'tab' => 'tg_join',
        'title' => 'متابعون ومشتركون تليجرام حقيقيون | SocialXchange',
        'desc' => 'اشترك وانضم للقنوات والمجموعات النشطة والممتعة على تليجرام لزيادة أعضاء مجموعتك مجاناً وبأمان.',
        'header_title' => 'متابعي قنوات ومجموعات تليجرام',
        'icon' => '📢'
    ],
    '/services/buypoints' => [
        'tab' => 'buy',
        'title' => 'شراء باقات النقاط الأرخص للترويج | SocialXchange',
        'desc' => 'اشترِ باقات نقاط فائقة بأسعار مخفضة للبدء فوراً بتمويل حملاتك الترويجية وجلب آلاف المتفاعلين في ثوانٍ معدودة.',
        'header_title' => 'شراء النقاط وتعبئة الرصيد المباشر',
        'icon' => '💳'
    ],
    '/services/advertise' => [
        'tab' => 'ad',
        'title' => 'إطلاق حملة ترويجية جديدة وزيادة التفاعل | SocialXchange',
        'desc' => 'قم بتمويل وإطلاق حملتك الترويجية لزيادة المتابعين، المشاهدات، واللايكات الحقيقية والآمنة على قنواتك وحساباتك الرقمية.',
        'header_title' => 'تمويل وإطلاق وإدارة حملاتك',
        'icon' => '📣'
    ],
    '/services/withdraw' => [
        'tab' => 'exchange',
        'title' => 'تحويل النقاط وسحب الأرباح النقدية | SocialXchange',
        'desc' => 'بوابتك المالية الآمنة والموثوقة: حوّل نقاط التبادل الفائضة لديك إلى دولارات واسحب كاش لجميع المحافظ الإلكترونية.',
        'header_title' => 'سحب الأرباح وتحويل كاش فوري',
        'icon' => '💰'
    ],
    '/services/settings' => [
        'tab' => 'settings',
        'title' => 'تخصيص إعدادات الحساب والملف | SocialXchange',
        'desc' => 'إدارة وتحديث بياناتك الشخصية، كلمات المرور، تفضيلات لغة العرض، وطرق التحقق التلقائي لحسابك.',
        'header_title' => 'إعدادات وتخصيص الحساب الشخصي',
        'icon' => '⚙️'
    ],
    '/services/technicalsupport' => [
        'tab' => 'support',
        'title' => 'مركز الدعم الفني وتلقي الشكاوى | SocialXchange',
        'desc' => 'تواصل مباشرة مع مهندسي الدعم الفني لإرسال الملاحظات، الشكاوى وحل مشاكل الحملات والسحوبات الفورية.',
        'header_title' => 'الدعم الفني والبطاقات المفتوحة',
        'icon' => '💬'
    ],
    '/services/admin' => [
        'tab' => 'admin',
        'title' => 'غرفة التحكم والإدارة الشاملة | SocialXchange',
        'desc' => 'منصة الإدارة الداخلية لإدارة الحملات والمستخدمين وتدقيق سحوبات الأموال وإعداد باقات النقاط وتنمية الموقع.',
        'header_title' => 'لوحة تحكم المدير العام',
        'icon' => '👑'
    ]
];

// Scan dynamic routing keys
$normalizedPath = strtolower($basePath);

// Define safe fallback metadata defaults
$metaTitle = "منصة التبادل والترويج الحقيقي | SocialXchange";
$metaDesc = "احصل مجاناً على متابعين، مشاهدات، لايكات، واشتراكات حقيقية لمختلف قنواتك وحساباتك لزيادة التفاعل الرقمي والربح.";
$headingTitle = "منصة التبادل والترويج الحقيقي";
$icon = "🎯";
$activeTab = '';

foreach ($routesMap as $pathKey => $data) {
    if (strtolower($pathKey) === $normalizedPath) {
        $metaTitle = $data['title'];
        $metaDesc = $data['desc'];
        $headingTitle = $data['header_title'];
        $icon = $data['icon'];
        $activeTab = $data['tab'];
        break;
    }
}

// 3. Scan the `/dist/assets` folder to fetch compiled CSS/JS asset paths dynamically
$cssFile = '';
$jsFile = '';

$distAssetsDir = __DIR__ . '/dist/assets';
if (is_dir($distAssetsDir)) {
    $files = @scandir($distAssetsDir);
    if ($files !== false) {
        foreach ($files as $file) {
            $ext = pathinfo($file, PATHINFO_EXTENSION);
            if ($ext === 'css') {
                $cssFile = '/dist/assets/' . $file;
            } elseif ($ext === 'js') {
                $jsFile = '/dist/assets/' . $file;
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Comprehensive SSR SEO Tags -->
    <title><?php echo htmlspecialchars($metaTitle); ?></title>
    <meta name="description" content="<?php echo htmlspecialchars($metaDesc); ?>">
    
    <!-- Verification and Crawlers Canonical optimization -->
    <link rel="canonical" href="https://<?php echo $_SERVER['HTTP_HOST'] . htmlspecialchars($basePath); ?>">

    <meta property="og:type" content="website">
    <meta property="og:url" content="https://<?php echo $_SERVER['HTTP_HOST'] . htmlspecialchars($basePath); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($metaTitle); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($metaDesc); ?>">
    <meta property="og:image" content="https://<?php echo $_SERVER['HTTP_HOST']; ?>/assets/seo_og_preview.png">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo htmlspecialchars($metaTitle); ?>">
    <meta name="twitter:description" content="<?php echo htmlspecialchars($metaDesc); ?>">

    <!-- High-end structural Typography -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;700;800;900&family=Tajawal:wght@400;500;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- CSS styling setup -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0f9ff',
                            100: '#e0f2fe',
                            500: '#0ea5e9',
                            600: '#0284c7',
                            700: '#0369a1',
                        }
                    },
                    fontFamily: {
                        sans: ['Cairo', 'Tajawal', 'Inter', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Injected stylesheet bundle (compiled via Build) -->
    <?php if ($cssFile): ?>
        <link rel="stylesheet" href="<?php echo $cssFile; ?>">
    <?php endif; ?>

    <style>
        html {
            font-size: 18px !important;
        }
        body {
            font-family: 'Cairo', 'Tajawal', 'Inter', sans-serif;
            font-weight: 500; /* Enforce medium font style globally to pop on dark backgrounds */
            background: linear-gradient(135deg, #090d16 0%, #0f1026 50%, #150d2c 100%);
            color: #f8fafc;
            min-height: 100vh;
        }
        /* Custom scrollbar matching platform vibe */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: #0f1026;
        }
        ::-webkit-scrollbar-thumb {
            background: #312e81;
            border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #4338ca;
        }
    </style>
</head>
<body class="flex flex-col min-h-screen Selection:bg-sky-500 Selection:text-white">

    <!-- Elegant Navigation Bar -->
    <header class="border-b border-indigo-950/60 bg-slate-950/70 backdrop-blur-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <a href="/home" class="flex items-center gap-2.5">
                    <span class="text-3xl">🚀</span>
                    <span class="text-2xl font-black bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-500 bg-clip-text text-transparent tracking-tight">SocialXchange</span>
                </a>
                <span class="text-[10px] uppercase font-bold tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded-full">
                    PHP Hybrid SSR
                </span>
            </div>

            <!-- Main site navigational tabs -->
            <nav class="hidden lg:flex items-center gap-2 text-[14px] font-semibold text-slate-300">
                <a href="/home" class="px-4 py-2 rounded-xl transition hover:text-white hover:bg-slate-900/60 <?php echo $normalizedPath==='/home' ? 'text-sky-400 bg-slate-900/80 border border-indigo-500/20' : ''; ?>">الرئيسية</a>
                <a href="/services/buypoints" class="px-4 py-2 rounded-xl transition hover:text-white hover:bg-slate-900/60 <?php echo $normalizedPath==='/services/buypoints' ? 'text-sky-400 bg-slate-900/80 border border-indigo-500/20' : ''; ?>">شراء نقاط</a>
                <a href="/services/advertise" class="px-4 py-2 rounded-xl transition hover:text-white hover:bg-slate-900/60 <?php echo $normalizedPath==='/services/advertise' ? 'text-sky-400 bg-slate-900/80 border border-indigo-500/20' : ''; ?>">إطلاق حملة ترويجية</a>
                <a href="/services/withdraw" class="px-4 py-2 rounded-xl transition hover:text-white hover:bg-slate-900/60 <?php echo $normalizedPath==='/services/withdraw' ? 'text-sky-400 bg-slate-900/80 border border-indigo-500/20' : ''; ?>">سحب الأرباح كاش</a>
                <a href="/services/technicalsupport" class="px-4 py-2 rounded-xl transition hover:text-white hover:bg-slate-900/60 <?php echo $normalizedPath==='/services/technicalsupport' ? 'text-sky-400 bg-slate-900/80 border border-indigo-500/20' : ''; ?>">الدعم الفني</a>
            </nav>

            <!-- Secondary user action tags -->
            <div class="flex items-center gap-3">
                <div class="bg-indigo-950/60 border border-indigo-500/30 rounded-xl px-3.5 py-1.5 flex items-center gap-2 text-sm font-bold text-amber-300">
                    <span>🪙</span>
                    <span>1,430 نقطة</span>
                </div>
                <!-- Dynamic Quick Nav -->
                <a href="/services/settings" class="bg-slate-900 hover:bg-slate-800 border border-slate-700/50 p-2 rounded-xl transition text-slate-300" title="إعدادات الحساب">
                    ⚙️
                </a>
            </div>
        </div>
    </header>

    <!-- SSR dynamic viewport container #root. React JS files mount inside here. -->
    <div id="root">
        <!-- 
          Inside the div: This is pre-rendered HTML content parsed at execution time server-side.
          This serves as the high-fidelity template with input fields, listings and text forms.
          When React hydrates, it will dynamically mount and replace everything in root.
        -->
        <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 flex flex-col justify-start">
            
            <!-- Hero banner detail -->
            <div class="w-full text-center mb-12 mt-4">
                <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 text-indigo-300 rounded-[30px] text-base font-bold border border-indigo-500/20 mb-6 tracking-wide">
                    <span>⚡ SYSTEM LIVE & SECURE</span>
                    <span>•</span>
                    <span>تبادل تفاعل رقمي مضمون 100%</span>
                </div>
                <h1 class="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                    <span class="text-7xl inline-block align-middle ml-2 animate-bounce"><?php echo $icon; ?></span>
                    <?php echo htmlspecialchars($headingTitle); ?>
                </h1>
                <p class="text-xl sm:text-2xl text-slate-200 font-semibold max-w-4xl mx-auto leading-relaxed">
                    <?php echo htmlspecialchars($metaDesc); ?>
                </p>
            </div>

            <!-- Dynamic UI content loader based on active route -->
            <div class="w-full">
                
                <?php if ($normalizedPath === '/home'): ?>
                    <!-- HIGH FIDELITY /home LANDING PORTAL WITH INPUTS, METRICS & SECTIONS -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 shadow-lg">
                        <!-- User Account Profile Metric Card -->
                        <div class="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                            <div>
                                <div class="flex items-center justify-between mb-5">
                                    <h3 class="text-lg md:text-xl font-bold bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase tracking-wider">معلومات الملف الشخصي</h3>
                                    <span class="bg-emerald-500/10 text-emerald-400 text-sm px-3 py-1 rounded-full font-black border border-emerald-500/20">نشط</span>
                                </div>
                                <div class="flex items-center gap-4 mb-6">
                                    <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-700 to-indigo-500 flex items-center justify-center text-2xl font-black text-white shadow-xl border border-indigo-400/20">
                                        UA
                                    </div>
                                    <div>
                                        <div class="text-xl md:text-2xl font-black text-white leading-tight">العضو التفاعلي المتميز</div>
                                        <div class="text-base font-bold text-slate-400 mt-0.5">ID: #94392-AR</div>
                                    </div>
                                </div>
                            </div>
                            <div class="border-t border-slate-800/80 pt-5 space-y-4 text-base sm:text-lg font-bold">
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-300">رصيد النقاط الفورية:</span>
                                    <span class="font-black text-amber-300 text-xl bg-amber-500/10 px-3.5 py-1.5 rounded-xl border border-amber-500/20">1,430 نقطة</span>
                                </div>
                                <div class="flex justify-between items-center">
                                    <span class="text-slate-300">الحملات النشطة:</span>
                                    <span class="font-black text-sky-400 text-xl bg-sky-500/10 px-3.5 py-1.5 rounded-xl border border-sky-500/20">2 خطة جارية</span>
                                </div>
                            </div>
                        </div>

                        <!-- Mini quick actions widget -->
                        <div class="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between md:col-span-2">
                            <div>
                                <h3 class="text-2xl md:text-3xl font-black text-white mb-3 flex items-center gap-2.5">
                                    <span>🚀</span> لوحة البداية السريعة والتوجيه
                                </h3>
                                <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">
                                    ابدأ الآن بتزويد وزيادة نمو حساباتك مجاناً عبر تبادل التفاعلات التلقائية واليدوية مع آلاف المستخدمين النشطين، أو قم بشحن رصيد نقاط التبادل للوصول السريع الفوري دون الحاجة للقيام بالمهام اليدوية والانتظار الطويل.
                                </p>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <a href="/services/advertise" class="bg-indigo-600 hover:bg-indigo-500 text-white text-base md:text-lg font-black px-5 py-4 rounded-xl text-center transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
                                    <span>📣</span> إطلاق ترويج جديد
                                </a>
                                <a href="/services/buypoints" class="bg-gradient-to-r from-amber-500 to-yellow-650 hover:from-amber-400 hover:to-yellow-500 text-white text-base md:text-lg font-black px-5 py-4 rounded-xl text-center transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                                    <span>💳</span> شحن رصيد نقاط
                                </a>
                                <a href="/services/withdraw" class="bg-emerald-600 hover:bg-emerald-500 text-white text-base md:text-lg font-black px-5 py-4 rounded-xl text-center transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                                    <span>💰</span> تحويل الأرباح كاش
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Direct Interaction Sections and Active Platforms List -->
                    <div class="mb-10 text-right">
                        <div class="flex items-center gap-3 mb-6">
                            <span class="text-3xl">🛠️</span>
                            <h2 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-relaxed">منصات التبادل وبوابات كسب النقاط المتاحة</h2>
                        </div>
                        
                        <div id="service-exchange-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <!-- Youtube Platform Exchange Box -->
                            <div id="card-youtube-exchange" class="bg-slate-900/40 border border-red-500/20 hover:border-red-500/40 rounded-2xl p-6 transition flex flex-col justify-between shadow-lg">
                                <div>
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="text-xs bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-full font-black">يوتيوب</span>
                                        <span class="text-green-400 text-sm font-black font-mono">100% Active</span>
                                    </div>
                                    <h3 class="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">تبادل الدعم يوتيوب (YouTube)</h3>
                                    <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">اكسب مئات النقاط عبر تصفح الفيديوهات، والاشتراك، والدعم الموثق الآمن.</p>
                                </div>
                                <div class="grid grid-cols-3 gap-2">
                                    <a id="link-yt-views" href="/services/youtubeviews" class="text-xs sm:text-sm font-bold bg-red-950/40 border border-red-800/40 text-red-350 py-2.5 rounded-xl text-center hover:bg-red-900/40 transition">مشاهدات</a>
                                    <a id="link-yt-subs" href="/services/youtubesubscription" class="text-xs sm:text-sm font-bold bg-red-950/40 border border-red-800/40 text-red-350 py-2.5 rounded-xl text-center hover:bg-red-900/40 transition">اشتراكات</a>
                                    <a id="link-yt-likes" href="/services/youtubelikes" class="text-xs sm:text-sm font-bold bg-red-950/40 border border-red-800/40 text-red-350 py-2.5 rounded-xl text-center hover:bg-red-900/40 transition">لايكات</a>
                                </div>
                            </div>

                            <!-- TikTok Platform Exchange Box -->
                            <div id="card-tiktok-exchange" class="bg-slate-900/40 border border-teal-500/20 hover:border-teal-500/40 rounded-2xl p-6 transition flex flex-col justify-between shadow-lg">
                                <div>
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="text-xs bg-teal-500/10 text-teal-400 border border-teal-500/20 px-3 py-1 rounded-full font-black">تيك توك</span>
                                        <span class="text-green-400 text-sm font-black font-mono">Active</span>
                                    </div>
                                    <h3 class="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">تبادل تيك توك (TikTok)</h3>
                                    <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">ادخل تريند الإكسبلور عبر زيادة الفولو وإعجابات مقاطع الفيديو بصورة فورية وموثوقة.</p>
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <a id="link-tiktok-fol" href="/services/tiktokfollowers" class="text-xs sm:text-sm font-bold bg-teal-950/40 border border-teal-800/40 text-teal-300 py-2.5 rounded-xl text-center hover:bg-teal-900/40 transition">متابعين</a>
                                    <a id="link-tiktok-lik" href="/services/likes" class="text-xs sm:text-sm font-bold bg-teal-950/40 border border-teal-800/40 text-teal-300 py-2.5 rounded-xl text-center hover:bg-teal-900/40 transition">لايك وإكسبلور</a>
                                </div>
                            </div>

                            <!-- Telegram Platform Exchange Box -->
                            <div id="card-telegram-exchange" class="bg-slate-900/40 border border-sky-500/20 hover:border-sky-500/40 rounded-2xl p-6 transition flex flex-col justify-between shadow-lg">
                                <div>
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full font-black">تليجرام</span>
                                        <span class="text-green-400 text-sm font-black font-mono">Active</span>
                                    </div>
                                    <h3 class="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">تبادل تليجرام (Telegram)</h3>
                                    <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">انضم للقنوات النشطة والمجموعات وكبّر عدد أعضاء قناتك بضمان تبادل حقيقي آمن ومضمون.</p>
                                </div>
                                <a id="link-telegram-fol" href="/services/telegramfollowers" class="text-sm sm:text-base font-bold bg-sky-950/40 border border-sky-800/40 text-sky-300 py-3 rounded-xl text-center hover:bg-sky-900/40 transition block shadow">
                                    تصفح قنوات تليجرام المتاحة 🚀
                                </a>
                            </div>

                            <!-- Analysis & Stat Box -->
                            <div id="card-analysis-stat" class="bg-slate-900/40 border border-indigo-500/20 hover:border-indigo-500/40 rounded-2xl p-6 transition flex flex-col justify-between shadow-lg">
                                <div>
                                    <div class="flex justify-between items-center mb-4">
                                        <span class="text-xs bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 px-3 py-1 rounded-full font-black">التحليلات</span>
                                        <span class="text-indigo-400 text-sm font-black font-mono">Stats Online</span>
                                    </div>
                                    <h3 class="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">التحليلات والطلبات</h3>
                                    <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">تتبع تقدّم طلباتك الجارية، إحصائيات معززة، وأداء المنشورات وترقب رصيد أرباحك.</p>
                                </div>
                                <a id="link-analysis-panel" href="/services/analysis" class="text-sm sm:text-base font-bold bg-indigo-950/40 border border-indigo-800/40 text-indigo-350 py-3 rounded-xl text-center hover:bg-indigo-900/40 transition block shadow">
                                    فتح التحليلات الاستراتيجية 📊
                                </a>
                            </div>
                        </div>
                    </div>
                <?php elseif ($normalizedPath === '/services/advertise'): ?>
                    <!-- LAUNCH CAMPAIGN FORM (إطلاق حملة ترويجية جديدة) -->
                    <div class="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl text-right">
                        <div class="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                            <span class="text-4xl">📣</span>
                            <div>
                                <h2 class="text-2xl sm:text-3xl font-black text-white">إطلاق وتنسيق خطة إعلانية جديدة لحساباتك</h2>
                                <p class="text-base sm:text-lg font-medium text-slate-300 mt-1">احصل على آلاف الزيارات والتفاعلات الحقيقية من المجموعات النشطة</p>
                            </div>
                        </div>

                        <!-- Active Campaign Input Fields -->
                        <form onsubmit="return false;" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Type selectors -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">نوع التفاعل المطلوب لحملتك</label>
                                    <select class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                         <option value="youtube_views">مشاهدات يوتيوب (🎥)</option>
                                         <option value="youtube_subs">اشتراكات قنوات يوتيوب (🔔)</option>
                                         <option value="youtube_likes">لايكات فيديوهات يوتيوب (👍)</option>
                                         <option value="fb_likes" selected>لايك وإعجابات فيسبوك (👥)</option>
                                         <option value="fb_follows">متابعين صفحات فيسبوك (📈)</option>
                                         <option value="ig_follows">متابعي انستغرام (📸)</option>
                                         <option value="ig_likes">لايك وإعجابات انستغرام (💖)</option>
                                         <option value="tiktok_follows">متابعة حسابات تيك توك (🎵)</option>
                                         <option value="tiktok_likes">لايكات تيك توك (⚡)</option>
                                         <option value="tg_join">اشتراكات قنوات ومجموعات تليجرام (📢)</option>
                                    </select>
                                </div>

                                <!-- Campaign Title Input -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">عنوان الإعلان الخاص بك</label>
                                    <input type="text" placeholder="مثال: زيادة لايكات منشوري الأخير لمسابقة" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Target link URL -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">رابط الحساب أو المنشور على التطبيق المختار</label>
                                    <input type="url" placeholder="https://www.facebook.com/..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                </div>

                                <!-- Duration view inputs (e.g. for YT videos) -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">مدة التصفح أو البقاء المطلوبة (بالثواني)</label>
                                    <input type="number" value="30" min="15" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Quantity target input -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">الكمية المستهدفة (الأدنى 25 تفاعل)</label>
                                    <input type="number" value="50" min="25" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                </div>

                                <!-- Reward per action input -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">مكافأة الزائر الواحد (نقاط التبادل)</label>
                                    <input type="number" value="15" min="5" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                </div>
                            </div>

                            <!-- Calculation summary metrics -->
                            <div class="bg-indigo-950/30 border border-indigo-900/40 p-5 rounded-xl flex items-center justify-between text-base sm:text-lg">
                                <div>
                                    <span class="text-slate-300 ml-2">الإجمالي التقديري للحملة:</span>
                                    <strong class="text-amber-300 font-extrabold text-xl sm:text-2xl">750 نقطة</strong>
                                </div>
                                <div class="text-slate-300 font-bold">
                                    الباقة المقدرة: <span class="text-white">50 إجراء × 15 ن</span>
                                </div>
                            </div>

                            <div class="pt-2">
                                <button type="submit" class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-4 px-6 rounded-xl transition flex items-center justify-center gap-2 text-base sm:text-lg shadow-lg shadow-indigo-600/10">
                                    <span>🚀</span> تأكيد وإطلاق الخطة الإعلانية التفاعلية
                                </button>
                            </div>
                        </form>
                    </div>

                <?php elseif ($normalizedPath === '/services/buypoints'): ?>
                    <!-- BUY POINTS TIERS (شراء باقات نقاط الترويج) -->
                    <div class="text-right mb-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <!-- Tier 1 -->
                            <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition">
                                <div>
                                    <span class="text-3xl mb-2 block">🥉</span>
                                    <h3 class="text-xl sm:text-2xl font-black text-white mb-1">باقة المبتدئين السريعة</h3>
                                    <div class="text-indigo-400 text-lg sm:text-xl font-bold mb-4 font-mono">5,000 Points</div>
                                    <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">مناسبة لتجربة جلب التفاعلات السريعة لمنشور واحد أو صفحة حديثة المنشأ.</p>
                                </div>
                                <div>
                                    <div class="text-2xl sm:text-3xl font-black text-white mb-4 font-mono">4.99 $</div>
                                    <button class="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-white font-bold py-3 rounded-xl text-sm transition">
                                        شراء ونقل فوري للرصيد
                                    </button>
                                </div>
                            </div>

                            <!-- Tier 2 - Recommended -->
                            <div class="bg-indigo-950/20 border-2 border-indigo-500/50 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500 transition relative">
                                <div class="absolute -top-3.5 left-4 bg-indigo-600 text-xs text-white font-black px-3 py-1 rounded-full uppercase tracking-wider">
                                    الباقة الأكثر طلباً 🔥
                                </div>
                                <div>
                                    <span class="text-3xl mb-2 block">🥈</span>
                                    <h3 class="text-xl sm:text-2xl font-black text-white mb-1">باقة رواد النمو الرقمي</h3>
                                    <div class="text-indigo-400 text-lg sm:text-xl font-bold mb-4 font-mono">15,000 Points</div>
                                    <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">أفضل خيار لتنمية الفيديوهات، حشد تفاعل لايكات ومتابعون دائمين لحسابك.</p>
                                </div>
                                <div>
                                    <div class="text-2xl sm:text-3xl font-black text-white mb-4 font-mono">11.99 $</div>
                                    <button class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl text-sm transition">
                                        شراء ونقل فوري للرصيد
                                    </button>
                                </div>
                            </div>

                            <!-- Tier 3 -->
                            <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-indigo-500/40 transition">
                                <div>
                                    <span class="text-3xl mb-2 block">🥇</span>
                                    <h3 class="text-xl sm:text-2xl font-black text-white mb-1">باقة كبار المعلنين</h3>
                                    <div class="text-indigo-400 text-lg sm:text-xl font-bold mb-4 font-mono">50,000 Points</div>
                                    <p class="text-slate-200 text-base sm:text-lg font-medium leading-relaxed mb-6">لأصحاب الشركات والقنوات الكبيرة الباحثين عن إرسال قنواتهم للترقية فورياً.</p>
                                </div>
                                <div>
                                    <div class="text-2xl sm:text-3xl font-black text-white mb-4 font-mono">29.99 $</div>
                                    <button id="btn-buy-tier-3" class="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-white font-black py-4 rounded-xl text-base transition">
                                        شراء ونقل فوري للرصيد
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Custom quantity form -->
                        <div id="custom-points-calculator" class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mt-8 shadow-lg">
                            <h4 class="text-xl sm:text-2xl font-black text-white mb-4">حساب مخصص ومشتريات فورية بنقرتين</h4>
                            <div class="flex flex-col sm:flex-row gap-4">
                                <input id="custom-points-input" type="number" placeholder="مثال: أدخل كمية مخصصة من النقاط" class="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-5 py-4 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                <button id="btn-custom-points-submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-8 py-4 rounded-xl text-base sm:text-lg transition whitespace-nowrap shadow-lg">
                                    طلب شحن مخصص
                                </button>
                            </div>
                        </div>
                    </div>

                <?php elseif ($normalizedPath === '/services/withdraw'): ?>
                    <!-- WITHDRAWAL FORM (سحب الأرباح) -->
                    <div id="panel-withdraw-cash" class="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl text-right">
                        <div class="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                            <span class="text-4xl">💰</span>
                            <div>
                                <h1 class="text-2xl sm:text-3xl font-black text-white">بوابة سحب الأرباح وتحويل كاش فوري</h1>
                                <p class="text-base sm:text-lg font-medium text-slate-350 mt-1">قم بتحويل نقاط التبادل الزائدة لديك إلى أموال نقدية حقيقية وسحبها مباشرة</p>
                            </div>
                        </div>

                        <form onsubmit="return false;" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <!-- Points Quantity -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">كمية النقاط المراد تحويلها</label>
                                    <input id="input-withdraw-points" type="number" placeholder="مثال: 10,000 نقطة" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-250 focus:outline-none focus:border-indigo-500">
                                    <p class="text-xs sm:text-sm text-slate-400 mt-2 font-medium">الحد الأدنى للتحويل: 5,000 نقطة (تساوي 5.00 دولارات)</p>
                                </div>

                                <!-- Payment Selector -->
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">وسيلة ومحفظة استلام الكاش المعتمدة</label>
                                    <select id="select-withdraw-method" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                        <option value="vodafone_cash">فودافون كاش (Vodafone Cash)</option>
                                        <option value="electronic_wallet">محفظة إلكترونية (Orange/Etisalat/We)</option>
                                        <option value="usdt">دولار رقمي (USDT - TRC20)</option>
                                        <option value="paypal">محفظة بايبال (PayPal Portal)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- Withdrawal Account details -->
                            <div>
                                <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">بيانات ورقم حساب الاستلام بالتفصيل</label>
                                <input id="input-withdraw-address" type="text" placeholder="أدخل رقم الهاتف أو عنوان محفظة استلام الكاش بدقة متناهية" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                            </div>

                            <div class="pt-2">
                                <button id="btn-withdraw-submit" class="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-4 px-6 rounded-xl transition text-base sm:text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10">
                                    <span>💸</span> تقديم طلب السحب والتحويل المالي فورياً
                                </button>
                            </div>
                        </form>
                    </div>

                <?php elseif ($normalizedPath === '/services/settings'): ?>
                    <!-- SETTINGS & PROFILE (تحديث الحساب) -->
                    <div id="panel-user-settings" class="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl text-right">
                        <div class="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                            <span class="text-4xl">⚙️</span>
                            <div>
                                <h1 class="text-2xl sm:text-3xl font-black text-white">إعدادات ملف التعريف وتخصيص الحساب الشخصي</h1>
                                <p class="text-base sm:text-lg font-medium text-slate-350 mt-1">تحديث معلومات العضوية وتأمين خيارات التفاعلات المباشرة</p>
                            </div>
                        </div>
                        
                        <form onsubmit="return false;" class="space-y-6">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">الاسم الكامل للمشترك</label>
                                    <input id="input-settings-name" type="text" value="العضو التفاعلي المتميز" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none focus:border-indigo-500">
                                </div>
                                <div>
                                    <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">البريد الإلكتروني المعتمد</label>
                                    <input id="input-settings-email" type="email" value="user@socialxchange.com" disabled class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-500 select-none cursor-not-allowed">
                                </div>
                            </div>

                            <div class="pt-2">
                                <button id="btn-settings-submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-3 px-8 rounded-xl transition text-base shadow-lg shadow-indigo-600/10">
                                    تحديث بيانات الملف
                                </button>
                            </div>
                        </form>
                    </div>

                <?php elseif ($normalizedPath === '/services/technicalsupport'): ?>
                    <!-- SUPPORT TICKET FORM (الدعم الفني) -->
                    <div id="panel-tech-support" class="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-xl text-right">
                        <div class="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
                            <span class="text-4xl">💬</span>
                            <div>
                                <h1 class="text-2xl sm:text-3xl font-black text-white">مركز الدعم الفني وتلقي الشكاوى</h1>
                                <p class="text-base sm:text-lg font-medium text-slate-350 mt-1">أرسل بطاقة دعم فني لمهندسي الدعم، وسيتم الرد عليك في غضون دقائق معدودة</p>
                            </div>
                        </div>

                        <form onsubmit="return false;" class="space-y-6">
                            <div>
                                <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">عنوان تذكرة الدعم / موضوع المشكلة</label>
                                <input id="input-support-subject" type="text" placeholder="مثال: تأخر تزويد نقاط المشتريات فودافون كاش" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none">
                            </div>

                            <div>
                                <label class="block text-base sm:text-lg font-bold text-slate-200 mb-2">تفاصيل المشكلة والشكوى بالتوضيح</label>
                                <textarea id="input-support-message" rows="5" placeholder="أرفق هنا أية تفاصيل وكلمات توضيحية لنتمكن من فهم ومعالجة الشكوى فورياً..." class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-base sm:text-lg font-medium text-slate-200 focus:outline-none"></textarea>
                            </div>

                            <div class="pt-2">
                                <button id="btn-support-submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold py-4 px-6 rounded-xl transition text-base sm:text-lg w-full flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10">
                                    <span>💬</span> إرسال تذكرة الدعم الفني فوراً
                                </button>
                            </div>
                        </form>
                    </div>

                <?php else: ?>
                    <!-- EXCHANGE TASKS VIEW (For Platform Tasks exchange, like Views / Follows / Likes) -->
                    <div id="panel-exchange-tasks" class="bg-slate-900/60 border border-slate-700/40 rounded-2xl p-6 backdrop-blur-md shadow-xl text-right">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 mb-6 gap-4">
                            <div class="flex items-center gap-3">
                                <span class="text-4xl"><?php echo $icon; ?></span>
                                <div>
                                    <h1 class="text-2xl sm:text-3xl font-black text-white">المهام والحملات التبادلية النشطة</h1>
                                    <p class="text-base sm:text-lg font-medium text-slate-350">تفاعل لكسب نقاط التبادل المعتمدة فورياً ونمو رصيدك</p>
                                </div>
                            </div>
                            <span id="badge-total-tasks" class="text-sm sm:text-base font-black bg-indigo-500/10 text-indigo-300 px-4 py-1.5 rounded-full border border-indigo-500/20 whitespace-nowrap">
                                المهام المتوفرة: 43 مهمة
                            </span>
                        </div>

                        <!-- Single active task presentation block -->
                        <div class="space-y-4">
                            <div id="task-item-1" class="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-indigo-500/30 transition shadow-sm">
                                <div class="space-y-2 flex-1">
                                    <div class="flex items-center gap-3 flex-wrap">
                                        <span class="text-lg sm:text-xl font-black text-white">ترقية وتنمية حساب رقمي مميز لدعم المنشور</span>
                                        <span id="task-item-1-reward" class="text-xs sm:text-sm bg-amber-500/10 text-amber-300 font-extrabold px-3 py-1 rounded-full border border-amber-500/20 font-mono">+15 PTS</span>
                                    </div>
                                    <p class="text-base sm:text-lg font-medium text-slate-300">اضغط على زر البدء بالأسفل، تفاعل بالحساب الحقيقي بصدق للتأكيد والحصول على المكافأة الفورية.</p>
                                </div>
                                <div class="flex items-center gap-2.5">
                                    <button id="btn-start-task-1" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3.5 rounded-xl text-sm sm:text-base transition block shadow">
                                        ابدأ التفاعل والتبادل التلقائي ⚡
                                    </button>
                                </div>
                            </div>

                            <div id="task-item-2" class="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 hover:border-indigo-500/30 transition shadow-sm">
                                <div class="space-y-2 flex-1">
                                    <div class="flex items-center gap-3 flex-wrap">
                                        <span class="text-lg sm:text-xl font-black text-white">تبادل حقيقي سريع ومطابقة ثنائية رقمية</span>
                                        <span id="task-item-2-reward" class="text-xs sm:text-sm bg-amber-500/10 text-amber-300 font-extrabold px-3 py-1 rounded-full border border-amber-500/20 font-mono">+18 PTS</span>
                                    </div>
                                    <p class="text-base sm:text-lg font-medium text-slate-300">تابع الحساب المستهدف لترفع مستوى الأرشفة السريعة لمجموعتك ومشاركة القبول.</p>
                                </div>
                                <div class="flex items-center gap-2.5">
                                    <button id="btn-start-task-2" class="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-6 py-3.5 rounded-xl text-sm sm:text-base transition block shadow">
                                        ابدأ التفاعل والتبادل التلقائي ⚡
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Information Help Section -->
                        <div id="info-verification-help" class="mt-8 border border-indigo-500/20 bg-indigo-950/10 p-6 rounded-2xl flex items-center gap-4">
                            <span class="text-3xl hidden md:block">💡</span>
                            <div>
                                <h4 class="text-base sm:text-lg font-black text-indigo-300">كيف يجري التحقق التلقائي لتبادل الدعم؟</h4>
                                <p class="text-base sm:text-lg font-medium text-slate-300 leading-relaxed mt-2">
                                    يفحص الخادم خوارزمية البقاء والتحليلات الخاصة بالمستخدمين للتأكد من عدم الإلغاء أو التقاعس لحماية نقاط معلني المجموعات بنجاح.
                                </p>
                            </div>
                        </div>
                    </div>
                <?php endif; ?>

            </div>

        </main>
    </div>

    <!-- Production Footer -->
    <footer class="border-t border-slate-900/80 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div class="max-w-7xl mx-auto px-4 space-y-2">
            <div>منصة التبادل والترويج الحقيقي والموثوق &copy; <?php echo date('Y'); ?></div>
            <div class="text-[11px] text-slate-500">تم التطوير وتحسين الأرشفة والسيو بالكامل عبر نظام PHP SSR Hybrid المتقدم</div>
        </div>
    </footer>

    <!-- 
      4. Linking the compiled bundle assets dynamically in the footer.
         This triggers React hydration to boot, enabling immediate interactions with the database,
         dynamic inputs, real verification, and state transitions seamlessly.
    -->
    <?php if ($jsFile): ?>
        <script type="module" src="<?php echo $jsFile; ?>"></script>
    <?php else: ?>
        <script type="module" src="/src/main.tsx"></script>
    <?php endif; ?>

</body>
</html>
