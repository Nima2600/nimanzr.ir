// نمایش/پنهان صفحات و مدیریت چاپ با ترتیب دلخواه
document.addEventListener('DOMContentLoaded', function () {
  const menuItems = Array.from(document.querySelectorAll('.menu-item'));
  const pages = Array.from(document.querySelectorAll('.page'));

  function showPage(id){
    pages.forEach(p => {
      if (p.id === id) p.classList.add('active');
      else p.classList.remove('active');
    });
    menuItems.forEach(btn => {
      if (btn.dataset.target === id) btn.classList.add('active');
      else btn.classList.remove('active');
    });
    const activePage = document.getElementById(id);
    if (activePage) activePage.focus();
  }

  menuItems.forEach(btn => {
    btn.addEventListener('click', () => {
      showPage(btn.dataset.target);
    });
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // دکمه پرینت: آماده‌سازی صفحه برای چاپ با ترتیب مشخص
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    const startPrint = () => {
      // اضافه کردن کلاس printing به body تا CSS مخصوص چاپ اعمال شود
      document.body.classList.add('printing');

      // همه صفحات را visible می‌کنیم تا چاپ پشت سر هم انجام شود
      const allPages = Array.from(document.querySelectorAll('.page'));
      allPages.forEach(p => p.classList.add('active'));

      // اطمینان از اینکه نوارهای پیشرفت عرض صحیح را نشان می‌دهند:
      const fills = Array.from(document.querySelectorAll('.progress-fill'));
      fills.forEach(f => {
        const val = getComputedStyle(f).getPropertyValue('--value') || '50%';
        f.style.width = val.trim();
      });

      // کوتاه صبر کن تا CSS اعمال شود سپس پنجره چاپ را باز کن
      setTimeout(() => {
        window.print();
      }, 200);
    };

    const endPrint = () => {
      // حذف کلاس printing و بازگرداندن نمایش فقط بخش فعال
      document.body.classList.remove('printing');

      // بازگشت به صفحه‌ای که کاربر آخرین بار انتخاب کرده بود
      const activeBtn = document.querySelector('.menu-item.active');
      const target = activeBtn ? activeBtn.dataset.target : 'summary';
      showPage(target);

      // پاک کردن inline widthهای اضافه‌شده (اختیاری ولی تمیزکننده)
      const fills = Array.from(document.querySelectorAll('.progress-fill'));
      fills.forEach(f => {
        f.style.width = '';
      });
    };

    printBtn.addEventListener('click', startPrint);

    // رویدادهای afterprint/بدیل matchMedia
    if (window.matchMedia) {
      const mql = window.matchMedia('print');
      mql.addListener(mql => {
        if (!mql.matches) {
          endPrint();
        }
      });
    }
    window.addEventListener('afterprint', endPrint);
  }

  // دکمه زبان: فقط جایگذاری شده (بدون عملکرد)
  const langBtn = document.getElementById('langBtn');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      langBtn.classList.add('clicked');
      setTimeout(() => langBtn.classList.remove('clicked'), 220);
    });
  }

  // صفحه پیش‌فرض
  showPage('summary');
});
