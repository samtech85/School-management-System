(function () {
  const list = document.querySelector("[data-users]");
  if (!list) return;
  window.SMSApi.get("/api/users")
    .then(({ users }) => {
      window.SMSFormatters.renderRows(list, users, [
        { value: (user) => user.id },
        { value: (user) => window.SMSFormatters.fullName(user) },
        { value: (user) => user.email },
        { value: (user) => user.role }
      ]);
    })
    .catch((error) => { list.textContent = error.message; });
})();
