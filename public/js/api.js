(function () {
  const TOKEN_KEY = "sms_token";

  async function request(url, options) {
    const config = options || {};
    const headers = new Headers(config.headers || {});
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (config.body && !(config.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, { ...config, headers });
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || `Request failed (${response.status}).`);
    }
    return response.json();
  }

  window.SMSApi = {
    get: (url) => request(url),
    post: (url, body) => request(url, { method: "POST", body: JSON.stringify(body) }),
    tokenKey: TOKEN_KEY
  };
})();
