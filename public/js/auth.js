document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const res = await apiRequest('/auth/login', 'POST', { email, password });
        localStorage.setItem('sms_token', res.token);
        localStorage.setItem('sms_user', JSON.stringify(res.user));
        window.location.href = 'dashboard.html';
      } catch (err) {
        alert(err.message || 'Login failed');
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const first_name = document.getElementById('first_name').value;
      const last_name = document.getElementById('last_name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      const role = document.getElementById('role').value;

      try {
        const res = await apiRequest('/auth/register', 'POST', { first_name, last_name, email, phone, password, role });
        alert(res.message);
        window.location.href = 'index.html';
      } catch (err) {
        alert(err.message || 'Registration failed');
      }
    });
  }
});