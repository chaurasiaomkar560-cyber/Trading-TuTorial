// Auto year update
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// Role toggle
const roleBtns = document.querySelectorAll(".role-btn");
const forms = {
  user: document.getElementById("user-form"),
  hoster: document.getElementById("hoster-form"),
  buyer: document.getElementById("buyer-form"),
};

roleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Toggle active button
    roleBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // Show relevant form
    Object.values(forms).forEach((f) => f.classList.add("hidden"));
    forms[btn.dataset.role].classList.remove("hidden");
  });
});

// Handle form submit
document.getElementById("signup-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const activeRole = document.querySelector(".role-btn.active").dataset.role;
  alert(`Signed up successfully as ${activeRole.toUpperCase()}!`);
});
