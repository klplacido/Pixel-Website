// js/inbox.js

const elMailList = document.getElementById("mail-list");
const btnNew = document.getElementById("btn-new"); // index.html must have id="btn-new"

// Login elements (IDs from index.html)
const elLoginUser = document.getElementById("login-username");
const elLoginPass = document.getElementById("login-password");
const elLoginErr = document.getElementById("login-error");
const elUserBadge = document.getElementById("user-badge");

/* ---------- storage helpers ---------- */
function loadEmails() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const emails = JSON.parse(raw);
    return Array.isArray(emails) ? emails : [];
  } catch {
    return [];
  }
}

function saveEmails(emails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
}

/* ---------- UI helpers ---------- */
function renderInbox() {
  try {
    const emails = loadEmails().sort((a, b) => (b.ts || 0) - (a.ts || 0));
    elMailList.innerHTML = "";

    if (emails.length === 0) {
      elMailList.innerHTML = `<div class="empty-state">No emails yet.</div>`;
      return;
    }

    emails.forEach(email => {
      const row = document.createElement("div");
      row.className = "mail-row";
      row.innerHTML = `
        <div class="mail-left">
          <div class="heart"></div>
          <div class="mail-subject">${escapeHtml(email.subject)}</div>
        </div>
        <div class="mail-date">${escapeHtml(email.date)}</div>
      `;

      row.addEventListener("click", () => {
        state.selectedEmail = email;
        showView("envelope");

        const env = document.getElementById("envelope");
        if (env) env.classList.remove("opening");
      });

      // flag special sender for styling
      if (email.author === "klplacido") row.classList.add("from-klplacido");

      elMailList.appendChild(row);
    });
  } catch (err) {
    console.error("renderInbox error:", err);
    elMailList.innerHTML = `<div class="empty-state">Inbox failed to load.</div>`;
  }
}

function applyPermissions() {
  if (!btnNew) return;
  btnNew.style.display = canWrite() ? "inline-block" : "none";
}

document.getElementById("btn-login").addEventListener("click", () => {
  const u = (elLoginUser.value || "").trim();
  const p = (elLoginPass.value || "").trim();

  const account = USERS[u];

  if(account && p === account.password){
    elLoginErr.style.display = "none";
    state.currentUser = { username: u, role: account.role };

    // show user badge
    if (elUserBadge) elUserBadge.textContent = u;

    renderInbox();
    applyPermissions();
    showView("inbox");
  } else {
    elLoginErr.style.display = "block";
  }
});

// Logout handler
const btnLogout = document.getElementById("btn-logout");
if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    state.currentUser = null;
    state.selectedEmail = null;
    if (elUserBadge) elUserBadge.textContent = "";
    if (elLoginUser) elLoginUser.value = "";
    if (elLoginPass) elLoginPass.value = "";
    if (elLoginErr) elLoginErr.style.display = "none";
    applyPermissions();
    showView("login");
  });
}

/* ---------- send (writer only) ---------- */
document.getElementById("btn-send").addEventListener("click", () => {
  if (!canWrite()) {
    alert("Read-only account. Only klplacido can add letters.");
    return;
  }

  const subjectEl = document.getElementById("compose-subject");
  const bodyEl = document.getElementById("compose-body");

  const subject = (subjectEl.value || "").trim() || "Untitled";
  const body = (bodyEl.value || "").trim() || "(empty)";

  const now = new Date();
  const newEmail = {
    id: crypto.randomUUID(),
    subject,
    body,
    date: formatDate(now),
    ts: now.getTime(),
    author: state.currentUser?.username || "unknown"
  };

  const emails = loadEmails();

  // Gmail style: newest first
  emails.unshift(newEmail);

  saveEmails(emails);

  // Clear inputs
  subjectEl.value = "";
  bodyEl.value = "";

  // Close modal (only if modal is open)
  const modalEl = document.getElementById("composeModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();

  // Re-render
  renderInbox();
});