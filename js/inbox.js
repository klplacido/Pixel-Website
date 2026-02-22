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
    item.className = "mail-item";
    item.innerHTML = `
      <span>❤️ ${email.subject}</span>
      <span>${email.date}</span>
    `;

    item.addEventListener("click", () => {
      state.selectedEmail = email;
      showView("envelope");
    });

    mailList.appendChild(item);
  });
}

document.getElementById("btn-send").addEventListener("click", () => {
  const subject = document.getElementById("compose-subject").value;
  const body = document.getElementById("compose-body").value;

  if (!subject || !body) return;

  const emails = getEmails();

  const newEmail = {
    subject,
    body,
    date: new Date().toLocaleDateString(),
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