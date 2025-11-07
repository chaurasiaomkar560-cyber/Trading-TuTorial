// --- Sub-tab switching ---
document.querySelectorAll(".sub-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    document.querySelectorAll(".sub-tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".admin-sub-tab-content").forEach(c => c.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(target).classList.add("active");
  });
});

// --- Toggle forms in Multiple Payment section ---
const paymentTypeSelect = document.getElementById("multiPaymentType");
const refundForm = document.getElementById("multiRefundForm");
const hosterForm = document.getElementById("multiHosterForm");

paymentTypeSelect.addEventListener("change", () => {
  if (paymentTypeSelect.value === "refund") {
    refundForm.style.display = "block";
    hosterForm.style.display = "none";
  } else if (paymentTypeSelect.value === "hoster") {
    refundForm.style.display = "none";
    hosterForm.style.display = "block";
  } else {
    refundForm.style.display = "none";
    hosterForm.style.display = "none";
  }
});

// --- Transaction utilities ---
async function loadTransactions() {
  const res = await fetch("/admin/get_transactions");
  const data = await res.json();
  const tbody = document.getElementById("transactionHistoryBody");
  tbody.innerHTML = "";

  if (data.status === "success" && data.transactions.length > 0) {
    data.transactions.forEach(tx => {
      const color =
        tx.type === "Refund"
          ? "style='color:#e74c3c'"
          : tx.type === "Payment to Hoster"
          ? "style='color:#27ae60'"
          : "style='color:#2980b9'";
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${new Date(tx.created_at).toLocaleString()}</td>
        <td ${color}>${tx.type}</td>
        <td>${tx.email}</td>
        <td>$${tx.amount}</td>
        <td>${tx.workshop || "—"}</td>
        <td>${tx.status}</td>`;
      tbody.appendChild(row);
    });
  } else {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">No transactions yet.</td></tr>`;
  }
}

async function recordTransaction(payload) {
  await fetch("/admin/add_transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  loadTransactions();
}

// --- Multiple Payment submission ---
document.getElementById("multiplePaymentForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const table = document.getElementById("multiTableName").value;
  const type = document.getElementById("multiPaymentType").value;
  const amount =
    type === "refund"
      ? document.getElementById("multiRefundAmount").value
      : document.getElementById("multiHosterAmount").value;

  const res = await fetch("/admin/send_multiple_payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table_name: table, type, amount })
  });
  const data = await res.json();
  alert(data.message);

  if (data.status === "success")
    recordTransaction({ amount, type: "Multiple " + type, status: "Completed" });
});

// Get elements
const paymentTypeSelect = document.getElementById("multiPaymentType");
const refundForm = document.getElementById("multiRefundForm");
const hosterForm = document.getElementById("multiHosterForm");

// Toggle forms based on dropdown selection
paymentTypeSelect.addEventListener("change", function () {
  const value = this.value;

  if (value === "refund") {
    refundForm.style.display = "block";
    hosterForm.style.display = "none";
  } else if (value === "hoster") {
    refundForm.style.display = "none";
    hosterForm.style.display = "block";
  } else {
    refundForm.style.display = "none";
    hosterForm.style.display = "none";
  }
});

// Handle refund button click
document.getElementById("sendRefundsBtn").addEventListener("click", async () => {
  const table = document.getElementById("multiTableName").value;
  const amount = document.getElementById("multiRefundAmount").value;

  if (!table || !amount) {
    alert("Please fill all fields!");
    return;
  }

  const res = await fetch("/admin/send_multiple_payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table_name: table, type: "refund", amount })
  });
  const data = await res.json();
  alert(data.message);
});

// Handle hoster button click
document.getElementById("payHostersBtn").addEventListener("click", async () => {
  const table = document.getElementById("multiTableName").value;
  const amount = document.getElementById("multiHosterAmount").value;

  if (!table || !amount) {
    alert("Please fill all fields!");
    return;
  }

  const res = await fetch("/admin/send_multiple_payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ table_name: table, type: "hoster", amount })
  });
  const data = await res.json();
  alert(data.message);
});
