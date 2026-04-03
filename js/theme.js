/* ============= theme.js — Dark/Light Mode ============= */
(function () {
  const STORAGE_KEY = 'lh_theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    // update all toggle icons on this page
    document.querySelectorAll('.theme-toggle-icon').forEach(el => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  function getTheme() {
    return localStorage.getItem(STORAGE_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  // Apply on load immediately to prevent flash
  applyTheme(getTheme());

  // Wire up all theme toggles after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getTheme());
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  });

  function setTheme(theme) {
    if (theme === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      localStorage.setItem(STORAGE_KEY, sys);
      applyTheme(sys);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
      applyTheme(theme);
    }
  }

  window.LHTheme = { toggle: toggleTheme, get: getTheme, apply: applyTheme, setTheme };
})();
