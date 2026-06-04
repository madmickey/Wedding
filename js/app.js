// Liz & Michael wedding site
// Keeps the small site interactive without needing any build tools.

const menuButton = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');

function closeMenu() {
  if (!menuButton || !navMenu) return;
  navMenu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = '☰';
}

function openMenu() {
  if (!menuButton || !navMenu) return;
  navMenu.classList.add('open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.textContent = '×';
}

if (menuButton && navMenu) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-controls', 'site-navigation');

  menuButton.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const weddingDate = new Date('2026-10-03T14:30:00+10:00');
const countdown = document.getElementById('countdown');

function updateCountdown() {
  if (!countdown) return;

  const millisecondsUntilWedding = weddingDate - new Date();

  if (millisecondsUntilWedding <= 0) {
    countdown.textContent = 'Today is the day!';
    return;
  }

  const days = Math.floor(millisecondsUntilWedding / 86_400_000);
  const hours = Math.floor(millisecondsUntilWedding / 3_600_000) % 24;
  const minutes = Math.floor(millisecondsUntilWedding / 60_000) % 60;

  countdown.textContent = `${days} days · ${hours} hours · ${minutes} minutes to go`;
}

updateCountdown();
setInterval(updateCountdown, 60_000);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => {
  revealObserver.observe(element);
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      // The site still works if service worker registration fails.
    });
  });
}
