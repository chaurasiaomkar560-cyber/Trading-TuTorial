// === 14. WORKSHOP REGISTRATION MODAL (Multi-Step) ===
const workshopModal = document.getElementById('workshopModal');
const workshopCloseBtn = document.getElementById('workshopCloseBtn');
const buyerRegForm = document.getElementById('buyerRegForm');
const workshopGrid = document.querySelector('.workshop-grid');

if (workshopModal && workshopCloseBtn && buyerRegForm && workshopGrid) {
  const buyerStep1 = document.getElementById('buyer-step-1');
  const buyerStep2 = document.getElementById('buyer-step-2');
  const buyerStep3 = document.getElementById('buyer-step-3');
  const buyerTerms = document.getElementById('buyerTerms');
  const buyerProceedBtn = document.getElementById('buyerProceedBtn');
  const paymentBackBtn = document.getElementById('paymentBackBtn');
  const paymentBtns = document.querySelectorAll('.payment-btn');
  const buyerDoneBtn = document.getElementById('buyerDoneBtn');

  let currentWorkshopData = {};

  workshopGrid.addEventListener('click', (e) => {
    if (e.target.classList.contains('register-btn')) {
      const card = e.target.closest('.workshop-card');
      currentWorkshopData = {
        title: card.querySelector('h3').textContent,
        price: card.querySelector('.workshop-badge')?.textContent || 'FREE',
        hostName: card.dataset.hostName || 'Trading Tutor Staff',
        date: card.querySelector('.workshop-meta').dataset.date
      };

      document.getElementById('modalWorkshopTitle').textContent = currentWorkshopData.title;
      document.getElementById('modalHosterName').textContent = currentWorkshopData.hostName;
      document.getElementById('modalAmount').textContent = currentWorkshopData.price;

      workshopModal.classList.add('open');
    }
  });

  buyerTerms.addEventListener('change', () => {
    buyerProceedBtn.disabled = !buyerTerms.checked;
  });

  buyerRegForm.addEventListener('submit', (e) => {
    e.preventDefault();
    buyerStep1.classList.remove('active');
    buyerStep2.classList.add('active');
  });

  paymentBackBtn.addEventListener('click', () => {
    buyerStep2.classList.remove('active');
    buyerStep1.classList.add('active');
  });

  paymentBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      let myWorkshops = JSON.parse(localStorage.getItem('myWorkshops')) || [];
      myWorkshops.push(currentWorkshopData);
      localStorage.setItem('myWorkshops', JSON.stringify(myWorkshops));

      document.getElementById('successWorkshopName').textContent = currentWorkshopData.title;

      buyerStep2.classList.remove('active');
      buyerStep3.classList.add('active');

      loadDashboardStats();
    });
  });

  const closeWorkshopModal = () => {
    workshopModal.classList.remove('open');
    buyerRegForm.reset();
    buyerStep1.classList.add('active');
    buyerStep2.classList.remove('active');
    buyerStep3.classList.remove('active');
    buyerTerms.checked = false;
    buyerProceedBtn.disabled = true;
  };

  workshopCloseBtn.addEventListener('click', closeWorkshopModal);
  buyerDoneBtn.addEventListener('click', closeWorkshopModal);
  workshopModal.addEventListener('click', (e) => {
    if (e.target.id === 'workshopModal') closeWorkshopModal();
  });
}
// *** End of Section 14 ***

// === 15. HOST A WORKSHOP MODAL (MODIFIED) ===
const showHostModalBtn = document.getElementById('showHostModalBtn');
const hostModal = document.getElementById('hostModal');
const hostCloseBtn = document.getElementById('hostCloseBtn');
const hostWorkshopForm = document.getElementById('hostWorkshopForm');

if (showHostModalBtn && hostModal && hostCloseBtn && hostWorkshopForm) {
  // (full host workshop logic — create workshop, localStorage, and success)
}
// *** End of Section 15 ***

// === 16. WORKSHOP COUNTDOWN TIMERS ===
function startWorkshopCountdowns() {
  const allWorkshopMeta = document.querySelectorAll('.workshop-meta[data-date]');
  allWorkshopMeta.forEach(meta => {
    const countdownElement = meta.querySelector('.countdown-timer');
    if (!countdownElement) return;
    // (countdown timer update logic)
  });
}
startWorkshopCountdowns();
// *** End of Section 16 ***

// === 17. WORKSHOP SEARCH & FILTER ===
const workshopSearchInput = document.getElementById('workshopSearchInput');
const workshopFilter = document.getElementById('workshopFilter');
function filterWorkshops() {
  // (filter logic)
}
if (workshopSearchInput && workshopFilter && workshopGrid) {
  workshopSearchInput.addEventListener('input', filterWorkshops);
  workshopFilter.addEventListener('change', filterWorkshops);
}
// *** End of Section 17 ***

// === 20. DASHBOARD STATS & "MY WORKSHOPS" MODAL ===
function loadDashboardStats() { /* update stats */ }
function populateMyWorkshopsList(filter = 'all') { /* populate workshops */ }
// *** End of Section 20 ***

// === 21. LIVE WEBINAR PAGE LOGIC ===
const micBtn = document.getElementById('mic-btn');
// (mic, video, chat, sidebar, and chat message logic)
// *** End of Section 21 ***

// === 22. WORKSHOP FILTER ICON TOGGLE (Mobile) ===
const workshopFilterBtn = document.querySelector('.filter-bar .filter-icon-btn');
const workshopFilterWrapper = document.querySelector('.filter-wrapper');
if (workshopFilterBtn && workshopFilterWrapper) {
  workshopFilterBtn.addEventListener('click', () => {
    workshopFilterWrapper.classList.toggle('open');
  });
}
// *** End of Section 22 ***
