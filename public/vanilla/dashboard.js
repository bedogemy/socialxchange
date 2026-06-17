// public/vanilla/dashboard.js
// Dashboard controller for Vanilla JS SPA - Reads points and lists services securely

export async function renderDashboard(container) {
  // Grab current user from localStorage
  const localUserStr = localStorage.getItem('vanilla_user');
  if (!localUserStr) {
    // Safety redirect to login if no state is present
    window.router.navigate('/login');
    return;
  }

  const currentUser = JSON.parse(localUserStr);

  // Initialize UI skeleton with loading state
  container.innerHTML = `
    <div class="space-y-8 fade-in">
      
      <!-- Welcome Header -->
      <div class="sm:flex sm:items-center sm:justify-between bg-slate-900/60 p-6 rounded-2xl border border-slate-800/60 backdrop-blur-md">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            ${currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <h1 class="text-xl font-black text-white">مرحباً، <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">${currentUser.displayName || 'أيها العضو الكريم'}</span>!</h1>
            <p class="text-xs text-slate-400 mt-1 font-mono">${currentUser.email}</p>
          </div>
        </div>
        <div class="mt-4 sm:mt-0 text-xs text-indigo-400 font-bold bg-indigo-500/10 px-3.5 py-1.5 rounded-xl border border-indigo-500/10 flex items-center gap-1.5 justify-center sm:justify-start">
          <i data-lucide="verified" class="w-4 h-4 text-indigo-400"></i>
          <span>حساب SPA نشط وموثق</span>
        </div>
      </div>

      <!-- Live Safe Fetch Points Balance Card -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-1 bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900/80 p-8 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden backdrop-blur-md flex flex-col justify-between min-h-[220px]">
          <!-- Decorative Background Glow -->
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          
          <div class="flex justify-between items-start">
            <div>
              <span class="text-zinc-400 text-xs font-bold uppercase tracking-wider block">الرصيد المتزامن والآمن</span>
              <span class="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 font-bold mt-1.5 inline-block">تحديث تلقائي آمن</span>
            </div>
            <div id="sync-loader" class="w-6 h-6 border-2 border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin"></div>
          </div>

          <div class="my-4">
            <div class="flex items-baseline gap-2">
              <span id="balance-value" class="text-4xl sm:text-5xl font-black text-white font-mono tracking-tight">
                ${currentUser.points ? currentUser.points.toLocaleString() : '---'}
              </span>
              <span class="text-xs text-indigo-300 font-extrabold uppercase">نقطة</span>
            </div>
            <p class="text-[10px] text-slate-400 mt-1">يتم التزامن مباشرة مع خادم قاعدة البيانات لقراءة الرصيد دون دهس.</p>
          </div>

          <div class="pt-4 border-t border-indigo-500/15 flex items-center justify-between text-xs">
            <span class="text-zinc-500 text-[10px] font-mono">حالة القراءة: <strong class="text-emerald-500">مباشرة & آمنة</strong></span>
            <button id="force-manual-sync" class="text-indigo-400 hover:text-indigo-300 font-black inline-flex items-center gap-1">
              <i data-lucide="refresh-cw" class="w-3.5 h-3.5"></i>
              <span>تحديث يدوي</span>
            </button>
          </div>
        </div>

        <!-- Safety Notice Card -->
        <div class="md:col-span-2 bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl flex flex-col justify-between backdrop-blur-md">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <i data-lucide="shield-check" class="w-5 h-5"></i>
              </div>
              <h3 class="text-md font-bold text-white">معايير حماية نقاط المستخدم</h3>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-300 leading-relaxed">
              <div class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                <p>قراءة الرصيد فقط (Read-Only) عند تحميل الصفحة دون أي طلبات تعديل عشوائية.</p>
              </div>
              <div class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                <p>منع إرسال أي نقاط افتراضية من المتصفح لحماية السيرفر من التلاعب بالقيم.</p>
              </div>
              <div class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                <p>يتم خصم النقاط حصرياً من الواجهة الخلفية بعد مروره بالتحقق المزدوج.</p>
              </div>
              <div class="flex items-start gap-2">
                <i data-lucide="check" class="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"></i>
                <p>تزامن فوري بين الأجهزة المفتوحة لضمان ظهور الرصيد الصحيح في كل مكان.</p>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row gap-3 justify-end">
            <button onclick="window.router.navigate('/control-room')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl transition duration-150 inline-flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10">
              <span>الدخول لغرفة عمليات استهلاك النقاط ⚙️</span>
              <i data-lucide="settings" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Services List Section (New Campaign Section) -->
      <div id="new-campaign-section" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-black text-white">الخدمات الترويجية المتاحة للتجربة</h2>
            <p class="text-xs text-slate-400 mt-1">تداول واستثمر نقاطك لتنمية حضور حساباتك بنقرة زر آمنة ومدروسة.</p>
          </div>
          <span class="text-[10px] bg-slate-900 border border-slate-800 text-zinc-400 px-3 py-1.5 rounded-lg font-mono font-bold">العدد: 4 خدمات</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Service 1 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group text-right">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg font-bold">يوتيوب</span>
                <span class="font-mono text-xs font-black text-amber-500">150 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">تحسين اشتراكات يوتيوب</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">اشتراكات آمنة متبادلة من حسابات حقيقية لتجاوز شروط تحقيق الربح.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'youtube_sub', cost: 150 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200 cursor-pointer">
              حجز الخدمة الآن
            </button>
          </div>

          <!-- Service 2 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group text-right">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg font-bold">إنستقرام</span>
                <span class="font-mono text-xs font-black text-amber-500">100 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">متابعي انستغرام عرب</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">متابعات فورية للملف الشخصي لزيادة مصداقية نشاطك التجاري والاجتماعي.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'instagram_follow', cost: 100 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200 cursor-pointer">
              حجز الخدمة الآن
            </button>
          </div>

          <!-- Service 3 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group text-right">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg font-bold">تيك توك</span>
                <span class="font-mono text-xs font-black text-amber-500">1200 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">دعم تيك توك الفاخر</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">باقة لايكات وحضور مكثف لتهيئة فيديوهاتك لتصدر صفحة الاكسبلور.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'tiktok_mega_boost', cost: 1200 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200 cursor-pointer">
              حجز الخدمة الآن
            </button>
          </div>

          <!-- Service 4 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group text-right">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg font-bold">إنترنت</span>
                <span class="font-mono text-xs font-black text-amber-500">80 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">ترافيك ومبيعات للموقع</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">زيارات موجهة مباشرة لصفحتك لرفع رتبة موقعك في محركات بحث قوقل.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'website_traffic', cost: 80 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200 cursor-pointer">
              حجز الخدمة الآن
            </button>
          </div>

        </div>
      </div>

      <!-- 🎁 Daily Bonus Card (Placed Statically Below Promotional Services List) -->
      <div id="manual-daily-bonus-card" class="bg-indigo-950/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-4 my-6 text-right font-[Cairo]" style="background: #1a1a2e; border: 1px solid #303056; border-radius: 20px; padding: 24px; margin-top: 24px; color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
          <div class="flex justify-between items-center" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
              <h3 class="text-md sm:text-lg font-black text-amber-400 flex items-center gap-2" style="margin: 0; font-size: 18px; color: #ffd700;">🎁 المكافأة اليومية (1000 نقطة)</h3>
              <span id="bonus-timer" class="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-lg font-bold" style="font-size: 12px; color: #ff4a4a; background: rgba(255,74,74,0.1); padding: 4px 8px; border-radius: 20px; display: none;">التجديد بعد: 24 ساعة</span>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-right" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; text-align: center;">
              <div class="bg-slate-950/60 border border-slate-850/80 p-4 rounded-2xl flex items-center justify-between" style="background: #222240; padding: 10px; border-radius: 8px;">
                  <span class="text-xs text-slate-400 font-bold" style="font-size: 12px; color: #aaa; display: block;">المهمات المنفذة</span>
                  <b id="bonus-completed-count" class="text-sm font-black text-emerald-400 font-mono" style="font-size: 20px; color: #28a745;">0</b>
              </div>
              <div class="bg-slate-950/60 border border-slate-850/80 p-4 rounded-2xl flex items-center justify-between" style="background: #222240; padding: 10px; border-radius: 8px;">
                  <span class="text-xs text-slate-400 font-bold" style="font-size: 12px; color: #aaa; display: block;">المهمات المتبقية</span>
                  <b id="bonus-remaining-count" class="text-sm font-black text-amber-500 font-mono" style="font-size: 20px; color: #ffc107;">50</b>
              </div>
          </div>

          <div class="relative w-full bg-slate-950 border border-slate-800 rounded-2xl h-6 overflow-hidden shadow-inner mt-2" style="background: #2d2d44; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 15px;">
              <div id="bonus-progress-bar" class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500 ease-out" style="background: linear-gradient(90deg, #28a745, #ffd700); height: 100%; width: 0%; transition: width 0.4s ease;"></div>
          </div>

          <div class="pt-2">
              <button id="claim-bonus-btn" disabled class="w-full bg-slate-850 border border-slate-800 text-slate-500 font-extrabold text-xs py-3.5 rounded-xl cursor-not-allowed" style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: #44445c; color: #8888a0; font-weight: bold; font-size: 15px; cursor: not-allowed; transition: all 0.3s ease;">
                  انتظر جلب البيانات...
              </button>
              <div id="bonus-alert" class="hidden text-xs p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl mt-3 text-center font-bold"></div>
          </div>
      </div>

      <!-- Daily Bonus & Task Center -->
      <div class="bg-slate-900/40 border border-slate-800/80 p-6 rounded-3xl backdrop-blur-md space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <i data-lucide="gift" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-md font-bold text-white">مركز المهام والمكافآت اليومية</h3>
              <p class="text-xs text-slate-400 mt-1">أكمل 50 مهمة اليوم للحصول على 1000 نقطة إضافية مجانية كل 24 ساعة!</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20 font-bold">تحديث يومي تلقائي</span>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6">

          <!-- 2. Fast Interactive Simulated Tasks -->
          <div class="bg-slate-950/40 border border-slate-800/40 p-5 rounded-2xl space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs text-slate-200 font-bold block"><i data-lucide="zap" class="w-4 h-4 text-amber-500 inline mr-1"></i>لوحة مهام سريعة لتأمين الـ 50 مهمة:</span>
              <span id="completed-counter-badge" class="text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-lg border border-indigo-500/10">0 / 50</span>
            </div>

            <!-- Task Items -->
            <div class="space-y-3">
              <!-- Task 1 -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-right">
                <div class="flex items-center gap-2.5">
                  <div class="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                    <i data-lucide="youtube" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <span class="text-[11px] text-white font-bold block">مشاهدة فيديو يوتيوب ترويجي للراعي</span>
                    <span class="text-[9px] text-zinc-500 font-semibold block mt-px">الجائزة: تسجيل +1 مهمة يومية</span>
                  </div>
                </div>
                <button data-task="task1" class="task-action-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition cursor-pointer">
                  بدء المهمة
                </button>
              </div>

              <!-- Task 2 -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-right">
                <div class="flex items-center gap-2.5">
                  <div class="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                    <i data-lucide="instagram" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <span class="text-[11px] text-white font-bold block">متابعة حساب انستقرام ترويجي للراعي</span>
                    <span class="text-[9px] text-zinc-500 font-semibold block mt-px">الجائزة: تسجيل +1 مهمة يومية</span>
                  </div>
                </div>
                <button data-task="task2" class="task-action-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition cursor-pointer">
                  بدء المهمة
                </button>
              </div>

              <!-- Task 3 -->
              <div class="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 text-xs text-right">
                <div class="flex items-center gap-2.5">
                  <div class="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                    <i data-lucide="globe" class="w-4 h-4"></i>
                  </div>
                  <div>
                    <span class="text-[11px] text-white font-bold block">زيارة موقع شريك ترويجي للمنصة</span>
                    <span class="text-[9px] text-zinc-500 font-semibold block mt-px">الجائزة: تسجيل +1 مهمة يومية</span>
                  </div>
                </div>
                <button data-task="task3" class="task-action-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition cursor-pointer">
                  بدء المهمة
                </button>
              </div>
            </div>

            <!-- Developer helper cheat tool -->
            <div class="pt-2 border-t border-slate-800/40 flex justify-between items-center text-right">
              <span class="text-[9px] text-zinc-500 font-semibold leading-relaxed">لأغراض المراجعة السريعة وتفادي التكرار 50 مرة:</span>
              <button id="dev-cheat-btn" class="bg-slate-950 hover:bg-indigo-900/40 text-amber-500 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 font-extrabold text-[9px] px-2.5 py-1 rounded-lg transition cursor-pointer">
                 مساعد الفحص: إضافة +10 مهام دفعة واحدة ⚡
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  // Icons activation
  if (window.lucide) window.lucide.createIcons();

  // Reference hooks
  const syncBtn = document.getElementById('force-manual-sync');
  const syncLoader = document.getElementById('sync-loader');
  const balanceVal = document.getElementById('balance-value');

  // Attach Safe Fetch Refresh Button Listener
  if (syncBtn) {
    syncBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      await safeFetchPoints();
    });
  }

  // Exposed globally for developer convenience or external script evaluations as requested
  window.checkAndRunDailyBonus = function(tasksCompletedToday, lastBonusClaimedTimestamp) {
    const completedText = document.getElementById('bonus-completed-count');
    const remainingText = document.getElementById('bonus-remaining-count');
    const progressBar = document.getElementById('bonus-progress-bar');
    const claimBtn = document.getElementById('claim-btn-bonus') || document.getElementById('claim-bonus-btn');
    const timerSpan = document.getElementById('bonus-timer');

    if (!completedText) return; // الحماية في حال لم تكن الصفحة محملة بعد

    const targetTasks = 50;
    const remainingTasks = Math.max(targetTasks - tasksCompletedToday, 0);
    
    // 1. تحديث الأرقام وشريط التقدم
    completedText.innerText = tasksCompletedToday;
    remainingText.innerText = remainingTasks;
    localStorage.setItem('tasksCompletedToday', tasksCompletedToday);
    
    if (progressBar) {
      progressBar.style.width = `${Math.min((tasksCompletedToday / targetTasks) * 100, 100)}%`;
    }

    // 2. حساب فجوة الـ 24 ساعة
    const now = Date.now();
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const timePassed = now - lastBonusClaimedTimestamp;
    const isTimeReady = !lastBonusClaimedTimestamp || timePassed >= oneDayInMs;

    if (!isTimeReady) {
        if (claimBtn) {
          claimBtn.disabled = true;
          claimBtn.style.background = '#333344';
          claimBtn.style.color = '#777788';
          claimBtn.style.cursor = 'not-allowed';
          claimBtn.innerText = 'تم استلام مكافأة اليوم بالفعل';
        }
        if (timerSpan) {
          timerSpan.style.display = 'inline-block';
          const timeLeft = oneDayInMs - timePassed;
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
          timerSpan.innerText = `التجديد بعد: ${hours}س و ${minutes}د`;
        }
        return;
    }

    if (timerSpan) timerSpan.style.display = 'none';

    // 3. التحقق من شرط الـ 50 مهمة تفعيل الزر يدوياً
    if (tasksCompletedToday < targetTasks) {
        if (claimBtn) {
          claimBtn.disabled = true;
          claimBtn.style.background = '#44445c';
          claimBtn.style.color = '#8888a0';
          claimBtn.style.cursor = 'not-allowed';
          claimBtn.innerText = `متبقي ${remainingTasks} مهمة للاستلام`;
        }
    } else {
        if (claimBtn) {
          claimBtn.disabled = false;
          claimBtn.style.background = 'linear-gradient(135deg, #28a745, #1e7e34)';
          claimBtn.style.color = '#ffffff';
          claimBtn.style.cursor = 'pointer';
          claimBtn.innerText = '🎁 اضغط هنا لاستلام 1000 نقطة!';
          
          // عند الضغط اليدوي
          claimBtn.onclick = async () => {
              claimBtn.disabled = true;
              claimBtn.innerText = 'جاري الشحن...';
              
              try {
                  const response = await fetch('/.netlify/functions/daily-bonus', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          userId: `vanilla_${currentUser.email.toLowerCase().trim()}`,
                          email: currentUser.email,
                          action: 'claim_bonus'
                      })
                  });
                  
                  const result = await response.json();
                  
                  if (response.ok) {
                      alert('🎉 مبروك! تم إضافة 1000 نقطة إلى حسابك بنجاح.');
                      
                      // تحديث البيانات محلياً بناءً على استجابة السيرفر لمنع التصفير
                      localStorage.setItem('userPoints', result.newPoints);
                      localStorage.setItem('lastBonusClaimed', Date.now());
                      
                      // تحديث رصيد النقاط المعروض في الصفحة فوراً
                      if (balanceVal) balanceVal.innerText = result.newPoints.toLocaleString();
                      
                      const navPoints = document.getElementById('nav-points');
                      if (navPoints) navPoints.innerText = result.newPoints.toLocaleString();

                      // تحديث مخزن المستخدم الكلي
                      const localUser = JSON.parse(localStorage.getItem('vanilla_user') || '{}');
                      localUser.points = result.newPoints;
                      localStorage.setItem('vanilla_user', JSON.stringify(localUser));

                      // تحديث الشاشة فوراً
                      window.checkAndRunDailyBonus(tasksCompletedToday, Date.now());
                  } else {
                      alert(`خطأ: ${result.message || result.error || 'فشلت المطالبة.'}`);
                      window.checkAndRunDailyBonus(tasksCompletedToday, lastBonusClaimedTimestamp);
                  }
              } catch (err) {
                  console.error(err);
                  alert('حدث خطأ أثناء الاتصال بالسيرفر، يرجى المحاولة لاحقاً.');
                  window.checkAndRunDailyBonus(tasksCompletedToday, lastBonusClaimedTimestamp);
              }
          };
        }
    }
  };

  // Keep aliases for compatibility
  window.updateDailyBonusUI = function(tasksCompletedToday, lastBonusClaimedTimestamp) {
    window.checkAndRunDailyBonus(tasksCompletedToday, lastBonusClaimedTimestamp);
  };

  window.updateBonusUI = function(tasksCompleted) {
    const lastClaimed = parseInt(localStorage.getItem('lastBonusClaimed') || '0');
    window.checkAndRunDailyBonus(tasksCompleted, lastClaimed);
  };

  // Attach Daily Bonus logic and UI updates
  async function fetchBonusStatus() {
    try {
      const response = await fetch('/.netlify/functions/daily-bonus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_status',
          email: currentUser.email
        })
      });

      if (!response.ok) throw new Error('فشلت عملية جلب حالة الجائزة اليومية.');

      const data = await response.json();
      if (data && data.success) {
        const completed = data.tasksCompletedToday || 0;
        const lastClaimed = data.lastBonusClaimed || 0;
        localStorage.setItem('lastBonusClaimed', lastClaimed);
        localStorage.setItem('tasksCompletedToday', completed);
        
        // Call checkAndRunDailyBonus on the fetched user state
        window.checkAndRunDailyBonus(completed, lastClaimed);
      }
    } catch (err) {
      console.error('Error in fetchBonusStatus:', err);
    }
  }

  // Bind simulated tasks click listeners
  const taskButtons = container.querySelectorAll('.task-action-btn');
  taskButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.className = "task-action-btn bg-slate-800 text-zinc-500 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-not-allowed";
      btn.innerHTML = `<div class="w-3 h-3 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div> <span>جاري التحقق...</span>`;
      
      try {
        const response = await fetch('/.netlify/functions/daily-bonus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: currentUser.email,
            action: 'complete_task'
          })
        });

        if (!response.ok) throw new Error('فشلت معالجة تسجيل المهمة من الخادم.');
        
        const data = await response.json();
        if (data && data.success) {
          btn.className = "task-action-btn bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-default";
          btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> <span>مكتملة ✅</span>`;
          if (window.lucide) window.lucide.createIcons();

          await fetchBonusStatus();
        }
      } catch (err) {
        console.error('Task action fail:', err);
        btn.disabled = false;
        btn.className = "task-action-btn bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-lg transition cursor-pointer";
        btn.innerHTML = originalHTML;
      }
    });
  });

  // Bind developer helper cheat trigger to add 10 tasks instantly
  const devCheatBtn = document.getElementById('dev-cheat-btn');
  if (devCheatBtn) {
    devCheatBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const originalText = devCheatBtn.innerText;
      devCheatBtn.disabled = true;
      devCheatBtn.className = "bg-slate-950 border border-slate-800 text-zinc-600 cursor-not-allowed font-extrabold text-[9px] px-2.5 py-1 rounded-lg";
      devCheatBtn.innerText = "جاري إرسال 10 طلبات متتالية لتسريع التصفير... ⚡";

      try {
        // Fire 10 parallel secure tasks completion server-side
        const requestsList = [];
        for (let i = 0; i < 10; i++) {
          requestsList.push(
            fetch('/.netlify/functions/daily-bonus', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                email: currentUser.email,
                action: 'complete_task'
              })
            })
          );
        }
        await Promise.all(requestsList);

        devCheatBtn.className = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[9px] px-2.5 py-1 rounded-lg";
        devCheatBtn.innerText = "تمت إضافة +10 مهام دفعة واحدة! 🌸";

        await fetchBonusStatus();

        setTimeout(() => {
          if (devCheatBtn) {
            devCheatBtn.disabled = false;
            devCheatBtn.className = "bg-slate-950 hover:bg-indigo-900/40 text-amber-500 hover:text-amber-400 border border-slate-800 hover:border-amber-500/30 font-extrabold text-[9px] px-2.5 py-1 rounded-lg transition cursor-pointer";
            devCheatBtn.innerText = "مساعد الفحص: إضافة +10 مهام دفعة واحدة ⚡";
          }
        }, 3000);

      } catch (err) {
        console.error('Cheat tool trigger fail:', err);
        devCheatBtn.disabled = false;
        devCheatBtn.innerText = originalText;
      }
    });
  }

  // Bind claim bonus action
  const claimBonusBtn = document.getElementById('claim-bonus-btn');
  if (claimBonusBtn) {
    claimBonusBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      const originalHTML = claimBonusBtn.innerHTML;
      claimBonusBtn.disabled = true;
      claimBonusBtn.innerHTML = `<div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> <span>جاري تحويل الـ 1000 نقطة بالجدار الناري...</span>`;
      
      const bonusAlert = document.getElementById('bonus-alert');
      if (bonusAlert) {
        bonusAlert.className = 'hidden text-[10px] p-2 rounded-lg mt-2 text-center font-bold';
        bonusAlert.innerText = '';
      }

      try {
        const response = await fetch('/.netlify/functions/daily-bonus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: `vanilla_${currentUser.email.toLowerCase().trim()}`,
            email: currentUser.email,
            action: 'claim_bonus'
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'عذراً تعذرت مطالبة المكافأة من الخادم.');
        }

        // UPDATE CLIENT-SIDE LOCAL STORAGE & FRONTEND
        const updatedLocalUser = {
          ...currentUser,
          points: data.newPoints
        };
        localStorage.setItem('vanilla_user', JSON.stringify(updatedLocalUser));
        currentUser.points = data.newPoints;

        // Sync visual point balances
        if (balanceVal) balanceVal.innerText = data.newPoints.toLocaleString();
        
        const navPoints = document.getElementById('nav-points');
        if (navPoints) navPoints.innerText = data.newPoints.toLocaleString();

        if (bonusAlert) {
          bonusAlert.className = "block text-[11px] p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl mt-3 text-center font-bold animate-bounce";
          bonusAlert.innerHTML = `🌟 تم شحن محفظتك بـ 1000 نقطة مجانية بنجاح!`;
        }

        await fetchBonusStatus();

      } catch (err) {
        console.error('Claim bonus execution failed:', err);
        if (bonusAlert) {
          bonusAlert.className = "block text-[10px] p-2.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl mt-2 text-center font-bold";
          bonusAlert.innerText = err.message;
        }
        claimBonusBtn.disabled = false;
        claimBonusBtn.innerHTML = originalHTML;
      }
    });
  }

  // Safe Fetch Helper Function (ONLY loads/reads points, no modifications)
  async function safeFetchPoints() {
    syncLoader.classList.remove('hidden');
    try {
      /*
        -----------------------------------------------------------------
        SAFE FETCH PROTOCOL:
        -----------------------------------------------------------------
        * Requests the 'get_profile' action which queries user's record (Read-Only) from Firestore database.
        * Ensures zero PUT or POST requests modify the database state.
      */
      const response = await fetch('/.netlify/functions/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'get_profile',
          email: currentUser.email
        })
      });

      if (!response.ok) {
        throw new Error('فشل تحديث النقاط من الخادم.');
      }

      const data = await response.json();
      
      if (data && data.user) {
        // Update Local Storage securely
        const updatedLocalUser = {
          ...currentUser,
          points: data.user.points
        };
        localStorage.setItem('vanilla_user', JSON.stringify(updatedLocalUser));

        // Update active UI values
        balanceVal.innerText = data.user.points.toLocaleString();
        
        // Trigger global state sync visually inside main layout header
        const navPoints = document.getElementById('nav-points');
        if (navPoints) {
          navPoints.innerText = data.user.points.toLocaleString();
        }
      }
    } catch (e) {
      console.error('Safe fetch error in dashboard:', e);
    } finally {
      syncLoader.classList.add('hidden');
      // Trigger matching status loading for the Daily Bonus framework
      await fetchBonusStatus();
    }
  }

  // Trigger Safe Fetch on page render (Non-blocking background sync)
  await safeFetchPoints();

  // Clear any existing guardian interval to prevent leaks
  if (window.dailyBonusIntervalID) {
    clearInterval(window.dailyBonusIntervalID);
  }

  // كود الحارس لإجبار خانة الـ Daily Bonus على الظهور في تطبيقات الـ SPA
  window.dailyBonusIntervalID = setInterval(() => {
    // 1. التحقق من أن الخانة لم يتم زرعها بالفعل لمنع التكرار
    if (document.getElementById('manual-daily-bonus-card')) return;

    // 2. البحث عن قسم "إطلاق حملة جديدة" من خلال النص المكتب داخل عناصر الشاشة
    const elements = document.querySelectorAll('h1, h2, h3, h4, div, button');
    let campaignTarget = null;

    for (let el of elements) {
        if (el.textContent.trim().includes('إطلاق حملة جديدة') || el.textContent.trim().includes('حملة جديدة') || el.textContent.trim().includes('الخدمات الترويجية المتاحة للتجربة')) {
            // نأخذ الحاوية (الأب) لهذا العنصر لكي نضع المكافأة أسفلها
            campaignTarget = el.closest('.card') || el.closest('#new-campaign-section') || el.closest('div') || el.parentElement;
            break;
        }
    }

    // 3. إذا وجدنا القسم، نقوم بحقن هيكل المكافأة اليومية فوراً أسفله
    if (campaignTarget) {
        const bonusHTML = `
            <div id="manual-daily-bonus-card" style="background: #1a1a2e; border: 1px solid #303056; border-radius: 12px; padding: 20px; margin-top: 20px; color: #ffffff; font-family: 'Cairo', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.2); direction: rtl; text-align: right;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; flex-direction: row-reverse;">
                    <h3 style="margin: 0; font-size: 18px; color: #ffd700;">🎁 المكافأة اليومية (1000 نقطة)</h3>
                    <span id="bonus-timer" style="font-size: 12px; color: #ff4a4a; background: rgba(255,74,74,0.1); padding: 4px 8px; border-radius: 20px; display: none;">التجديد بعد: 24 ساعة</span>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px; text-align: center;">
                    <div style="background: #222240; padding: 10px; border-radius: 8px;">
                        <span style="font-size: 12px; color: #aaa; display: block;">المهمات المنفذة</span>
                        <b id="bonus-completed-count" style="font-size: 20px; color: #28a745;">0</b>
                    </div>
                    <div style="background: #222240; padding: 10px; border-radius: 8px;">
                        <span style="font-size: 12px; color: #aaa; display: block;">المهمات المتبقية</span>
                        <b id="bonus-remaining-count" style="font-size: 20px; color: #ffc107;">50</b>
                    </div>
                </div>

                <div style="background: #2d2d44; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 15px;">
                    <div id="bonus-progress-bar" style="background: linear-gradient(90deg, #28a745, #ffd700); height: 100%; width: 0%; transition: width 0.4s ease;"></div>
                </div>

                <button id="claim-bonus-btn" disabled style="width: 100%; padding: 12px; border: none; border-radius: 8px; background: #44445c; color: #8888a0; font-weight: bold; font-size: 15px; cursor: not-allowed; transition: all 0.3s ease;">
                    انتظر جلب البيانات...
                </button>
                <div id="bonus-alert" class="hidden text-xs p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl mt-3 text-center font-bold"></div>
            </div>
        `;
        
        // حقن الكود مباشرة بعد قسم الحملة
        campaignTarget.insertAdjacentHTML('afterend', bonusHTML);
        console.log("🚀 تم حقن خانة المكافأة اليومية بنجاح أسفل قسم الحملات!");
        
        // استدعاء دالة التحديث فوراً لتلوين الزر وحساب الأرقام بناءً على بيانات المستخدم الحالية
        if (typeof window.checkAndRunDailyBonus === 'function') {
            // جلب البيانات المحلية مؤقتاً لتحديث الواجهة فوراً
            const tasks = parseInt(localStorage.getItem('tasksCompletedToday') || 0);
            const lastClaim = parseInt(localStorage.getItem('lastBonusClaimed') || 0);
            window.checkAndRunDailyBonus(tasks, lastClaim);
        }
    }
  }, 1000); // يفحص الصفحة كل ثانية واحدة للتأكد من وجود الخانة
}
