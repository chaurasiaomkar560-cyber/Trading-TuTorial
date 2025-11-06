/* ===========================
   scripts.js — Trading Tutor
   =========================== */

/* === 20-SECOND REDIRECT ON HOME PAGE === */
// Check karein ki hum index page par hain
const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html');
// Note: Yeh feature user se hide nahi kiya jaa sakta, yeh client-side hai.
if (isHomePage) {
  setTimeout(() => {
    // 20 seconds ke baad, signup page par redirect kar dein
    window.location.href = 'signup.html';
  }, 20000); // 20,000 milliseconds = 20 seconds
}

/* === DOMCONTENTLOADED WRAPPER === */
// Baaki saara code iske andar chalega
document.addEventListener('DOMContentLoaded', () => {

  // === 1. HAMBURGER MENU TOGGLE (Dropdown Box Style) ===
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
  const strengthMeter = document.getElementById('password-strength-meter');
  const strengthText = strengthMeter ? strengthMeter.querySelector('.strength-text') : null;

  // 1. Password Show/Hide Toggle (Global)
  // Yeh code page par sabhi password toggle buttons ko dhoondhega
  const allPassToggleBtns = document.querySelectorAll('.password-toggle-btn');
  
  allPassToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Button ke paas waale input ko dhoondho
      const passWrapper = btn.closest('.password-wrapper');
      const passInputEl = passWrapper.querySelector('input');
      const icon = btn.querySelector('i');

      if (passInputEl && icon) {
        // Input type aur icon ko toggle karo
        if (passInputEl.type === 'password') {
          passInputEl.type = 'text';
          icon.classList.remove('fa-eye-slash');
          icon.classList.add('fa-eye');
        } else {
          passInputEl.type = 'password';
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

 // 3. Form Submit (Simulation & SAVE to localStorage)
  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // --- YEH NAYA LOGIC HAI ---
      // 1. Form se data lein
      const name = document.getElementById('signupName').value;
      const email = document.getElementById('signupEmail').value;
      
      // 2. Puraane users ko localStorage se load karein
      let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
      
      // 3. Naya user object banayein
      const newUser = {
        id: `u_${new Date().getTime()}`,
        name: name,
        email: email,
        role: 'Learner', // Default role
        status: 'Active'  // Default status
      };
      
      // 4. Naye user ko list mein add karein
      allUsers.push(newUser);
      
      // 5. Poori list ko waapas save karein
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      // --- END OF NAYA LOGIC ---
      
      alert('Account created successfully! (Saved to LocalStorage)');
      signupForm.reset();
      if(strengthMeter) strengthMeter.dataset.strength = '';
      if(strengthText) strengthText.textContent = '';
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

  // === 7. DASHBOARD CARD MODAL (FIXED - Ab Sahi Content Dikhayega) ===
  
  const dashboardCardModal = document.getElementById('dashboardCardModal');
  const cardModalCloseBtn = document.getElementById('cardModalCloseBtn');
  const allAccordionHeaders = document.querySelectorAll('.accordion-card .card-header');
  
  if (dashboardCardModal && cardModalCloseBtn && allAccordionHeaders.length > 0) {
    
    // 1. Click to Open Modal
    allAccordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const card = header.closest('.accordion-card');
        
        // --- YEH HAI CORRECT LOGIC ---
        // Card se data nikalein
        const title = card.querySelector('h3').textContent;
        const imageSrc = card.querySelector('.card-image').src;
        // '.card-content' ke andar ka poora HTML (headings, lists, table sab) lein
        const richContent = card.querySelector('.card-content').innerHTML; 
        
        // Modal mein data daalein
        document.getElementById('cardModalTitle').textContent = title;
        document.getElementById('cardModalImage').src = imageSrc;
        // Poora HTML content modal mein daalein
        document.getElementById('cardModalContent').innerHTML = richContent; 
        
        // Modal dikhayein
        dashboardCardModal.classList.add('open');
      });
    });
    
    // 2. Click to Close Modal
    cardModalCloseBtn.addEventListener('click', () => {
      dashboardCardModal.classList.remove('open');
      dashboardCardModal.classList.remove('chatbot-is-open'); 
    });
  }
  // *** End of Section 7 (Fixed) ***

  // === 8. BLOG FORM SUBMISSION (Updated to fetch User) ===
  const blogForm = document.getElementById('blogForm');
  const blogList = document.getElementById('blogList');

  if (blogForm && blogList) {
    blogForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('blogTitle').value;
      const fullContent = document.getElementById('blogContent').value;
      let imageUrl = document.getElementById('blogImage').value;
      
      let snippet = fullContent.substring(0, 100);
      if (fullContent.length > 100) {
        snippet += "... (click read more)";
      }
      if (imageUrl === '') {
        const randomSeed = Math.floor(Math.random() * 1000);
        imageUrl = `https://picsum.photos/seed/${randomSeed}/400/200`;
      }
      
      // --- YEH NAYA LOGIC HAI ---
      // 1. "Logged in" user ko localStorage se lein
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      let authorName = 'Anonymous';
      let authorSeed = 'default'; // Profile pic ke liye
      
      if (currentUser && currentUser.name) {
        authorName = currentUser.name;
        authorSeed = currentUser.email; // Email se unique profile pic banayega
      }
      
      // 2. Naya blog object banayein
      const newBlog = {
        id: `b_${new Date().getTime()}`,
        title: title,
        author: authorName,
        authorSeed: authorSeed,
        date: new Date().toISOString(), // Save as ISO string
        content: fullContent,
        snippet: snippet,
        imageUrl: imageUrl
      };
      
      // 3. Blog ko "allBlogs" list mein save karein (Admin panel ke liye)
      let allBlogs = JSON.parse(localStorage.getItem('allBlogs')) || [];
      allBlogs.push(newBlog);
      localStorage.setItem('allBlogs', JSON.stringify(allBlogs));
      // --- END OF NAYA LOGIC ---

      // Naya blog card banane ke liye HTML
      const newPost = document.createElement('div');
      newPost.className = 'card blog-card';
      newPost.innerHTML = `
        <img src="${newBlog.imageUrl}" class="blog-thumb" alt="Blog Image">
        <div class="blog-content">
          <h3 class="blog-card-title">${newBlog.title}</h3>
          <p class="blog-card-snippet">${newBlog.snippet}</p>
          <p class="blog-card-full-content" style="display: none;">${newBlog.content}</p>
          
          <div class="author-info">
            <img src="https://picsum.photos/seed/${newBlog.authorSeed}/40/40" alt="Author">
            <div>
              <span class="author-name">${newBlog.author}</span>
              <span class="post-date muted">Just now</span>
            </div>
          </div>
          
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
      blogList.prepend(newPost);
      blogForm.reset();
    });
  }
  // *** End of Section 8 ***
  
  // === 9. BLOG MODAL (POPUP) LOGIC ===
  const blogModal = document.getElementById('blogModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCommentList = document.getElementById('modalCommentList');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalFullContent = document.getElementById('modalFullContent');

  if (blogList && blogModal && modalCloseBtn) {
    blogList.addEventListener('click', (e) => {
      if (e.target.classList.contains('read-more-btn')) {
        e.preventDefault();
        const card = e.target.closest('.blog-card');
        const title = card.querySelector('.blog-card-title').textContent;
        const fullContent = card.querySelector('.blog-card-full-content').textContent;
        const imageSrc = card.querySelector('.blog-thumb').src;
        
        modalTitle.textContent = title;
        modalFullContent.textContent = fullContent;
        modalImage.src = imageSrc;
        
        blogModal.classList.add('open');
      }
    });
    
    const closeModal = () => {
      blogModal.classList.remove('open');
      if(modalCommentList) modalCommentList.innerHTML = ""; // Comments ko clear kar dein
    };
    
    modalCloseBtn.addEventListener('click', closeModal);
    blogModal.addEventListener('click', (e) => {
      if (e.target.id === 'blogModal') {
        closeModal();
      }
    });
  }
  // *** End of Section 9 ***

  // === 10. EDIT & DELETE LOGIC ===
  if (blogList) {
    blogList.addEventListener('click', (e) => {
      // --- DELETE BUTTON LOGIC ---
      if (e.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this post?')) {
          const card = e.target.closest('.blog-card');
          card.remove();
          // Note: This does not remove it from localStorage. A full fix would require finding the blog by ID.
        }
      }
      
      // --- EDIT BUTTON LOGIC ---
      if (e.target.classList.contains('edit-btn')) {
        const card = e.target.closest('.blog-card');
        const title = card.querySelector('.blog-card-title').textContent;
        const fullContent = card.querySelector('.blog-card-full-content').textContent;
        const imageUrl = card.querySelector('.blog-thumb').src;
        
        document.getElementById('blogTitle').value = title;
        document.getElementById('blogContent').value = fullContent;
        document.getElementById('blogImage').value = imageUrl;
        
        card.remove();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.getElementById('blogTitle').focus();
        // Note: This does not update it in localStorage.
      }
    });
  }
  // *** End of Section 10 ***

  // === 11. COMMENT SUBMISSION LOGIC ===
  const commentForm = document.getElementById('modalCommentForm');
  
  if (commentForm && modalCommentList) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('commentName');
      const commentInput = document.getElementById('commentText');
      const name = nameInput.value;
      const commentText = commentInput.value;
      
      const newComment = document.createElement('div');
      newComment.className = 'comment';
      newComment.innerHTML = `
        <p class="comment-body">${commentText}</p>
        <p class="comment-meta">by <strong>${name}</strong> on ${new Date().toLocaleDateString('en-IN')}</p>
      `;
      modalCommentList.prepend(newComment);
      commentForm.reset();
    });
  }
  // *** End of Section 11 ***

  // === 12. LIKE BUTTON LOGIC ===
  document.body.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
      likeBtn.classList.toggle('liked');
      const countSpan = likeBtn.querySelector('span');
      if (!countSpan) return;
      
      let currentLikes;
      if (likeBtn.classList.contains('liked')) {
        if (countSpan.textContent.includes('Like')) {
          currentLikes = parseInt(countSpan.textContent.match(/\d+/)[0]);
          countSpan.textContent = `Like (${currentLikes + 1})`;
        } else {
          currentLikes = parseInt(countSpan.textContent);
          countSpan.textContent = currentLikes + 1;
        }
        likeBtn.querySelector('i').classList.remove('fa-regular');
        likeBtn.querySelector('i').classList.add('fa-solid');
      } else {
        if (countSpan.textContent.includes('Like')) {
          currentLikes = parseInt(countSpan.textContent.match(/\d+/)[0]);
          countSpan.textContent = `Like (${currentLikes - 1})`;
        } else {
          currentLikes = parseInt(countSpan.textContent);
          countSpan.textContent = currentLikes - 1;
        }
        likeBtn.querySelector('i').classList.remove('fa-solid');
        likeBtn.querySelector('i').classList.add('fa-regular');
      }
    }
  });
  // *** End of Section 12 ***

  // === 13. REAL-TIME BLOG SEARCH ===
  const searchInput = document.getElementById('blogSearchInput');
  if (searchInput && blogList) {
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const allCards = blogList.querySelectorAll('.blog-card');
      
      allCards.forEach(card => {
        const title = card.querySelector('.blog-card-title').textContent.toLowerCase();
        const snippet = card.querySelector('.blog-card-snippet').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || snippet.includes(searchTerm)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
  // *** End of Section 13 ***

  // === NEW SECTION 13.A: LOAD PERSISTENT BLOGS (FIXED) ===
  const blogListOnLoad = document.getElementById('blogList');
  if (blogListOnLoad) {
      const allBlogs = JSON.parse(localStorage.getItem('allBlogs')) || [];
      
      // **** YEH HAI AAPKA FIX (BLOGS) ****
      // Page load par, pehle se likhe (hardcoded) blogs ko hata dein
      // Taaki sirf saved blogs hi dikhein.
      blogListOnLoad.innerHTML = '';
      // **********************************

      // Ab, localStorage se blogs load karein
      allBlogs.slice().reverse().forEach(blog => {
          const newPost = document.createElement('div');
          newPost.className = 'card blog-card';
          // Section 8 (submit logic) mein use kiye gaye template ka istemal karein
          newPost.innerHTML = `
            <img src="${blog.imageUrl}" class="blog-thumb" alt="Blog Image">
            <div class="blog-content">
              <h3 class="blog-card-title">${blog.title}</h3>
              <p class="blog-card-snippet">${blog.snippet}</p>
              <p class="blog-card-full-content" style="display: none;">${blog.content}</p>
              <div class="author-info">
                <img src="https://picsum.photos/seed/${blog.authorSeed}/40/40" alt="Author">
                <div>
                  <span class="author-name">${blog.author}</span>
                  <span class="post-date muted">${new Date(blog.date).toLocaleDateString('en-IN')}</span> 
                </div>
              </div>
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
          blogListOnLoad.prepend(newPost); // Naye blogs ko list mein sabse upar add karein
      });
  }
  // *** End of New Section 13.A ***


  // === FUNCTION DEFINITION MOVED ===
  // Is function ko Section 14 se pehle define karna zaroori hai
  function loadDashboardStats() {
    const statsTotalEl = document.getElementById('stats-total');
    if (!statsTotalEl) return;
    
    const myWorkshops = JSON.parse(localStorage.getItem('myWorkshops')) || [];
    const now = new Date();
    
    let total = myWorkshops.length;
    let completed = 0;
    let pendingPaid = 0;
    let pendingFree = 0;
    
    myWorkshops.forEach(workshop => {
      const workshopDateStr = workshop.date || '1970-01-01T00:00:00';
      const workshopDate = new Date(workshopDateStr.split('•')[0].trim());

      if (workshopDate < now) {
        completed++;
      } else {
        if (workshop.price && workshop.price.toLowerCase() === 'free') pendingFree++;
        else pendingPaid++;
      }
    });
    
    statsTotalEl.textContent = total;
    document.getElementById('stats-completed').textContent = completed;
    document.getElementById('stats-pending-paid').textContent = pendingPaid;
    document.getElementById('stats-pending-free').textContent = pendingFree;
  }

  // === 14. WORKSHOP REGISTRATION MODAL (Multi-Step) (MODIFIED) ===
  const workshopModal = document.getElementById('workshopModal');
  const workshopCloseBtn = document.getElementById('workshopCloseBtn');
  const buyerRegForm = document.getElementById('buyerRegForm');
  const workshopGrid = document.querySelector('.workshop-grid'); // Yeh global 'workshopGrid' hai
  
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
    
    // === YEH LOGIC UPDATE KIYA GAYA HAI ===
    paymentBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        let myWorkshops = JSON.parse(localStorage.getItem('myWorkshops')) || [];
        
        // Form se buyer ka data collect karein (naye form ke hisab se)
        const buyerName = document.getElementById('buyerName').value;
        const buyerEmail = document.getElementById('buyerEmail').value;
        const buyerMobile = document.getElementById('buyerMobile').value;

        // Workshop data aur buyer data ko merge karein
        const workshopToSave = {
          ...currentWorkshopData, // Isme title, price, hostName, date hai
          buyerName: buyerName,
          buyerEmail: buyerEmail,
          buyerMobile: buyerMobile
        };

        myWorkshops.push(workshopToSave); // Pura object save karein
        localStorage.setItem('myWorkshops', JSON.stringify(myWorkshops));
        
        document.getElementById('successWorkshopName').textContent = currentWorkshopData.title;
        
        buyerStep2.classList.remove('active');
        buyerStep3.classList.add('active');
        
        // Dashboard stats update karein (function ab defined hai)
        loadDashboardStats();
      });
    });
    // === END OF UPDATE ===

    const closeWorkshopModal = () => {
      workshopModal.classList.remove('open');
      buyerRegForm.reset(); // Yeh naye form ko bhi reset kar dega
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

  // === NEW SECTION 14.A: LOAD PERSISTENT WORKSHOPS (FIXED) ===
  // Note: 'workshopGrid' variable Section 14 mein pehle hi define ho chuka hai.
  if (workshopGrid) { // Check karein ki hum workshop page par hain
      const pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
      
      // **** YEH HAI AAPKA FIX (WORKSHOPS) ****
      // Page load par, pehle se likhe (hardcoded) workshops ko hata dein
      // Taaki sirf saved workshops hi dikhein.
      workshopGrid.innerHTML = '';
      // **************************************

      // Ab, localStorage se workshops load karein
      pendingWorkshops.slice().reverse().forEach(workshop => {
          const newWorkshop = document.createElement('div');
          newWorkshop.className = 'card workshop-card';
          
          let priceBadge = '';
          if (workshop.price === '0' || workshop.price === '') {
              priceBadge = '<div class="workshop-badge free">FREE</div>';
          } else {
              priceBadge = `<div class="workshop-badge price">$${workshop.price}</div>`;
          }
          
          const randomSeed = Math.floor(Math.random() * 1000);
          const imageUrl = `https://picsum.photos/seed/ws${randomSeed}/400/200`;

          // Section 15 (submit logic) mein use kiye gaye template ka istemal karein
          newWorkshop.innerHTML = `
            ${priceBadge}
            <img src="${imageUrl}" class="workshop-thumb" alt="Workshop Image" />
            <div class="workshop-content">
              <div class="workshop-meta" data-date="${workshop.date}">
                <div class="countdown-timer">
                  <span>--d</span> : <span>--h</span> : <span>--m</span> : <span>--s</span>
                </div>
                <span class="workshop-duration">
                  <i class="fa-regular fa-clock"></i> ${workshop.duration}
                </span>
              </div>
              <h3>${workshop.title}</h3>
              <p>${workshop.description}</p>
              <button class="btn btn-primary register-btn" style="width: 100%">
                Register Now
              </button>
            </div>
          `;
          workshopGrid.prepend(newWorkshop); // Naye workshop ko grid mein sabse upar add karein
      });
  }
  // *** End of New Section 14.A ***


// === 15. HOST A WORKSHOP MODAL (MODIFIED) ===
  const showHostModalBtn = document.getElementById('showHostModalBtn');
  const hostModal = document.getElementById('hostModal');
  const hostCloseBtn = document.getElementById('hostCloseBtn');
  const hostWorkshopForm = document.getElementById('hostWorkshopForm');
  
  if (showHostModalBtn && hostModal && hostCloseBtn && hostWorkshopForm) {
    
    // Sabhi steps ko select karein
    const hostSteps = document.querySelectorAll('#hostModal .modal-step');
    const stepIndicators = document.querySelectorAll('#hostModal .step-indicator');
    const hostProgressBar = document.getElementById('host-progress-bar');
    const hostSuccessStep = document.getElementById('host-step-success');
    const hostDoneBtn = document.getElementById('hostDoneBtn');
    
    // Step 1 buttons
    const hostNextBtn1 = document.getElementById('hostNextBtn1');
    
    // Step 2 buttons
    const hostBackBtn1 = document.getElementById('hostBackBtn1');
    const hostNextBtn2 = document.getElementById('hostNextBtn2');
    
    // Step 3 buttons
    const hostBackBtn2 = document.getElementById('hostBackBtn2');
    const hostTerms = document.getElementById('hostTerms');
    const hostSubmitBtn = document.getElementById('hostSubmitBtn');

    // Helper function
    function goToHostStep(stepNumber) {
      hostSteps.forEach((step, index) => {
        // (index + 1) step number hai (e.g., 0+1=1, 1+1=2)
        // Success step ka index 3 hai, par woh is logic mein nahi aata
        if (step.id === `host-step-${stepNumber}`) {
          step.classList.add('active');
        } else {
          step.classList.remove('active');
        }
      });
      stepIndicators.forEach((indicator, index) => {
        // Step indicator text ko bhi update kar dein
        if (index === 1) indicator.textContent = "2. Workshop & Company";
        indicator.classList.toggle('active', (index + 1) === stepNumber);
      });
    }

    // 1. "Host a Workshop" button par click
    showHostModalBtn.addEventListener('click', () => hostModal.classList.add('open'));

    // 2. Step 1 -> Step 2
    hostNextBtn1.addEventListener('click', () => {
      const hostName = document.getElementById('hostName').value;
      const hostEmail = document.getElementById('hostEmail').value;
      if (hostName === '' || hostEmail === '') {
        alert('Please fill in your name and email to proceed.');
        return;
      }
      goToHostStep(2);
    });

    // 3. Step 2 -> Step 1
    hostBackBtn1.addEventListener('click', () => goToHostStep(1));
    
    // 4. Step 2 -> Step 3
    hostNextBtn2.addEventListener('click', () => {
      if (document.getElementById('hostTitle').value === '' || document.getElementById('hostDate').value === '') {
        alert('Please fill in at least the workshop title and date.');
        return;
      }
      goToHostStep(3);
    });

    // 5. Step 3 -> Step 2
    hostBackBtn2.addEventListener('click', () => goToHostStep(2));
    
    // 6. Checkbox to enable submit
    hostTerms.addEventListener('change', () => {
      hostSubmitBtn.disabled = !hostTerms.checked;
    });

    // 7. Modal band karne ka function
    const closeHostModal = () => {
      hostModal.classList.remove('open');
      setTimeout(() => {
        hostWorkshopForm.reset();
        goToHostStep(1); // Pehle step par reset karein
        hostTerms.checked = false;
        hostSubmitBtn.disabled = true;
        // Form aur success message ko reset karein
        hostWorkshopForm.style.display = 'block';
        hostProgressBar.style.display = 'grid'; // 'flex' ki jagah 'grid' (jaisa CSS mein hai)
        hostSuccessStep.classList.remove('active');
      }, 500);
    };
    
    hostCloseBtn.addEventListener('click', closeHostModal); // Close (x) button
    hostDoneBtn.addEventListener('click', closeHostModal); // Success "Done" button
    hostModal.addEventListener('click', (e) => {
      if (e.target.id === 'hostModal') closeHostModal();
    });

    // 8. FINAL Form Submit Logic (Page 3 se) (MODIFIED)
    hostWorkshopForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // --- YEH HAI NAYA LOGIC ---

      // 1. Data collect karein (Hoster + Workshop Details se)
      const hostName = document.getElementById('hostName').value;
      const title = document.getElementById('hostTitle').value;
      const description = document.getElementById('hostDescription').value;
      const price = document.getElementById('hostPrice').value;
      const duration = document.getElementById('hostDuration').value;
      const dateISO = document.getElementById('hostDate').value; // Format: 'YYYY-MM-DDTHH:mm'

      // 2. Data save karein (LocalStorage mein)
      let pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
      const newWorkshopData = { 
          host: hostName,
          title: title,
          description: description,
          price: price,
          duration: duration,
          date: dateISO,
          // ... (baaki saare form fields bhi yahaan add kar sakte hain)
      };
      pendingWorkshops.push(newWorkshopData);
      localStorage.setItem('pendingWorkshops', JSON.stringify(pendingWorkshops));

      // 3. Naya card UI par banayein
      const newWorkshop = document.createElement('div');
      newWorkshop.className = 'card workshop-card';
      
      // Price Badge logic
      let priceBadge = '';
      if (price === '0' || price === '') {
        priceBadge = '<div class="workshop-badge free">FREE</div>';
      } else {
        priceBadge = `<div class="workshop-badge price">$${price}</div>`;
      }
      
      // Random placeholder image
      const randomSeed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://picsum.photos/seed/ws${randomSeed}/400/200`;

      // Card ka poora HTML structure
      newWorkshop.innerHTML = `
        ${priceBadge}
        <img src="${imageUrl}" class="workshop-thumb" alt="Workshop Image" />
        <div class="workshop-content">
          <div class="workshop-meta" data-date="${dateISO}">
            <div class="countdown-timer">
              <span>--d</span> : <span>--h</span> : <span>--m</span> : <span>--s</span>
            </div>
            <span class="workshop-duration">
              <i class="fa-regular fa-clock"></i> ${duration}
            </span>
          </div>
          <h3>${title}</h3>
          <p>${description}</p>
          <button class="btn btn-primary register-btn" style="width: 100%">
            Register Now
          </button>
        </div>
      `;
      
      // 4. Card ko grid mein sabse aage add karein
      // (Global 'workshopGrid' variable Section 14 se use ho raha hai)
      if (workshopGrid) {
        workshopGrid.prepend(newWorkshop);
      }
      
      // 5. Naye card ke liye countdown timer start karein
      startWorkshopCountdowns(); 
      
      // 6. Form ko hide karein aur Success message dikhayein
      alert("✅ Your workshop has been submitted for review. We'll email you once it’s approved!");
      hostWorkshopForm.style.display = 'none';
      hostProgressBar.style.display = 'none';
      hostSuccessStep.classList.add('active');

      // --- END OF NAYA LOGIC ---
    });
  }
  // *** End of Section 15 ***
  
  // === 16. WORKSHOP COUNTDOWN TIMERS ===
  function startWorkshopCountdowns() {
    const allWorkshopMeta = document.querySelectorAll('.workshop-meta[data-date]');
    allWorkshopMeta.forEach(meta => {
      const countdownElement = meta.querySelector('.countdown-timer');
      if (!countdownElement) return;
      
      // Agar timer pehle se chal raha hai, toh use reset karein
      if (meta.dataset.intervalId) {
        clearInterval(parseInt(meta.dataset.intervalId));
      }

      const targetDateStr = meta.dataset.date;
      let targetDate;
      
      if (targetDateStr.includes('T')) {
         targetDate = new Date(targetDateStr).getTime(); // ISO Format (YYYY-MM-DDTHH:MM)
      } else {
         // Fallback (agar T na ho)
         targetDate = new Date(targetDateStr.split('•')[0].trim()).getTime();
      }

      if (isNaN(targetDate)) {
          countdownElement.innerHTML = "Invalid Date";
          countdownElement.classList.add('expired');
          return;
      }
      
      const updateTimer = () => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
          clearInterval(interval);
          countdownElement.innerHTML = "Workshop Expired";
          countdownElement.classList.add('expired');
          meta.closest('.workshop-card')?.classList.add('is-sold-out'); // Expired ko bhi sold-out jaisa dikhayein
          return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        const pad = (num) => num.toString().padStart(2, '0');
        
        countdownElement.innerHTML = `
          <span>${days}d</span> : <span>${pad(hours)}h</span> : <span>${pad(minutes)}m</span> : <span>${pad(seconds)}s</span>
        `;
      };
      
      updateTimer(); // Fauran run karein taaki '--d' na dikhe
      const interval = setInterval(updateTimer, 1000);
      meta.dataset.intervalId = interval; // Interval ID save karein taaki clear ho sake
    });
  }
  // YEH FUNCTION AB PAGE LOAD PAR CHALEGA (NAYE ADD KIYE GAYE CARDS KE LIYE BHI)
  startWorkshopCountdowns();
  // *** End of Section 16 ***

  // === 17. WORKSHOP SEARCH & FILTER ===
  const workshopSearchInput = document.getElementById('workshopSearchInput');
  const workshopFilter = document.getElementById('workshopFilter');
  
  function filterWorkshops() {
    if (!workshopSearchInput || !workshopFilter || !workshopGrid) return;
    const searchTerm = workshopSearchInput.value.toLowerCase();
    const filterValue = workshopFilter.value;
    const allCards = workshopGrid.querySelectorAll('.workshop-card');
    
    allCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('p').textContent.toLowerCase();
      const textMatch = title.includes(searchTerm) || description.includes(searchTerm);
      
      let filterMatch = false;
      const isSoldOut = card.classList.contains('is-sold-out'); // CSS se sold-out
      const isExpired = card.querySelector('.countdown-timer.expired'); // JS se expired
      
      if (filterValue === 'all') filterMatch = true;
      else if (filterValue === 'available') filterMatch = !isSoldOut && !isExpired;
      else if (filterValue === 'expired') filterMatch = isSoldOut || isExpired;
      
      if (textMatch && filterMatch) card.style.display = 'flex';
      else card.style.display = 'none';
    });
  }
  if (workshopSearchInput && workshopFilter && workshopGrid) {
    workshopSearchInput.addEventListener('input', filterWorkshops);
    workshopFilter.addEventListener('change', filterWorkshops);
  }
  // *** End of Section 17 ***

  // === 18. GLOBAL CHATBOT INJECTOR & LOGIC ===
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
                  <p>Hi there! How can I help you today?</p>
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
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
  }
  
  function activateChatbot() {
    injectChatbotHTML();
    
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotPopup = document.getElementById('chatbot-popup');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatLog = document.getElementById('chatbot-log');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send');
    const suggestions = document.getElementById('chatbot-suggestions');
    const expandBtn = document.getElementById('chatbot-expand');
    const expandIcon = expandBtn ? expandBtn.querySelector('i') : null;

    if (!chatbotToggle || !chatbotPopup || !chatbotClose || !chatLog || !inputField || !sendBtn) {
      console.error("Chatbot elements not found.");
      return;
    }

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
      // Agar fullscreen hai, toh use bhi remove karein
      if (chatbotPopup.classList.contains('fullscreen')) {
        chatbotPopup.classList.remove('fullscreen');
        expandIcon.classList.remove('fa-compress');
        expandIcon.classList.add('fa-expand');
        expandBtn.setAttribute('title', 'Toggle Fullscreen');
      }
    });

    if (expandBtn && expandIcon) {
      expandBtn.addEventListener('click', () => {
        chatbotPopup.classList.toggle('fullscreen');
        const isFullscreen = chatbotPopup.classList.contains('fullscreen');
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

    const sendMessage = () => {
      const text = inputField.value.trim();
      if (text === "") return;
      createMessageElement(text, 'user');
      inputField.value = "";
      setTimeout(botReply, 1000);
    };

    const createMessageElement = (text, type) => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${type}`;
      messageDiv.innerHTML = `<p>${text}</p>`;
      chatLog.appendChild(messageDiv);
      chatLog.scrollTop = chatLog.scrollHeight;
    };

    const botReply = () => {
      const reply = "I am a demo bot. I cannot process your request, but thank you for talking to me! Real AI integration is the next step.";
      createMessageElement(reply, 'bot');
    };
    
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
    
    suggestions.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-chip')) {
        inputField.value = e.target.textContent;
        sendMessage();
      }
    });
  }
  activateChatbot();
  // *** End of Section 18 ***

  // === 19. DYNAMIC CONTACT FORM ===
  const contactForm = document.getElementById('contactForm');
  const formSuccessMessage = document.getElementById('formSuccessMessage');

  if (contactForm && formSuccessMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log("Form submitted. (Simulation)");
      contactForm.style.display = 'none';
      formSuccessMessage.style.display = 'block';
    });
  }
  // *** End of Section 19 ***

  // === 20. DASHBOARD STATS & "MY WORKSHOPS" MODAL ===
  const myWorkshopsModal = document.getElementById('myWorkshopsModal');
  const myWorkshopsCloseBtn = document.getElementById('myWorkshopsCloseBtn');
  const myWorkshopsList = document.getElementById('my-workshops-list');
  const statsGrid = document.querySelector('.stats-grid');
  const filterBtnGroup = document.querySelector('.filter-btn-group');

  // --- 1. Stats Cards ko Load Karne ka Function ---
  // Iski definition upar move kar di gayi hai (Section 14 se pehle)
  
  // --- 2. "My Workshops" List ko Populate Karne ka Function ---
  function populateMyWorkshopsList(filter = 'all') {
    if (!myWorkshopsList) return;
    
    const myWorkshops = JSON.parse(localStorage.getItem('myWorkshops')) || [];
    const now = new Date();
    myWorkshopsList.innerHTML = "";
    
    filterBtnGroup.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    
    let filteredWorkshops = myWorkshops;
    if (filter === 'completed') {
      filteredWorkshops = myWorkshops.filter(ws => new Date((ws.date || '1970-01-01').split('•')[0].trim()) < now);
    } else if (filter === 'pending') {
      filteredWorkshops = myWorkshops.filter(ws => new Date((ws.date || '1970-01-01').split('•')[0].trim()) >= now);
    }
    
    if (filteredWorkshops.length === 0) {
      myWorkshopsList.innerHTML = `<p class="muted" style="text-align: center;">No workshops found for this filter.</p>`;
      return;
    }
    
    filteredWorkshops.forEach(ws => {
      const workshopDateStr = ws.date || '1970-01-01T00:00:00';
      const workshopDate = new Date(workshopDateStr.split('•')[0].trim());
      const isCompleted = workshopDate < now;
      const statusClass = isCompleted ? 'completed' : 'pending';
      
      const item = document.createElement('div');
      item.className = `workshop-list-item ${statusClass}`;
      item.innerHTML = `
        <h4>${ws.title}</h4>
        <span class="date">${workshopDate.toLocaleDateString('en-IN')}</span>
        <span class="price">${ws.price}</span>
        <span class="status-badge ${statusClass}">${isCompleted ? 'Completed' : 'Pending'}</span>
      `;
      myWorkshopsList.appendChild(item);
    });
  }

  // --- 3. Event Listeners ---
  if (statsGrid && myWorkshopsModal) {
    statsGrid.addEventListener('click', (e) => {
      e.preventDefault();
      const card = e.target.closest('.stats-card');
      if (!card) return;
      
      const filter = card.dataset.filter;
      let listFilter = 'all';
      if (filter === 'completed') listFilter = 'completed';
      if (filter.includes('pending')) listFilter = 'pending';
      
      populateMyWorkshopsList(listFilter);
      myWorkshopsModal.classList.add('open');
    });
    
    filterBtnGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      populateMyWorkshopsList(btn.dataset.filter);
    });
    
    myWorkshopsCloseBtn.addEventListener('click', () => {
      myWorkshopsModal.classList.remove('open');
    });
    myWorkshopsModal.addEventListener('click', (e) => {
      if (e.target.id === 'myWorkshopsModal') {
        myWorkshopsModal.classList.remove('open');
      }
    });
  }
  
  // Page load par stats ko run karein
  loadDashboardStats();
  
  // *** End of Section 20 ***

  // === 21. LIVE WEBINAR PAGE LOGIC (UPGRADED) ===
  const micBtn = document.getElementById('mic-btn');
  const videoBtn = document.getElementById('video-btn');
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const leaveBtn = document.getElementById('leave-btn');
  const sidebar = document.getElementById('webinar-sidebar');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarTabs = document.querySelector('.sidebar-tabs');
  const sidebarPanels = document.querySelectorAll('.sidebar-panel');
  const webinarChatLog = document.getElementById('webinar-chat-log');
  const chatInput = document.getElementById('chat-input');
  const chatSendBtn = document.getElementById('chat-send-btn');

  if (micBtn && sidebarTabs && chatInput) {
    
    micBtn.addEventListener('click', () => {
      micBtn.classList.toggle('active');
      micBtn.classList.toggle('mic-off');
      const icon = micBtn.querySelector('i');
      if (icon.classList.contains('fa-microphone')) {
        icon.classList.remove('fa-microphone');
        icon.classList.add('fa-microphone-slash');
        micBtn.setAttribute('title', 'Unmute Microphone');
      } else {
        icon.classList.remove('fa-microphone-slash');
        icon.classList.add('fa-microphone');
        micBtn.setAttribute('title', 'Mute Microphone');
      }
    });

    videoBtn.addEventListener('click', () => {
      videoBtn.classList.toggle('active');
      const icon = videoBtn.querySelector('i');
      if (icon.classList.contains('fa-video')) {
        icon.classList.remove('fa-video');
        icon.classList.add('fa-video-slash');
        videoBtn.setAttribute('title', 'Start Camera');
      } else {
        icon.classList.remove('fa-video-slash');
        icon.classList.add('fa-video');
        videoBtn.setAttribute('title', 'Stop Camera');
      }
    });

    leaveBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to leave the workshop?')) {
        window.location.href = 'workshop.html';
      }
    });

    chatToggleBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
    sidebarCloseBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });

    sidebarTabs.addEventListener('click', (e) => {
      const tabBtn = e.target.closest('.sidebar-tab-btn');
      if (!tabBtn) return;
      const targetPanelId = tabBtn.dataset.target;
      document.querySelectorAll('.sidebar-tab-btn').forEach(btn => btn.classList.remove('active'));
      tabBtn.classList.add('active');
      sidebarPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === targetPanelId);
      });
    });

    const timeEl = document.getElementById('current-time');
    if (timeEl) {
      setInterval(() => {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      }, 1000);
    }
    
    const sendChatMessage = () => {
      const text = chatInput.value.trim();
      if (text === "") return;
      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'chat-message user';
      messageDiv.innerHTML = `<p>${text}</p>`;
      webinarChatLog.appendChild(messageDiv);
      webinarChatLog.scrollTop = webinarChatLog.scrollHeight;
      chatInput.value = "";
      
      setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'chat-message bot';
        botMessage.innerHTML = `<p>Thanks for your message! (This is a simulation)</p>`;
        webinarChatLog.appendChild(botMessage);
        webinarChatLog.scrollTop = webinarChatLog.scrollHeight;
      }, 1000);
    };
    
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        sendChatMessage();
      }
    });
  }
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

  // === 23. BLOG FILTER ICON (Placeholder) ===
  const blogFilterBtn = document.querySelector('#blogSearchInput + .filter-icon-btn');
  
  if (blogFilterBtn) {
    blogFilterBtn.addEventListener('click', () => {
      alert('Blog filters (by category, date, etc.) are coming soon!');
    });
  }
  // *** End of Section 23 ***

}); // <-- End of DOMContentLoaded