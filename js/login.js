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
    const delBtn = row.querySelector('.btn-delete');
    if (delBtn) {
      delBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!confirm('Delete this letter?')) return;
        if (window.lettersAPI && window.lettersAPI.del) {
          window.lettersAPI.del(email.id).then(() => {});
        } else {
          const emails = loadEmails();
          const idx = emails.findIndex(e => e.id === email.id);
          if (idx >= 0) {
            emails.splice(idx, 1);
            saveEmails(emails);
            if (state.selectedEmail && state.selectedEmail.id === email.id) {
              state.selectedEmail = null;
              showView('inbox');
            }
            renderInbox();
          }
        }
      });

        const env = document.getElementById("envelope");
        if (env) {
          env.classList.remove("opening");
          const isKl = (email.author === "klplacido") || (!email.author && email.subject === "Trial Letter");
          env.classList.toggle("from-klplacido", isKl);
        }
      });

      // flag special sender for styling
      if (email.author === "klplacido") row.classList.add("from-klplacido");

      // delete handler
      const delBtn = row.querySelector('.btn-delete');
      if (delBtn) {
        delBtn.addEventListener('click', (ev) => {
          ev.stopPropagation();
          if (!confirm('Delete this letter?')) return;
          const emails = loadEmails();
          const idx = emails.findIndex(e => e.id === email.id);
          if (idx >= 0) {
            emails.splice(idx, 1);
            saveEmails(emails);
            if (state.selectedEmail && state.selectedEmail.id === email.id) {
              state.selectedEmail = null;
              showView('inbox');
            }
  if (window.lettersAPI && window.lettersAPI.add) {
    window.lettersAPI.add(newEmail).then(() => {});
  } else {
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
  }
const btnLoginEl = document.getElementById("btn-login");
if (btnLoginEl) btnLoginEl.addEventListener("click", () => {
  // If Firestore path used, the realtime listener will re-render and we still clear inputs + close modal.
  if (window.lettersAPI && window.lettersAPI.add) {
    subjectEl.value = "";
    bodyEl.value = "";
    const modalEl = document.getElementById("composeModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
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
const btnSendEl = document.getElementById("btn-send");
if (btnSendEl) btnSendEl.addEventListener("click", () => {
  if (!canWrite()) {
    alert("You don't have permission to add letters.");
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