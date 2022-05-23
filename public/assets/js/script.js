function redirect(url) {
  window.location.href = url;
}

function copy(url) {
  navigator.clipboard.writeText(url);
}

setTimeout(() => {
  document.getElementById("toast").remove();
}, 3000);

document.getElementById("copy").addEventListener("click", () => {
  document.querySelector(".copied").classList.remove("hidden");

  setTimeout(() => {
    document.querySelector(".copied").classList.add("hidden");
  }, 3000);
});
