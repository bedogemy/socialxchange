// public/vanilla/router.js
// Clean client-side SPA router with Route Guards and header synchronization

import { renderLogin, checkAuthState } from './login.js';
import { renderDashboard } from './dashboard.js';
import { renderControlRoom } from './control-room.js';

class VanillaRouter {
  constructor() {
    this.routes = {
      '/login': renderLogin,
      '/dashboard': renderDashboard,
      '/control-room': renderControlRoom
    };
    
    this.appContainer = document.getElementById('app');
    
    // View Caching system (Map) and Prefetch tracker
    this.cache = new Map();
    this.prefetchedKeys = new Set();

    // Bind navigation handlers: Trigger routing as soon as DOM is parsed
    window.addEventListener('hashchange', () => this.handleRouting());
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.handleRouting();
        this.syncHeader();
      });
    } else {
      this.handleRouting();
      this.syncHeader();
    }

    // Listen for custom state change events from login/transaction actions
    window.addEventListener('vanilla_auth_state_changed', () => {
      // Clear cache on authentication change to ensure updated values load freshly
      this.cache.clear();
      this.prefetchedKeys.clear();
      this.syncHeader();
    });
    
    // Bind Log Out button
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // Enable intelligent Hover Prefetching
    this.setupHoverPrefetching();
  }

  // Generates safe unique keys for storage caching
  getCacheKey(path, params) {
    return params && Object.keys(params).length > 0
      ? `${path}?${JSON.stringify(params)}`
      : path;
  }

  // Delegate mouseover events to catch all link highlights and prefetch them instantly
  setupHoverPrefetching() {
    document.addEventListener('mouseover', (e) => {
      const element = e.target.closest('a, button, [onclick], [data-route]');
      if (!element) return;

      let path = '';
      let params = null;

      // Extract target paths from standard links
      if (element.tagName === 'A') {
        const href = element.getAttribute('href') || '';
        if (href.startsWith('#/')) {
          path = href.substring(1);
        }
      } 
      // Extract target paths from router click bindings
      else {
        const onclickAttr = element.getAttribute('onclick') || '';
        if (onclickAttr.includes('router.navigate')) {
          const match = onclickAttr.match(/router\.navigate\(\s*['"]([^'"]+)['"]\s*(?:,\s*(\{.*?\}))?\s*\)/);
          if (match) {
            path = match[1];
            if (match[2]) {
              try {
                // Safely format parameters back to JSON format
                const rawParamsStr = match[2].replace(/'/g, '"');
                params = JSON.parse(rawParamsStr);
              } catch (err) {
                console.warn('Prefetch key processing error:', err);
              }
            }
          }
        }
      }

      const cleanPath = path.split('?')[0];
      if (cleanPath && this.routes[cleanPath]) {
        this.prefetch(cleanPath, params);
      }
    });
  }

  // Backdoor cache loader running background tasks on mouseenter
  async prefetch(path, params) {
    const cacheKey = this.getCacheKey(path, params);
    if (this.cache.has(cacheKey) || this.prefetchedKeys.has(cacheKey)) {
      return; // Already preloaded
    }

    this.prefetchedKeys.add(cacheKey);
    console.log(`[Smart Prefetch] Hover detected! Preloading "${path}" ahead of click...`);

    try {
      const renderComponent = this.routes[path];
      if (renderComponent) {
        const tempContainer = document.createElement('div');
        await renderComponent(tempContainer, params);
        
        // Cache visual output structure
        this.cache.set(cacheKey, tempContainer.innerHTML);
        console.log(`[Smart Prefetch] Cached route "${cacheKey}" to 0ms local state.`);
      }
    } catch (e) {
      this.prefetchedKeys.delete(cacheKey);
      console.warn('Prefetch process aborted:', e);
    }
  }

  // Return elegant customized Skeleton Screens for premium page load states
  getSkeletonUI(path) {
    if (path === '/dashboard') {
      return `
        <div class="space-y-8 animate-pulse text-right" dir="rtl">
          <!-- Welcome Bar Skeleton -->
          <div class="sm:flex sm:items-center sm:justify-between bg-slate-900/40 p-6 rounded-2xl border border-slate-800/40">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-slate-800 skeleton-glow"></div>
              <div class="space-y-2">
                <div class="h-4 w-32 bg-slate-800 rounded skeleton-glow"></div>
                <div class="h-3 w-48 bg-slate-800 rounded skeleton-glow"></div>
              </div>
            </div>
            <div class="h-8 w-32 bg-slate-800 rounded-xl mt-4 sm:mt-0 skeleton-glow"></div>
          </div>

          <!-- Points and Analytics Info Grid Skeletons -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-900/40 p-8 rounded-3xl border border-slate-800/40 min-h-[220px] flex flex-col justify-between">
              <div class="space-y-2">
                <div class="h-3.5 w-28 bg-slate-800 rounded skeleton-glow"></div>
                <div class="h-4 w-20 bg-slate-800 rounded skeleton-glow"></div>
              </div>
              <div class="space-y-2">
                <div class="h-9 w-40 bg-slate-800 rounded skeleton-glow"></div>
              </div>
              <div class="h-3 w-32 bg-slate-800 rounded skeleton-glow"></div>
            </div>

            <div class="md:col-span-2 bg-slate-900/40 border border-slate-800/40 p-6 rounded-3xl flex flex-col justify-between">
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-slate-800 skeleton-glow"></div>
                  <div class="h-4.5 w-40 bg-slate-800 rounded skeleton-glow"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="h-10 bg-slate-800/45 rounded-xl skeleton-glow"></div>
                  <div class="h-10 bg-slate-800/45 rounded-xl skeleton-glow"></div>
                </div>
              </div>
              <div class="h-10 w-48 bg-slate-800 rounded-xl self-end mt-4 skeleton-glow"></div>
            </div>
          </div>

          <!-- Services grid Skeletons -->
          <div class="space-y-4">
            <div class="h-5 w-48 bg-slate-800 rounded skeleton-glow"></div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div class="h-48 bg-slate-900/40 border border-slate-800/40 rounded-2xl skeleton-glow"></div>
              <div class="h-48 bg-slate-900/40 border border-slate-800/40 rounded-2xl skeleton-glow"></div>
              <div class="h-48 bg-slate-900/40 border border-slate-800/40 rounded-2xl skeleton-glow"></div>
              <div class="h-48 bg-slate-900/40 border border-slate-800/40 rounded-2xl skeleton-glow"></div>
            </div>
          </div>
        </div>
      `;
    }

    if (path === '/control-room') {
      return `
        <div class="max-w-4xl mx-auto space-y-8 animate-pulse text-right shadow-sm" dir="rtl">
          <div class="h-4.5 w-32 bg-slate-800 rounded skeleton-glow"></div>
          <div class="space-y-2">
            <div class="h-6 w-64 bg-slate-800 rounded skeleton-glow"></div>
            <div class="h-3.5 w-96 bg-slate-800 rounded skeleton-glow"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2 space-y-6">
              <div class="bg-slate-900/40 border border-slate-800/40 p-6 rounded-2xl space-y-4">
                <div class="h-4 w-44 bg-slate-800 rounded skeleton-glow"></div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="h-16 bg-slate-800/60 rounded-xl skeleton-glow"></div>
                  <div class="h-16 bg-slate-800/60 rounded-xl skeleton-glow"></div>
                  <div class="h-16 bg-slate-800/60 rounded-xl skeleton-glow"></div>
                  <div class="h-16 bg-slate-800/60 rounded-xl skeleton-glow"></div>
                </div>
                <div class="h-12 w-full bg-slate-800/60 rounded-xl skeleton-glow"></div>
              </div>
            </div>
            <div class="md:col-span-1 bg-slate-900/40 border border-slate-800/40 p-6 rounded-2xl h-80 skeleton-glow"></div>
          </div>
        </div>
      `;
    }

    // Default Fallback circular loader
    return `
      <div class="flex flex-col items-center justify-center min-h-[40vh] space-y-4 animate-pulse">
        <div class="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-xs text-slate-400 font-semibold tracking-wider">جاري مزامنة بيانات الصفحة من السيرفر الآمن...</p>
      </div>
    `;
  }

  // Parse path from Hash to support deep-linking naturally without server 404s
  getRoutePath() {
    const hash = window.location.hash || '#/dashboard';
    const path = hash.substring(1); // Strips the '#' character
    
    // Separate queries if routed with extra parameters passed as serialized JSON or parameters
    const [cleanPath, queryStr] = path.split('?');
    let params = {};
    
    if (queryStr) {
      try {
        params = JSON.parse(decodeURIComponent(queryStr));
      } catch (e) {
        console.warn('Could not parse route params:', e);
      }
    }
    
    return {
      path: cleanPath || '/dashboard',
      params
    };
  }

  // Main execution route handler with transitions, SWR Caching, and Skeletons
  async handleRouting() {
    const { path, params } = this.getRoutePath();
    const isUserAuthenticated = checkAuthState();
    
    // Protected routes listing
    const isProtectedRoute = (path === '/dashboard' || path === '/control-room');

    // ==========================================
    // ROUTE GUARDS (حماية المسارات والدخول الموثق)
    // ==========================================
    if (isProtectedRoute && !isUserAuthenticated) {
      console.log('Route Guard: User unauthorized. Redirecting to /login');
      this.navigate('/login');
      return;
    }
    
    if (path === '/login' && isUserAuthenticated) {
      console.log('Route Guard: Already logged in. Redirecting to /dashboard');
      this.navigate('/dashboard');
      return;
    }

    // Identify target component function
    const renderComponent = this.routes[path];
    
    if (!renderComponent) {
      this.render404();
      return;
    }

    // Generate unique caching key
    const cacheKey = this.getCacheKey(path, params);

    // 1. Core Transition Mechanics: Apply gorgeous fade-out beforehand
    if (this.appContainer.children.length > 0) {
      this.appContainer.classList.remove('fade-in');
      this.appContainer.classList.add('fade-out');
      // Match the CSS animation duration perfectly
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    this.appContainer.classList.remove('fade-out');
    this.appContainer.classList.add('fade-in');

    // 2. Local State View Caching (Stale-While-Revalidate Engine)
    const cachedHTML = this.cache.get(cacheKey);

    if (cachedHTML) {
      console.log(`[View Cache] Rendering cached content instantly (0ms) for "${cacheKey}"...`);
      // Update DOM with cached data first
      this.appContainer.innerHTML = cachedHTML;
      if (window.lucide) window.lucide.createIcons();

      // Background Validation: Re-execute in the background to ensure data stays fully up-to-date
      setTimeout(async () => {
        try {
          const freshDiv = document.createElement('div');
          await renderComponent(freshDiv, params);
          
          this.cache.set(cacheKey, freshDiv.innerHTML);

          // If the user has NOT changed routes during background execution, update DOM seamlessly
          const activeRoute = this.getRoutePath();
          if (this.getCacheKey(activeRoute.path, activeRoute.params) === cacheKey) {
            // Check if there are active inputs (prevent input interruption)
            const focusedEl = document.activeElement;
            const activeInputStates = Array.from(this.appContainer.querySelectorAll('input, textarea, select')).map(input => ({
              id: input.id,
              value: input.value,
              isFocused: input === focusedEl
            }));

            this.appContainer.innerHTML = freshDiv.innerHTML;

            // Retouch input states to guarantee flawless user form editing
            activeInputStates.forEach(state => {
              if (state.id) {
                const refreshedEl = this.appContainer.querySelector(`#${state.id}`);
                if (refreshedEl) {
                  refreshedEl.value = state.value;
                  if (state.isFocused) refreshedEl.focus();
                }
              }
            });

            if (window.lucide) window.lucide.createIcons();
          }
        } catch (err) {
          console.warn('[View Cache] Background state updates deferred:', err);
        }
      }, 100);

    } else {
      // 3. New Screen Skeleton Rendering Framework
      console.log(`[Skeleton Loader] Loading first-visit state for "${path}"...`);
      this.appContainer.innerHTML = this.getSkeletonUI(path);
      if (window.lucide) window.lucide.createIcons();

      // Fetch, build, and render freshest elements dynamically from backend
      try {
        const freshRenderDiv = document.createElement('div');
        await renderComponent(freshRenderDiv, params);

        // Update main viewport frame
        this.appContainer.innerHTML = freshRenderDiv.innerHTML;
        
        // Cache visual output structure
        this.cache.set(cacheKey, freshRenderDiv.innerHTML);
        if (window.lucide) window.lucide.createIcons();

      } catch (err) {
        this.appContainer.innerHTML = `
          <div class="max-w-md mx-auto bg-slate-900 border border-rose-500/15 p-6 rounded-2xl text-center space-y-4">
            <i data-lucide="alert-octagon" class="w-12 h-12 text-rose-500 mx-auto animate-bounce"></i>
            <h3 class="text-md font-bold text-white">فشل تحميل واجهة الصفحة</h3>
            <p class="text-xs text-slate-400">${err.message || 'عذراً، حدث خطأ داخلي في العرض.'}</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }

    // Keep active header elements synchronized
    this.syncHeader();
  }

  // Pure navigational router push with optional parameters
  navigate(path, params = null) {
    let targetHash = `#${path}`;
    if (params) {
      targetHash += `?${encodeURIComponent(JSON.stringify(params))}`;
    }
    window.location.hash = targetHash;
  }

  // Sync Header Bar point visual indicator and show/hide controls
  syncHeader() {
    const localUserStr = localStorage.getItem('vanilla_user');
    const headerContainer = document.getElementById('nav-user-container');
    const pointsIndicator = document.getElementById('nav-points');

    if (localUserStr) {
      try {
        const user = JSON.parse(localUserStr);
        if (headerContainer && pointsIndicator) {
          pointsIndicator.innerText = (user.points || 0).toLocaleString();
          headerContainer.classList.remove('hidden');
          headerContainer.classList.add('flex');
        }
      } catch (e) {
        localStorage.removeItem('vanilla_user');
      }
    } else {
      if (headerContainer) {
        headerContainer.classList.add('hidden');
        headerContainer.classList.remove('flex');
      }
    }
  }

  // Clear session and wipe tokens on Log Out
  logout() {
    localStorage.removeItem('vanilla_user');
    this.syncHeader();
    this.navigate('/login');
  }

  // Standard 404 view markup
  render404() {
    this.appContainer.innerHTML = `
      <div class="text-center py-20 space-y-6">
        <i data-lucide="compass" class="w-16 h-16 text-indigo-400 mx-auto animate-spin"></i>
        <h2 class="text-3xl font-black text-white">404 - الصفحة غير موجودة</h2>
        <p class="text-xs text-slate-400">يبدو أنك سلكت مساراً خاطئاً في التوجيه.</p>
        <button onclick="window.router.navigate('/dashboard')" class="bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition duration-150">
          العودة للوحة القيادة العامة
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
}

// Instantiate and expose router globally so SPA modules can call methods freely
window.router = new VanillaRouter();
export default window.router;
