// /* ===========================
//    ADMIN.JS (Logic for Admin Panel)
//    =========================== */

// document.addEventListener('DOMContentLoaded', () => {
  
//   // === THEME TOGGLE LOGIC (Copied from main scripts.js) ===
//   const themeBtn = document.getElementById('theme-btn');
//   const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
//   const htmlElement = document.documentElement; // <html> tag

//   if (themeBtn && themeIcon) {
//     const setTheme = (theme) => {
//       if (theme === 'dark') {
//         htmlElement.setAttribute('data-theme', 'dark');
//         themeIcon.classList.remove('fa-moon');
//         themeIcon.classList.add('fa-sun');
//         localStorage.setItem('theme', 'dark');
//       } else {
//         htmlElement.setAttribute('data-theme', 'light');
//         themeIcon.classList.remove('fa-sun');
//         themeIcon.classList.add('fa-moon');
//         localStorage.setItem('theme', 'light');
//       }
//     };
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (savedTheme) {
//       setTheme(savedTheme);
//     } else if (prefersDark) {
//       setTheme('dark');
//     } else {
//       setTheme('light');
//     }
//     themeBtn.addEventListener('click', () => {
//       const currentTheme = htmlElement.getAttribute('data-theme');
//       if (currentTheme === 'dark') {
//         setTheme('light');
//       } else {
//         setTheme('dark');
//       }
//     });
//   }
//   // === END OF THEME LOGIC ===

//   // --- ADMIN LOGIN PAGE LOGIC ---
//   const loginForm = document.getElementById('adminLoginForm');
//   if (loginForm) {
//     loginForm.addEventListener('submit', handleAdminLogin);
//   }
  
//   // --- ADMIN DASHBOARD PAGE LOGIC ---
//   const adminContent = document.getElementById('admin-content');
//   if (adminContent) {
//     // 1. Authorization Check (Backend se)
//     checkAdminAuth();
    
//     // 2. Data Load Karein
//     loadAdminData();
    
//     // 3. Event Listeners (Approve/Deny/Tabs)
//     setupEventListeners();
//   }
  
// }); // <-- END OF DOMCONTENTLOADED

// /*
//  * =================================
//  * LOGIN PAGE FUNCTIONS
//  * =================================
//  */
// async function handleAdminLogin(e) {
//   e.preventDefault();
//   const email = document.getElementById('adminEmail').value;
//   const password = document.getElementById('adminPassword').value;
//   const errorEl = document.getElementById('adminLoginError');
//   errorEl.textContent = "";

//   // TODO (Backend Developer):
//   try {
//     console.log("TODO: Sending login request to backend...", { email, password });
//     if (email === "admin@test.com") {
//       alert("Login Simulation Successful! Redirecting...");
//       window.location.href = 'admin.html';
//     } else {
//       throw new Error('Invalid credentials');
//     }
//   } catch (err) {
//     errorEl.textContent = err.message;
//   }
// }

// /*
//  * =================================
//  * DASHBOARD PAGE FUNCTIONS
//  * =================================
//  */
// function checkAdminAuth() {
//   // TODO (Backend Developer):
//   console.log("TODO: Checking admin auth with backend...");
// }

// function loadAdminData() {
//   // TODO (Backend Developer): Is logic ko API call se replace karein
  
//   // --- YEH HAI NAYA LOGIC (Step 2) ---
//   // 1. localStorage se real data lein
//   const pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
//   const allUsers = JSON.parse(localStorage.getItem('allUsers')) || []; // (Yeh hum agle step mein banayenge)
//   const allBlogs = JSON.parse(localStorage.getItem('allBlogs')) || []; // (Yeh bhi agle step mein banayenge)

//   // 2. Stats calculate karein
//   const stats = {
//     users: allUsers.length,
//     pending: pendingWorkshops.length,
//     blogs: allBlogs.length
//   };
  
//   // 3. UI ko populate karein
//   populateStats(stats);
//   populateWorkshopsTable(pendingWorkshops);
//   // (Yeh functions abhi dummy data dikhayenge, hum inhe bhi update karenge)
//   populateUsersTable(allUsers);
//   populateBlogsTable(allBlogs);
// }

// function populateStats(stats) {
//   document.getElementById('stat-total-users').textContent = stats.users;
//   document.getElementById('stat-pending-workshops').textContent = stats.pending;
//   document.getElementById('stat-total-blogs').textContent = stats.blogs;
// }

// function populateWorkshopsTable(workshops) {
//   const tableBody = document.getElementById('workshopsTableBody');
//   if (!tableBody) return;
  
//   if (workshops.length === 0) {
//     tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No workshops pending review.</td></tr>';
//     return;
//   }
  
//   // Data ab 'hostName' use kar raha hai, 'host' nahi
//   tableBody.innerHTML = workshops.map(ws => `
//     <tr>
//       <td>${ws.title}</td>
//       <td>${ws.hostName}</td>
//       <td>${new Date(ws.date).toLocaleDateString()}</td>
//       <td>${ws.price}</td>
//       <td>
//         <button class="btn btn-outline btn-approve" data-id="${ws.id}">Approve</button>
//         <button class="btn btn-outline btn-deny" data-id="${ws.id}">Deny</button>
//       </td>
//     </tr>
//   `).join('');
// }

// function populateUsersTable(users) {
//   const tableBody = document.getElementById('usersTableBody');
//   if (!tableBody) return;
//   if (users.length === 0) {
//     tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found.</td></tr>';
//     return;
//   }
//   tableBody.innerHTML = users.map(user => `
//     <tr>
//       <td>${user.id}</td>
//       <td>${user.email}</td>
//       <td>${user.name}</td>
//       <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
//       <td>
//         <button class="btn btn-outline btn-deny" data-id="${user.id}">Delete</button>
//       </td>
//     </tr>
//   `).join('');
// }

// function populateBlogsTable(blogs) {
//   const tableBody = document.getElementById('blogTableBody');
//   if (!tableBody) return;
//   if (blogs.length === 0) {
//     tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No blog posts found.</td></tr>';
//     return;
//   }
//   tableBody.innerHTML = blogs.map(blog => `
//     <tr>
//       <td>${blog.title}</td>
//       <td>${blog.author}</td>
//       <td>${new Date(blog.date).toLocaleDateString()}</td>
//       <td>
//         <button class="btn btn-outline btn-deny" data-id="${blog.id}">Delete</button>
//       </td>
//     </tr>
//   `).join('');
// }

// function setupEventListeners() {
//   const adminNav = document.querySelector('.admin-nav');
//   const adminTabs = document.querySelectorAll('.admin-tab-content'); // Selector fix kiya
//   const adminNavLinks = document.querySelectorAll('.admin-nav-link');
//   const logoutBtn = document.getElementById('logoutButton');
  
//   // --- Tab Switching Logic ---
//   if (adminNav) {
//     adminNav.addEventListener('click', (e) => {
//       const targetLink = e.target.closest('a');
//       if (!targetLink) return;
//       e.preventDefault();
      
//       const targetId = targetLink.getAttribute('href').substring(1); // e.g., "users"
      
//       // 1. Links ka .active class manage karein
//       adminNavLinks.forEach(link => link.classList.remove('active'));
//       targetLink.classList.add('active');
      
//       // 2. Tabs ko .active class manage karein
//       adminTabs.forEach(tab => {
//         if (tab.id === targetId) { // ID ko seedha match karein
//           tab.classList.add('active');
//         } else {
//           tab.classList.remove('active');
//         }
//       });
//     });
//   }
  
//   // --- Table Button Listeners ---
//   document.body.addEventListener('click', (e) => {
//     const target = e.target;
//     // Data-id ko seedha button se lein
//     const actionButton = e.target.closest('button[data-id]');
//     if (!actionButton) return;
    
//     const id = actionButton.dataset.id;
    
//     // Parent table ko dhoondhein
//     const workshopsTable = e.target.closest('#workshopsTableBody');
//     const usersTable = e.target.closest('#usersTableBody');
//     const blogsTable = e.target.closest('#blogTableBody');
    
//     // Workshop actions
//     if (workshopsTable) {
//       if (target.classList.contains('btn-approve')) {
//         handleWorkshopAction(id, 'approve');
//       } else if (target.classList.contains('btn-deny')) {
//         handleWorkshopAction(id, 'deny');
//       }
//     }
    
//     // User/Blog delete actions
//     if (usersTable && target.classList.contains('btn-deny')) {
//       handleUserAction(id, 'delete');
//     }
//     if (blogsTable && target.classList.contains('btn-deny')) {
//       handleBlogAction(id, 'delete');
//     }
//   });

//   // --- Logout Button ---
//   if(logoutBtn) {
//     logoutBtn.addEventListener('click', handleLogout);
//   }
// }

// function handleWorkshopAction(id, action) {
//   // TODO (Backend Developer): Is logic ko API call se replace karein
//   console.log(`Action: ${action} for workshop ${id}`);
  
//   // 1. localStorage se data lein
//   let pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
  
//   // 2. Is ID ko chhodkar baaki sab workshops ki nayi list banayein
//   const updatedWorkshops = pendingWorkshops.filter(ws => ws.id !== id);
  
//   // 3. Nayi list ko waapas save karein
//   localStorage.setItem('pendingWorkshops', JSON.stringify(updatedWorkshops));
  
//   // 4. UI se row hata dein
//   document.querySelector(`#workshopsTableBody button[data-id="${id}"]`).closest('tr').remove();
  
//   // 5. Stats counter ko update karein
//   document.getElementById('stat-pending-workshops').textContent = updatedWorkshops.length;
// }

// function handleUserAction(id, action) {
//   // TODO (Backend Developer): Call API '/api/admin/users/${id}'
//   console.log(`TODO: Sending action '${action}' for user ${id} to backend.`);
//   if (confirm(`Are you sure you want to ${action} user ${id}?`)) {
//     alert(`User ${id} has been ${action}d. (Simulation)`);
//     document.querySelector(`#usersTableBody button[data-id="${id}"]`).closest('tr').remove();
//   }
// }

// function handleBlogAction(id, action) {
//   // TODO (Backend Developer): Call API '/api/admin/blogs/${id}'
//   console.log(`TODO: Sending action '${action}' for blog ${id} to backend.`);
//   if (confirm(`Are you sure you want to ${action} blog post ${id}?`)) {
//     alert(`Blog post ${id} has been ${action}d. (Simulation)`);
//     document.querySelector(`#blogTableBody button[data-id="${id}"]`).closest('tr').remove();
//   }
// }

// function handleLogout() {
//   // TODO (Backend Developer): Call API '/api/admin/logout'
//   console.log("TODO: Sending logout request to backend.");
//   alert("Logging out...");
//   window.location.href = 'admin-login.html';
// }

/* ===========================
   ADMIN.JS (Fully Dynamic Logic)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // === THEME TOGGLE LOGIC ===
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
      if (currentTheme === 'dark') setTheme('light');
      else setTheme('dark');
    });
  }
  // === END OF THEME LOGIC ===

  // --- ADMIN LOGIN PAGE LOGIC ---
  const loginForm = document.getElementById('adminLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleAdminLogin);
  }
  
  // --- ADMIN DASHBOARD PAGE LOGIC ---
  const adminContent = document.getElementById('admin-content');
  if (adminContent) {
    checkAdminAuth();
    loadAdminData();
    setupEventListeners();
  }
  
}); // <-- END OF DOMCONTENTLOADED

/*
 * =================================
 * LOGIN PAGE FUNCTIONS
 * =================================
 */
async function handleAdminLogin(e) {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value;
  if (email === "admin@test.com") {
    window.location.href = 'admin.html';
  } else {
    document.getElementById('adminLoginError').textContent = 'Invalid credentials';
  }
}

/*
 * =================================
 * DASHBOARD PAGE FUNCTIONS
 * =================================
 */
function checkAdminAuth() {
  // TODO (Backend): Call '/api/admin/check-auth'
  console.log("TODO: Checking admin auth with backend...");
}

function loadAdminData() {
  // TODO (Backend): Load all this data from API endpoints
  
  // --- (FIXED) Front-End Simulation ---
  // Ab hum dummy data ki jagah localStorage se REAL data load kar rahe hain
  const pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
  const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
  const allBlogs = JSON.parse(localStorage.getItem('allBlogs')) || [];
  const allRegisteredWorkshops = JSON.parse(localStorage.getItem('myWorkshops')) || []; // YEH HAI NAYA DYNAMIC DATA

  // (Finance abhi bhi dummy hai kyunki iska data create karne ka UI nahi hai)
  const allFinance = [
    { id: 'f1', host: 'Krishna', amount: 500, fines: 50, complains: 2, status: 'pending' }
  ];
  
  // --- YEH NAYA LOGIC HAI: Workshops ko sort karna ---
  const todayWorkshops = [];
  const tomorrowWorkshops = [];
  const completedWorkshops = [];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  allRegisteredWorkshops.forEach(ws => {
    const wsDateStr = ws.date.split('T')[0];
    const wsDate = new Date(ws.date);

    if (wsDate < now) {
      ws.status = 'completed';
      ws.complains = 0; // (Dummy)
      ws.paymentDate = 'Pending'; // (Dummy)
      completedWorkshops.push(ws);
    } else if (wsDateStr === todayStr) {
      ws.status = 'today';
      ws.attenders = 1; // (Dummy)
      ws.time = new Date(ws.date).toLocaleTimeString('en-IN'); // (Dynamic Time)
      todayWorkshops.push(ws);
    } else if (wsDateStr === tomorrowStr) {
      ws.status = 'tomorrow';
      ws.attenders = 1; // (Dummy)
      ws.time = new Date(ws.date).toLocaleTimeString('en-IN');
      tomorrowWorkshops.push(ws);
    }
  });
  // --- End of Naya Logic ---

  // --- Stats Calculation (Ab real data use kar raha hai) ---
  const userStats = {
    total: allUsers.length,
    new: allUsers.length,
    old: 0,
    hosters: allUsers.filter(u => u.role === 'Hoster').length,
    buyers: allUsers.filter(u => u.role === 'Buyer').length,
  };
  const workshopStats = {
    total: allRegisteredWorkshops.length,
    hosters: new Set(allRegisteredWorkshops.map(w => w.hostName)).size,
    buyers: allRegisteredWorkshops.length
  };

  // --- Populate UI ---
  populateUserStats(userStats);
  populateWorkshopStats(workshopStats);
  // (Yeh ab dynamic data bhej raha hai)
  populateWorkshopTables(todayWorkshops, tomorrowWorkshops, completedWorkshops);
  populateUsersTable(allUsers);
  populateBlogsTable(allBlogs);
  populateFinanceTable(allFinance);
}

// --- POPULATE FUNCTIONS ---
function populateUserStats(stats) {
  document.getElementById('stat-total-users').textContent = stats.total;
  document.getElementById('stat-new-users').textContent = stats.new;
  document.getElementById('stat-old-users').textContent = stats.old;
  document.getElementById('stat-hosters').textContent = stats.hosters;
  document.getElementById('stat-buyers').textContent = stats.buyers;
}

function populateWorkshopStats(stats) {
  document.getElementById('stat-total-workshops').textContent = stats.total;
  document.getElementById('stat-total-hosters').textContent = stats.hosters;
  document.getElementById('stat-total-buyers').textContent = stats.buyers;
}

// (Yeh function ab DYNAMIC hai)
function populateWorkshopTables(today, tomorrow, completed) {
  const todayBody = document.getElementById('todayWorkshopsTable');
  const tomorrowBody = document.getElementById('tomorrowWorkshopsTable');
  const completedBody = document.getElementById('completedWorkshopsTable');
  
  todayBody.innerHTML = ""; tomorrowBody.innerHTML = ""; completedBody.innerHTML = "";
  
  today.forEach(ws => {
    todayBody.innerHTML += `<tr><td>${ws.hostName}</td><td>${ws.attenders}</td><td>${ws.time}</td></tr>`;
  });
  tomorrow.forEach(ws => {
    tomorrowBody.innerHTML += `<tr><td>${ws.hostName}</td><td>${ws.attenders}</td><td>${ws.time}</td></tr>`;
  });
  completed.forEach(ws => {
    completedBody.innerHTML += `<tr><td>${ws.hostName}</td><td>${ws.attenders}</td><td>${ws.time}</td><td>${ws.complains}</td><td>${ws.paymentDate}</td></tr>`;
  });
  
  if(todayBody.innerHTML === "") todayBody.innerHTML = '<tr><td colspan="3" class="muted">No workshops scheduled for today.</td></tr>';
  if(tomorrowBody.innerHTML === "") tomorrowBody.innerHTML = '<tr><td colspan="3" class="muted">No workshops scheduled for tomorrow.</td></tr>';
  if(completedBody.innerHTML === "") completedBody.innerHTML = '<tr><td colspan="5" class="muted">No workshops completed yet.</td></tr>';
}

function populateFinanceTable(transactions) {
  // (Yeh section abhi bhi DUMMY data use kar raha hai)
  const tableBody = document.getElementById('financeTableBody');
  if (!tableBody) return;
  tableBody.innerHTML = transactions.map(t => `
    <tr>
      <td>${t.host}</td>
      <td>$${t.amount.toFixed(2)}</td>
      <td>$${t.fines.toFixed(2)}</td>
      <td>${t.complains}</td>
      <td><span class="status ${t.status}">${t.status}</span></td>
      <td><button class="btn btn-outline btn-approve" data-id="${t.id}">Process</button></td>
    </tr>
  `).join('');
}

function populateUsersTable(users) {
  // (Yeh ab DYNAMIC hai)
  const tableBody = document.getElementById('usersTableBody');
  if (!tableBody) return;
  if (users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found.</td></tr>';
    return;
  }
  tableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></td>
      <td>
        <button class="btn btn-outline btn-block" data-id="${user.id}" data-status="${user.status}">
          ${user.status === 'Active' ? 'Block' : 'Unblock'}
        </button>
      </td>
    </tr>
  `).join('');
}

function populateBlogsTable(blogs) {
  // (Yeh ab DYNAMIC hai)
  const tableBody = document.getElementById('blogTableBody');
  if (!tableBody) return;
  if (blogs.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No blog posts found.</td></tr>';
    return;
  }
  tableBody.innerHTML = blogs.map(blog => `
    <tr>
      <td>${blog.title}</td>
      <td>${blog.author}</td>
      <td>${new Date(blog.date).toLocaleDateString()}</td>
      <td>
        <button class="btn btn-outline btn-deny" data-id="${blog.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  const adminNav = document.querySelector('.admin-nav');
  const adminTabs = document.querySelectorAll('.admin-tab-content');
  const adminNavLinks = document.querySelectorAll('.admin-nav-link');
  const logoutBtn = document.getElementById('logoutButton');
  const broadcastForm = document.getElementById('broadcastEmailForm');
  const singleEmailForm = document.getElementById('singleEmailForm');
  const financeForm = document.getElementById('financeForm');
  const adminHeaderTitle = document.getElementById('admin-header-title');
  
  // Main Tab Switching
  if (adminNav) {
    adminNav.addEventListener('click', (e) => {
      const targetLink = e.target.closest('a');
      if (!targetLink) return;
      e.preventDefault();
      const targetId = targetLink.getAttribute('href').substring(1);
      adminNavLinks.forEach(link => link.classList.remove('active'));
      targetLink.classList.add('active');
      adminTabs.forEach(tab => {
        tab.classList.toggle('active', tab.id === targetId);
      });
      adminHeaderTitle.textContent = targetLink.textContent;
    });
  }
  
  // Email Sub-Tab Switching
  const subTabContainer = document.querySelector('.admin-sub-tabs');
  if (subTabContainer) {
    subTabContainer.addEventListener('click', (e) => {
      const targetBtn = e.target.closest('.sub-tab-btn');
      if (!targetBtn) return;
      const targetPanelId = targetBtn.dataset.target;
      subTabContainer.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('active'));
      targetBtn.classList.add('active');
      document.querySelectorAll('.admin-sub-tab-content').forEach(panel => {
        panel.classList.toggle('active', panel.id === targetPanelId);
      });
    });
  }
  
  // Table Button Listeners (Dynamic)
  document.body.addEventListener('click', (e) => {
    const actionButton = e.target.closest('button[data-id]');
    if (!actionButton) return;
    
    const id = actionButton.dataset.id;
    const usersTable = e.target.closest('#usersTableBody');
    const blogsTable = e.target.closest('#blogTableBody');
    
    if (usersTable) {
      const currentStatus = actionButton.dataset.status;
      const newStatus = (currentStatus === 'Active') ? 'Block' : 'Unblock';
      handleUserAction(id, newStatus.toLowerCase(), actionButton);
    }
    if (blogsTable && actionButton.classList.contains('btn-deny')) {
      handleBlogAction(id, 'delete');
    }
  });

  // Form Submissions
  if(logoutBtn) logoutBtn.addEventListener('click', handleLogout);
  if(broadcastForm) broadcastForm.addEventListener('submit', handleBroadcastSubmit);
  if(singleEmailForm) singleEmailForm.addEventListener('submit', handleSingleEmailSubmit);
  if(financeForm) financeForm.addEventListener('submit', handleFinanceSubmit);
}

// --- ACTION HANDLERS (Dynamic) ---
function handleUserAction(id, action, button) {
  // TODO (Backend): Call API
  console.log(`TODO: Sending action '${action}' for user ${id} to backend.`);
  if (confirm(`Are you sure you want to ${action} user ${id}?`)) {
    
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const newStatus = (action === 'block') ? 'Blocked' : 'Active';
    
    allUsers = allUsers.map(user => {
      if (user.id === id) {
        user.status = newStatus;
      }
      return user;
    });
    
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    alert(`User ${id} has been ${action}ed. (Simulation)`);
    
    // Toggle UI
    const newAction = (action === 'block') ? 'Unblock' : 'Block';
    button.dataset.status = newStatus;
    button.textContent = newAction;
    
    const statusBadge = button.closest('tr').querySelector('.status-badge');
    statusBadge.className = `status-badge ${newStatus.toLowerCase()}`;
    statusBadge.textContent = newStatus;
  }
}

function handleBlogAction(id, action) {
  // TODO (Backend): Call API
  console.log(`TODO: Sending action '${action}' for blog ${id} to backend.`);
  if (confirm(`Are you sure you want to ${action} blog post ${id}?`)) {
    
    let allBlogs = JSON.parse(localStorage.getItem('allBlogs')) || [];
    allBlogs = allBlogs.filter(blog => blog.id !== id);
    localStorage.setItem('allBlogs', JSON.stringify(allBlogs));
    
    alert(`Blog post ${id} has been ${action}d. (Simulation)`);
    document.querySelector(`#blogTableBody button[data-id="${id}"]`).closest('tr').remove();
  }
}

function handleBroadcastSubmit(e) {
  e.preventDefault();
  // TODO (Backend): Call API
  const subject = document.getElementById('emailSubject').value;
  console.log(`TODO: Sending broadcast...`, { subject });
  alert("Broadcast email sent successfully! (Simulation)");
  e.target.reset();
}

function handleSingleEmailSubmit(e) {
  e.preventDefault();
  // TODO (Backend): Call API
  const email = document.getElementById('emailSingleAddress').value;
  console.log(`TODO: Sending single email to ${email}...`);
  alert(`Email sent to ${email} successfully! (Simulation)`);
  e.target.reset();
}

function handleFinanceSubmit(e) {
  e.preventDefault();
  // TODO (Backend): Call API
  const hoster = document.getElementById('financeHosterName').value;
  alert(`Payment processed for ${hoster}! (Simulation)`);
  e.target.reset();
}

function handleLogout() {
  // TODO (Backend): Call API
  console.log("TODO: Sending logout request to backend.");
  alert("Logging out...");
  window.location.href = 'admin-login.html';
}