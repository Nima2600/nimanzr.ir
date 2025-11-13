// تنها مسئول نمایش/پنهان صفحات و مدیریت کلاس active در منو
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

  // دکمه پرینت: فقط جایگذاری شده (بدون عملکرد)
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      printBtn.classList.add('clicked');
      setTimeout(() => printBtn.classList.remove('clicked'), 220);
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
