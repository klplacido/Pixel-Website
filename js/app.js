// js/app.js

const USERS = {
  fiaaarry:   { password: "12345678", role: "writer" },  // allow sending letters
  klplacido:  { password: "12345678", role: "writer" }   // can add letters
};

const STORAGE_KEY = "pixel_webmail_emails";

const views = {
  login: document.getElementById("view-login"),
  inbox: document.getElementById("view-inbox"),
  envelope: document.getElementById("view-envelope"),
  letter: document.getElementById("view-letter"),
};

const state = {
  selectedEmail: null,
  currentUser: null,   // { username, role }
};

function showView(name){
  Object.values(views).forEach(v => v.classList.remove("active"));
  views[name].classList.add("active");
}

function formatDate(d){
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const yy = d.getFullYear();
  return `${mm}/${dd}/${yy}`;
}

function loadEmails(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch {}
  }
  const seed = [{
    id: crypto.randomUUID(),
    subject: "Trial Letter",
    body: "practice lang po hehehe thanks",
    date: "2/22/2026",
    ts: new Date("2026-02-22T08:00:00").getTime(),
    author: "klplacido"
  }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
  return seed;
}

function saveEmails(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getEmailsNewestFirst(){
  const emails = loadEmails();
  emails.sort((a,b) => b.ts - a.ts);
  return emails;
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ✅ Permission helper
function canWrite(){
  return state.currentUser && state.currentUser.role === "writer";
}

// Listen for storage changes in other tabs/windows and re-render the inbox
window.addEventListener('storage', (e) => {
  try {
    if (e.key === STORAGE_KEY) {
      if (typeof renderInbox === 'function') renderInbox();
    }
  } catch (err) {
    // ignore
  }
});

// Firestore wrapper API (if Firestore is initialized)
;(function(){
  const db = window.__DB || null;
  const lettersCol = db ? db.collection('letters') : null;

  function startListener(cb){
    if (!lettersCol) return;
    lettersCol.orderBy('ts','desc').onSnapshot(snapshot => {
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      try { cb(list); } catch(e){}
    });
  }

  function addLetter(obj){
    if (!lettersCol) return Promise.resolve().then(() => { const list = loadEmails(); list.unshift(obj); saveEmails(list); if (typeof renderInbox === 'function') renderInbox(); });
    return lettersCol.add(obj);
  }

  function deleteLetter(id){
    if (!lettersCol) return Promise.resolve().then(() => { const list = loadEmails(); const idx = list.findIndex(l=>l.id===id); if (idx>=0){ list.splice(idx,1); saveEmails(list); if (typeof renderInbox === 'function') renderInbox(); } });
    return lettersCol.doc(id).delete();
  }

  function getAllOnce(){
    if (!lettersCol) return Promise.resolve(getEmailsNewestFirst());
    return lettersCol.orderBy('ts','desc').get().then(snapshot => {
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      return list;
    });
  }

  window.lettersAPI = {
    start: startListener,
    add: addLetter,
    del: deleteLetter,
    getOnce: getAllOnce
  };
})();