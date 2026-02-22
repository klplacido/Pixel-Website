// js/inbox.js

const STORAGE_KEY = "pixel_webmail_emails";

function getEmails() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveEmails(emails) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
}

function renderInbox(emailsParam) {
  const mailList = document.getElementById("mail-list");
  mailList.innerHTML = "";

  const emails = Array.isArray(emailsParam) ? emailsParam : getEmails();

  emails.forEach((email, index) => {
    const item = document.createElement("div");
    item.className = "mail-row";
    item.innerHTML = `
      <div class="mail-left">
        <div class="heart"></div>
        <div class="mail-subject">${escapeHtml(email.subject)}</div>
      </div>
      <div class="mail-date">${escapeHtml(email.date)}</div>
      <div class="mail-actions">
        <button class="btn btn-outline-pixel btn-delete">Delete</button>
      </div>
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

    const del = item.querySelector('.btn-delete');
    if (del) {
      del.addEventListener('click', (ev) => {
        ev.stopPropagation();
        if (!confirm('Delete this letter?')) return;
        if (window.lettersAPI && window.lettersAPI.del) {
          window.lettersAPI.del(email.id).then(() => {});
        } else {
          const emails = getEmails();
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
    }

    mailList.appendChild(item);
  });
}

const btnSendEl_inbox = document.getElementById("btn-send");
if (btnSendEl_inbox) btnSendEl_inbox.addEventListener("click", () => {
  const subject = document.getElementById("compose-subject").value;
  const body = document.getElementById("compose-body").value;

  if (!subject || !body) return;

  const newEmail = {
    id: crypto.randomUUID(),
    subject,
    body,
    date: new Date().toLocaleDateString(),
    ts: Date.now(),
    author: state.currentUser?.username || "unknown"
  };

  if (window.lettersAPI && window.lettersAPI.add) {
    window.lettersAPI.add(newEmail).then(() => {});
  } else {
    const emails = getEmails();
    emails.unshift(newEmail);
    saveEmails(emails);
    renderInbox();
  }

  document.getElementById("compose-subject").value = "";
  document.getElementById("compose-body").value = "";

  const modal = bootstrap.Modal.getInstance(
    document.getElementById("composeModal")
  );
  modal.hide();
});

// start Firestore realtime listener if available
if (window.lettersAPI && window.lettersAPI.start) {
  window.lettersAPI.start((list) => renderInbox(list));
}
});