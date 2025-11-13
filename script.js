document.addEventListener('DOMContentLoaded', function () {
  try {
    const menuItems = Array.from(document.querySelectorAll('.menu-item'));
    const pages = Array.from(document.querySelectorAll('.page'));
    const printBtn = document.getElementById('printBtn');
    const langBtn = document.getElementById('langBtn');

    function showPage(id){
      pages.forEach(p => p.classList.toggle('active', p.id === id));
      menuItems.forEach(btn => btn.classList.toggle('active', btn.dataset.target === id));
      const activePage = document.getElementById(id);
      if (activePage) activePage.focus();
    }

    menuItems.forEach(btn => {
      btn.addEventListener('click', () => showPage(btn.dataset.target));
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    // --- چاپ (همان رفتار قبلی، بدون لاگ) ---
    function prepareForPrint() {
      document.body.classList.add('printing');
      const allPages = Array.from(document.querySelectorAll('.page'));
      allPages.forEach(p => p.classList.add('active'));

      const fills = Array.from(document.querySelectorAll('.progress-fill'));
      fills.forEach(f => {
        const raw = getComputedStyle(f).getPropertyValue('--value') || '50%';
        const val = raw.trim().endsWith('%') ? raw.trim() : (raw.trim() + '%');
        try {
          f.style.setProperty('width', val, 'important');
          f.style.setProperty('display', 'block', 'important');
          f.style.setProperty('visibility', 'visible', 'important');
          f.style.setProperty('min-width', '6%', 'important');
          f.style.setProperty('position', 'absolute', 'important');
          f.style.setProperty('right', '0', 'important');
        } catch (e) {
          f.style.width = val;
          f.style.display = 'block';
          f.style.visibility = 'visible';
          f.style.minWidth = '6%';
          f.style.position = 'absolute';
          f.style.right = '0';
        }

        const valEl = f.parentElement.querySelector('.progress-value');
        if (valEl) {
          try {
            valEl.style.setProperty('color', '#fff', 'important');
            valEl.style.setProperty('z-index', '3', 'important');
            valEl.style.setProperty('position', 'absolute', 'important');
            valEl.style.setProperty('right', '8px', 'important');
          } catch (e) {
            valEl.style.color = '#fff';
            valEl.style.zIndex = '3';
            valEl.style.position = 'absolute';
            valEl.style.right = '8px';
          }
        }
      });

      try {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const c = document.querySelector('.content');
        if (c) c.offsetHeight;
      } catch (e) { /* silent */ }

      requestAnimationFrame(() => {
        setTimeout(() => {
          window.print();
        }, 400);
      });
    }

    function restoreAfterPrint() {
      document.body.classList.remove('printing');
      const activeBtn = document.querySelector('.menu-item.active');
      const target = activeBtn ? activeBtn.dataset.target : 'summary';
      showPage(target);

      const fills = Array.from(document.querySelectorAll('.progress-fill'));
      fills.forEach(f => {
        try {
          f.style.removeProperty('width');
          f.style.removeProperty('display');
          f.style.removeProperty('visibility');
          f.style.removeProperty('min-width');
          f.style.removeProperty('position');
          f.style.removeProperty('right');
        } catch (e) {
          f.style.width = '';
          f.style.display = '';
          f.style.visibility = '';
          f.style.minWidth = '';
          f.style.position = '';
          f.style.right = '';
        }

        const valEl = f.parentElement.querySelector('.progress-value');
        if (valEl) {
          try {
            valEl.style.removeProperty('color');
            valEl.style.removeProperty('z-index');
            valEl.style.removeProperty('position');
            valEl.style.removeProperty('right');
          } catch (e) {
            valEl.style.color = '';
            valEl.style.zIndex = '';
            valEl.style.position = '';
            valEl.style.right = '';
          }
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        prepareForPrint();
      });
    }

    if (window.matchMedia) {
      const mql = window.matchMedia('print');
      if (typeof mql.addListener === 'function') {
        mql.addListener(m => {
          if (m.matches) {
            if (!document.body.classList.contains('printing')) prepareForPrint();
          } else {
            restoreAfterPrint();
          }
        });
      }
    }
    window.addEventListener('beforeprint', () => {
      if (!document.body.classList.contains('printing')) prepareForPrint();
    });
    window.addEventListener('afterprint', () => {
      restoreAfterPrint();
    });

    // شورتکات Ctrl/Cmd+P
    window.addEventListener('keydown', function (e) {
      try {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
        const key = (e.key || '').toLowerCase();
        const code = e.code || '';

        if (ctrlOrCmd && (key === 'p' || code === 'KeyP')) {
          e.preventDefault();
          if (!document.body.classList.contains('printing')) {
            prepareForPrint();
          }
        }
      } catch (innerErr) {
        // silent
      }
    });

    if (langBtn) {
      langBtn.addEventListener('click', () => {
        langBtn.classList.add('clicked');
        setTimeout(() => langBtn.classList.remove('clicked'), 220);
      });
    }

    // صفحه پیش‌فرض
    showPage('summary');

    // --- مودال مدرک ---
    (function(){
      const modal = document.getElementById('certModal');
      const viewer = document.getElementById('certViewer');

      function openModal(src) {
        // تلاش برای بارگذاری در iframe؛ اگر مرورگر اجازه ندهد، در تب جدید باز می‌شود
        viewer.src = src;
        modal.setAttribute('aria-hidden', 'false');
        modal.focus();
      }

      function closeModal() {
        viewer.src = '';
        modal.setAttribute('aria-hidden', 'true');
      }

      // لینک‌هایی که data-modal="1" دارند مودال را باز می‌کنند
      document.querySelectorAll('.cert-link[data-modal="1"]').forEach(link => {
        link.addEventListener('click', function(e){
          e.preventDefault();
          const href = link.getAttribute('href');
          if (!href) return;
          // برخی منابع (Cross-origin) ممکن است iframe را بلوک کنند؛ برای UX ابتدا تلاش می‌کنیم iframe، و اگر نمایش نداشت کاربر می‌تواند روی دکمه open in new tab کلیک کند.
          openModal(href);
        });
      });

      // بستن با کلیک روی بک‌دراپ یا دکمه بستن
      modal.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close') || e.target === modal.querySelector('.cert-modal-backdrop')) {
          closeModal();
        }
      });

      // بستن با Escape
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
          closeModal();
        }
      });
    })();

  } catch (err) {
    // silent
  }
});
