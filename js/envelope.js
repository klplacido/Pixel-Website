const elEnvelope = document.getElementById("envelope");

elEnvelope.addEventListener("click", () => {
  if(!state.selectedEmail) return;
  // set envelope/letter styling based on author
  elEnvelope.classList.toggle("from-klplacido", state.selectedEmail?.author === "klplacido");

  elEnvelope.classList.add("opening");

  setTimeout(() => {
    document.getElementById("letter-content").textContent = state.selectedEmail.body;
    const paper = document.querySelector(".letter-paper");
    if (paper) paper.classList.toggle("from-klplacido", state.selectedEmail?.author === "klplacido");
    showView("letter");
  }, 780);
});

document.getElementById("btn-back-inbox").addEventListener("click", () => {
  showView("inbox");
});