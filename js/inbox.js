// js/inbox.js

const STORAGE_KEY = "pixel_webmail_emails";

function getEmails() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveEmails(emails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
}

function renderInbox() {
  const mailList = document.getElementById("mail-list");
  mailList.innerHTML = "";

  const emails = getEmails();

  emails.forEach((email, index) => {
    const item = document.createElement("div");
    item.className = "mail-row";
    item.innerHTML = `
      <div class="mail-left">
        <div class="heart"></div>
        <div class="mail-subject">${escapeHtml(email.subject)}</div>
      </div>
      <div class="mail-date">${escapeHtml(email.date)}</div>
    `;

    item.addEventListener("click", () => {
      state.selectedEmail = email;
      showView("envelope");
      const env = document.getElementById("envelope");
      if (env) {
        env.classList.remove("opening");
        const isKl = (email.author === "klplacido") || (!email.author && email.subject === "Trial Letter");
        env.classList.toggle("from-klplacido", isKl);
      }
    });

    if (email.author === "klplacido") item.classList.add("from-klplacido");

    mailList.appendChild(item);
  });
}

document.getElementById("btn-send").addEventListener("click", () => {
  const subject = document.getElementById("compose-subject").value;
  const body = document.getElementById("compose-body").value;

  if (!subject || !body) return;

  const emails = getEmails();

  const newEmail = {
    id: crypto.randomUUID(),
    subject,
    body,
    date: new Date().toLocaleDateString(),
    ts: Date.now(),
    author: state.currentUser?.username || "unknown"
  };

  // Add new email to top
  emails.unshift(newEmail);

  saveEmails(emails);

  renderInbox();

  document.getElementById("compose-subject").value = "";
  document.getElementById("compose-body").value = "";

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("composeModal")
  );
  modal.hide();
});