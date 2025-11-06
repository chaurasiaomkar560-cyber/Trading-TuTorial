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
  const signupForm = document.getElementById('signupForm');
  const passInput = document.getElementById('signupPassword');
  const strengthMeter = document.getElementById('passwordStrengthMeter');
  const strengthText = document.getElementById('passwordStrengthText');

  // Password show/hide toggle
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const passWrapper = btn.closest('.password-wrapper');
      const input = passWrapper.querySelector('input');
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

  // Real-time password strength
  if (passInput && strengthMeter && strengthText) {
    passInput.addEventListener('input', () => {
      const pass = passInput.value;
      let strength = '', level = '';
      const hasNumber = /\d/.test(pass);
      const hasUpper = /[A-Z]/.test(pass);
      const hasLower = /[a-z]/.test(pass);
      const hasSpecial = /[!@#$%^&*()]/.test(pass);

      if (pass.length >= 10 && hasNumber && hasUpper && hasLower && hasSpecial) {
        strength = 'Strong';
        level = 'strong';
      } else if (pass.length >= 8 && (hasNumber || hasSpecial) && hasUpper && hasLower) {
        strength = 'Medium';
        level = 'medium';
      } else if (pass.length > 0) {
        strength = 'Weak';
        level = 'weak';
      }

      strengthMeter.dataset.strength = level;
      strengthText.textContent = strength;
    });
  }

  // Signup form simulation
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Account created successfully! (Simulation)');
      signupForm.reset();
      if (strengthMeter) strengthMeter.dataset.strength = '';
      if (strengthText) strengthText.textContent = '';
    });
  }

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

  // === 16. WORKSHOP COUNTDOWN TIMERS (Optimized Global Timer) ===
  function updateWorkshopCountdowns() {
    document.querySelectorAll('.workshop-meta[data-date]').forEach(meta => {
      const countdown = meta.querySelector('.countdown-timer');
      if (!countdown) return;
      const target = new Date(meta.dataset.date).getTime();
      const now = Date.now();
      const distance = target - now;

      if (distance < 0) {
        countdown.textContent = "Workshop Expired";
        countdown.classList.add('expired');
        return;
      }

      const days = Math.floor(distance / (1000*60*60*24));
      const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
      const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
      const seconds = Math.floor((distance % (1000*60)) / 1000);

      const pad = (n) => n.toString().padStart(2, '0');
      countdown.innerHTML = `<span>${days}d</span> : <span>${pad(hours)}h</span> : <span>${pad(minutes)}m</span> : <span>${pad(seconds)}s</span>`;
    });
  }
  setInterval(updateWorkshopCountdowns, 1000);
  updateWorkshopCountdowns();

  // === 15. HOST WORKSHOP CARD FIX ===
  const showHostModalBtn = document.getElementById('showHostModalBtn');
  const hostModal = document.getElementById('hostModal');
  const hostCloseBtn = document.getElementById('hostCloseBtn');
  const hostWorkshopForm = document.getElementById('hostWorkshopForm');
  const workshopGrid = document.querySelector('.workshop-grid');

  if (showHostModalBtn && hostModal && hostCloseBtn && hostWorkshopForm && workshopGrid) {
    showHostModalBtn.addEventListener('click', () => hostModal.classList.add('open'));
    const closeHostModal = () => { hostModal.classList.remove('open'); hostWorkshopForm.reset(); };
    hostCloseBtn.addEventListener('click', closeHostModal);
    hostModal.addEventListener('click', e => { if(e.target.id==='hostModal') closeHostModal(); });

    hostWorkshopForm.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('hostTitle').value;
      const desc = document.getElementById('hostDesc').value;
      const price = document.getElementById('hostPrice').value;
      const duration = document.getElementById('hostDuration').value;
      const date = document.getElementById('hostDate').value;
      let imageUrl = document.getElementById('hostImage').value || `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/400/200`;
      const badgeClass = price.toLowerCase()==='free'?'free':'price';

      const newWorkshopData = { title, desc, price, duration, date, imageUrl, badgeClass };
      const newWorkshop = document.createElement('div');
      newWorkshop.className = 'card workshop-card';
      newWorkshop.innerHTML = `
        <div class="workshop-badge ${badgeClass}">${price}</div>
        <img src="${imageUrl}" class="workshop-thumb" alt="Workshop Image">
        <div class="workshop-content">
          <div class="workshop-meta" data-date="${date}">
            <div class="countdown-timer">Just Published!</div>
            <span class="workshop-duration"><i class="fa-regular fa-clock"></i> ${duration}</span>
          </div>
          <h3>${title}</h3>
          <p>${desc}</p>
          <button class="btn btn-primary register-btn" style="width: 100%;">Register Now</button>
        </div>
      `;
      workshopGrid.prepend(newWorkshop);
      closeHostModal();
      alert('Success! Your workshop is submitted for review.');
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


document.addEventListener('DOMContentLoaded', () => {

  // ... (Sections 1-4, 6-7, 16 are unchanged - keeping them for context)

  // === 16. WORKSHOP COUNTDOWN TIMERS (Optimized Global Timer) ===
  function updateWorkshopCountdowns() {
    document.querySelectorAll('.workshop-meta[data-date]').forEach(meta => {
      // ... (countdown logic)
    });
  }
  setInterval(updateWorkshopCountdowns, 1000);
  updateWorkshopCountdowns();

  // === 15. HOST WORKSHOP CARD FIX (Hoster Modal) ===
  const showHostModalBtn = document.getElementById('showHostModalBtn');
  const hostModal = document.getElementById('hostModal');
  const hostCloseBtn = document.getElementById('hostCloseBtn');
  const hostWorkshopForm = document.getElementById('hostWorkshopForm');
  const workshopGrid = document.querySelector('.workshop-grid');
  // New Hoster Modal Elements for multi-step
  const hostNextBtn1 = document.getElementById('hostNextBtn1');
  const hostBackBtn1 = document.getElementById('hostBackBtn1');
  const hostNextBtn2 = document.getElementById('hostNextBtn2');
  const hostBackBtn2 = document.getElementById('hostBackBtn2');
  const hostSubmitBtn = document.getElementById('hostSubmitBtn');
  const hostTermsCheckbox = document.getElementById('hostTerms');
  const hostSteps = [
    document.getElementById('host-step-1'),
    document.getElementById('host-step-2'),
    document.getElementById('host-step-3')
  ];
  const hostStepIndicators = [
    document.getElementById('step-indicator-1'),
    document.getElementById('step-indicator-2'),
    document.getElementById('step-indicator-3')
  ];
  let currentHostStep = 0;

  // Function to show a specific host step
  function showHostStep(stepIndex) {
    hostSteps.forEach((step, index) => {
      step.classList.remove('active');
      hostStepIndicators[index].classList.remove('active');
    });
    hostSteps[stepIndex].classList.add('active');
    hostStepIndicators[stepIndex].classList.add('active');
    currentHostStep = stepIndex;
  }
  
  // Host Modal Navigation Handlers
  hostNextBtn1?.addEventListener('click', (e) => {
    e.preventDefault();
    // Basic validation check for step 1
    const hostName = document.getElementById('hostName').value;
    const hostEmail = document.getElementById('hostEmail').value;
    const hostSocial = document.getElementById('hostSocial').value;
    const hostExpertise = document.getElementById('hostExpertise').value;
    if (hostName && hostEmail && hostSocial && hostExpertise) {
        showHostStep(1); // Go to Step 2
    } else {
        alert('Please fill out all required fields in Step 1.');
    }
  });
  
  hostBackBtn1?.addEventListener('click', () => showHostStep(0));
  
  hostNextBtn2?.addEventListener('click', (e) => {
    e.preventDefault();
     // Basic validation check for step 2
    const hostTitle = document.getElementById('hostTitle').value;
    const hostDesc = document.getElementById('hostDesc').value;
    const hostPrice = document.getElementById('hostPrice').value;
    const hostDate = document.getElementById('hostDate').value;
    const hostDuration = document.getElementById('hostDuration').value;
    const hostLang = document.getElementById('hostLang').value;
    const hostAudience = document.getElementById('hostAudience').value;

    if (hostTitle && hostDesc && hostPrice && hostDate && hostDuration && hostLang && hostAudience) {
        showHostStep(2); // Go to Step 3
    } else {
        alert('Please fill out all required fields in Step 2.');
    }
  });

  hostBackBtn2?.addEventListener('click', () => showHostStep(1));

  hostTermsCheckbox?.addEventListener('change', () => {
    hostSubmitBtn.disabled = !hostTermsCheckbox.checked;
  });

  // Host Submit Handler (now displays success step)
  hostWorkshopForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (!hostTermsCheckbox.checked) return;

    // Simulate form submission and go to success step
    document.getElementById('host-step-3').classList.remove('active');
    document.getElementById('host-step-success').classList.add('active');
    hostStepIndicators.forEach(ind => ind.classList.remove('active')); // Clear progress bar
    alert('Success! Your workshop is submitted for review.');

    // Clear and close after successful submission simulation (optional)
    // You would typically handle API submission here before closing.
    // setTimeout(() => {
    //     closeHostModal();
    // }, 3000);
  });
  
  document.getElementById('hostDoneBtn')?.addEventListener('click', () => {
      hostModal.classList.remove('open'); 
      hostWorkshopForm.reset();
      document.getElementById('host-step-success').classList.remove('active');
      showHostStep(0); // Reset to step 1
  });
  
  if (showHostModalBtn && hostModal && hostCloseBtn && hostWorkshopForm && workshopGrid) {
    showHostModalBtn.addEventListener('click', () => hostModal.classList.add('open'));
    const closeHostModal = () => { hostModal.classList.remove('open'); hostWorkshopForm.reset(); showHostStep(0); };
    hostCloseBtn.addEventListener('click', closeHostModal);
    hostModal.addEventListener('click', e => { if(e.target.id==='hostModal') closeHostModal(); });
  }


  // === 19. WORKSHOP REGISTRATION MODAL (BUYER) FIX ===
  const workshopModal = document.getElementById('workshopModal');
  const workshopCloseBtn = document.getElementById('workshopCloseBtn');
  const registerButtons = document.querySelectorAll('.register-btn');
  const buyerRegForm = document.getElementById('buyerRegForm');
  const buyerProceedBtn = document.getElementById('buyerProceedBtn');
  const buyerTermsCheckbox = document.getElementById('buyerTerms');
  const paymentBackBtn = document.getElementById('paymentBackBtn');
  const paymentOptions = document.querySelector('#buyer-step-2 .payment-options');
  const buyerDoneBtn = document.getElementById('buyerDoneBtn');

  // Function to open the buyer modal
  function openBuyerModal(title) {
    document.getElementById('modalWorkshopTitle').textContent = title;
    // Set other dynamic details here if available (e.g., price, hoster)
    document.getElementById('modalAmount').textContent = '—'; // Placeholder
    document.getElementById('modalHosterName').textContent = 'Expert Trader'; // Placeholder
    
    // Reset to step 1
    document.querySelectorAll('#workshopModal .modal-step').forEach(step => step.classList.remove('active'));
    document.getElementById('buyer-step-1').classList.add('active');
    
    // Open the modal
    workshopModal.classList.add('open');
  }

  // Function to close the buyer modal and reset form
  function closeBuyerModal() {
    workshopModal.classList.remove('open');
    buyerRegForm.reset();
    buyerProceedBtn.disabled = true;
  }

  // 19.1. Attach click listeners to all "Register Now" buttons
  registerButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const workshopCard = e.target.closest('.workshop-card');
      const title = workshopCard.querySelector('h3').textContent;
      
      // Prevent opening modal for sold out/disabled cards
      if (workshopCard.classList.contains('is-sold-out') || e.target.disabled) {
        return; 
      }
      
      openBuyerModal(title);
    });
  });

  // 19.2. Close button and overlay click
  workshopCloseBtn?.addEventListener('click', closeBuyerModal);
  workshopModal?.addEventListener('click', e => {
      if(e.target.id==='workshopModal') closeBuyerModal(); 
  });

  // 19.3. Enable/Disable 'Proceed' button based on T&C checkbox
  buyerTermsCheckbox?.addEventListener('change', () => {
    buyerProceedBtn.disabled = !buyerTermsCheckbox.checked;
  });

  // 19.4. Step 1: Registration Form Submission -> Step 2: Payment
  buyerRegForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!buyerTermsCheckbox.checked) return;

    // Simulate validation successful
    document.getElementById('buyer-step-1').classList.remove('active');
    document.getElementById('buyer-step-2').classList.add('active');
  });

  // 19.5. Step 2: Payment Back Button
  paymentBackBtn?.addEventListener('click', () => {
    document.getElementById('buyer-step-2').classList.remove('active');
    document.getElementById('buyer-step-1').classList.add('active');
  });

  // 19.6. Step 2: Payment Buttons -> Step 3: Success
  paymentOptions?.querySelectorAll('.payment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const workshopTitle = document.getElementById('modalWorkshopTitle').textContent;
      
      document.getElementById('successWorkshopName').textContent = workshopTitle;
      document.getElementById('buyer-step-2').classList.remove('active');
      document.getElementById('buyer-step-3').classList.add('active');
    });
  });

  // 19.7. Step 3: Done Button
  buyerDoneBtn?.addEventListener('click', closeBuyerModal);

  // ... (Section 18 for Chatbot is unchanged)

});

document.getElementById('profile_picture').addEventListener('change', function() {
    var fileName = this.files && this.files.length > 0 ? this.files[0].name : 'No file chosen';
    document.getElementById('profile_picture_filename').textContent = fileName;
});

// Host Submit Handler (now displays success step AND adds card)
hostWorkshopForm?.addEventListener('submit', e => {
    e.preventDefault();
    if (!hostTermsCheckbox.checked) return;
    
    // --- 1. **Capture Form Data for Dynamic Card Creation** ---
    // Make sure to get the values from the Step 2 fields
    const hostTitle = document.getElementById('hostTitle').value;
    const hostDesc = document.getElementById('hostDesc').value;
    const hostPrice = document.getElementById('hostPrice').value;
    const hostDuration = document.getElementById('hostDuration').value;
    const hostDate = document.getElementById('hostDate').value;

    // NOTE: hostImage field does not exist, using random seed
    const imageUrl = `https://picsum.photos/seed/${Math.floor(Math.random()*1000)}/400/200`;
    const badgeClass = hostPrice.toLowerCase() === 'free' ? 'free' : 'price';

    // --- 2. **Simulate Form Submission and Go to Success Step** ---
    document.getElementById('host-step-3').classList.remove('active');
    document.getElementById('host-step-success').classList.add('active');
    hostStepIndicators.forEach(ind => ind.classList.remove('active')); // Clear progress bar
    alert('Success! Your workshop is submitted for review.');
    
    // --- 3. **Create and Prepend New Workshop Card** ---
    const newWorkshop = document.createElement('div');
    newWorkshop.className = 'card workshop-card';
    newWorkshop.innerHTML = `
        <div class="workshop-badge ${badgeClass}">${hostPrice}</div>
        <img src="${imageUrl}" class="workshop-thumb" alt="Workshop Image">
        <div class="workshop-content">
          <div class="workshop-meta" data-date="${hostDate}">
            <div class="countdown-timer">Just Published!</div>
            <span class="workshop-duration"><i class="fa-regular fa-clock"></i> ${hostDuration}</span>
          </div>
          <h3>${hostTitle}</h3>
          <p>${hostDesc}</p>
          <button class="btn btn-primary register-btn" style="width: 100%;">Register Now</button>
        </div>
    `;
    workshopGrid.prepend(newWorkshop);
    
    // --- 4. **Re-attach Buyer Modal listener to the new button** ---
    const newRegisterBtn = newWorkshop.querySelector('.register-btn');
    if (newRegisterBtn) {
        newRegisterBtn.addEventListener('click', (e) => {
            const card = e.target.closest('.workshop-card');
            if (card.classList.contains('is-sold-out') || e.target.disabled) return;
            // The openBuyerModal function is defined elsewhere in your script
            openBuyerModal(card.querySelector('h3').textContent);
        });
    }
});