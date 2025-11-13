// نمایش/پنهان صفحات و مدیریت چاپ با ترتیب دلخواه + اتصال شورتکات Ctrl/Cmd+P
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

  // آماده‌سازی چاپ: تنظیم نوارها و فعال‌سازی کلاس printing
  function prepareForPrint() {
    document.body.classList.add('printing');

    // همه صفحات را visible می‌کنیم تا چاپ پشت سر هم انجام شود
    const allPages = Array.from(document.querySelectorAll('.page'));
    allPages.forEach(p => p.classList.add('active'));

    // تنظیم inline width از مقدار CSS variable --value برای داشتن نتیجه پایدار در چاپ
    const fills = Array.from(document.querySelectorAll('.progress-fill'));
    fills.forEach(f => {
      const val = getComputedStyle(f).getPropertyValue('--value') || '50%';
      f.style.width = val.trim();
    });
  }

  // بازگردانی بعد از چاپ
  function restoreAfterPrint() {
    document.body.classList.remove('printing');

    // بازگشت به صفحه‌ای که کاربر آخرین بار انتخاب کرده بود
    const activeBtn = document.querySelector('.menu-item.active');
    const target = activeBtn ? activeBtn.dataset.target : 'summary';
    showPage(target);

    // پاک کردن inline widthهای اضافه‌شده
    const fills = Array.from(document.querySelectorAll('.progress-fill'));
    fills.forEach(f => {
      f.style.width = '';
    });
  }

  // دکمه پرینت: استفاده از تابع آماده‌سازی و window.print()
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      prepareForPrint();
      // اجازه بدهیم مرورگر پیش‌نمایش چاپ را باز کند؛ afterprint/fallback آن را بازگردانی خواهد کرد
      setTimeout(() => window.print(), 200);
    });
  }

  // مدیریت رویدادهای beforeprint/afterprint برای مرورگرهایی که پشتیبانی می‌کنند
  if (window.matchMedia) {
    const mql = window.matchMedia('print');
    mql.addListener(m => {
      if (m.matches) {
        // قبل از چاپ در برخی مرورگرها
        prepareForPrint();
      } else {
        // بعد از چاپ
        restoreAfterPrint();
      }
    });
  }
  window.addEventListener('beforeprint', prepareForPrint);
  window.addEventListener('afterprint', restoreAfterPrint);

  // شورتکات Ctrl/Cmd+P: جلوگیری از دیالوگ پیش‌فرض و استفاده از آماده‌ساز پرینت ما
  window.addEventListener('keydown', function (e) {
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;
    if (ctrlOrCmd && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      // اگر قبلاً در حالت printing نیستیم، آماده‌سازی و چاپ را اجرا کن
      if (!document.body.classList.contains('printing')) {
        prepareForPrint();
        // کمی تأخیر برای اعمال CSS، سپس فراخوانی چاپ
        setTimeout(() => window.print(), 200);
      }
    }
  });

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
