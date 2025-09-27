// assets/js/main.js
// JS for navigation, modal, simple form validation, localStorage draft, theme toggle
(function () {
  // Elements
  const mobileBtn = document.getElementById('mobileNavBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mainNav = document.getElementById('mainNav');
  const modal = document.getElementById('modal');
  const openRegister = document.getElementById('openRegister');
  const openLogin = document.getElementById('openLogin');
  const openRegister2 = document.getElementById('openRegister2');
  const mobileRegister = document.getElementById('mobileRegister');
  const mobileLogin = document.getElementById('mobileLogin');
  const closeModal = document.getElementById('closeModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const regForm = document.getElementById('regForm');
  const regFeedback = document.getElementById('regFeedback');
  const modalSwitch = document.getElementById('modalSwitch');
  const selectPlanButtons = document.querySelectorAll('.select-plan');
  const contactForm = document.getElementById('contactForm');
  const saveDraftBtn = document.getElementById('saveDraft');
  const contactFeedback = document.getElementById('contactFeedback');
  const themeToggle = document.getElementById('themeToggle');

  // toggle mobile menu
  if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
      const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', String(!expanded));
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Modal openers
  const openModalFor = (mode = 'register') => {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('form').reset();
    regFeedback.classList.add('hidden');
    if (mode === 'register') {
      modalTitle.textContent = 'Register';
      modalSubtitle.textContent = 'Create your account to get started.';
      modalSwitch.textContent = 'Switch to Login';
    } else {
      modalTitle.textContent = 'Login';
      modalSubtitle.textContent = 'Welcome back — please sign in.';
      modalSwitch.textContent = 'Switch to Register';
      // For login variant, hide some fields and adjust the form minimally
    }
    document.body.style.overflow = 'hidden';
    // autofocus first input
    setTimeout(() => {
      const first = modal.querySelector('input');
      if (first) first.focus();
    }, 80);
  };

  [openRegister, openLogin, openRegister2, mobileRegister, mobileLogin].forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (btn.id === 'openLogin' || btn.id === 'mobileLogin') openModalFor('login');
      else openModalFor('register');
      // hide mobile menu if open
      if (!mobileMenu.classList.contains('hidden')) mobileMenu.classList.add('hidden');
    });
  });

  // close modal
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }
  // click outside to close
  document.addEventListener('click', (e) => {
    if (!modal.classList.contains('hidden') && e.target === modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Modal "Switch to Login/Register" button
  if (modalSwitch) {
    modalSwitch.addEventListener('click', (e) => {
      e.preventDefault();
      const isRegister = modalTitle.textContent.toLowerCase().includes('register');
      openModalFor(isRegister ? 'login' : 'register');
    });
  }

  // Simple registration form validation + demo behavior (no server)
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      regFeedback.classList.add('hidden');

      const email = document.getElementById('regEmail').value.trim();
      const pass = document.getElementById('regPass').value;
      const pass2 = document.getElementById('regPass2').value;
      const accept = document.getElementById('acceptTnc').checked;

      if (!email || !pass || !pass2) {
        regFeedback.textContent = 'Please fill all required fields.';
        regFeedback.classList.remove('hidden');
        return;
      }
      if (pass.length < 6) {
        regFeedback.textContent = 'Password must be at least 6 characters.';
        regFeedback.classList.remove('hidden');
        return;
      }
      if (pass !== pass2) {
        regFeedback.textContent = 'Passwords do not match.';
        regFeedback.classList.remove('hidden');
        return;
      }
      if (!accept) {
        regFeedback.textContent = 'You must accept the Terms & Conditions.';
        regFeedback.classList.remove('hidden');
        return;
      }

      // Demo: save to localStorage as a "registered user" (NOT secure) and show success
      const users = JSON.parse(localStorage.getItem('tb_users') || '[]');
      users.push({ email, createdAt: new Date().toISOString() });
      localStorage.setItem('tb_users', JSON.stringify(users));

      regFeedback.textContent = 'Account created (demo). Check your email for confirmation.';
      regFeedback.classList.remove('hidden');
      regFeedback.classList.remove('text-red-600');
      regFeedback.classList.add('text-green-600');

      setTimeout(() => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }, 1200);
    });
  }

  // Plan selection -> open registration modal and pre-fill a hidden "plan" field label
  selectPlanButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      openModalFor('register');
      // show short confirmation toast (quick)
      toast(`Selected plan: ${btn.dataset.plan}`);
    });
  });

  // Simple toast
  function toast(msg, timeout = 2000) {
    const t = document.createElement('div');
    t.className = 'fixed bottom-6 right-6 bg-black/80 text-white text-sm px-4 py-2 rounded shadow-lg z-50';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('fade-out'), timeout - 300);
    setTimeout(() => t.remove(), timeout);
  }

  // Contact form: Save draft to localStorage, and pretend to "send" with validation
  if (contactForm) {
    // load draft if present
    const saved = JSON.parse(localStorage.getItem('tb_contact_draft') || 'null');
    if (saved) {
      const n = document.getElementById('contactName');
      const e = document.getElementById('contactEmail');
      const m = document.getElementById('contactMessage');
      if (n) n.value = saved.name || '';
      if (e) e.value = saved.email || '';
      if (m) m.value = saved.message || '';
      contactFeedback.textContent = 'Loaded saved draft.';
      contactFeedback.classList.remove('hidden');
      setTimeout(() => contactFeedback.classList.add('hidden'), 2000);
    }

    contactForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      contactFeedback.classList.remove('hidden');
      contactFeedback.classList.remove('text-red-600');
      contactFeedback.classList.add('text-gray-600');

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const msg = document.getElementById('contactMessage').value.trim();

      if (!name || !email) {
        contactFeedback.textContent = 'Please provide a name and an email.';
        contactFeedback.classList.add('text-red-600');
        return;
      }

      // simulate "send"
      contactFeedback.textContent = 'Message sent (demo). We will contact you soon.';
      contactFeedback.classList.remove('text-red-600');
      contactFeedback.classList.add('text-green-600');
      // clear draft
      localStorage.removeItem('tb_contact_draft');
      setTimeout(() => contactFeedback.classList.add('hidden'), 3000);
      contactForm.reset();
    });

    if (saveDraftBtn) {
      saveDraftBtn.addEventListener('click', () => {
        const name = document.getElementById('contactName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const msg = document.getElementById('contactMessage').value.trim();
        const payload = { name, email, message: msg, savedAt: new Date().toISOString() };
        localStorage.setItem('tb_contact_draft', JSON.stringify(payload));
        contactFeedback.textContent = 'Draft saved locally.';
        contactFeedback.classList.remove('hidden');
        contactFeedback.classList.remove('text-red-600');
        contactFeedback.classList.add('text-gray-600');
        setTimeout(() => contactFeedback.classList.add('hidden'), 1800);
      });
    }
  }

  // quick handler for other contact forms (about page)
  const aboutContact = document.getElementById('aboutContact');
  if (aboutContact) {
    aboutContact.addEventListener('submit', (e) => {
      e.preventDefault();
      toast('Message sent (demo).');
      aboutContact.reset();
    });

    const registerNow = document.getElementById('registerNow');
    if (registerNow) registerNow.addEventListener('click', (ev) => {
      ev.preventDefault();
      openModalFor('register');
    });
  }

  // Keyboard: Esc to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // Theme toggle (dark / light) using localStorage
  const root = document.documentElement;
  if (themeToggle) {
    const saved = localStorage.getItem('tb_theme');
    if (saved === 'dark') {
      root.classList.add('dark');
      themeToggle.textContent = '☀️';
      themeToggle.setAttribute('aria-pressed', 'true');
    }
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      themeToggle.textContent = isDark ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      localStorage.setItem('tb_theme', isDark ? 'dark' : 'light');
    });
  }

  // tiny accessibility: add focus outlines when keyboard nav detected
  (function trackKeyboard() {
    function handleFirstTab(e) {
      if (e.key === 'Tab') {
        document.body.classList.add('user-is-tabbing');
        window.removeEventListener('keydown', handleFirstTab);
      }
    }
    window.addEventListener('keydown', handleFirstTab);
  })();

})();
