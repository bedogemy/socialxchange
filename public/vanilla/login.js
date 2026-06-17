// public/vanilla/login.js
// Auth controller for Vanilla JS SPA - Handle UI & Communications with Netlify auth function

// =========================================================================
// CRITICAL ARCHITECTURE: UNDERSTANDING THE OVERWRITE PREVENTION MECHANISM
// =========================================================================
// * RULE 1: The frontend has NO authority over point state. Points are managed 
//   exclusively server-side (Single Source of Truth).
// * RULE 2: When logging in, the frontend submits ONLY the credentials ('email' & 'password').
//   It is strictly forbidden from appending a client-side default value like "points: 1000".
// * RULE 3: The backend accepts the login, reads the user's previously earned points
//   from the Firestore collection (Read-Only), and returns them. It does NOT overwrite them.
// * RULE 4: Point initializations (points: 1000) occur strictly inside the 'signup' action.
// =========================================================================

export function checkAuthState() {
  const loggedInUser = localStorage.getItem('vanilla_user');
  if (loggedInUser) {
    try {
      const parsed = JSON.parse(loggedInUser);
      if (parsed && parsed.email) {
        return true;
      }
    } catch (e) {
      localStorage.removeItem('vanilla_user');
    }
  }
  return false;
}

export function renderLogin(container) {
  let isSignupMode = false;

  function updateView() {
    container.innerHTML = `
      <div id="login-card" class="max-w-md mx-auto bg-slate-900/80 border border-indigo-500/10 rounded-2xl shadow-2xl p-8 fade-in backdrop-blur-md">
        
        <!-- Logo and Heading -->
        <div class="text-center mb-8">
          <div class="inline-flex bg-indigo-500/10 p-3.5 rounded-full mb-3 border border-indigo-500/25">
            <i data-lucide="${isSignupMode ? 'user-plus' : 'shield-check'}" class="w-8 h-8 text-indigo-400"></i>
          </div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">
            ${isSignupMode ? 'إنشاء حساب جديد' : 'تسجيل الدخول للنظام الآمن'}
          </h2>
          <p class="text-xs text-slate-400 mt-1.5 font-medium leading-relaxed">
            ${isSignupMode ? 'احصل على 1000 نقطة ترحيبية فوراً للبدء في ترويج حملاتك!' : 'التحقق التلقائي والوصول السريع لغرفة التحكم.'}
          </p>
        </div>

        <!-- Notification Message Block -->
        <div id="auth-alert" class="hidden text-xs rounded-xl p-3.5 mb-5 font-semibold"></div>

        <!-- Auth Form -->
        <form id="auth-form" class="space-y-4">
          ${isSignupMode ? `
            <div>
              <label class="block text-xs text-slate-400 font-bold mb-1.5">الاسم الكامل</label>
              <div class="relative">
                <input type="text" id="auth-name" placeholder="John Doe" required
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-semibold" />
              </div>
            </div>
          ` : ''}

          <div>
            <label class="block text-xs text-slate-400 font-bold mb-1.5">البريد الإلكتروني</label>
            <input type="email" id="auth-email" placeholder="example@email.com" required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-mono" />
          </div>

          <div>
            <label class="block text-xs text-slate-400 font-bold mb-1.5">كلمة المرور</label>
            <input type="password" id="auth-password" placeholder="••••••••" required
              class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all font-mono" />
          </div>

          <button type="submit" id="auth-submit-btn"
            class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-650 hover:to-purple-750 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg active:translate-y-0 flex items-center justify-center gap-2">
            <span>${isSignupMode ? 'إنشاء الحساب وكسب 1000 نقطة 🎁' : 'دخول مسجل'}</span>
            <i data-lucide="arrow-left" class="w-4 h-4"></i>
          </button>
        </form>

        <!-- Toggle Mode Links -->
        <div class="mt-6 pt-6 border-t border-slate-800/40 text-center">
          <p class="text-xs text-zinc-400">
            ${isSignupMode ? 'تمتلك حساباً بالفعل؟' : 'ليس لديك حساب حتى الآن؟'}
            <button id="toggle-auth-mode" class="text-indigo-400 hover:text-indigo-300 font-bold ml-1 transition duration-150 underline decoration-indigo-500/30">
              ${isSignupMode ? 'سجل دخول هنا' : 'إنشاء حساب جديد كلياً'}
            </button>
          </p>
        </div>

        <!-- Overwrite Security Explainer Badge -->
        <div class="mt-6 p-3 rounded-xl bg-indigo-550/5 border border-indigo-500/10 text-[10px] text-indigo-300 leading-relaxed">
          <div class="flex items-start gap-1.5">
            <i data-lucide="shield-check" class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5"></i>
            <div>
              <strong class="font-bold text-white block mb-0.5">حماية دهس الرصيد (Overwrite Safe)</strong>
              عند تسجيل الدخول، يستعلم السيرفر عن رصيدك الفعلي من قاعدة البيانات (قراءة فقط)، ويُحظر تماماً تعيينه أو إعادة ضبط النقاط، لحماية رصيدكم ونقاطكم المكتسبة من الزوال.
            </div>
          </div>
        </div>

      </div>
    `;

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }

    // Attach Event Listeners
    document.getElementById('toggle-auth-mode').addEventListener('click', (e) => {
      e.preventDefault();
      isSignupMode = !isSignupMode;
      updateView();
    });

    document.getElementById('auth-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = document.getElementById('auth-submit-btn');
      const alertBox = document.getElementById('auth-alert');
      
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const displayName = isSignupMode ? document.getElementById('auth-name').value : null;

      // Disable button & animate loading state
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        <span>جاري التحقق...</span>
      `;

      // Reset alert
      alertBox.className = 'hidden text-xs rounded-xl p-3.5 mb-5 font-semibold';
      alertBox.innerText = '';

      try {
        const payload = {
          action: isSignupMode ? 'signup' : 'login',
          email,
          password
        };

        if (isSignupMode) {
          payload.displayName = displayName;
        }

        /*
          CRITICAL STEP: We send NO default point values inside payload.
          POINTS ARE MANAGED SERVER-SIDE ONLY.
        */
        const response = await fetch('/.netlify/functions/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'حدث خطأ غير متوقع أثناء معالجة الطلب.');
        }

        // Save authenticated user profile locally to maintain state across pages
        localStorage.setItem('vanilla_user', JSON.stringify(data.user));

        // Display Success Alert
        alertBox.className = 'block text-xs rounded-xl p-3.5 mb-5 font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
        alertBox.innerHTML = `
          <div class="flex items-center gap-1.5">
            <i data-lucide="check-circle" class="w-4 h-4"></i>
            <span>${data.message || 'تمت العملية بنجاح!'}</span>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();

        // Redirect dynamically through our router after a brief success delay
        setTimeout(() => {
          // Trigger global header update
          window.dispatchEvent(new Event('vanilla_auth_state_changed'));
          window.router.navigate('/dashboard');
        }, 1200);

      } catch (error) {
        console.error('Auth Request failed:', error);
        
        // Display Error Alert
        alertBox.className = 'block text-xs rounded-xl p-3.5 mb-5 font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20';
        alertBox.innerHTML = `
          <div class="flex items-center gap-1.5">
            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            <span>${error.message}</span>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();

        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
      }
    });
  }

  // Initial render
  updateView();
}
