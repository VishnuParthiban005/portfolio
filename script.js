// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const menu = document.querySelector('#navmenu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
}

// Theme toggle (respects prefers-color-scheme)
const themeBtn = document.getElementById('themeToggle');
const root = document.documentElement;

const THEME_KEY = 'theme'; // 'light' | 'dark' | null
const setTheme = (mode) => {
  if (!mode) {
    root.removeAttribute('data-theme');
    localStorage.removeItem(THEME_KEY);
  } else {
    root.setAttribute('data-theme', mode);
    localStorage.setItem(THEME_KEY, mode);
  }
};
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) setTheme(savedTheme);

themeBtn?.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// Optional: force tokens when data-theme is set
const observer = new MutationObserver(() => {
  const mode = root.getAttribute('data-theme');
  if (mode === 'dark') {
    // dark mode variables (mirror of prefers-color-scheme dark)
    root.style.setProperty('--bg', '#0b0c10');
    root.style.setProperty('--bg-alt', '#111217');
    root.style.setProperty('--text', '#e6e6e6');
    root.style.setProperty('--muted', '#a8a8a8');
    root.style.setProperty('--card', '#151823');
    root.style.setProperty('--border', '#25273a');
  } else if (mode === 'light') {
    root.style.setProperty('--bg', '#ffffff');
    root.style.setProperty('--bg-alt', '#f7f7fb');
    root.style.setProperty('--text', '#111217');
    root.style.setProperty('--muted', '#5b5f71');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--border', '#e6e8f0');
  } else {
    // reset to CSS defaults (prefers-color-scheme)
    root.style.cssText = '';
  }
});
observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

// Year + fun counters
document.getElementById('year').textContent = new Date().getFullYear();

const counters = document.querySelectorAll('.kpi .num');
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

const runCounter = (el) => {
  const end = Number(el.dataset.count || 0);
  let start = 0; const dur = 900; const t0 = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = Math.floor(easeOut(p) * end);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const observer2 = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      runCounter(e.target.querySelector('.num'));
      observer2.unobserve(e.target);
    }
  }
}, { threshold: .6 });

document.querySelectorAll('.kpi').forEach(k => observer2.observe(k));
