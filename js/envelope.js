const elEnvelope = document.getElementById("envelope");
if (elEnvelope) {
  elEnvelope.addEventListener("click", () => {
    if(!state.selectedEmail) return;
    // set envelope/letter styling based on author (treat seeded Trial Letter as klplacido)
    const sel = state.selectedEmail || {};
    const isKl = (sel.author === "klplacido") || (!sel.author && sel.subject === "Trial Letter");
    elEnvelope.classList.toggle("from-klplacido", isKl);

    elEnvelope.classList.add("opening");

    setTimeout(() => {
      const letterContent = document.getElementById("letter-content");
      if (letterContent) letterContent.textContent = state.selectedEmail.body;
      const paper = document.querySelector(".letter-paper");
      if (paper) paper.classList.toggle("from-klplacido", state.selectedEmail?.author === "klplacido");
      showView("letter");
    }, 780);
  });
}

const btnBackInbox = document.getElementById("btn-back-inbox");
if (btnBackInbox) btnBackInbox.addEventListener("click", () => {
  showView("inbox");
});