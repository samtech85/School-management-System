function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed bottom-5 right-5 z-50 flex flex-col space-y-2';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  const bgClass = type === 'success' ? 'bg-primary text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-secondary text-white';
  toast.className = `px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 transform translate-y-2 opacity-0 ${bgClass}`;
  toast.textContent = message;

  toastContainer.appendChild(toast.cloneNode(true)); // simple render
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function renderLayout(pageTitle) {
  const userStr = localStorage.getItem('sms_user');
  const user = userStr ? JSON.parse(userStr) : { first_name: 'Guest', role: 'User' };

  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  appContainer.className = 'min-h-screen bg-gray-50 flex';

  const sidebarHTML = `
    <aside class="w-64 bg-darkgray-dark text-white flex flex-col hidden md:flex shadow-md">
      <div class="p-5 border-b border-darkgray-light">
        <h1 class="text-xl font-bold text-primary-light">School MS</h1>
        <p class="text-xs text-gray-400">HTG Professional Edition</p>
      </div>
      <nav class="flex-1 p-4 space-y-1 text-sm">
        <a href="dashboard.html" class="block px-3 py-2 rounded hover:bg-darkgray transition">Dashboard</a>
        ${user.role === 'Admin' ? '<a href="users.html" class="block px-3 py-2 rounded hover:bg-darkgray transition">Users Management</a>' : ''}
        ${user.role === 'Admin' ? '<a href="academics.html" class="block px-3 py-2 rounded hover:bg-darkgray transition">Terms, Courses & Classes</a>' : ''}
        ${['Admin', 'Teacher'].includes(user.role) ? '<a href="grades.html" class="block px-3 py-2 rounded hover:bg-darkgray transition">Grades Entry</a>' : ''}
        <a href="reports.html" class="block px-3 py-2 rounded hover:bg-darkgray transition">Reports</a>
        ${user.role === 'Admin' ? '<a href="backups.html" class="block px-3 py-2 rounded hover:bg-darkgray transition">Backup & Restore</a>' : ''}
      </nav>
      <div class="p-4 border-t border-darkgray-light text-xs text-gray-400">
        Role: <span class="text-primary-light font-semibold">${user.role}</span>
      </div>
    </aside>
  `;

  const topbarHTML = `
    <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6 border-b border-gray-200">
      <h2 class="text-lg font-bold text-heading">${pageTitle}</h2>
      <div class="flex items-center space-x-4">
        <span class="text-sm font-medium text-darkgray">Welcome, ${user.first_name}</span>
        <button id="logout-btn" class="bg-red-500 text-white px-3 py-1.5 rounded text-sm hover:bg-red-600 transition">Logout</button>
      </div>
    </header>
  `;

  // Wrap existing content
  const contentHTML = appContainer.innerHTML;
  appContainer.innerHTML = `
    ${sidebarHTML}
    <div class="flex-1 flex flex-col min-w-0">
      ${topbarHTML}
      <main class="flex-1 p-6 overflow-y-auto">
        ${contentHTML}
      </main>
    </div>
  `;

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    localStorage.removeItem('sms_token');
    localStorage.removeItem('sms_user');
    window.location.href = 'index.html';
  });
}