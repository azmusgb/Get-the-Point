(() => {
  'use strict';

  const BRAND = 'DECISIONS, DECISIONS';
  const LEGACY_BRAND = 'GET THE POINT';
  const LEGACY_BRAND_TITLE = 'Get the Point';

  const PRIMARY = [
    ['How it works', '/how'],
    ['Playtest', '/playtest'],
    ['FAQ', '/faq'],
    ['About', '/about']
  ];

  // Keep development/commercial workstream pages live by direct URL, but do not
  // surface them in the public navigation until they are relevant to visitors.
  const MORE = [
    ['Private demo', '/play'],
    ['Contact', '/contact']
  ];

  const MOBILE_PRIMARY = [['Home', '/'], ...PRIMARY];

  function normalizePath(pathname = location.pathname) {
    const normalized = (pathname.replace(/\.html$/, '') || '/').replace(/\/$/, '');
    return normalized || '/';
  }

  function replaceLegacyBrand(value) {
    return String(value ?? '')
      .replaceAll(LEGACY_BRAND, BRAND)
      .replaceAll(LEGACY_BRAND_TITLE, 'Decisions, Decisions');
  }

  function applyBrandIdentity(root = document) {
    if (document.title.includes(LEGACY_BRAND) || document.title.includes(LEGACY_BRAND_TITLE)) {
      document.title = replaceLegacyBrand(document.title);
    }

    document.querySelectorAll('meta[name="description"],meta[name="apple-mobile-web-app-title"],meta[property="og:title"],meta[property="og:description"]').forEach(meta => {
      const current = meta.getAttribute('content') || '';
      const next = replaceLegacyBrand(current);
      if (next !== current) meta.setAttribute('content', next);
    });

    const scope = root instanceof Element || root instanceof Document ? root : document;
    scope.querySelectorAll?.('.site-header .brand,.site-drawer .brand').forEach(brand => {
      if (brand.textContent !== BRAND) brand.textContent = BRAND;
      if (brand instanceof HTMLAnchorElement) brand.setAttribute('aria-label', `${BRAND} home`);
    });

    // The private PWA home screen is rendered dynamically by play.js. Keep the
    // brand slot replaceable without coupling game state to a commercial title.
    document.querySelectorAll('.home-brand h1.brand').forEach(mark => {
      const expected = '<span class="line">DECISIONS,</span><span class="line">DECISIONS</span>';
      if (mark.innerHTML !== expected) mark.innerHTML = expected;
      mark.setAttribute('aria-label', BRAND);
    });

    // Fallback for current public/development pages that still contain the old
    // working title in static text. Historical /legacy pages do not load this shell.
    const walker = document.createTreeWalker(
      scope instanceof Document ? scope.body : scope,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || ['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
          return node.nodeValue?.includes(LEGACY_BRAND) || node.nodeValue?.includes(LEGACY_BRAND_TITLE)
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const next = replaceLegacyBrand(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
  }

  function ensureStyles() {
    if (document.querySelector('link[href*="navigation.css"]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/navigation.css?v=13';
    document.head.appendChild(link);
  }

  function setupSkipLink() {
    const main = document.querySelector('main');
    if (!(main instanceof HTMLElement)) return;
    if (!main.id) main.id = 'main-content';
    if (document.querySelector('.skip-link')) return;
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = `#${main.id}`;
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  function moreMarkup() {
    return `<details class="site-more"><summary>More</summary><div class="site-more-menu">${MORE.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}</div></details>`;
  }

  function navMarkup() {
    return `<div class="site-nav-primary">${PRIMARY.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}${moreMarkup()}</div><a class="button button--primary site-nav-cta" href="/playtest#signup">Join a playtest</a>`;
  }

  function drawerMarkup() {
    const privatePaths = new Set(['/play', '/diagnostics', '/analysis', '/feedback']);
    const currentPath = normalizePath();
    const privateArea = privatePaths.has(currentPath);
    const demoTools = privateArea
      ? '<span class="site-drawer-label">PLAYTEST TOOLS</span><a href="/play">Play demo</a><a href="/diagnostics">Device diagnostics</a><a href="/analysis">Analyze telemetry</a><a href="/feedback">Session feedback</a><a class="site-drawer-private" href="/demo-access?logout=1">Lock demo on this device</a>'
      : '';

    return `<div class="site-drawer-backdrop" data-site-drawer-backdrop hidden></div><aside id="siteDrawer" class="site-drawer" data-site-drawer role="dialog" aria-modal="true" aria-hidden="true" aria-label="Site menu" inert><div class="site-drawer-head"><a class="brand" href="/" aria-label="${BRAND} home">${BRAND}</a><button class="site-drawer-close" type="button" aria-label="Close menu">×</button></div><nav aria-label="Site menu"><span class="site-drawer-label">PLAY + LEARN</span>${MOBILE_PRIMARY.map(([label, href]) => `<a href="${href}">${label}</a>`).join('')}<span class="site-drawer-label">MORE</span>${MORE.map(([label, href]) => `<a href="${href}"${href === '/play' ? ' class="site-drawer-private"' : ''}>${label}</a>`).join('')}<a class="site-drawer-feature" href="/playtest#signup">Join a playtest</a>${demoTools}</nav><div class="site-drawer-foot"><span>ONE PROMPT. THREE WAYS TO PLAY.</span></div></aside>`;
  }

  function setupHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const nav = header.querySelector('.nav');
    if (!nav) return;

    let links = nav.querySelector('.nav-links');
    if (!links) {
      links = document.createElement('nav');
      links.className = 'nav-links';
      links.setAttribute('aria-label', 'Main navigation');
      nav.appendChild(links);
    }

    const brand = nav.querySelector('.brand');
    if (brand) {
      brand.textContent = BRAND;
      brand.setAttribute('aria-label', `${BRAND} home`);
    }

    links.innerHTML = navMarkup();

    if (!nav.querySelector('.site-menu-toggle')) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'site-menu-toggle';
      toggle.setAttribute('aria-label', 'Open site menu');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'siteDrawer');
      toggle.innerHTML = '<span></span><span></span><span></span>';
      nav.appendChild(toggle);
    }
  }

  function setupGameMenu() {
    if (!document.getElementById('app') || document.querySelector('.site-header')) return;
    if (document.querySelector('.game-site-menu')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'game-site-menu';
    button.setAttribute('aria-label', 'Open site menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'siteDrawer');
    button.innerHTML = '<span></span><span></span><span></span>';
    document.body.appendChild(button);
  }

  function focusableWithin(root) {
    return [...root.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])')]
      .filter(node => !node.hidden && node.getAttribute('aria-hidden') !== 'true');
  }

  function setupDrawer() {
    if (!document.querySelector('[data-site-drawer]')) document.body.insertAdjacentHTML('beforeend', drawerMarkup());
    const drawer = document.querySelector('[data-site-drawer]');
    const backdrop = document.querySelector('[data-site-drawer-backdrop]');
    const toggles = [...document.querySelectorAll('.site-menu-toggle,.game-site-menu')];
    const close = drawer?.querySelector('.site-drawer-close');
    const header = document.querySelector('.site-header');
    const main = document.querySelector('main');
    const footer = document.querySelector('.footer');
    let opener = null;

    const setBackgroundInert = inert => {
      [header, main, footer].filter(Boolean).forEach(node => {
        if (node === drawer || node.contains(drawer)) return;
        node.toggleAttribute('inert', inert);
      });
    };

    const setOpen = open => {
      if (!drawer || !backdrop) return;
      if (open) opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      drawer.classList.toggle('is-open', open);
      drawer.setAttribute('aria-hidden', String(!open));
      drawer.toggleAttribute('inert', !open);
      backdrop.hidden = !open;
      document.body.classList.toggle('site-menu-open', open);
      toggles.forEach(btn => btn.setAttribute('aria-expanded', String(open)));
      setBackgroundInert(open);
      if (open) close?.focus();
      else opener?.focus?.();
    };

    toggles.forEach(btn => btn.addEventListener('click', () => setOpen(true)));
    close?.addEventListener('click', () => setOpen(false));
    backdrop?.addEventListener('click', () => setOpen(false));
    drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));

    document.addEventListener('keydown', event => {
      if (!drawer?.classList.contains('is-open')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = focusableWithin(drawer);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  function setupMoreMenu() {
    const more = document.querySelector('.site-more');
    if (!more) return;
    document.addEventListener('click', event => {
      if (more.open && !more.contains(event.target)) more.removeAttribute('open');
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && more.open) {
        more.removeAttribute('open');
        more.querySelector('summary')?.focus();
      }
    });
    more.querySelectorAll('a').forEach(a => a.addEventListener('click', () => more.removeAttribute('open')));
  }

  function markCurrent() {
    const path = normalizePath();
    document.querySelectorAll('.site-nav-primary a,.site-drawer a').forEach(a => {
      const target = normalizePath(new URL(a.href, location.origin).pathname);
      if (target === path) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    if (MORE.some(([, href]) => normalizePath(href) === path)) document.querySelector('.site-more summary')?.classList.add('is-current');
  }

  function watchDynamicBrand() {
    const app = document.getElementById('app');
    if (!app) return;
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      queueMicrotask(() => {
        scheduled = false;
        applyBrandIdentity(app);
      });
    });
    observer.observe(app, { childList: true, subtree: true, characterData: true });
  }

  window.addEventListener('DOMContentLoaded', () => {
    ensureStyles();
    applyBrandIdentity();
    setupSkipLink();
    setupHeader();
    setupGameMenu();
    setupDrawer();
    setupMoreMenu();
    markCurrent();
    applyBrandIdentity();
    watchDynamicBrand();
  });
})();
