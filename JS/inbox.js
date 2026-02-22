// js/inbox.js

const elMailList = document.getElementById("mail-list");
const btnNew = document.getElementById("btn-new");

function applyPermissions(){
  // Reader: hide New button
  if(btnNew){
    btnNew.style.display = canWrite() ? "inline-block" : "none";
  }
}

function renderInbox(){
  const emails = getEmailsNewestFirst();
  elMailList.innerHTML = "";

  if(emails.length === 0){
    elMailList.innerHTML = `<div style="font-weight:900;color:var(--muted);padding:10px;">No emails yet.</div>`;
    return;
  }

  emails.forEach(email => {
    const row = document.createElement("div");
    row.className = "mail-row";
    row.innerHTML = `
      <div class="mail-left">
        <div class="heart"></div>
        <div class="mail-subject" title="${escapeHtml(email.subject)}">${escapeHtml(email.subject)}</div>
      </div>
      <div class="mail-date">${escapeHtml(email.date)}</div>
    `;

    row.addEventListener("click", () => {
      state.selectedEmail = email;
      showView("envelope");
      document.getElementById("envelope").classList.remove("opening");
    });

    elMailList.appendChild(row);
  });
}

// ✅ Compose / Send (writer only)
document.getElementById("btn-send").addEventListener("click", () => {
  if(!canWrite()){
    alert("Read-only account. Only klplacido can add letters.");
    return;
  }

  const subject = (document.getElementById("compose-subject").value || "").trim() || "Untitled";
  const body    = (document.getElementById("compose-body").value || "").trim() || "(empty)";

  const now = new Date();
  const newEmail = {
    id: crypto.randomUUID(),
    subject,
    body,
    date: formatDate(now),
    ts: now.getTime()
  };

  const emails = loadEmails();
  emails.push(newEmail);
  saveEmails(emails);

  document.getElementById("compose-subject").value = "";
  document.getElementById("compose-body").value = "";

  const modalEl = document.getElementById("composeModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();

  renderInbox();
});