(function () {
  const loginForm = document.querySelector("#login-form");
  const registerForm = document.querySelector("#register-form");
  const message = document.querySelector("[data-message]");

  async function submit(form, endpoint) {
    const values = Object.fromEntries(new FormData(form).entries());
    try {
      const result = await window.SMSApi.post(`/api/auth/${endpoint}`, values);
      if (endpoint === "login") {
        localStorage.setItem(window.SMSApi.tokenKey, result.token);
        localStorage.setItem("sms_user", JSON.stringify(result.user));
        location.assign("/dashboard.html");
      } else {
        message.textContent = "Account created. You can now sign in.";
        location.assign("/index.html");
      }
    } catch (error) {
      message.textContent = error.message;
    }
  }

  if (loginForm) loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submit(loginForm, "login");
  });
  if (registerForm) registerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    submit(registerForm, "register");
  });
})();
