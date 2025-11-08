/* ===========================
   scripts.js — Trading Tutor (Clean & Optimized)
   =========================== */

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Trading Tutor scripts loaded successfully.");

  // ======================================================
  // 1️⃣ HAMBURGER MENU TOGGLE
  // ======================================================
  const menuBtn = document.getElementById("menu-btn");
  const menuIcon = menuBtn ? menuBtn.querySelector("i") : null;
  const navLinks = document.querySelector(".nav-links");

  if (menuBtn && navLinks && menuIcon) {
    menuBtn.addEventListener("click", () => {
      navLinks.classList.toggle("nav-open");
      menuIcon.classList.toggle("fa-times");
      menuIcon.classList.toggle("fa-bars");
    });
  }

  // Close menu when any link clicked
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks?.classList.remove("nav-open");
      if (menuIcon) {
        menuIcon.classList.remove("fa-times");
        menuIcon.classList.add("fa-bars");
      }
    });
  });

  // ======================================================
  // 2️⃣ THEME TOGGLE
  // ======================================================
  const themeBtn = document.getElementById("theme-btn");
  const themeIcon = themeBtn ? themeBtn.querySelector("i") : null;
  const htmlElement = document.documentElement;

  if (themeBtn && themeIcon) {
    const setTheme = (theme) => {
      htmlElement.setAttribute("data-theme", theme);
      themeIcon.classList.toggle("fa-sun", theme === "dark");
      themeIcon.classList.toggle("fa-moon", theme === "light");
      localStorage.setItem("theme", theme);
    };

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(savedTheme || (prefersDark ? "dark" : "light"));

    themeBtn.addEventListener("click", () => {
      const current = htmlElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  // ======================================================
  // 3️⃣ FOOTER YEAR AUTO UPDATE
  // ======================================================
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // ======================================================
  // 4️⃣ CHATBOT INITIALIZATION
  // ======================================================
  (function initChatbot() {
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
    document.body.insertAdjacentHTML("beforeend", chatbotHTML);

    const toggleBtn = document.getElementById("chatbot-toggle");
    const popup = document.getElementById("chatbot-popup");
    const closeBtn = document.getElementById("chatbot-close");
    const log = document.getElementById("chatbot-log");
    const input = document.getElementById("chatbot-input-field");
    const sendBtn = document.getElementById("chatbot-send");
    const suggestions = document.getElementById("chatbot-suggestions");
    const expandBtn = document.getElementById("chatbot-expand");
    const expandIcon = expandBtn ? expandBtn.querySelector("i") : null;

    toggleBtn.addEventListener("click", () => {
      popup.classList.toggle("open");
      toggleBtn.style.opacity = popup.classList.contains("open") ? "0" : "1";
    });

    closeBtn.addEventListener("click", () => {
      popup.classList.remove("open");
      toggleBtn.style.opacity = "1";
    });

    expandBtn?.addEventListener("click", () => {
      popup.classList.toggle("fullscreen");
      const fs = popup.classList.contains("fullscreen");
      expandIcon.classList.toggle("fa-compress", fs);
      expandIcon.classList.toggle("fa-expand", !fs);
    });

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      createMessage(text, "user");
      input.value = "";
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json();
        createMessage(data?.response || "⚠️ No reply received.", "bot");
      } catch (e) {
        createMessage("🤖 Mock reply: " + text, "bot");
      }
    }

    function createMessage(text, type) {
      const div = document.createElement("div");
      div.className = `chat-message ${type}`;
      div.innerHTML = `<p>${text}</p>`;
      log.appendChild(div);
      log.scrollTop = log.scrollHeight;
    }

    sendBtn.addEventListener("click", sendMessage);
    input.addEventListener("keypress", (e) => e.key === "Enter" && sendMessage());
    suggestions?.addEventListener("click", (e) => {
      if (e.target.classList.contains("suggestion-chip")) {
        input.value = e.target.textContent;
        sendMessage();
      }
    });
    createMessage("👋 Hello! I'm your Trading Tutor Bot — ask me anything about trading.", "bot");
  })();

  // ======================================================
  // 5️⃣ WORKSHOP SECTION
  // ======================================================

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

  // === Utility functions ===
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

    if (prefix === "host") {
      document.getElementById(`step-indicator-${current}`)?.classList.remove("active");
      document.getElementById(`step-indicator-${next}`)?.classList.add("active");
    }
  }

  // === Open/Close Modals ===
  showHostModalBtn?.addEventListener("click", () => showModal(hostModal));
  hostCloseBtn?.addEventListener("click", () => hideModal(hostModal));
  document.getElementById("hostDoneBtn")?.addEventListener("click", () => hideModal(hostModal));
  workshopCloseBtn?.addEventListener("click", () => hideModal(workshopModal));

  // === Hoster Navigation ===
  hostNextBtn1?.addEventListener("click", () => switchStep("host", 1, 2));
  hostBackBtn1?.addEventListener("click", () => switchStep("host", 2, 1));
  hostNextBtn2?.addEventListener("click", () => switchStep("host", 2, 3));
  hostBackBtn2?.addEventListener("click", () => switchStep("host", 3, 2));

  document.getElementById("hostTerms")?.addEventListener("change", (e) => {
    hostSubmitBtn.disabled = !e.target.checked;
  });

  // === Hoster Form Submission ===
  hostForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(hostForm);

    try {
      const res = await fetch("/workshop/hoster_signup", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "❌ Failed to submit workshop.");
        return;
      }

      switchStep("host", 3, "success");
      setTimeout(() => {
        hideModal(hostModal);
        hostForm.reset();
        loadWorkshops();
      }, 1500);
    } catch (err) {
      console.error("Host form error:", err);
      alert("⚠️ Error submitting hoster form.");
    }
  });

  // === Buyer Registration ===
  document.getElementById("buyerTerms")?.addEventListener("change", (e) => {
    buyerProceedBtn.disabled = !e.target.checked;
  });

  buyerForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!selectedWorkshop) return alert("⚠️ Please select a workshop first.");

    const formData = new FormData(buyerForm);
    formData.append("workshop_id", selectedWorkshop.id);

    try {
      const res = await fetch("/workshop/buyer_register", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to register.");
        return;
      }

      switchStep("buyer", 1, 2);

      document.querySelectorAll(".payment-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          switchStep("buyer", 2, 3);
          document.getElementById("successWorkshopName").textContent = selectedWorkshop.title;
        });
      });
    } catch (err) {
      console.error("Buyer registration error:", err);
      alert("⚠️ Error while registering.");
    }
  });

  paymentBackBtn?.addEventListener("click", () => switchStep("buyer", 2, 1));
  buyerDoneBtn?.addEventListener("click", () => hideModal(workshopModal));

  // === Register Buttons on Workshop Cards ===
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

  // === Load Workshops ===
  async function loadWorkshops() {
    try {
      const res = await fetch("/workshop/get_workshops");
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.warn("No workshops found:", data);
        return;
      }

      workshopGrid.innerHTML = "";

      data.forEach((ws) => {
        const card = document.createElement("div");
        card.className = "card workshop-card";
        card.dataset.id = ws.id;

        const badgeClass = ws.price == 0 ? "free" : "price";
        const priceLabel = ws.price == 0 ? "FREE" : `$${ws.price}`;

        // --- Replace the innerHTML creation for each workshop card with this ---
        card.innerHTML = `
  <div class="workshop-badge ${badgeClass}">${priceLabel}</div>
  <img src="${ws.image_url || "https://picsum.photos/seed/default/400/200"}" class="workshop-thumb" alt="Workshop Image">
  <div class="workshop-content">
    <div class="workshop-meta" data-date="${ws.date_time || ''}">
      <div class="countdown-timer">--d : --h : --m : --s</div>
      <span class="workshop-duration"><i class="fa-regular fa-clock"></i> ${ws.duration || "Duration not specified"}</span>
    </div>
    <h3>${ws.title || 'Untitled Workshop'}</h3>
    <p>${ws.description || ''}</p>
    <!-- show actual hoster name if available; fallback to ws.hoster or a dash -->
    <p class="muted"><strong>${ws.hoster_name || ws.hoster || '—'}</strong></p>
    <button class="btn btn-primary register-btn" style="width: 100%">Register Now</button>
  </div>
`;

        workshopGrid.appendChild(card);
      });
    } catch (err) {
      console.error("Failed to load workshops:", err);
    }
  }

  function updateCountdowns() {
  document.querySelectorAll(".workshop-meta[data-date]").forEach((meta) => {
    const countdown = meta.querySelector(".countdown-timer");
    const dateStr = meta.dataset.date;
    if (!dateStr) {
      countdown.textContent = "Date not set";
      return;
    }

    const target = new Date(dateStr).getTime();
    if (isNaN(target)) {
      countdown.textContent = "Invalid date";
      return;
    }

    const now = Date.now();
    const diff = target - now;

    // If in the future -> normal countdown
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      countdown.textContent = `${days}d : ${hours}h : ${mins}m : ${secs}s`;
      return;
    }

    // If in the past -> show "Started X ago" (or a readable date if very old)
    const past = Math.abs(diff);
    const pdays = Math.floor(past / (1000 * 60 * 60 * 24));
    const phours = Math.floor((past / (1000 * 60 * 60)) % 24);
    const pmins = Math.floor((past / (1000 * 60)) % 60);

    if (pdays >= 30) {
      // If older than 30 days show actual start date (human readable)
      const dateObj = new Date(target);
      countdown.textContent = `Started on ${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`;
    } else if (pdays > 0) {
      countdown.textContent = `Started ${pdays}d ${phours}h ago`;
    } else if (phours > 0) {
      countdown.textContent = `Started ${phours}h ${pmins}m ago`;
    } else {
      countdown.textContent = `Started ${pmins}m ago`;
    }
  });
}


  setInterval(updateCountdowns, 1000);
  loadWorkshops();
});


// ======================================================
// 7️⃣ DASHBOARD CARD POPUP (User-Controlled)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".accordion-card");

  // Create popup modal structure only once
  const modal = document.createElement("div");
  modal.className = "card-modal-overlay";
  modal.innerHTML = `
    <div class="card-modal-content">
      <button class="modal-close-btn" aria-label="Close">&times;</button>
      <img id="cardModalImage" src="" alt="Card Image">
      <h2 id="cardModalTitle"></h2>
      <div id="cardModalContent"></div>
    </div>
  `;
  document.body.appendChild(modal);

  const modalContent = modal.querySelector(".card-modal-content");
  const closeBtn = modal.querySelector(".modal-close-btn");
  const img = modal.querySelector("#cardModalImage");
  const title = modal.querySelector("#cardModalTitle");
  const content = modal.querySelector("#cardModalContent");

  // Close modal function
  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = "auto";
  }

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(); // click outside box
  });

  // Click event for each card
  cards.forEach((card) => {
    const header = card.querySelector(".card-header");
    if (!header) return;

    header.addEventListener("click", () => {
      const cardImage = card.querySelector("img")?.src || "";
      const cardTitle = card.querySelector("h3")?.textContent || "Trading Style";
      const cardContent = card.querySelector(".card-content")?.innerHTML || "<p>No content available.</p>";

      img.src = cardImage;
      title.textContent = cardTitle;
      content.innerHTML = cardContent;

      modal.classList.add("open");
      document.body.style.overflow = "hidden"; // prevent background scroll
    });
  });
});




