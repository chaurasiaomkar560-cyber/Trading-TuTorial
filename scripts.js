/* ===========================
   scripts.js — Trading Tutor (Updated)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  // === 1. HAMBURGER MENU TOGGLE (Updated for Popup) ===
  const menuBtn = document.getElementById('menu-btn');
  const menuIcon = menuBtn ? menuBtn.querySelector('i') : null;
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks && menuIcon) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('nav-open');
      if (navLinks.classList.contains('nav-open')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
      } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
    });
  }

  // === 2. THEME TOGGLE ===
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
  const htmlElement = document.documentElement;

  if (themeBtn && themeIcon) {
    const setTheme = (theme) => {
      if (theme === 'dark') {
        htmlElement.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        localStorage.setItem('theme', 'dark');
      } else {
        htmlElement.setAttribute('data-theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        localStorage.setItem('theme', 'light');
      }
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme) setTheme(savedTheme);
    else if (prefersDark) setTheme('dark');
    else setTheme('light');

    themeBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  // === 3. FOOTER YEAR AUTO UPDATE ===
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // === 4. PASSWORD TOGGLE & STRENGTH ===
 
  // Password show/hide toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const passWrapper = btn.closest('.password-wrapper');
      const input = passWrapper.querySelector('input')
      const icon = btn.querySelector('i');
      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.classList.replace('fa-eye-slash', 'fa-eye');
        } else {
          input.type = 'password';
          icon.classList.replace('fa-eye', 'fa-eye-slash');
        }
      }
    });
  });

  // Real-time passw
  // === 6. CLOSE MENU WHEN A LINK IS CLICKED ===
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks) navLinks.classList.remove('nav-open');
      if (menuIcon) {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
    });
  });

  // === 7. DASHBOARD CARD MODAL (Updated for Full HTML Content) ===
  const dashboardCardModal = document.getElementById('dashboardCardModal');
  const cardModalCloseBtn = document.getElementById('cardModalCloseBtn');

  if (dashboardCardModal && cardModalCloseBtn) {
    document.querySelectorAll('.accordion-card .card-header').forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.accordion-card');
        if (!card) return;

        // Set title
        document.getElementById('cardModalTitle').textContent = card.querySelector('h3').textContent;

        // Set full HTML content
        const cardContent = card.querySelector('.card-content');
        if (cardContent) {
          document.getElementById('cardModalContent').innerHTML = cardContent.innerHTML;
        }

        // Set image
        const cardImage = card.querySelector('.card-image');
        if (cardImage) {
          document.getElementById('cardModalImage').src = cardImage.src;
        }

        dashboardCardModal.classList.add('open');
      });
    });

    cardModalCloseBtn.addEventListener('click', () => {
      dashboardCardModal.classList.remove('open');
      dashboardCardModal.classList.remove('chatbot-is-open');
    });
  }

  // === 18. CHATBOT (Cleaned, No Nested DOMContentLoaded) ===
  (function initChatbot(){
    const chatbotHTML = `
      <button id="chatbot-toggle" class="icon-btn"><i class="fa-solid fa-chart-line"></i></button>
      <div id="chatbot-popup">
        <div class="chatbot-header">
          <h3>Trading Tutor AI</h3>
          <div class="chatbot-header-buttons">
            <button id="chatbot-expand" class="icon-btn"><i class="fa-solid fa-expand"></i></button>
            <button id="chatbot-close" class="icon-btn">&times;</button>
          </div>
        </div>
        <div id="chatbot-log" class="chatbot-log"></div>
        <div id="chatbot-suggestions" class="chatbot-suggestions">
          <button class="suggestion-chip">What is Swing Trading?</button>
          <button class="suggestion-chip">How do I host a workshop?</button>
        </div>
        <div class="chatbot-input">
          <input type="text" id="chatbot-input-field" placeholder="Ask a question..." autocomplete="off">
          <button id="chatbot-send" class="icon-btn"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
      </div>`;
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    const toggleBtn = document.getElementById('chatbot-toggle');
    const popup = document.getElementById('chatbot-popup');
    const closeBtn = document.getElementById('chatbot-close');
    const log = document.getElementById('chatbot-log');
    const input = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send');
    const suggestions = document.getElementById('chatbot-suggestions');
    const expandBtn = document.getElementById('chatbot-expand');
    const expandIcon = expandBtn ? expandBtn.querySelector('i') : null;

    toggleBtn.addEventListener('click', ()=>{ 
      popup.classList.toggle('open'); 
      toggleBtn.style.opacity = popup.classList.contains('open')?'0':'1'; 
    });

    closeBtn.addEventListener('click', ()=>{ 
      popup.classList.remove('open'); 
      toggleBtn.style.opacity='1'; 
    });

    expandBtn?.addEventListener('click', ()=>{ 
      popup.classList.toggle('fullscreen');
      const fs = popup.classList.contains('fullscreen');
      expandIcon.classList.toggle('fa-compress', fs);
      expandIcon.classList.toggle('fa-expand', !fs);
    });

    async function sendMessage(){
      const text=input.value.trim(); if(!text) return;
      createMessage(text,'user'); input.value='';
      try{
        const res=await fetch('/api/chat',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify({message:text})
        });
        const data=res.ok?await res.json():null;
        createMessage(data?.response||"⚠️ No reply received.",'bot');
      }catch(e){ createMessage("🤖 Mock reply: "+text,'bot'); }
    }

    function createMessage(text,type){
      const div=document.createElement('div');
      div.className=`chat-message ${type}`;
      div.innerHTML=`<p>${text}</p>`;
      log.appendChild(div);
      log.scrollTop=log.scrollHeight;
    }

    sendBtn.addEventListener('click',sendMessage);
    input.addEventListener('keypress',e=>{if(e.key==='Enter')sendMessage();});
    suggestions?.addEventListener('click',e=>{ 
      if(e.target.classList.contains('suggestion-chip')){ 
        input.value=e.target.textContent; 
        sendMessage(); 
      }
    });
    createMessage("👋 Hello! I'm your Trading Tutor Bot — ask me anything about trading.",'bot');
  })();

});

/// blogs section 
// Get form and blog list
const blogForm = document.getElementById('blogForm');
const blogList = document.getElementById('blogList');

// Function to attach like event to a button
function attachLikeHandler(btn) {
    const likeCountSpan = btn.querySelector("span");
    btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = e.target.closest(".blog-card");
        const blogId = card.dataset.id;

        const isLiked = btn.classList.contains("liked");
        let newCount = parseInt(likeCountSpan.textContent);

        if (isLiked) {
            newCount = Math.max(0, newCount - 1);
            btn.classList.remove("liked");
        } else {
            newCount++;
            btn.classList.add("liked");
        }

        likeCountSpan.textContent = newCount;

        try {
            const response = await fetch(`/blog/like/${blogId}`, { method: "POST" });
            const data = await response.json();

            if (!data.success) {
                alert(data.error || "Failed to update like count on server.");
                // Optional: revert UI
                likeCountSpan.textContent = isLiked ? newCount + 1 : newCount - 1;
                btn.classList.toggle("liked");
            }
        } catch (error) {
            alert("Network error: Could not connect to the server.");
            // Revert UI
            likeCountSpan.textContent = isLiked ? newCount + 1 : newCount - 1;
            btn.classList.toggle("liked");
        }
    });
}

// Attach to all existing like buttons
document.querySelectorAll(".blog-card .like-btn").forEach(attachLikeHandler);

// Handle new blog submission
if (blogForm) {
    blogForm.addEventListener('submit', async e => {
        e.preventDefault();

        const formData = new FormData(blogForm);
        const res = await fetch('/blog', {
            method: 'POST',
            body: formData
        });

        const blog = await res.json();
        if (blog.error) {
            alert(blog.error);
            return;
        }

        // Dynamically create new blog card
        const div = document.createElement("div");
        div.classList.add("blog-card");
        div.dataset.id = blog.id;
        div.innerHTML = `
            <h3>${blog.title}</h3>
            <p>${blog.content}</p>
            <button class="like-btn">Like <span>0</span></button>
        `;
        blogList.prepend(div);

        // Attach like handler to the new button
        attachLikeHandler(div.querySelector(".like-btn"));
    });
}

document.addEventListener('DOMContentLoaded', () => {

  // === BLOG ELEMENTS ===
  const blogForm = document.getElementById('blogForm');
  const blogList = document.getElementById('blogList');
  const blogModal = document.getElementById('blogModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalFullContent = document.getElementById('modalFullContent');
  const modalLikeBar = document.querySelector('#blogModal .modal-like-bar .like-btn');

  // === FUNCTIONS ===

  // Attach listeners to all blog cards
  function attachBlogCardListeners() {
    // Read More / Modal
    document.querySelectorAll('.read-more-btn').forEach(btn => {
      btn.removeEventListener('click', openBlogModal); // safe removal
      btn.addEventListener('click', openBlogModal);
    });

    // Like buttons
    document.querySelectorAll('.blog-card .like-btn').forEach(btn => {
      btn.removeEventListener('click', handleLikeAction);
      btn.addEventListener('click', handleLikeAction);
    });

    // Delete buttons
    document.querySelectorAll('.blog-card .delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!confirm("Are you sure you want to delete this blog post?")) {
          e.preventDefault();
        }
      });
    });
  }

  // Open Modal
  function openBlogModal(e) {
    e.preventDefault();
    const blogCard = e.target.closest('.blog-card');
    if (!blogCard || !blogModal) return;

    modalTitle.textContent = blogCard.querySelector('.blog-card-title')?.textContent || 'Untitled Post';
    modalFullContent.textContent = blogCard.querySelector('.blog-card-full-content')?.textContent || 'Content not available.';
    modalImage.src = blogCard.querySelector('.blog-thumb')?.src || 'https://picsum.photos/400/200';

    // Sync like button in modal
    if (modalLikeBar) {
      const blogId = blogCard.dataset.id;
      const currentLikes = blogCard.querySelector('.like-btn span')?.textContent || '0';
      modalLikeBar.dataset.id = blogId;
      modalLikeBar.querySelector('span').textContent = `Like (${currentLikes})`;

      if (blogCard.querySelector('.like-btn').classList.contains('liked')) {
        modalLikeBar.classList.add('liked');
      } else {
        modalLikeBar.classList.remove('liked');
      }
    }

    blogModal.classList.add('open');
  }

  // Handle Like Action (both modal and card)
  async function handleLikeAction(e) {
    e.preventDefault();
    e.stopPropagation();

    const button = e.currentTarget;
    const blogId = button.dataset.id || button.closest('.blog-card')?.dataset.id;
    if (!blogId) return;

    const card = document.querySelector(`.blog-card[data-id="${blogId}"]`);
    const cardButton = card?.querySelector('.like-btn');
    const cardLikeSpan = cardButton?.querySelector('span');
    const modalButton = document.querySelector('#blogModal .modal-like-bar .like-btn');

    try {
      const response = await fetch(`/blog/like/${blogId}`, { method: "POST" });
      const data = await response.json();

      if (data.success) {
        const newLikes = data.new_likes;
        const action = data.action;

        if (cardLikeSpan) cardLikeSpan.textContent = newLikes;
        if (modalButton) modalButton.querySelector('span').textContent = `Like (${newLikes})`;

        if (action === "liked") {
          cardButton?.classList.add('liked');
          modalButton?.classList.add('liked');
        } else {
          cardButton?.classList.remove('liked');
          modalButton?.classList.remove('liked');
        }

      } else {
        alert(data.error || "Failed to update like count on server.");
      }
    } catch (err) {
      alert("Network error: Could not connect to the server.");
    }
  }

  // Close modal
  if (blogModal && modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => blogModal.classList.remove('open'));
    blogModal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        blogModal.classList.remove('open');
      }
    });
  }

  // Modal like button listener
  modalLikeBar?.addEventListener('click', handleLikeAction);

  // Initial listeners
  attachBlogCardListeners();
});
















/* ===========================
   scripts.js — Trading Tutor
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  // === DOM ELEMENT REFERENCES ===
  const hostModal = document.getElementById("hostModal");
  const workshopModal = document.getElementById("workshopModal");
  const showHostModalBtn = document.getElementById("showHostModalBtn");
  const hostCloseBtn = document.getElementById("hostCloseBtn");
  const workshopCloseBtn = document.getElementById("workshopCloseBtn");
  const hostForm = document.getElementById("hostWorkshopForm");
  const buyerForm = document.getElementById("buyerRegForm");
  const hostSubmitBtn = document.getElementById("hostSubmitBtn");
  const buyerProceedBtn = document.getElementById("buyerProceedBtn");
  const paymentBackBtn = document.getElementById("paymentBackBtn");
  const buyerDoneBtn = document.getElementById("buyerDoneBtn");
  const hostNextBtn1 = document.getElementById("hostNextBtn1");
  const hostNextBtn2 = document.getElementById("hostNextBtn2");
  const hostBackBtn1 = document.getElementById("hostBackBtn1");
  const hostBackBtn2 = document.getElementById("hostBackBtn2");
  const workshopGrid = document.querySelector(".workshop-grid");

  let selectedWorkshop = null;

  // === UTILS ===
  function showModal(modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function hideModal(modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  function switchStep(prefix, current, next) {
    const currentStep = document.getElementById(`${prefix}-step-${current}`);
    const nextStep = document.getElementById(`${prefix}-step-${next}`);
    if (!currentStep || !nextStep) return;
    currentStep.classList.remove("active");
    nextStep.classList.add("active");

    // update progress bar (hoster only)
    if (prefix === "host") {
      const currentIndicator = document.getElementById(`step-indicator-${current}`);
      const nextIndicator = document.getElementById(`step-indicator-${next}`);
      if (currentIndicator && nextIndicator) {
        currentIndicator.classList.remove("active");
        nextIndicator.classList.add("active");
      }
    }
  }

  /* ==============================
     HOST MODAL HANDLERS
  ============================== */
  showHostModalBtn?.addEventListener("click", () => showModal(hostModal));
  hostCloseBtn?.addEventListener("click", () => hideModal(hostModal));
  document.getElementById("hostDoneBtn")?.addEventListener("click", () => hideModal(hostModal));

  hostNextBtn1?.addEventListener("click", () => switchStep("host", 1, 2));
  hostBackBtn1?.addEventListener("click", () => switchStep("host", 2, 1));
  hostNextBtn2?.addEventListener("click", () => switchStep("host", 2, 3));
  hostBackBtn2?.addEventListener("click", () => switchStep("host", 3, 2));

  document.getElementById("hostTerms")?.addEventListener("change", (e) => {
    hostSubmitBtn.disabled = !e.target.checked;
  });

  hostForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(hostForm);

    try {
      const res = await fetch("/hoster_signup", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        switchStep("host", 3, "success");
        setTimeout(() => {
          hideModal(hostModal);
          hostForm.reset();
          loadWorkshops();
        }, 1500);
      } else alert(data.error || "❌ Failed to submit workshop");
    } catch (err) {
      console.error("Host form error:", err);
      alert("⚠️ Error submitting hoster form");
    }
  });

  /* ==============================
     BUYER MODAL HANDLERS
  ============================== */
  workshopCloseBtn?.addEventListener("click", () => hideModal(workshopModal));

  document.getElementById("buyerTerms")?.addEventListener("change", (e) => {
    buyerProceedBtn.disabled = !e.target.checked;
  });

  buyerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedWorkshop) return alert("⚠️ Please select a workshop first.");

    const formData = new FormData(buyerForm);
    formData.append("workshop_id", selectedWorkshop.id);

    try {
      const res = await fetch("/buyer_register", { method: "POST", body: formData });
      const data = await res.json();

      if (res.ok) {
        switchStep("buyer", 1, 2);

        // Payment Simulation
        document.querySelectorAll(".payment-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            switchStep("buyer", 2, 3);
            document.getElementById("successWorkshopName").textContent = selectedWorkshop.title;
          });
        });
      } else alert(data.error || "Failed to register.");
    } catch (err) {
      console.error("Buyer registration error:", err);
      alert("⚠️ Error while registering.");
    }
  });

  paymentBackBtn?.addEventListener("click", () => switchStep("buyer", 2, 1));
  buyerDoneBtn?.addEventListener("click", () => hideModal(workshopModal));

  /* ==============================
     REGISTER BUTTON (WORKSHOP CARDS)
  ============================== */
  workshopGrid?.addEventListener("click", (e) => {
    const btn = e.target.closest(".register-btn");
    if (!btn) return;

    const card = btn.closest(".workshop-card");
    if (!card) return;

    selectedWorkshop = {
      id: card.dataset.id || "demo",
      title: card.querySelector("h3")?.textContent.trim(),
      hoster: card.querySelector(".muted strong")?.textContent || "Hoster",
      price: card.querySelector(".workshop-badge")?.textContent.trim() || "FREE",
    };

    document.getElementById("modalWorkshopTitle").textContent = selectedWorkshop.title;
    document.getElementById("modalHosterName").textContent = selectedWorkshop.hoster;
    document.getElementById("modalAmount").textContent = selectedWorkshop.price;

    showModal(workshopModal);
  });

  /* ==============================
     WORKSHOP FETCHER
  ============================== */
  async function loadWorkshops() {
    try {
      const res = await fetch("/get_workshops");
      const data = await res.json();

      if (!Array.isArray(data)) return;
      workshopGrid.innerHTML = "";

      data.forEach((ws) => {
        const card = document.createElement("div");
        card.className = "card workshop-card";
        card.dataset.id = ws.id;

        const badgeClass = ws.price == 0 ? "free" : "price";
        const priceLabel = ws.price == 0 ? "FREE" : `$${ws.price}`;

        card.innerHTML = `
          <div class="workshop-badge ${badgeClass}">${priceLabel}</div>
          <img src="${ws.image_url || "https://picsum.photos/seed/default/400/200"}" class="workshop-thumb" alt="Workshop">
          <div class="workshop-content">
            <div class="workshop-meta" data-date="${ws.date_time}">
              <div class="countdown-timer">--d : --h : --m : --s</div>
              <span class="workshop-duration"><i class="fa-regular fa-clock"></i> ${ws.duration}</span>
            </div>
            <h3>${ws.title}</h3>
            <p>${ws.description}</p>
            <p class="muted"><strong>${ws.hoster?.full_name || "Unknown"}</strong></p>
            <button class="btn btn-primary register-btn" style="width: 100%">Register Now</button>
          </div>
        `;
        workshopGrid.appendChild(card);
      });
    } catch (err) {
      console.error("Failed to load workshops:", err);
    }
  }

  loadWorkshops();

  /* ==============================
     COUNTDOWN TIMER
  ============================== */
  function updateCountdowns() {
    document.querySelectorAll(".workshop-meta[data-date]").forEach((meta) => {
      const countdown = meta.querySelector(".countdown-timer");
      const target = new Date(meta.dataset.date).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        countdown.textContent = "Expired";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      countdown.textContent = `${days}d : ${hours}h : ${mins}m : ${secs}s`;
    });
  }
  setInterval(updateCountdowns, 1000);
});
