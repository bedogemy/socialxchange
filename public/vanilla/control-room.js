// public/vanilla/control-room.js
// Control Room module for Vanilla JS SPA - Deducts points with strict manual double-validation.

export function renderControlRoom(container, params = {}) {
  const localUserStr = localStorage.getItem('vanilla_user');
  if (!localUserStr) {
    window.router.navigate('/login');
    return;
  }

  const currentUser = JSON.parse(localUserStr);

  // Available Services definitions
  const SERVICES = [
    { id: 'youtube_sub', name: 'تحسين اشتراكات يوتيوب', cost: 150, icon: 'youtube', platform: 'YouTube' },
    { id: 'instagram_follow', name: 'متابعي انستغرام عرب', cost: 100, icon: 'instagram', platform: 'Instagram' },
    { id: 'tiktok_mega_boost', name: 'دعم تيك توك الفاخر', cost: 1200, icon: 'flame', platform: 'TikTok' },
    { id: 'website_traffic', name: 'ترافيك ومبيعات للموقع', cost: 80, icon: 'globe', platform: 'Web Traffic' }
  ];

  // Pick pre-selected service if routed with params (e.g. from direct dashboard buttons)
  let activeServiceId = params.serviceId || SERVICES[0].id;
  let selectedService = SERVICES.find(s => s.id === activeServiceId) || SERVICES[0];

  function updateView() {
    const userPoints = currentUser.points || 0;

    container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-8 fade-in">
        
        <!-- Breadcrumb Backlink -->
        <button onclick="window.router.navigate('/dashboard')" class="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
          <span>العودة للوحة تحكم الحساب</span>
        </button>

        <!-- Main Title Header -->
        <div>
          <h1 class="text-2xl font-black text-white">غرفة العمليات واستثمار الرصيد</h1>
          <p class="text-xs text-slate-400 mt-1">اختر الخدمة المطلوبة ونفّذ معاملتك بلمس اليد. النظام يخضع لمعايير حماية الحساب المزدوجة.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Left side: Choose Campaigns -->
          <div class="md:col-span-2 space-y-6">
            <div class="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl backdrop-blur-md space-y-4">
              <h3 class="text-sm font-bold text-slate-200">1. اختر الخدمة الترويجية المستهدفة</h3>
              
              <div id="services-selector" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                ${SERVICES.map(service => {
                  const isSelected = service.id === selectedService.id;
                  return `
                    <button data-id="${service.id}" data-cost="${service.cost}"
                      class="flex items-center justify-between p-4 rounded-xl border text-right transition-all duration-200 ${
                        isSelected 
                          ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-lg' 
                          : 'bg-slate-950/60 border-slate-800/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }">
                      <div class="flex items-center gap-3">
                        <div class="p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}">
                          <i data-lucide="${service.icon}" class="w-4 h-4"></i>
                        </div>
                        <div>
                          <span class="block text-xs font-black">${service.name}</span>
                          <span class="block text-[10px] text-zinc-500 mt-0.5">${service.platform}</span>
                        </div>
                      </div>
                      <span class="font-mono text-xs font-bold text-amber-500">${service.cost} ن</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <!-- URL Target Input -->
              <div class="pt-2">
                <label class="block text-xs text-slate-400 font-bold mb-1.5 flex justify-between">
                  <span>أدخل رابط أو بروفايل الحملة (Target URL)</span>
                  <span class="text-[10px] text-indigo-400 font-bold">* مطلوب</span>
                </label>
                <input type="url" id="target-url" placeholder="https://youtube.com/c/example_profile" required
                  class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-all font-mono" />
              </div>
            </div>

            <!-- Transaction Alert Box -->
            <div id="tx-alert" class="hidden text-xs rounded-xl p-4 font-semibold leading-relaxed"></div>
          </div>

          <!-- Right side: Execution & Checkout -->
          <div class="md:col-span-1 space-y-6">
            <div class="bg-gradient-to-b from-slate-900/80 to-slate-950/80 border border-indigo-500/10 p-6 rounded-2xl backdrop-blur-md space-y-6 flex flex-col justify-between">
              
              <div class="space-y-4">
                <h3 class="text-xs font-bold text-indigo-400 uppercase tracking-widest">تفاصيل الفاتورة الفورية</h3>
                
                <div class="space-y-3 pt-2 text-xs font-semibold">
                  <div class="flex justify-between border-b border-slate-800/60 pb-3">
                    <span class="text-slate-400">رصيدك الكلي الحالي:</span>
                    <span class="text-white font-mono font-bold">${userPoints.toLocaleString()} ن</span>
                  </div>
                  <div class="flex justify-between border-b border-slate-800/60 pb-3">
                    <span class="text-slate-400">تكلفة الخدمة:</span>
                    <span class="text-amber-500 font-mono font-bold leading-none select-none">${selectedService.cost} ن</span>
                  </div>
                  <div class="flex justify-between pt-1">
                    <span class="text-slate-400">الرصيد بعد الخصم:</span>
                    <span class="font-mono font-bold ${userPoints >= selectedService.cost ? 'text-emerald-400' : 'text-rose-400'}">
                      ${(userPoints - selectedService.cost).toLocaleString()} ن
                    </span>
                  </div>
                </div>
              </div>

              <!-- Button Triggering Security Features -->
              <div class="pt-6">
                <!-- CLIENT SIDE VALIDATION ALARM (Warn User Locally before launching requests) -->
                ${userPoints < selectedService.cost ? `
                  <div class="mb-4 text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl p-3 font-semibold flex items-start gap-1.5 leading-relaxed">
                    <i data-lucide="alert-circle" class="w-4 h-4 shrink-0"></i>
                    <span>توقّف! رصيدك المتوفر بالمتصفح (${userPoints} ن) غير كافٍ لشراء الخدمة المحددة (${selectedService.cost} ن).</span>
                  </div>
                  
                  <button id="tx-execute-btn" disabled 
                    class="w-full bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-1.5">
                    <i data-lucide="lock" class="w-4 h-4"></i>
                    <span>الرصيد الحالي غير كافٍ</span>
                  </button>
                ` : `
                  <button id="tx-execute-btn"
                    class="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs py-3.5 px-4 rounded-xl transition duration-150 shadow-lg active:translate-y-0 transform hover:-translate-y-0.5 active:shadow-sm flex items-center justify-center gap-1.5 ring-2 ring-amber-500/10">
                    <i data-lucide="activity" class="w-4 h-4 animate-pulse"></i>
                    <span>تنفيذ العملية واستهلاك النقاط</span>
                  </button>
                `}
              </div>

            </div>

            <!-- Security Double Validation Banner -->
            <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-[10px] text-zinc-400 leading-relaxed space-y-2">
              <span class="font-bold text-white flex items-center gap-1 text-[11px]">
                <i data-lucide="shield-alert" class="w-4 h-4 text-amber-500"></i>
                نظام حماية الاستهلاك التلقائي (Double-Audit)
              </span>
              <p>خصم نقاط الحملات الترويجية مقيد كلياً بحدث الضغط اليدوي. يمر الطلب بعمليتي تفتيش متزامنتين:</p>
              <ul class="list-disc leading-relaxed list-inside pl-1 space-y-1">
                <li><strong class="text-slate-200">الأولى:</strong> يفحص كود المتصفح الرصيد محليًا لصد المعاملات المستحيلة.</li>
                <li><strong class="text-slate-200">الثانية:</strong> يستدعي الخادم قاعدة البيانات للتحقق النهائي والخصم وتوثيق السجل.</li>
              </ul>
            </div>
          </div>

        </div>

      </div>
    `;

    // Initialize Lucide icons
    if (window.lucide) window.lucide.createIcons();

    // Attach Event Listeners to Service Selection Buttons
    document.querySelectorAll('#services-selector button').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const clickedId = button.getAttribute('data-id');
        activeServiceId = clickedId;
        selectedService = SERVICES.find(s => s.id === clickedId) || SERVICES[0];
        updateView();
      });
    });

    // Attach Transaction click handler (MANUAL click only, double protected)
    const execBtn = document.getElementById('tx-execute-btn');
    if (execBtn) {
      execBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Prevents any form bubble-up reload

        const targetUrlInput = document.getElementById('target-url');
        const alertBox = document.getElementById('tx-alert');
        
        if (!targetUrlInput.value || !targetUrlInput.validity.valid) {
          alertBox.className = 'block text-xs rounded-xl p-4 font-semibold leading-relaxed bg-amber-500/10 text-amber-400 border border-amber-500/20';
          alertBox.innerHTML = `
            <div class="flex items-center gap-1.5">
              <i data-lucide="alert-triangle" class="w-4 h-4 shrink-0"></i>
              <span>يرجى إدخال رابط الحملة المستهدفة بشكل صحيح وصيغة URL صالحة لتنفيذ المعاملة.</span>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();
          targetUrlInput.focus();
          return;
        }

        // Clean & disable button visually during loading
        execBtn.disabled = true;
        const originalBtnHTML = execBtn.innerHTML;
        execBtn.innerHTML = `
          <div class="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
          <span>جاري الخصم وصناعة السجل بالخادم...</span>
        `;

        // Hide alert block
        alertBox.className = 'hidden text-xs rounded-xl p-4 font-semibold leading-relaxed';
        alertBox.innerText = '';

        try {
          // Double Validation: Client side checkpoints before sending requests
          if (currentUser.points < selectedService.cost) {
            throw new Error(`تعذر تحضير المعاملة محلياً: قيمة نقاط حسابك بالمتصفح (${currentUser.points}) غير كافية لخصم تكلفة الخدمة (${selectedService.cost}).`);
          }

          // Trigger server transaction
          const response = await fetch('/.netlify/functions/transaction', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: currentUser.email,
              serviceId: selectedService.id,
              cost: selectedService.cost
            })
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'فشلت معالجة المعاملة على السيرفر.');
          }

          // SUCCESS: Server returned status 200 indicating accurate points balance update inside Firestore!
          // We now update localStorage and reflect the dynamic point labels locally
          const updatedLocalUser = {
            ...currentUser,
            points: data.newPoints // Use points strictly calculated and authorized by back-end
          };
          localStorage.setItem('vanilla_user', JSON.stringify(updatedLocalUser));
          
          // زيادة عداد المهام يدويًا في المتصفح لتحديث الحسبة أمام العضو فورًا
          let completed = parseInt(localStorage.getItem('tasksCompletedToday') || 0);
          completed++;
          localStorage.setItem('tasksCompletedToday', completed);

          // ثم استدعاء دالة تحديث خانة البونص لعرض الأرقام الجديدة
          if (window.updateBonusUI) {
            window.updateBonusUI(completed);
          }

          // تسجيل إنجاز المهمة في السيرفر لضمان الأمان ومزامنة قاعدة البيانات
          try {
            fetch('/.netlify/functions/daily-bonus', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                userId: `vanilla_${currentUser.email.toLowerCase().trim()}`,
                email: currentUser.email,
                action: 'complete_task'
              })
            }).catch(e => console.error('Silent task sync failure:', e));
          } catch (taskErr) {
            console.error('Failed to sync complete_task on the server:', taskErr);
          }

          // Re-update the active reference state in memory
          currentUser.points = data.newPoints;

          // Alert banner
          alertBox.className = 'block text-xs rounded-xl p-4 font-semibold leading-relaxed bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
          alertBox.innerHTML = `
            <div class="flex items-start gap-1.5">
              <i data-lucide="sparkles" class="w-4.5 h-4.5 text-emerald-400 shrink-0 mt-0.5 animate-bounce"></i>
              <div>
                <strong class="block text-white mb-0.5">معاملة موثقة وناجحة!</strong>
                <span>${data.message || 'تم حجز الخدمة بنجاح وخصم الرصيد.'} الرصيد المتبقي بمحفظتك هو: <strong class="text-white font-mono">${data.newPoints.toLocaleString()} نقطة</strong>.</span>
              </div>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();

          // Sync Global Navigation Header points visual indicators automatically
          const navPoints = document.getElementById('nav-points');
          if (navPoints) navPoints.innerText = data.newPoints.toLocaleString();

          // Reset URL inputs
          targetUrlInput.value = '';

          // Re-render UI frame with new validated balance
          setTimeout(() => {
            updateView();
          }, 3000);

        } catch (error) {
          console.error('Transaction Execution failed:', error);

          alertBox.className = 'block text-xs rounded-xl p-4 font-semibold leading-relaxed bg-rose-500/10 text-rose-400 border border-rose-500/20';
          alertBox.innerHTML = `
            <div class="flex items-start gap-1.5">
              <i data-lucide="alert-triangle" class="w-4.5 h-4.5 text-rose-400 shrink-0 mt-0.5"></i>
              <div>
                <strong class="block text-white mb-0.5">خطأ في المعاملة فُرض بالتحقق المزدوج:</strong>
                <span>${error.message}</span>
              </div>
            </div>
          `;
          if (window.lucide) window.lucide.createIcons();

          // Restore Button
          execBtn.disabled = false;
          execBtn.innerHTML = originalBtnHTML;
        }
      });
    }
  }

  // Initial Render Trigger
  updateView();
}
