(function () {
  const token = localStorage.getItem("sms_token");
  const protectedPage = !["/", "/index.html", "/register.html"].includes(location.pathname);
  if (protectedPage && !token) location.replace("/index.html");

  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", () => {
      localStorage.removeItem("sms_token");
      localStorage.removeItem("sms_user");
      location.replace("/index.html");
    });
  });
})();
