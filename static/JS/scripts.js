/* ===========================
   scripts.js — Trading Tutor
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

 // === 1. HAMBURGER MENU TOGGLE (Updated for Popup) ===
  const menuBtn = document.getElementById('menu-btn');
  const menuIcon = menuBtn ? menuBtn.querySelector('i') : null;
  const navLinks = document.querySelector('.nav-links');

  if (menuBtn && navLinks && menuIcon) {
    menuBtn.addEventListener('click', () => {
      // Toggle the menu's open state
      navLinks.classList.toggle('nav-open');
      
      // Toggle the icon
      if (navLinks.classList.contains('nav-open')) {
        // Menu is open, show 'X' (times) icon
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
      } else {
        // Menu is closed, show 'hamburger' (bars) icon
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
    });
  }
  

  // === 2. THEME TOGGLE (Corrected with localStorage) ===
  // Yeh humare CSS (data-theme) se match karta hai
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
  const htmlElement = document.documentElement; // <html> tag

  if (themeBtn && themeIcon) {
    // Function to set the theme
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

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Apply theme on page load
    if (savedTheme) {
      setTheme(savedTheme); // Use saved theme
    } else if (prefersDark) {
      setTheme('dark'); // Use OS preference
    } else {
      setTheme('light'); // Default to light
    }

    // Add click event listener to the button
    themeBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    });
  }

  // === 3. FOOTER YEAR AUTO UPDATE ===
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // === 4. NEW SIGNUP PAGE DYNAMICS ===
  const signupForm = document.getElementById('signup-form');
  const passInput = document.getElementById('signupPassword');
  const passToggleBtn = document.querySelector('.password-toggle-btn');
  const strengthMeter = document.getElementById('password-strength-meter');
  const strengthText = strengthMeter ? strengthMeter.querySelector('.strength-text') : null;

  // 1. Password Show/Hide Toggle (Global)
  // Yeh code page par sabhi password toggle buttons ko dhoondhega
  const allPassToggleBtns = document.querySelectorAll('.password-toggle-btn');
  
  allPassToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Button ke paas waale input ko dhoondho
      const passWrapper = btn.closest('.password-wrapper');
      const passInput = passWrapper.querySelector('input');
      const icon = btn.querySelector('i');

      if (passInput && icon) {
        // Input type aur icon ko toggle karo
        if (passInput.type === 'password') {
          passInput.type = 'text';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        } else {
          passInput.type = 'password';
          icon.classList.remove('fa-eye');
          icon.classList.add('fa-eye-slash');
        }
      }
    });
  });
  
  // 2. Real-time Password Strength
  if (passInput && strengthMeter && strengthText) {
    passInput.addEventListener('input', () => {
      const pass = passInput.value;
      let strength = 'Weak';
      let strengthLevel = 'weak';
      
      const hasNumber = /\d/.test(pass);
      const hasUpper = /[A-Z]/.test(pass);
      const hasLower = /[a-z]/.test(pass);
      const hasSpecial = /[!@#$%^&*()]/.test(pass);
      
      if (pass.length >= 10 && hasNumber && hasUpper && hasLower && hasSpecial) {
        strength = 'Strong';
        strengthLevel = 'strong';
      } else if (pass.length >= 8 && (hasNumber || hasSpecial) && hasUpper && hasLower) {
        strength = 'Medium';
        strengthLevel = 'medium';
      } else if (pass.length === 0) {
        strength = '';
        strengthLevel = '';
      }
      
      strengthMeter.dataset.strength = strengthLevel;
      strengthText.textContent = strength;
    });
  }
  
  // 3. Form Submit (Simulation)
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Account created successfully! (Simulation)');
      signupForm.reset();
      strengthMeter.dataset.strength = '';
      strengthText.textContent = '';
    });
  }
  // *** End of Section 4 (New) ***

  // === 6. CLOSE MENU WHEN A LINK IS CLICKED (Popup) ===
 const allNavLinks = document.querySelectorAll('.nav-links a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close the nav menu
      if (navLinks) navLinks.classList.remove('nav-open');
      
      // IMPORTANT: Reset the icon back to hamburger
      if (menuIcon) {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
      }
    });
  });

 // === 7. DASHBOARD CARD MODAL (Replaced Accordion Logic) ===
  const dashboardCardModal = document.getElementById('dashboardCardModal');
  const cardModalCloseBtn = document.getElementById('cardModalCloseBtn');
  const allAccordionHeaders = document.querySelectorAll('.accordion-card .card-header');
  
  if (dashboardCardModal && cardModalCloseBtn && allAccordionHeaders.length > 0) {
    
    // 1. Click to Open Modal
    allAccordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.accordion-card');
        
        // Card se data nikalein
        const title = card.querySelector('h3').textContent;
        const imageSrc = card.querySelector('.card-image').src;
        
        // *** YEH HAI FIX ***
        // Humne '.card-content p' ko specifically target kiya hai
        const content = card.querySelector('.card-content p').textContent; 
        
        // Modal mein data daalein
        document.getElementById('cardModalTitle').textContent = title;
        document.getElementById('cardModalContent').textContent = content; // Ab yahaan sahi content aayega
        document.getElementById('cardModalImage').src = imageSrc;
        
        // Modal dikhayein
        dashboardCardModal.classList.add('open');
      });
    });
    
    // 2. Click to Close Modal
    cardModalCloseBtn.addEventListener('click', () => {
      dashboardCardModal.classList.remove('open');
      // Saath hi chatbot shrink class bhi hata dein
      dashboardCardModal.classList.remove('chatbot-is-open'); 
    });
  }
  // *** End of Section 7 (Updated) ***


  // === 8. BLOG FORM SUBMISSION (Updated for Modal) ===
  const blogForm = document.getElementById('blogForm');
  const blogList = document.getElementById('blogList');

  if (blogForm && blogList) {
    blogForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Page ko reload hone se rokein

      // Form se values lein
      const title = document.getElementById('blogTitle').value;
      const fullContent = document.getElementById('blogContent').value; // Yeh poora content hai
      let imageUrl = document.getElementById('blogImage').value;

      // Snippet banayein (e.g., pehle 100 characters)
      let snippet = fullContent.substring(0, 100);
      if (fullContent.length > 100) {
        snippet += "... (click read more)";
      }

      // Agar image URL nahi hai, toh random image use karein
      if (imageUrl === '') {
        const randomSeed = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/seed/${randomSeed}/400/200`;
      }

      // Naya blog card banane ke liye HTML
      const newPost = document.createElement('div');
      newPost.className = 'card blog-card';
      newPost.innerHTML = `
  <img src="${imageUrl}" class="blog-thumb" alt="Blog Image">
  <div class="blog-content">
    <h3 class="blog-card-title">${title}</h3>
    <p class="blog-card-snippet">${snippet}</p>
    <p class="blog-card-full-content" style="display: none;">${fullContent}</p>
    <p class="muted blog-meta">By You • Just now</p>
    <div class="blog-actions">
      <a href="#" class="btn btn-secondary read-more-btn">Read More</a>
      <button class="btn btn-outline like-btn">
  <i class="fa-regular fa-heart"></i> <span>0</span>
</button>
      <button class="btn btn-outline edit-btn">Edit</button>
      <button class="btn btn-outline delete-btn">Delete</button>
    </div>
  </div>
`;

      // Naye post ko list mein sabse upar add karein
      blogList.prepend(newPost);

      // Form ko reset kar dein
      blogForm.reset();
    });
  }
  // *** End of Section 8 ***

  // === 9. BLOG MODAL (POPUP) LOGIC ===
  const blogModal = document.getElementById('blogModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCommentList = document.getElementById('modalCommentList'); // YEH LINE ADD KAREIN
  
  // Modal content elements
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalFullContent = document.getElementById('modalFullContent');

  // blogList variable Section 8 mein pehle se define hai
  if (blogList && blogModal && modalCloseBtn) {
    
    // Event Delegation: Poori list par click sunein
    blogList.addEventListener('click', (e) => {
      // Check karein ki kya 'read-more-btn' par click hua hai
      if (e.target.classList.contains('read-more-btn')) {
        e.preventDefault(); // Link ko jump karne se rokein
        
        // Parent blog card aur uska content dhoondhein
        const card = e.target.closest('.blog-card');
        const title = card.querySelector('.blog-card-title').textContent;
        const fullContent = card.querySelector('.blog-card-full-content').textContent;
        const imageSrc = card.querySelector('.blog-thumb').src;
        
        // Modal ko content se bharein
        modalTitle.textContent = title;
        modalFullContent.textContent = fullContent;
        modalImage.src = imageSrc;
        
        // Modal ko dikhayein
        blogModal.classList.add('open');
      }
    });
    
    // Modal band karne ka function
    const closeModal = () => {
      blogModal.classList.remove('open');

      if(modalCommentList) modalCommentList.innerHTML = ""; // Comments ko clear kar dein
    };
    
    // Close button par click
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Overlay (background) par click karke band karein
    blogModal.addEventListener('click', (e) => {
      if (e.target.id === 'blogModal') {
        closeModal();
      }
    });
  }
  // *** End of Section 9 ***

  // === 10. EDIT & DELETE LOGIC ===
  // blogList variable pehle se defined hai (Section 8 mein)

  if (blogList) {
    blogList.addEventListener('click', (e) => {
      
      // --- DELETE BUTTON LOGIC ---
      if (e.target.classList.contains('delete-btn')) {
        // Confirmation poochein
        if (confirm('Are you sure you want to delete this post?')) {
          const card = e.target.closest('.blog-card');
          card.remove(); // Card ko HTML se delete kar dein
        }
      }
      
      // --- EDIT BUTTON LOGIC ---
      if (e.target.classList.contains('edit-btn')) {
        const card = e.target.closest('.blog-card');
        
        // Card se puraana data nikaalein
        const title = card.querySelector('.blog-card-title').textContent;
        const fullContent = card.querySelector('.blog-card-full-content').textContent;
        const imageUrl = card.querySelector('.blog-thumb').src;
        
        // Us data ko upar waale main form mein daal dein
        document.getElementById('blogTitle').value = title;
        document.getElementById('blogContent').value = fullContent;
        document.getElementById('blogImage').value = imageUrl;
        
        // Puraane card ko delete kar dein
        card.remove();
        
        // User ko form tak scroll kar dein
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Form par focus kar dein
        document.getElementById('blogTitle').focus();
      }
      
    });
  }
  // *** End of Section 10 ***

  // === 11. COMMENT SUBMISSION LOGIC ===
  const commentForm = document.getElementById('modalCommentForm');
  // modalCommentList pehle se (Section 9 mein) defined hai
  
  if (commentForm && modalCommentList) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // 1. Form se values lein
      const nameInput = document.getElementById('commentName');
      const commentInput = document.getElementById('commentText');
      const name = nameInput.value;
      const commentText = commentInput.value;
      
      // 2. Naya comment element banayein
      const newComment = document.createElement('div');
      newComment.className = 'comment';
      
      // 3. Uska HTML set karein
      newComment.innerHTML = `
        <p class="comment-body">${commentText}</p>
        <p class="comment-meta">by <strong>${name}</strong> on ${new Date().toLocaleDateString('en-IN')}</p>
      `;
      
      // 4. List mein sabse upar add karein
      modalCommentList.prepend(newComment);
      
      // 5. Form ko reset kar dein
      commentForm.reset();
    });
  }
  // *** End of Section 11 ***

  // === 12. LIKE BUTTON LOGIC ===
  
  // Like button click ko handle karne ke liye global listener
  document.body.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    
    if (likeBtn) {
      // 1. Like state (class) ko toggle karein
      likeBtn.classList.toggle('liked');
      
      // 2. Count (span) ko dhoondhein
      const countSpan = likeBtn.querySelector('span');
      if (!countSpan) return; // Agar span nahi mila toh exit
      
      let currentLikes;
      
      // 3. Count ko update karein
      if (likeBtn.classList.contains('liked')) {
        // Abhi-abhi like kiya hai
        // Check karein ki modal wala button hai ya card wala
        if (countSpan.textContent.includes('Like')) {
          currentLikes = parseInt(countSpan.textContent.match(/\d+/)[0]); // (0) se 0 nikaalein
          countSpan.textContent = `Like (${currentLikes + 1})`;
        } else {
          currentLikes = parseInt(countSpan.textContent);
          countSpan.textContent = currentLikes + 1;
        }
        
        // Icon ko solid karein (CSS bhi yeh karta hai, par JS se better hai)
        likeBtn.querySelector('i').classList.remove('fa-regular');
        likeBtn.querySelector('i').classList.add('fa-solid');
        
      } else {
        // Abhi-abhi unlike kiya hai
        if (countSpan.textContent.includes('Like')) {
          currentLikes = parseInt(countSpan.textContent.match(/\d+/)[0]); // (1) se 1 nikaalein
          countSpan.textContent = `Like (${currentLikes - 1})`;
        } else {
          currentLikes = parseInt(countSpan.textContent);
          countSpan.textContent = currentLikes - 1;
        }
        
        // Icon ko regular karein
        likeBtn.querySelector('i').classList.remove('fa-solid');
        likeBtn.querySelector('i').classList.add('fa-regular');
      }
    }
  });
  // *** End of Section 12 ***

  // === 13. REAL-TIME BLOG SEARCH ===
  const searchInput = document.getElementById('blogSearchInput');
  // blogList (the <div> holding all cards) pehle se defined hai (Section 8)

  if (searchInput && blogList) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      
      // Card list ko dhoondhein
      const allCards = blogList.querySelectorAll('.blog-card');
      
      allCards.forEach(card => {
        // Title aur snippet dono mein search karein
        const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
        const snippet = card.querySelector('.blog-card-snippet').textContent.toLowerCase();
        
        // Check karein ki match hota hai ya nahi
        if (title.includes(searchTerm) || snippet.includes(searchTerm)) {
          // IMPORTANT: Card ka display 'flex' hai (CSS ke hisab se)
          card.style.display = 'flex'; // Card ko waapas dikhayein
        } else {
          card.style.display = 'none'; // Card ko hide kar dein
        }
      });
    });
  }
  // *** End of Section 13 ***

  // === 14. WORKSHOP REGISTRATION MODAL ===
  const workshopModal = document.getElementById('workshopModal');
  const workshopCloseBtn = document.getElementById('workshopCloseBtn');
  const workshopRegForm = document.getElementById('workshopRegForm');
  const workshopGrid = document.querySelector('.workshop-grid'); // Cards ka container
  
  if (workshopModal && workshopCloseBtn && workshopRegForm && workshopGrid) {
    
    // 1. "Register Now" button par click
    workshopGrid.addEventListener('click', (e) => {
      if (e.target.classList.contains('register-btn')) {
        // Card se title dhoondhein
        const card = e.target.closest('.workshop-card');
        const title = card.querySelector('h3').textContent;
        const priceBadge = card.querySelector('.workshop-badge');
        const price = priceBadge ? priceBadge.textContent : 'FREE'; // Price lein
        const meta = card.querySelector('.workshop-meta');
        const date = meta ? meta.dataset.date : new Date().toISOString();

        workshopRegForm.dataset.title = title;
        workshopRegForm.dataset.price = price;
        workshopRegForm.dataset.date = date;
        
        // Modal mein title set karein
        document.getElementById('modalWorkshopTitle').textContent = title;
        
        // Modal ko dikhayein
        workshopModal.classList.add('open');
      }
    });
    
    // 2. Modal band karne ka function
    const closeWorkshopModal = () => {
      workshopModal.classList.remove('open');
      workshopRegForm.reset(); // Form ko reset karein
    };
    
    // 3. Close button par click
    workshopCloseBtn.addEventListener('click', closeWorkshopModal);
    
    // 4. Overlay (background) par click
    workshopModal.addEventListener('click', (e) => {
      if (e.target.id === 'workshopModal') {
        closeWorkshopModal();
      }
    });
    
    // 5. Form Submit Logic (Abhi ke liye sirf alert)
    workshopRegForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value;
      const {title,price,date} = workshopRegForm.dataset;

      let myWorkshops = JSON.parse(localStorage.getItem('myWorkshops')) || [];
      myWorkshops.push({ title, price, date });
      localStorage.setItem('myWorkshops', JSON.stringify(myWorkshops));
      alert(`Success, ${name}! You are registered for the workshop: ${title}`);
      closeWorkshopModal(); // Form submit hone par modal band kar dein
    });
  }
  // *** End of Section 14 ***

  // === 15. HOST A WORKSHOP MODAL & FORM LOGIC ===
  const showHostModalBtn = document.getElementById('showHostModalBtn');
  const hostModal = document.getElementById('hostModal');
  const hostCloseBtn = document.getElementById('hostCloseBtn');
  const hostWorkshopForm = document.getElementById('hostWorkshopForm');
  // workshopGrid (cards container) pehle se defined hai (Section 14)

  if (showHostModalBtn && hostModal && hostCloseBtn && hostWorkshopForm && workshopGrid) {

    // 1. "Host a Workshop" button par click
    showHostModalBtn.addEventListener('click', () => {
      hostModal.classList.add('open');
    });

    // 2. Modal band karne ka function
    const closeHostModal = () => {
      hostModal.classList.remove('open');
      hostWorkshopForm.reset();
    };

    // 3. Close button aur Overlay par click
    hostCloseBtn.addEventListener('click', closeHostModal);
    hostModal.addEventListener('click', (e) => {
      if (e.target.id === 'hostModal') {
        closeHostModal();
      }
    });

    // 4. Form Submit Logic (Ab localStorage mein SAVE karega)
    hostWorkshopForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // --- Tier 2: Hoster Vetting Details ---
      const hostName = document.getElementById('hostName').value;
      const hostEmail = document.getElementById('hostEmail').value;
      // ... (baaki hoster details)

      // --- Workshop Details ---
      const title = document.getElementById('hostTitle').value;
      const desc = document.getElementById('hostDesc').value;
      const price = document.getElementById('hostPrice').value;
      const duration = document.getElementById('hostDuration').value;
      const date = document.getElementById('hostDate').value;
      let imageUrl = document.getElementById('hostImage').value;

      if (imageUrl === '') {
        const randomSeed = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/seed/${randomSeed}/400/200`;
      }
      
      let badgeClass = 'price';
      if (price.toLowerCase() === 'free') {
        badgeClass = 'free';
      }

      // --- YEH HAI NAYA LOGIC (Step 1) ---
      // 1. Puraana data "PendingWorkshops" se lein
      let pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
      
      // 2. Naya workshop object banayein
      const newWorkshopData = {
        id: `ws_${new Date().getTime()}`, // Ek unique ID banayein
        title,
        hostName,
        hostEmail,
        date,
        price,
        duration,
        desc,
        imageUrl,
        badgeClass
      };
      
      // 3. Naya workshop add karein
      pendingWorkshops.push(newWorkshopData);
      
      // 4. Waapas localStorage mein save karein
      localStorage.setItem('pendingWorkshops', JSON.stringify(pendingWorkshops));
      
      // --- End of Naya Logic ---

      
      // --- Front-End Update (UI) ---
      // (Ab hum naya data use karke card banayenge)
      const newWorkshop = document.createElement('div');
      newWorkshop.className = 'card workshop-card';
      
      newWorkshop.innerHTML = `
        <div class="workshop-badge ${newWorkshopData.badgeClass}">${newWorkshopData.price}</div>
        <img src="${newWorkshopData.imageUrl}" class="workshop-thumb" alt="Workshop Image">
        <div class.="workshop-content">
          <div class="workshop-meta" data-date="${newWorkshopData.date}">
            <div class="countdown-timer">Just Published!</div>
            <span class="workshop-duration">
              <i class="fa-regular fa-clock"></i> ${newWorkshopData.duration}
            </span>
          </div>
          <h3>${newWorkshopData.title}</h3>
          <p>${newWorkshopData.desc}</p>
          <button class="btn btn-primary register-btn" style="width: 100%;">Register Now</button>
        </div>
      `;

      workshopGrid.prepend(newWorkshop);
      startWorkshopCountdowns(); 
      closeHostModal();
      
      alert('Success! Your workshop is submitted for review.');
    });
  
  }
  // *** End of Section 15 ***

  // === 16. WORKSHOP COUNTDOWN TIMERS ===
  
  // Pehle ek helper function banayein
  function startWorkshopCountdowns() {
    const allWorkshopMeta = document.querySelectorAll('.workshop-meta[data-date]');
    
    allWorkshopMeta.forEach(meta => {
      const countdownElement = meta.querySelector('.countdown-timer');
      if (!countdownElement) return; // Agar countdown div nahi hai toh skip
      
      const targetDate = new Date(meta.dataset.date).getTime();
      
      // Timer ko har second update karein
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        // 1. Agar time poora ho gaya hai
        if (distance < 0) {
          clearInterval(interval);
          countdownElement.innerHTML = "Workshop Expired";
          countdownElement.classList.add('expired');
          return;
        }
        
        // 2. Time calculate karein
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Helper function (taaki '5' ki jagah '05' dikhe)
        const pad = (num) => num.toString().padStart(2, '0');
        
        // 3. HTML ko update karein
        countdownElement.innerHTML = `
          <span>${days}d</span> : <span>${pad(hours)}h</span> : <span>${pad(minutes)}m</span> : <span>${pad(seconds)}s</span>
        `;
        
      }, 1000);
    });
  }
  
  // Function ko call karein (DOMContentLoaded ke andar)
  startWorkshopCountdowns();

  // *** End of Section 16 ***

  // === 17. WORKSHOP SEARCH & FILTER ===
  const workshopSearchInput = document.getElementById('workshopSearchInput');
  const workshopFilter = document.getElementById('workshopFilter');
  // workshopGrid is already defined in Section 15
  
  function filterWorkshops() {
    // Agar elements page par maujood nahi hain, toh function na chalayein
    if (!workshopSearchInput || !workshopFilter || !workshopGrid) return;

    const searchTerm = workshopSearchInput.value.toLowerCase();
    const filterValue = workshopFilter.value;
    
    const allCards = workshopGrid.querySelectorAll('.workshop-card');
    
    allCards.forEach(card => {
      
      // 1. Check for Text Match (Title aur Description mein)
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const textMatch = title.includes(searchTerm) || description.includes(searchTerm);
      
      // 2. Check for Filter Match (Available, Expired)
      let filterMatch = false;
      const isSoldOut = card.classList.contains('is-sold-out');
      // Timer script .expired class add karti hai
      const isExpired = card.querySelector('.countdown-timer.expired'); 
      
      if (filterValue === 'all') {
        filterMatch = true;
      } else if (filterValue === 'available') {
        filterMatch = !isSoldOut && !isExpired; // Na sold out ho, na expired
      } else if (filterValue === 'expired') {
        filterMatch = isSoldOut || isExpired; // Ya toh sold out ho YA expired
      }
      
      // 3. Show or Hide Card
      if (textMatch && filterMatch) {
        card.style.display = 'flex'; // 'flex' because .workshop-card is display: flex
      } else {
        card.style.display = 'none'; // Hide karo
      }
    });
  }

  // Event listeners ko DOMContentLoaded ke andar hi rakhein
  if (workshopSearchInput && workshopFilter && workshopGrid) {
    workshopSearchInput.addEventListener('input', filterWorkshops);
    workshopFilter.addEventListener('change', filterWorkshops);
  }
  // *** End of Section 17 ***

  // === 18. GLOBAL CHATBOT INJECTOR & LOGIC ===
  
  // 1. HTML ko inject karein
  function injectChatbotHTML() {
    const chatbotHTML = `
      <button id="chatbot-toggle" class="icon-btn" aria-label="Open Chatbot">
          <i class="fa-solid fa-chart-line"></i>
      </button>

      <div id="chatbot-popup">
          <div class="chatbot-header">
    <h3>Trading Tutor AI</h3>
    <div class="chatbot-header-buttons">
        <button id="chatbot-expand" class="icon-btn" aria-label="Toggle Fullscreen" title="Toggle Fullscreen">
            <i class="fa-solid fa-expand"></i>
        </button>
        <button id="chatbot-close" class="icon-btn" aria-label="Close Chatbot" title="Close Chatbot">
            &times;
        </button>
    </div>
</div>
          <div class="chatbot-log" id="chatbot-log">
              <div class="chat-message bot">
                  <p>Hi there! How can I help you today? You can ask about workshops, trading, or this site.</p>
              </div>
          </div>
          <div class="chatbot-suggestions" id="chatbot-suggestions">
              <button class="suggestion-chip">What is Swing Trading?</button>
              <button class="suggestion-chip">How do I host a workshop?</button>
          </div>
          <div class="chatbot-input">
              <input type="text" id="chatbot-input-field" placeholder="Ask a question..." autocomplete="off">
              <button id="chatbot-send" class="icon-btn" aria-label="Send Message">
                  <i class="fa-solid fa-paper-plane"></i>
              </button>
          </div>
      </div>
    `;
    // HTML ko <body> mein daalein
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }
  
  // 2. Chatbot logic ko activate karein
  function activateChatbot() {
    // Pehle HTML ko inject karein
    injectChatbotHTML();
    
    // Ab sabhi elements ko select karein
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatLog = document.getElementById('chatbot-log');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send');
    const suggestions = document.getElementById('chatbot-suggestions');

    // Agar elements nahi mile, toh exit
    if (!chatbotToggle || !chatbotPopup || !chatbotClose || !chatLog || !inputField || !sendBtn) {
      console.error("Chatbot elements not found. Injection might have failed.");
      return;
    }

    // Toggle (Open/Close) logic
    chatbotToggle.addEventListener('click', () => {
      chatbotPopup.classList.toggle('open');
      chatbotToggle.style.opacity = '0';
      document.querySelector('header .actions')?.classList.add('hidden');
      document.getElementById('dashboardCardModal')?.classList.add('chatbot-is-open');
    });
    chatbotClose.addEventListener('click', () => {
      chatbotPopup.classList.remove('open');
      chatbotToggle.style.opacity = '1';
      document.querySelector('header .actions')?.classList.remove('hidden');
      document.getElementById('dashboardCardModal')?.classList.remove('chatbot-is-open');
    });

    // 
    // ***** YEH HAI NAYA/FIXED CODE *****
    //
    // Fullscreen (Expand/Compress) button logic
    const expandBtn = document.getElementById('chatbot-expand');
    const expandIcon = expandBtn ? expandBtn.querySelector('i') : null;
    
    if (expandBtn && expandIcon) {
      expandBtn.addEventListener('click', () => {
        // 'fullscreen' class ko popup par toggle karein
        chatbotPopup.classList.toggle('fullscreen');
        const isFullscreen = chatbotPopup.classList.contains('fullscreen');
        
        // Icon aur title badlein
        if (isFullscreen) {
          expandIcon.classList.remove('fa-expand');
          expandIcon.classList.add('fa-compress');
          expandBtn.setAttribute('title', 'Exit Fullscreen');
        } else {
          expandIcon.classList.remove('fa-compress');
          expandIcon.classList.add('fa-expand');
          expandBtn.setAttribute('title', 'Toggle Fullscreen');
        }
      });
    }
    // ***** END OF FIX *****
    //

    // Message bhejne ka function
    const sendMessage = () => {
      const text = inputField.value.trim();
      if (text === "") return;
      
      createMessageElement(text, 'user');
      inputField.value = "";
      
      setTimeout(botReply, 1000);
    };

    // Message element banane ka function
    const createMessageElement = (text, type) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${type}`;
      messageDiv.innerHTML = `<p>${text}</p>`;
      
      chatLog.appendChild(messageDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    };

    // Fake Bot Reply
    const botReply = () => {
      const reply = "I am a demo bot. I cannot process your request, but thank you for talking to me! Real AI integration is the next step.";
      createMessageElement(reply, 'bot');
    };
    
    // Send button aur Enter key se message bhejein
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
    
    // Suggestion chips par click
    suggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-chip')) {
        const text = e.target.textContent;
        inputField.value = text;
        sendMessage();
      }
    });
  } // <-- activateChatbot function yahaan khatm hota hai

  // 3. Poori Chatbot functionality ko run karein
  activateChatbot();

  // *** End of Section 18 ***

  // === 19. DYNAMIC CONTACT FORM ===
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  if (contactForm && formSuccessMessage) {
    contactForm.addEventListener('submit', (e) => {
      // 1. Page ko reload hone se rokein
      e.preventDefault();
      
      // (Asli application mein, yahaan data server ko bhejte hain)
      console.log("Form submitted. (Simulation)");
      
      // 2. Form ko hide karein
      contactForm.style.display = 'none';
      
      // 3. Success message ko dikhayein
      formSuccessMessage.style.display = 'block';
    });
  }
  // *** End of Section 19 ***

  // === 20. DASHBOARD STATS LOADER ===
  
  // Yeh function sirf dashboard page par chalega
  function loadDashboardStats() {
    // Check karein ki hum dashboard page par hain ya nahi
    const statsTotalEl = document.getElementById('stats-total');
    if (!statsTotalEl) {
      return; // Agar element nahi mila, toh dashboard page nahi hai, exit
    }
    
    // 1. Data ko localStorage se load karein
    const myWorkshops = JSON.parse(localStorage.getItem('myWorkshops')) || [];
    
    // 2. Counters banayein
    let total = myWorkshops.length;
    let completed = 0;
    let pendingPaid = 0;
    let pendingFree = 0;
    const now = new Date(); // Aaj ki date
    
    // 3. Data ko loop karke calculate karein
    myWorkshops.forEach(workshop => {
      const workshopDate = new Date(workshop.date);
      
      if (workshopDate < now) {
        // Workshop puraana ho gaya hai
        completed++;
      } else {
        // Workshop aane waala hai
        if (workshop.price.toLowerCase() === 'free') {
          pendingFree++;
        } else {
          pendingPaid++;
        }
      }
    });
    
    // 4. HTML ko numbers se update karein
    document.getElementById('stats-total').textContent = total;
    document.getElementById('stats-completed').textContent = completed;
    document.getElementById('stats-pending-paid').textContent = pendingPaid;
    document.getElementById('stats-pending-free').textContent = pendingFree;
  }
  
  // Function ko run karein
  loadDashboardStats();
  
  // *** End of Section 20 ***


}); // <-- End of DOMContentLoaded