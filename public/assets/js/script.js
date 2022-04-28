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
