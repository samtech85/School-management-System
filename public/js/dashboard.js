(function () {
  const summary = document.querySelector("[data-summary]");
  if (!summary) return;
  window.SMSApi.get("/api/dashboard")
    .then(({ summary: data }) => {
      summary.replaceChildren();
      Object.entries(data).forEach(([label, count]) => {
        const card = document.createElement("article");
        card.className = "rounded-lg bg-white p-5 shadow";
        const name = document.createElement("p");
        name.className = "text-sm capitalize text-slate-500";
        name.textContent = label;
        const value = document.createElement("p");
        value.className = "text-2xl font-semibold";
        value.textContent = count;
        card.append(name, value);
        summary.appendChild(card);
      });
    })
    .catch((error) => { summary.textContent = error.message; });
})();
