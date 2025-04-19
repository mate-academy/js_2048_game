import { DOM } from '../ui/dom.js';

function setTheme(theme) {
  DOM.htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);

  if (theme === 'dark') {
    DOM.iconSun.style.display = 'flex';
    DOM.iconMoon.style.display = 'none';
  } else {
    DOM.iconSun.style.display = 'none';
    DOM.iconMoon.style.display = 'flex';
  }
}

function toggleTheme() {
  const current = DOM.htmlElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';

  setTheme(newTheme);
}

DOM.themeToggleButton.addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';

  setTheme(savedTheme);
});

document.addEventListener('keydown', (e) => {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    if (e.key === 't' || e.key === 'T') {
      toggleTheme();
    }
  }
});
