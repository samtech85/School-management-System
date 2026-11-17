document.addEventListener('DOMContentLoaded', () => {
  renderLayout('Enrollments & Fees');
  loadEnrollmentsData();

  document.getElementById('enroll-form').addEventListener('submit', handleEnrollSubmit);
});

async function loadEnrollmentsData() {
  try {
    const [enrollRes, studentsRes, classesRes] = await Promise.all([
      apiRequest('/enrollments'),
      apiRequest('/users?role=Student'),
      apiRequest('/academics/classes')
    ]);

    const tbody = document.getElementById('enrollments-table-body');
    tbody.innerHTML = '';

    if (enrollRes.enrollments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="p-4 text-center text-gray-500">No enrollments found.</td></tr>`;
    } else {
      enrollRes.enrollments.forEach(e => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 border-b';
        tr.innerHTML = `
          <td class="p-3 font-medium text-heading">${e.student_first_name} ${e.student_last_name}</td>
          <td class="p-3">${e.class_name} (${e.course_code})</td>
          <td class="p-3">${e.term_name}</td>
          <td class="p-3">${formatMoney(e.fee)}</td>
          <td class="p-3">${formatMoney(e.fee_paid)}</td>
          <td class="p-3">${e.scholarship ? '<span class="px-2 py-0.5 rounded text-xs bg-purple-100 text-purple-800 font-medium">Yes</span>' : 'No'}</td>
          <td class="p-3 text-xs font-mono">${e.receipt_id || '-'}</td>
          <td class="p-3 text-right space-x-2">
            <button onclick="deleteEnrollment(${e.id})" class="text-red-600 hover:underline text-xs">Remove</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    // Populate Modal Dropdowns
    document.getElementById('enroll-student').innerHTML = studentsRes.users.map(s => `<option value="${s.id}">${s.first_name} ${s.last_name} (${s.username})</option>`).join('');
    document.getElementById('enroll-class').innerHTML = classesRes.classes.map(c => `<option value="${c.id}">${c.class_name} - ${c.course_name} (${c.term_name})</option>`).join('');

  } catch (err) {
    alert(err.message || 'Failed to load enrollments');
  }
}

window.openEnrollModal = () => document.getElementById('enroll-modal').classList.remove('hidden');
window.closeEnrollModal = () => document.getElementById('enroll-modal').classList.add('hidden');

async function handleEnrollSubmit(e) {
  e.preventDefault();
  const student_id = document.getElementById('enroll-student').value;
  const class_id = document.getElementById('enroll-class').value;
  const fee = document.getElementById('enroll-fee').value;
  const scholarship = document.getElementById('enroll-scholarship').checked;

  try {
    await apiRequest('/enrollments', 'POST', { student_id, class_id, fee, scholarship });
    closeEnrollModal();
    loadEnrollmentsData();
  } catch (err) {
    alert(err.message || 'Enrollment failed');
  }
}

window.deleteEnrollment = async function(id) {
  if (!confirm('Are you sure you want to remove this enrollment?')) return;
  try {
    await apiRequest(`/enrollments/${id}`, 'DELETE');
    loadEnrollmentsData();
  } catch (err) {
    alert(err.message || 'Failed to delete enrollment');
  }
};