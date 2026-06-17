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

      <!-- Services List Section -->
      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg font-black text-white">الخدمات الترويجية المتاحة للتجربة</h2>
            <p class="text-xs text-slate-400 mt-1">تداول واستثمر نقاطك لتنمية حضور حساباتك بنقرة زر آمنة ومدروسة.</p>
          </div>
          <span class="text-[10px] bg-slate-900 border border-slate-800 text-zinc-400 px-3 py-1.5 rounded-lg font-mono font-bold font-mono">العدد: 4 خدمات</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Service 1 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg font-bold">يوتيوب</span>
                <span class="font-mono text-xs font-black text-amber-500">150 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">تحسين اشتراكات يوتيوب</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">اشتراكات آمنة متبادلة من حسابات حقيقية لتجاوز شروط تحقيق الربح.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'youtube_sub', cost: 150 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200">
              حجز الخدمة الآن
            </button>
          </div>

          <!-- Service 2 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg font-bold">إنستقرام</span>
                <span class="font-mono text-xs font-black text-amber-500">100 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">متابعي انستغرام عرب</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">متابعات فورية للملف الشخصي لزيادة مصداقية نشاطك التجاري والاجتماعي.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'instagram_follow', cost: 100 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200">
              حجز الخدمة الآن
            </button>
          </div>

          <!-- Service 3 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-lg font-bold">تيك توك</span>
                <span class="font-mono text-xs font-black text-amber-500">1200 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">دعم تيك توك الفاخر</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">باقة لايكات وحضور مكثف لتهيئة فيديوهاتك لتصدر صفحة الاكسبلور.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'tiktok_mega_boost', cost: 1200 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200">
              حجز الخدمة الآن
            </button>
          </div>

          <!-- Service 4 -->
          <div class="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between group">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-lg font-bold">إنترنت</span>
                <span class="font-mono text-xs font-black text-amber-500">80 ن</span>
              </div>
              <h4 class="text-xs font-black text-white group-hover:text-indigo-400 transition">ترافيك ومبيعات للموقع</h4>
              <p class="text-[11px] text-slate-400 leading-relaxed font-semibold">زيارات موجهة مباشرة لصفحتك لرفع رتبة موقعك في محركات بحث قوقل.</p>
            </div>
            <button onclick="window.router.navigate('/control-room', { serviceId: 'website_traffic', cost: 80 })" 
              class="w-full mt-4 bg-slate-950 hover:bg-indigo-600 border border-slate-800 hover:border-indigo-500/30 text-slate-300 hover:text-white font-extrabold text-[10px] py-2 rounded-xl transition-all duration-200">
              حجز الخدمة الآن
            </button>
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

  // Trigger Safe Fetch on page render (Non-blocking background sync)
  safeFetchPoints();

  // Attach Safe Fetch Refresh Button Listener
  syncBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await safeFetchPoints();
  });

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
    }
  }
}
