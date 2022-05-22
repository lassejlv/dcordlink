function redirect(url) {
  window.location.href = url;
}

function copy(url) {
  navigator.clipboard.writeText(url);
}

setTimeout(() => {
  document.getElementById("error").remove();
}, 3000);
