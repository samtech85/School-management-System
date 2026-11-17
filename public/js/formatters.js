(function () {
  window.SMSFormatters = {
    date(value) {
      if (!value) return "—";
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
    },
    fullName(person) {
      return [person.first_name, person.last_name].filter(Boolean).join(" ");
    },
    renderRows(target, rows, columns) {
      target.replaceChildren();
      rows.forEach((row) => {
        const tr = document.createElement("tr");
        columns.forEach((column) => {
          const td = document.createElement("td");
          td.textContent = column.value(row);
          tr.appendChild(td);
        });
        target.appendChild(tr);
      });
    }
  };
})();
