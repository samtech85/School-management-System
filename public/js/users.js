document.addEventListener('DOMContentLoaded', () => {
  renderLayout('Users Management');
  loadUsers();

  document.getElementById('filter-btn').addEventListener('click', loadUsers);
  document.getElementById('open-add-modal').addEventListener('click', () => openModal());
  document.getElementById('close-modal').addEventListener('click', closeModal);

  document.getElementById('user-form').addEventListener('submit', handleSaveUser);
});

async function loadUsers() {
  const search = document.getElementById('search-input').value;
  const role = document.getElementById('role-filter').value;
  const status = document.getElementById('status-filter').value;

  let query = '/users?';
  if (search) query += `search=${encodeURIComponent(search)}&`;
  if (role) query += `role=${role}&`;
  if (status) query += `status=${status}&`;

  try {
    const res = await apiRequest(query);
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '';

    if (res.users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="p-4 text-center text-gray-500">No users found.</td></tr>`;
      return;
    }

    res.users.forEach(u => {
      const statusBadge = u.status === 'active' ? 'bg-green-100 text-green-800' : u.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800';
      const tr = document.createElement('tr');
      tr.className = 'hover:bg-gray-50 border-b';
      tr.innerHTML = `
        <td class="p-3 font-medium text-heading">${u.username}</td>
        <td class="p-3">${u.first_name} ${u.last_name}</td>
        <td class="p-3 text-xs text-gray-600">${u.email || '-'}<br>${u.phone || ''}</td>
        <td class="p-3"><span class="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 font-medium">${u.role}</span></td>
        <td class="p-3"><span class="px-2 py-1 rounded text-xs font-semibold ${statusBadge}">${u.status}</span></td>
        <td class="p-3 text-right space-x-2">
          <button onclick="editUser(${u.id}, '${u.username}', '${u.first_name}', '${u.last_name}', '${u.email || ''}', '${u.phone || ''}', '${u.role}', '${u.status}')" class="text-secondary hover:underline text-xs">Edit</button>
          <button onclick="toggleStatus(${u.id}, '${u.status}')" class="text-yellow-600 hover:underline text-xs">${u.status === 'active' ? 'Suspend' : 'Activate'}</button>
          <button onclick="deleteUser(${u.id})" class="text-red-600 hover:underline text-xs">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert(err.message || 'Failed to load users');
  }
}

function openModal(user = null) {
  const modal = document.getElementById('user-modal');
  const title = document.getElementById('modal-title');
  const passWrapper = document.getElementById('password-field-wrapper');
  
  document.getElementById('user-form').reset();
  document.getElementById('user-id').value = '';

  if (user) {
    title.textContent = 'Edit User';
    document.getElementById('user-id').value = user.id;
    document.getElementById('form-username').value = user.username;
    document.getElementById('form-username').disabled = true;
    document.getElementById('form-first-name').value = user.first_name;
    document.getElementById('form-last-name').value = user.last_name;
    document.getElementById('form-email').value = user.email;
    document.getElementById('form-phone').value = user.phone;
    document.getElementById('form-role').value = user.role;
    passWrapper.style.display = 'none'; // password not changed here
  } else {
    title.textContent = 'Add New User';
    document.getElementById('form-username').disabled = false;
    passWrapper.style.display = 'block';
  }

  modal.classList.remove('hidden');
}

function closeModal() {
  document.getElementById('user-modal').classList.add('hidden');
}

window.editUser = function(id, username, first_name, last_name, email, phone, role, status) {
  openModal({ id, username, first_name, last_name, email, phone, role, status });
};

async function handleSaveUser(e) {
  e.preventDefault();
  const id = document.getElementById('user-id').value;
  const username = document.getElementById('form-username').value;
  const first_name = document.getElementById('form-first-name').value;
  const last_name = document.getElementById('form-last-name').value;
  const email = document.getElementById('form-email').value;
  const phone = document.getElementById('form-phone').value;
  const role = document.getElementById('form-role').value;
  const password = document.getElementById('form-password').value;

  const data = { username, first_name, last_name, email, phone, role, password };

  try {
    if (id) {
      await apiRequest(`/users/${id}`, 'PUT', data);
      alert('User updated successfully');
    } else {
      await apiRequest('/users', 'POST', data);
      alert('User created successfully');
    }
    closeModal();
    loadUsers();
  } catch (err) {
    alert(err.message || 'Operation failed');
  }
}

window.toggleStatus = async function(id, currentStatus) {
  const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
  if (!confirm(`Are you sure you want to ${newStatus === 'active' ? 'activate' : 'suspend'} this user?`)) return;

  try {
    await apiRequest(`/users/${id}/status`, 'PATCH', { status: newStatus });
    loadUsers();
  } catch (err) {
    alert(err.message || 'Failed to update status');
  }
};

window.deleteUser = async function(id) {
  if (!confirm('Are you sure you want to remove this user?')) return;

  try {
    await apiRequest(`/users/${id}`, 'DELETE');
    loadUsers();
  } catch (err) {
    alert(err.message || 'Failed to delete user');
  }
};