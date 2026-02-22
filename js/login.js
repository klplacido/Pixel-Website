// js/inbox.js

const elMailList = document.getElementById("mail-list");
const btnNew = document.getElementById("btn-new"); // make sure index.html has id="btn-new"

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

function renderInbox() {
  const emails = loadEmails().sort((a, b) => (b.ts || 0) - (a.ts || 0));

  elMailList.innerHTML = "";

  if (emails.length === 0) {
    elMailList.innerHTML = `<div style="padding:12px;font-weight:900;color:var(--muted);">No emails yet.</div>`;
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

      // reset animation state if you have one
      const env = document.getElementById("envelope");
      if (env) env.classList.remove("opening");
    });

    elMailList.appendChild(row);
  });
}

function applyPermissions() {
  if (!btnNew) return;
  btnNew.style.display = canWrite() ? "inline-block" : "none";
}

// SEND button: only klplacido (writer) can add letters
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
    ts: now.getTime()
  };

  const emails = loadEmails();

  // Gmail style: newest first
  emails.unshift(newEmail);

  saveEmails(emails);

  // Clear inputs
  subjectEl.value = "";
  bodyEl.value = "";

  // Close modal
  const modalEl = document.getElementById("composeModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  // Re-render
  renderInbox();
});