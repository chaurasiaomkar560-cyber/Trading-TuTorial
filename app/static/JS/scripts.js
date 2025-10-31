/* ===========================
   scripts.js — Trading Tutor
   =========================== */

// === Mobile Menu Toggle ===
const menuBtn = document.getElementById('menu-btn');
const header = document.querySelector('header');

if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    header.classList.toggle('active');
  });
}

// === Dark Mode Toggle ===
const themeBtn = document.getElementById('theme-btn');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeBtn.querySelector('i');

    // Change icon based on theme
    if (document.body.classList.contains('dark')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  });
}

// === Footer Year Auto Update ===
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// === Signup Page Role Switching ===
const roleBtns = document.querySelectorAll('.role-btn');
const formFields = document.querySelectorAll('.form-fields');

if (roleBtns.length > 0) {
  roleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Remove active classes
      roleBtns.forEach((b) => b.classList.remove('active'));
      formFields.forEach((f) => f.classList.remove('active'));

      // Add active to selected role
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');
      const roleForm = document.getElementById(`${role}-form`);
      if (roleForm) roleForm.classList.add('active');
    });
  });
}

// === Trading Simulator (Dashboard) ===
const buyBtn = document.getElementById('buyBtn');
const sellBtn = document.getElementById('sellBtn');
const simOutput = document.getElementById('simOutput');

function simulateTrade(action) {
  const price = (1000 + Math.random() * 500).toFixed(2);
  const msg = `${action} executed at $${price}`;
  const p = document.createElement('p');
  p.textContent = msg;
  p.style.marginBottom = '4px';
  simOutput.prepend(p);
}

if (buyBtn && sellBtn && simOutput) {
  buyBtn.addEventListener('click', () => simulateTrade('Buy'));
  sellBtn.addEventListener('click', () => simulateTrade('Sell'));
}

// === Close Menu When a Link is Clicked (Mobile UX Improvement) ===
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    header.classList.remove('active');
  });
});
