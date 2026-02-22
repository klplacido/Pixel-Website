// js/login.js

const elLoginUser = document.getElementById("login-username");
const elLoginPass = document.getElementById("login-password");
const elLoginErr  = document.getElementById("login-error");

document.getElementById("btn-login").addEventListener("click", () => {
  const u = (elLoginUser.value || "").trim();
  const p = (elLoginPass.value || "").trim();

  const account = USERS[u];

  if(account && p === account.password){
    elLoginErr.style.display = "none";
    state.currentUser = { username: u, role: account.role };

    renderInbox();
    applyPermissions();     // ✅ hide/show New button
    showView("inbox");
  }else{
    elLoginErr.style.display = "block";
  }
});

// Enter key support
[elLoginUser, elLoginPass].forEach(inp => {
  inp.addEventListener("keydown", (e) => {
    if(e.key === "Enter") document.getElementById("btn-login").click();
  });
});

// Logout
document.getElementById("btn-logout").addEventListener("click", () => {
  state.currentUser = null;
  state.selectedEmail = null;

  elLoginUser.value = "";
  elLoginPass.value = "";
  elLoginErr.style.display = "none";

  showView("login");
});