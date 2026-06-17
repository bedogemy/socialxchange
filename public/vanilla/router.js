// public/vanilla/router.js
// Advanced Client-Side SPA Router & Reactive State Engine
// Created by Senior Frontend Architect for maximum performance, DOM caching, and fluid transitions.

import { renderLogin, checkAuthState } from './login.js';
import { renderDashboard } from './dashboard.js';
import { renderControlRoom } from './control-room.js';

// ==========================================
// 1. REACTIVE GLOBAL STATE MANAGEMENT
// ==========================================
class VanillaStateStore {
  constructor() {
    this.state = {
      points: 0,
      tasksCompletedToday: 0,
      user: null
    };
    this.listeners = new Map();
    this.initFromStorage();
  }

  // Load initial values from localStorage safely
  initFromStorage() {
    const localUserStr = localStorage.getItem('vanilla_user');
    if (localUserStr) {
      try {
        const user = JSON.parse(localUserStr);
        this.state.user = user;
        this.state.points = user.points || 0;
        this.state.tasksCompletedToday = parseInt(localStorage.getItem('tasksCompletedToday') || '0', 10);
      } catch (e) {
        console.warn('Could not initialize state from storage:', e);
      }
    }
  }

  // Retrieve current value
  get(key) {
    return this.state[key];
  }

  // Update a key and notify all active listeners
  set(key, value) {
    const stringifiedNew = JSON.stringify(value);
    const stringifiedOld = JSON.stringify(this.state[key]);

    if (stringifiedNew !== stringifiedOld) {
      this.state[key] = value;
      this.notify(key, value);
      
      // Keep localStorage in sync for consistency with legacy scripts
      if (key === 'points' && this.state.user) {
        this.state.user.points = value;
        localStorage.setItem('vanilla_user', JSON.stringify(this.state.user));
      }
      if (key === 'user') {
        if (value) {
          localStorage.setItem('vanilla_user', JSON.stringify(value));
        } else {
          localStorage.removeItem('vanilla_user');
        }
      }
      if (key === 'tasksCompletedToday') {
        localStorage.setItem('tasksCompletedToday', value.toString());
      }
    }
  }

  // Register state change listener (returns unsubscribe handler)
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push(callback);
    
    // Call immediately with current value to populate screen components
    if (this.state[key] !== undefined) {
      callback(this.state[key]);
    }

    return () => {
      const list = this.listeners.get(key) || [];
      this.listeners.set(key, list.filter(cb => cb !== callback));
    };
  }

  // Broadcast update to subscribers
  notify(key, value) {
    const list = this.listeners.get(key) || [];
    list.forEach(callback => {
      try {
        callback(value);
      } catch (err) {
        console.error(`State notify error for "${key}":`, err);
      }
    });
  }
}

// Instantiate and expose state globally
export const vanillaState = new VanillaStateStore();
window.vanillaState = vanillaState;

// ==========================================
// 2. HIGH-PERFORMANCE DOM-CACHING ROUTER
// ==========================================
class VanillaRouter {
  constructor() {
    this.routes = {
      '/login': renderLogin,
      '/dashboard': renderDashboard,
      '/control-room': renderControlRoom
    };
    
    this.appContainer = document.getElementById('app');
    
    // Core Caching system (Stores real rendered HTMLElement containers instead of flat strings)
    this.cache = new Map();
    this.currentContainer = null;

    // Listen to history popstate back/forward triggers
    window.addEventListener('popstate', () => this.handleRouting());
    
    // Listen for custom authentication dispatch flags
    window.addEventListener('vanilla_auth_state_changed', () => {
      // Clear view cache fully on sign-in status changes to prevent data leak views
      this.wipeCache();
      vanillaState.initFromStorage();
      this.handleRouting();
    });

    // Intercept relative link navigations and translate them programmatically
    this.setupIntercepts();

    // Handle initial routing upon script execution / page load (On Load Routing)
    this.handleRouting();
  }

  // Wipe view elements memory
  wipeCache() {
    this.cache.forEach(container => {
      if (container.parentNode) {
        container.parentNode.removeChild(container);
      }
    });
    this.cache.clear();
    this.currentContainer = null;
  }

  // Register public access routes dynamically
  registerRoute(path, renderCallback) {
    this.routes[path] = renderCallback;
  }

  // Catch both standard relative anchors/buttons and history flows
  setupIntercepts() {
    // 1. Absolute mouse clicks interceptor
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore absolute external protocols
      if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
        return;
      }

      // Route cleaner fallback matches
      if (href.startsWith('#/')) {
        e.preventDefault();
        this.navigate(href.substring(1));
      } else if (href.startsWith('/')) {
        e.preventDefault();
        this.navigate(href);
      }
    });

    // 2. Click link button actions with specific onclick listeners
    document.addEventListener('mouseover', (e) => {
      const hoverTarget = e.target.closest('[data-route], [onclick*="router.navigate"]');
      if (!hoverTarget) return;

      // Pre-add hover class for slick native button states if desired
      hoverTarget.style.cursor = 'pointer';
    });

    // 3. Keep nav-logout button synced
    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }

    // 4. Connect Reactive state indicators directly to header elements
    vanillaState.subscribe('points', (points) => {
      const pointsIndicator = document.getElementById('nav-points');
      if (pointsIndicator) {
        pointsIndicator.innerText = Number(points || 0).toLocaleString();
      }
    });

    vanillaState.subscribe('user', (user) => {
      const headerContainer = document.getElementById('nav-user-container');
      if (headerContainer) {
        if (user) {
          headerContainer.classList.remove('hidden');
          headerContainer.classList.add('flex');
        } else {
          headerContainer.classList.add('hidden');
          headerContainer.classList.remove('flex');
        }
      }
    });
  }

  // Parse path based on URL subpath paths safely (e.g. support /vanilla subfolders)
  getRoutePath() {
    const base = window.location.pathname.startsWith('/vanilla') ? '/vanilla' : '';
    let relativePath = window.location.pathname;

    if (base && relativePath.startsWith(base)) {
      relativePath = relativePath.substring(base.length);
    }

    // Default route mapping
    if (relativePath === '/' || relativePath === '/index.html' || relativePath === '') {
      relativePath = '/dashboard';
    }

    // Fallback hash check for deep-links matching backward compatibility
    if (window.location.hash.startsWith('#/')) {
      const parts = window.location.hash.substring(1).split('?');
      relativePath = parts[0];
    }

    // Match query variables
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of urlParams.entries()) {
      try {
        params[key] = JSON.parse(value);
      } catch (err) {
        params[key] = value;
      }
    }

    return {
      path: relativePath,
      params
    };
  }

  // Central Dispatcher routing logic
  async handleRouting() {
    const { path, params } = this.getRoutePath();
    const isUserAuthenticated = checkAuthState();
    const isProtectedRoute = (path === '/dashboard' || path === '/control-room');

    // ROUTE GUARDS (حماية حيوية للمسارات)
    if (isProtectedRoute && !isUserAuthenticated) {
      console.log(`[Router Guard] Route "${path}" is protected. Re-routing client to /login`);
      this.navigate('/login');
      return;
    }
    
    if (path === '/login' && isUserAuthenticated) {
      console.log('[Router Guard] Authorized user session detected. Auto-forwarding to /dashboard');
      this.navigate('/dashboard');
      return;
    }

    const renderComponent = this.routes[path];
    if (!renderComponent) {
      this.render404();
      return;
    }

    // Generate specific caching key containing serializations
    const cacheKey = path + (Object.keys(params).length ? `?${JSON.stringify(params)}` : '');

    // Get or create route views container securely
    let targetContainer = this.cache.get(cacheKey);
    const isNewNode = !targetContainer;

    if (isNewNode) {
      targetContainer = document.createElement('div');
      targetContainer.id = `view-${path.replace(/[^a-zA-Z0-9]/g, '-')}`;
      targetContainer.className = 'w-full hidden';
      this.appContainer.appendChild(targetContainer);
      this.cache.set(cacheKey, targetContainer);
    }

    // Transition Handler: Animate previous container fading out smoothly
    const previousContainer = this.currentContainer;

    if (previousContainer && previousContainer !== targetContainer) {
      previousContainer.classList.remove('fade-in');
      previousContainer.classList.add('fade-out');
      
      // Let animation fade out conclude fully before display toggling
      await new Promise(resolve => setTimeout(resolve, 180));
      previousContainer.style.display = 'none';
      previousContainer.classList.remove('fade-out');
    }

    // Populate layout if newly loaded or refresh data
    this.currentContainer = targetContainer;
    targetContainer.style.display = 'block';
    
    if (isNewNode) {
      // First-visit load: show immediate elegant loading skeleton
      targetContainer.innerHTML = this.getSkeletonUI(path);
      if (window.lucide) window.lucide.createIcons();

      try {
        // Render view component dynamically
        const freshRenderDiv = document.createElement('div');
        await renderComponent(freshRenderDiv, params);
        
        targetContainer.innerHTML = freshRenderDiv.innerHTML;
        if (window.lucide) window.lucide.createIcons();
      } catch (err) {
        targetContainer.innerHTML = `
          <div class="max-w-md mx-auto bg-slate-900 border border-rose-500/15 p-6 rounded-2xl text-center space-y-4 shadow-2xl">
            <i data-lucide="alert-octagon" class="w-12 h-12 text-rose-500 mx-auto animate-bounce"></i>
            <h3 class="text-md font-bold text-white">فشل تحميل واجهة الصفحة</h3>
            <p class="text-xs text-slate-400">${err.message || 'عذراً، حدث خطأ داخلي في العرض.'}</p>
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    } else {
      // SWR (Stale-While-Revalidate): render instantly from DOM cache, then update in background!
      setTimeout(async () => {
        try {
          const freshRenderDiv = document.createElement('div');
          await renderComponent(freshRenderDiv, params);
          
          // Re-validate view data if user is still actively staying on the same screen
          if (this.currentContainer === targetContainer) {
            targetContainer.innerHTML = freshRenderDiv.innerHTML;
            if (window.lucide) window.lucide.createIcons();
          }
        } catch (e) {
          console.warn('[View Cache] Background state poll deferred:', e);
        }
      }, 50);
    }

    // Trigger visual fade-in animation
    targetContainer.classList.add('fade-in');
  }

  // Push clean URL route programmatically without full screen re-render
  navigate(path, params = null) {
    const base = window.location.pathname.startsWith('/vanilla') ? '/vanilla' : '';
    let targetUrl = base + path;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        searchParams.set(key, JSON.stringify(params[key]));
      });
      targetUrl += '?' + searchParams.toString();
    }

    // Set fallback hash dynamically to support direct bookmarks and deep linkages
    window.location.hash = `#${path}`;

    // Push clean path states to History
    window.history.pushState({ path, params }, '', targetUrl);
    this.handleRouting();
  }

  // Clear token and logout
  logout() {
    localStorage.removeItem('vanilla_user');
    vanillaState.set('user', null);
    vanillaState.set('points', 0);
    this.wipeCache();
    this.navigate('/login');
  }

  // Return customized Skeleton Screens matching layout specs
  getSkeletonUI(path) {
    if (path === '/dashboard') {
      return `
        <div class="space-y-8 animate-pulse text-right" dir="rtl">
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

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-slate-900/40 p-8 rounded-3xl border border-slate-800/40 min-h-[220px] flex flex-col justify-between">
              <div class="space-y-2">
                <div class="h-3.5 w-28 bg-slate-800 rounded skeleton-glow"></div>
                <div class="h-4 w-20 bg-slate-800 rounded skeleton-glow"></div>
              </div>
              <div class="h-9 w-40 bg-slate-800 rounded skeleton-glow"></div>
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
            </div>
          </div>
        </div>
      `;
    }

    if (path === '/control-room') {
      return `
        <div class="max-w-4xl mx-auto space-y-8 animate-pulse text-right" dir="rtl">
          <div class="h-4.5 w-32 bg-slate-800 rounded skeleton-glow"></div>
          <div class="space-y-2">
            <div class="h-6 w-64 bg-slate-800 rounded skeleton-glow"></div>
            <div class="h-3.5 w-96 bg-slate-800 rounded skeleton-glow"></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="md:col-span-2 space-y-6">
              <div class="bg-slate-900/40 border border-slate-800/40 p-6 rounded-2xl space-y-4">
                <div class="h-16 bg-slate-800/60 rounded-xl skeleton-glow"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Default Spinner loader
    return `
      <div class="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
        <div class="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        <p class="text-xs text-slate-400 font-semibold">جاري مزامنة بيانات الصفحة من السيرفر الآمن...</p>
      </div>
    `;
  }

  // 404 handler
  render404() {
    this.appContainer.innerHTML = `
      <div class="text-center py-20 space-y-6 fade-in" dir="rtl">
        <i data-lucide="compass" class="w-16 h-16 text-indigo-400 mx-auto animate-spin"></i>
        <h2 class="text-3xl font-black text-white">404 - الصفحة غير موجودة</h2>
        <p class="text-xs text-slate-400">يبدو أنك سلكت مساراً غير مدعوم في منصتنا.</p>
        <button onclick="window.router.navigate('/dashboard')" class="bg-indigo-650 hover:bg-indigo-750 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl transition duration-150">
          العودة للوحة القيادة العامة
        </button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
  }
}

// Instantiate and expose router globally
window.router = new VanillaRouter();
export default window.router;
