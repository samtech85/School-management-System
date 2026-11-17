(function () {
  const list = document.querySelector("[data-backups]");
  if (!list) return;
  window.SMSApi.get("/api/backups")
    .then(({ backups }) => {
      list.replaceChildren();
      (backups.length ? backups : ["No backup files found."]).forEach((name) => {
        const item = document.createElement("li");
        item.textContent = name;
        list.appendChild(item);
      });
    })
    .catch((error) => { list.textContent = error.message; });
})();
