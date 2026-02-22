const elEnvelope = document.getElementById("envelope");

elEnvelope.addEventListener("click", () => {
  if(!state.selectedEmail) return;

  elEnvelope.classList.add("opening");

  setTimeout(() => {
    document.getElementById("letter-content").textContent = state.selectedEmail.body;
    showView("letter");
  }, 780);
});

document.getElementById("btn-back-inbox").addEventListener("click", () => {
  showView("inbox");
});