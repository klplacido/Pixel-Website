// js/login.js

const btnNew = document.getElementById("btn-new");
const elLoginUser = document.getElementById("login-username");
const elLoginPass = document.getElementById("login-password");
const elLoginErr = document.getElementById("login-error");
const elUserBadge = document.getElementById("user-badge");

function applyPermissions() {
  if (!btnNew) return;
  btnNew.style.display = canWrite() ? "inline-block" : "none";
}

const btnLoginEl = document.getElementById("btn-login");
if (btnLoginEl) btnLoginEl.addEventListener("click", () => {
  const u = (elLoginUser?.value || "").trim();
  const p = (elLoginPass?.value || "").trim();

  const account = USERS[u];

  if (account && p === account.password) {
    if (elLoginErr) elLoginErr.style.display = "none";
    state.currentUser = { username: u, role: account.role };
    if (elUserBadge) elUserBadge.textContent = u;

    // Render inbox (inbox.js renderInbox accepts an optional list)
    if (typeof renderInbox === 'function') renderInbox();
    applyPermissions();
    showView("inbox");
  } else {
    if (elLoginErr) elLoginErr.style.display = "block";
  }
});

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
