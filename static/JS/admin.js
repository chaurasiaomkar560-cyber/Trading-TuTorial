/* ===========================
   ADMIN.JS (Logic for Admin Panel)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  
  // === THEME TOGGLE LOGIC (Copied from main scripts.js) ===
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;
  const htmlElement = document.documentElement; // <html> tag

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
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    themeBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        setTheme('light');
      } else {
        setTheme('dark');
      }
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
    // 1. Authorization Check (Backend se)
    checkAdminAuth();
    
    // 2. Data Load Karein
    loadAdminData();
    
    // 3. Event Listeners (Approve/Deny/Tabs)
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
  const password = document.getElementById('adminPassword').value;
  const errorEl = document.getElementById('adminLoginError');
  errorEl.textContent = "";

  // TODO (Backend Developer):
  try {
    console.log("TODO: Sending login request to backend...", { email, password });
    if (email === "admin@test.com") {
      alert("Login Simulation Successful! Redirecting...");
      window.location.href = 'admin.html';
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (err) {
    errorEl.textContent = err.message;
  }
}

/*
 * =================================
 * DASHBOARD PAGE FUNCTIONS
 * =================================
 */
function checkAdminAuth() {
  // TODO (Backend Developer):
  console.log("TODO: Checking admin auth with backend...");
}

function loadAdminData() {
  // TODO (Backend Developer): Is logic ko API call se replace karein
  
  // --- YEH HAI NAYA LOGIC (Step 2) ---
  // 1. localStorage se real data lein
  const pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
  const allUsers = JSON.parse(localStorage.getItem('allUsers')) || []; // (Yeh hum agle step mein banayenge)
  const allBlogs = JSON.parse(localStorage.getItem('allBlogs')) || []; // (Yeh bhi agle step mein banayenge)

  // 2. Stats calculate karein
  const stats = {
    users: allUsers.length,
    pending: pendingWorkshops.length,
    blogs: allBlogs.length
  };
  
  // 3. UI ko populate karein
  populateStats(stats);
  populateWorkshopsTable(pendingWorkshops);
  // (Yeh functions abhi dummy data dikhayenge, hum inhe bhi update karenge)
  populateUsersTable(allUsers);
  populateBlogsTable(allBlogs);
}

function populateStats(stats) {
  document.getElementById('stat-total-users').textContent = stats.users;
  document.getElementById('stat-pending-workshops').textContent = stats.pending;
  document.getElementById('stat-total-blogs').textContent = stats.blogs;
}

function populateWorkshopsTable(workshops) {
  const tableBody = document.getElementById('workshopsTableBody');
  if (!tableBody) return;
  
  if (workshops.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No workshops pending review.</td></tr>';
    return;
  }
  
  // Data ab 'hostName' use kar raha hai, 'host' nahi
  tableBody.innerHTML = workshops.map(ws => `
    <tr>
      <td>${ws.title}</td>
      <td>${ws.hostName}</td>
      <td>${new Date(ws.date).toLocaleDateString()}</td>
      <td>${ws.price}</td>
      <td>
        <button class="btn btn-outline btn-approve" data-id="${ws.id}">Approve</button>
        <button class="btn btn-outline btn-deny" data-id="${ws.id}">Deny</button>
      </td>
    </tr>
  `).join('');
}

function populateUsersTable(users) {
  const tableBody = document.getElementById('usersTableBody');
  if (!tableBody) return;
  if (users.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No users found.</td></tr>';
    return;
  }
  tableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.email}</td>
      <td>${user.name}</td>
      <td><span class="role-badge ${user.role.toLowerCase()}">${user.role}</span></td>
      <td>
        <button class="btn btn-outline btn-deny" data-id="${user.id}">Delete</button>
      </td>
    </tr>
  `).join('');
}

function populateBlogsTable(blogs) {
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

function setupEventListeners() {
  const adminNav = document.querySelector('.admin-nav');
  const adminTabs = document.querySelectorAll('.admin-tab-content'); // Selector fix kiya
  const adminNavLinks = document.querySelectorAll('.admin-nav-link');
  const logoutBtn = document.getElementById('logoutButton');
  
  // --- Tab Switching Logic ---
  if (adminNav) {
    adminNav.addEventListener('click', (e) => {
      const targetLink = e.target.closest('a');
      if (!targetLink) return;
      e.preventDefault();
      
      const targetId = targetLink.getAttribute('href').substring(1); // e.g., "users"
      
      // 1. Links ka .active class manage karein
      adminNavLinks.forEach(link => link.classList.remove('active'));
      targetLink.classList.add('active');
      
      // 2. Tabs ko .active class manage karein
      adminTabs.forEach(tab => {
        if (tab.id === targetId) { // ID ko seedha match karein
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    });
  }
  
  // --- Table Button Listeners ---
  document.body.addEventListener('click', (e) => {
    const target = e.target;
    // Data-id ko seedha button se lein
    const actionButton = e.target.closest('button[data-id]');
    if (!actionButton) return;
    
    const id = actionButton.dataset.id;
    
    // Parent table ko dhoondhein
    const workshopsTable = e.target.closest('#workshopsTableBody');
    const usersTable = e.target.closest('#usersTableBody');
    const blogsTable = e.target.closest('#blogTableBody');
    
    // Workshop actions
    if (workshopsTable) {
      if (target.classList.contains('btn-approve')) {
        handleWorkshopAction(id, 'approve');
      } else if (target.classList.contains('btn-deny')) {
        handleWorkshopAction(id, 'deny');
      }
    }
    
    // User/Blog delete actions
    if (usersTable && target.classList.contains('btn-deny')) {
      handleUserAction(id, 'delete');
    }
    if (blogsTable && target.classList.contains('btn-deny')) {
      handleBlogAction(id, 'delete');
    }
  });

  // --- Logout Button ---
  if(logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

function handleWorkshopAction(id, action) {
  // TODO (Backend Developer): Is logic ko API call se replace karein
  console.log(`Action: ${action} for workshop ${id}`);
  
  // 1. localStorage se data lein
  let pendingWorkshops = JSON.parse(localStorage.getItem('pendingWorkshops')) || [];
  
  // 2. Is ID ko chhodkar baaki sab workshops ki nayi list banayein
  const updatedWorkshops = pendingWorkshops.filter(ws => ws.id !== id);
  
  // 3. Nayi list ko waapas save karein
  localStorage.setItem('pendingWorkshops', JSON.stringify(updatedWorkshops));
  
  // 4. UI se row hata dein
  document.querySelector(`#workshopsTableBody button[data-id="${id}"]`).closest('tr').remove();
  
  // 5. Stats counter ko update karein
  document.getElementById('stat-pending-workshops').textContent = updatedWorkshops.length;
}

function handleUserAction(id, action) {
  // TODO (Backend Developer): Call API '/api/admin/users/${id}'
  console.log(`TODO: Sending action '${action}' for user ${id} to backend.`);
  if (confirm(`Are you sure you want to ${action} user ${id}?`)) {
    alert(`User ${id} has been ${action}d. (Simulation)`);
    document.querySelector(`#usersTableBody button[data-id="${id}"]`).closest('tr').remove();
  }
}

function handleBlogAction(id, action) {
  // TODO (Backend Developer): Call API '/api/admin/blogs/${id}'
  console.log(`TODO: Sending action '${action}' for blog ${id} to backend.`);
  if (confirm(`Are you sure you want to ${action} blog post ${id}?`)) {
    alert(`Blog post ${id} has been ${action}d. (Simulation)`);
    document.querySelector(`#blogTableBody button[data-id="${id}"]`).closest('tr').remove();
  }
}

function handleLogout() {
  // TODO (Backend Developer): Call API '/api/admin/logout'
  console.log("TODO: Sending logout request to backend.");
  alert("Logging out...");
  window.location.href = 'admin-login.html';
}