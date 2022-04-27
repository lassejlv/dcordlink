console.log("Hello World");

function redirect(url) {
  window.location.href = url;
}

function copy(url) {
  const toastCopied = document.getElementById("toast-copied");
  toastCopied.classList.remove("d-none");

  setTimeout(() => {
    toastCopied.classList.add("d-none");
  }, 3000);

  navigator.clipboard.writeText(url);
}

// function validateDiscordInvite() {
//   const create = document.getElementById("create");
//   let errorMessageRed = document.getElementById("error-message-redirect");
//   let inputfield = document.getElementById("redirect");

//   // if the invite dont have an .gg or .com then remove the d-none class
//   if (!inputfield.value.includes(".gg") || !inputfield.value.includes(".com")) {
//     errorMessageRed.classList.add("d-none");
//     create.disabled = true;
//   } else {
//     errorMessageRed.classList.remove("d-none");
//     create.disabled = true;
//   }
// }
