// تنها مسئول نمایش/پنهان صفحات و مدیریت کلاس active در منو + آماده‌سازی چاپ
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
    // دسترسی کیبورد
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // دکمه پرینت: آماده‌سازی صفحه برای چاپ و بازگرداندن حالت بعد از چاپ
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    const startPrint = () => {
      // اضافه کردن کلاس printing به body تا CSS مخصوص چاپ اعمال شود
      document.body.classList.add('printing');

      // برای چاپ می‌خواهیم همه بخش‌ها پشت سر هم نمایش داده شوند، پس همه صفحات را visible می‌کنیم
      const allPages = Array.from(document.querySelectorAll('.page'));
      allPages.forEach(p => p.classList.add('active'));

      // اطمینان از اینکه نوارهای پیشرفت مقدار نهایی را نشان می‌دهند:
      // تنظیم inline width از مقدار CSS variable --value برای برخی مرورگرها در چاپ بهتر عمل کند
      const fills = Array.from(document.querySelectorAll('.progress-fill'));
      fills.forEach(f => {
        const val = getComputedStyle(f).getPropertyValue('--value') || '50%';
        f.style.width = val.trim();
      });

      // صبر کوتاه برای اعمال تغییرات DOM و CSS، سپس فراخوانی چاپ
      setTimeout(() => {
        // استفاده از window.print() برای باز کردن دیالوگ چاپ
        window.print();
      }, 150);
    };

    const endPrint = () => {
      // حذف کلاس printing و بازگرداندن نمایش فقط بخش فعال
      document.body.classList.remove('printing');

      // بازگشت به صفحه‌ای که کاربر آخرین بار انتخاب کرده بود: با بررسی منوی فعال
      const activeBtn = document.querySelector('.menu-item.active');
      const target = activeBtn ? activeBtn.dataset.target : 'summary';
      showPage(target);
    };

    // اتصال به دکمه
    printBtn.addEventListener('click', () => {
      startPrint();
    });

    // رویدادهای beforeprint/afterprint برای مرورگرهایی که از آنها پشتیبانی می‌کنند
    if (window.matchMedia) {
      // برای مرورگرهای مدرن: listen to print media changes
      const mql = window.matchMedia('print');
      mql.addListener(mql => {
        if (mql.matches) {
          // before print (some browsers)
        } else {
          // after print
          endPrint();
        }
      });
    }

    // fallback: رویدادهای مستقیم قبل و بعد چاپ
    window.addEventListener('afterprint', endPrint);
    window.addEventListener('beforeprint', () => {
      // بعضی مرورگرها قبل از نمایش دیالوگ چاپ صدا می‌کنند
    });
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
