const btnLetterBack = document.getElementById("btn-letter-back");
if (btnLetterBack) btnLetterBack.addEventListener("click", () => {
  showView("inbox");
});

// init
showView("login");