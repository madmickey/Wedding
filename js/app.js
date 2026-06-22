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

  const now = new Date();

  if (now >= weddingDate) {
    countdown.textContent = "We're married!";
    return;
  }

  const millisecondsRemaining = weddingDate - now;
  const daysRemaining = Math.floor(millisecondsRemaining / 86_400_000);

  // Last 4 weeks
  if (daysRemaining <= 28) {

    if (daysRemaining === 0) {
      countdown.textContent = "Today's the day!";
      return;
    }

    const weeks = Math.floor(daysRemaining / 7);
    const days = daysRemaining % 7;

    if (weeks > 0) {
      countdown.textContent =
        `${weeks} week${weeks === 1 ? '' : 's'}, ${days} day${days === 1 ? '' : 's'} to go!`;
    } else {
      countdown.textContent =
        `${days} day${days === 1 ? '' : 's'} to go!`;
    }

    return;
  }

  // More than 4 weeks away
  const monthsRemaining =
    (weddingDate.getFullYear() - now.getFullYear()) * 12 +
    (weddingDate.getMonth() - now.getMonth());

  countdown.textContent =
    `${monthsRemaining} month${monthsRemaining === 1 ? '' : 's'} to go`;
}

updateCountdown();
setInterval(updateCountdown, 60 * 60 * 1000);


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
  navigator.serviceWorker.register('service-worker.js').then(reg => {
    reg.addEventListener('updatefound', () => {
      const newWorker = reg.installing;

      newWorker.addEventListener('statechange', () => {
        if (
          newWorker.state === 'installed' &&
          navigator.serviceWorker.controller
        ) {
          const updateNow = confirm(
            'A new version of the wedding app is available. Update now?'
          );

          if (updateNow) {
            newWorker.postMessage({ type: 'SKIP_WAITING' });
          }
        }
      });
    });
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    window.location.reload();
  });
}

// PWA install button
// Android/Chrome supports the native beforeinstallprompt event.
// iOS Safari does not, so we show a friendly animated guide instead.

let deferredInstallPrompt = null;

const installStrip = document.getElementById('install-strip');
const installButton = document.getElementById('install-button');
const installDismiss = document.getElementById('install-dismiss');
const iosInstallModal = document.getElementById('ios-install-modal');
const iosInstallClose = document.getElementById('ios-install-close');

const INSTALL_DISMISS_KEY = 'installDismissUntil';

function isIosDevice() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandaloneApp() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function showInstallStrip(label = 'Install app') {
  if (!installStrip || !installButton || isStandaloneApp()) return;

  const hiddenUntil = Number(
    localStorage.getItem(INSTALL_DISMISS_KEY) || 0
  );

  if (Date.now() < hiddenUntil) return;

  installButton.textContent = label;
  installStrip.hidden = false;
}

function hideInstallStrip() {
  if (!installStrip) return;
  installStrip.hidden = true;
}

function openIosInstallGuide() {
  if (!iosInstallModal) return;

  iosInstallModal.hidden = false;
  iosInstallModal.setAttribute('aria-hidden', 'false');
}

function closeIosInstallGuide() {
  if (!iosInstallModal) return;

  iosInstallModal.hidden = true;
  iosInstallModal.setAttribute('aria-hidden', 'true');
}

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();

  deferredInstallPrompt = event;

  showInstallStrip('Install app');
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  hideInstallStrip();
});

if (installButton) {
  installButton.addEventListener('click', async () => {

    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();

      await deferredInstallPrompt.userChoice;

      deferredInstallPrompt = null;

      hideInstallStrip();
      return;
    }

    if (isIosDevice()) {
      openIosInstallGuide();
    }
  });
}

if (installDismiss) {
  installDismiss.addEventListener('click', () => {

    const oneHourFromNow =
      Date.now() + (60 * 60 * 1000);

    localStorage.setItem(
      INSTALL_DISMISS_KEY,
      oneHourFromNow
    );

    hideInstallStrip();
  });
}

if (iosInstallClose) {
  iosInstallClose.addEventListener(
    'click',
    closeIosInstallGuide
  );
}

if (iosInstallModal) {
  iosInstallModal.addEventListener('click', (event) => {
    if (event.target === iosInstallModal) {
      closeIosInstallGuide();
    }
  });
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeIosInstallGuide();
  }
});

window.addEventListener('load', () => {

  if (isStandaloneApp()) {
    hideInstallStrip();
    return;
  }

  if (isIosDevice()) {
    showInstallStrip('How to install');
  }
});

const showInstallGuideButton =
  document.getElementById('show-install-guide');

if (showInstallGuideButton) {
  showInstallGuideButton.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('installDismissUntil');

    if (isStandaloneApp()) {
      return;
    }

    if (isIosDevice()) {
      openIosInstallGuide();
      return;
    }

    if (deferredInstallPrompt) {
      showInstallStrip('Install app');
      return;
    }

    openIosInstallGuide();
  });
}

function updateOnlineStatus() {
  document.body.classList.toggle('is-offline', !navigator.onLine);
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

window.addEventListener('load', updateOnlineStatus);