// js/app.js

const USERS = {
  fiaaarry:   { password: "12345678", role: "reader" },  // read-only
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