// script.js — نسخه با بهبود برای چاپ: تنظیم display و width صریح، و پاک‌سازی بعد از چاپ
document.addEventListener('DOMContentLoaded', function () {
  try {
    console.log('[script.js] loaded');

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

    // آماده‌سازی چاپ: تنظیم نوارها و اطمینان از نمایش آنها
    function prepareForPrint() {
      console.log('[print] prepareForPrint start');
      document.body.classList.add('printing');

      // همه صفحات را visible می‌کنیم
      const allPages = Array.from(document.querySelectorAll('.page'));
      allPages.forEach(p => p.classList.add('active'));

      // تنظیم inline width و display و visibility از مقدار CSS variable --value
      const fills = Array.from(document.querySelectorAll('.progress-fill'));
      fills.forEach(f => {
        const raw = getComputedStyle(f).getPropertyValue('--value') || '50%';
        const val = raw.trim().endsWith('%') ? raw.trim() : (raw.trim() + '%');
        try {
          f.style.setProperty('width', val, 'important');
          f.style.setProperty('display', 'block', 'important');
          f.style.setProperty('visibility', 'visible', 'important');
          f.style.setProperty('min-width', '6%', 'important'); // تضمین دیده شدن در چاپ
          console.log('[print] set progress width for', f, '->', val);
        } catch (e) {
          // مرورگرهای قدیمی ممکن است از third param ignore کنند
          f.style.width = val;
          f.style.display = 'block';
          f.style.visibility = 'visible';
          f.style.minWidth = '6%';
          console.log('[print] fallback set progress width for', f, '->', val);
        }
      });

      // force layout و سپس print با تأخیر بیشتر
      requestAnimationFrame(() => {
        setTimeout(() => {
          console.log('[print] calling window.print()');
          window.print();
        }, 500);
      });

      console.log('[print] prepareForPrint scheduled print');
    }

    function restoreAfterPrint() {
      console.log('[print] restoreAfterPrint start');
      document.body.classList.remove('printing');

      const activeBtn = document.querySelector('.menu-item.active');
      const target = activeBtn ? activeBtn.dataset.target : 'summary';
      showPage(target);

      const fills = Array.from(document.querySelectorAll('.progress-fill'));
      fills.forEach(f => {
        // پاک کردن استایل‌های inline ای که اضافه شده‌اند
        f.style.removeProperty('width');
        f.style.removeProperty('display');
        f.style.removeProperty('visibility');
        f.style.removeProperty('min-width');
      });
      console.log('[print] restoreAfterPrint done');
    }

    // دکمه پرینت
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        prepareForPrint();
      });
      console.log('[script.js] printBtn listener attached');
    } else console.warn('[script.js] printBtn NOT found');

    // beforeprint/afterprint + matchMedia
    if (window.matchMedia) {
      const mql = window.matchMedia('print');
      if (typeof mql.addListener === 'function') {
        mql.addListener(m => {
          if (m.matches) {
            console.log('[matchMedia] print start');
            // بعضی مرورگرها این را خودشان فراخوانی می‌کنند؛ اما ما redundantly prepare می‌کنیم
            if (!document.body.classList.contains('printing')) prepareForPrint();
          } else {
            console.log('[matchMedia] print end');
            restoreAfterPrint();
          }
        });
      }
    }
    window.addEventListener('beforeprint', () => {
      console.log('[event] beforeprint');
      if (!document.body.classList.contains('printing')) prepareForPrint();
    });
    window.addEventListener('afterprint', () => {
      console.log('[event] afterprint');
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
            console.log('[shortcut] Ctrl/Cmd+P detected — triggering print flow');
            prepareForPrint();
          } else {
            console.log('[shortcut] already printing — ignored');
          }
        }
      } catch (innerErr) {
        console.error('[script.js][keydown] error', innerErr);
      }
    });

    // دکمه زبان (جایگذاری)
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        langBtn.classList.add('clicked');
        setTimeout(() => langBtn.classList.remove('clicked'), 220);
      });
    }

    // صفحه پیش‌فرض
    showPage('summary');

  } catch (err) {
    console.error('[script.js] initialization error', err);
  }
});
