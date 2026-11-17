let allCourses = [];
let allTerms = [];

document.addEventListener('DOMContentLoaded', () => {
  renderLayout('Academics Management');
  loadAcademicsData();

  document.getElementById('term-form').addEventListener('submit', handleCreateTerm);
  document.getElementById('course-form').addEventListener('submit', handleCreateCourse);
  document.getElementById('class-form').addEventListener('submit', handleCreateClass);
});

async function loadAcademicsData() {
  try {
    const [termsRes, coursesRes, classesRes, usersRes] = await Promise.all([
      apiRequest('/academics/terms'),
      apiRequest('/academics/courses'),
      apiRequest('/academics/classes'),
      apiRequest('/users?role=Teacher')
    ]);

    allTerms = termsRes.terms;
    allCourses = coursesRes.courses;

    // Render Terms
    const termsContainer = document.getElementById('terms-list');
    termsContainer.innerHTML = allTerms.map(t => `
      <div class="p-3 border rounded text-sm flex justify-between items-center bg-gray-50">
        <div>
          <p class="font-bold">${t.name}</p>
          <p class="text-xs text-gray-500">${t.start_date.split('T')[0]} to ${t.end_date.split('T')[0]}</p>
        </div>
        <div class="text-right">
          <span class="px-2 py-0.5 rounded text-xs font-semibold ${t.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}">${t.status}</span>
          <button onclick="toggleTermStatus(${t.id}, '${t.status}')" class="block text-xs text-secondary hover:underline mt-1">Toggle Status</button>
        </div>
      </div>
    `).join('') || '<p class="text-xs text-gray-500">No terms found.</p>';

    // Render Courses
    const coursesContainer = document.getElementById('courses-list');
    coursesContainer.innerHTML = allCourses.map(c => `
      <div class="p-3 border rounded text-sm bg-gray-50">
        <span class="font-bold text-primary-dark">${c.code}</span> - ${c.name}
        ${c.description ? `<p class="text-xs text-gray-600 mt-1">${c.description}</p>` : ''}
      </div>
    `).join('') || '<p class="text-xs text-gray-500">No courses found.</p>';

    // Render Classes
    const classesContainer = document.getElementById('classes-list');
    classesContainer.innerHTML = classesRes.classes.map(cl => `
      <div class="p-3 border rounded text-sm bg-gray-50 flex justify-between items-center">
        <div>
          <p class="font-bold">${cl.class_name} (${cl.course_code})</p>
          <p class="text-xs text-gray-600">Term: ${cl.term_name} | Teacher: ${cl.teacher_first_name ? cl.teacher_first_name + ' ' + cl.teacher_last_name : 'Unassigned'}</p>
        </div>
        <button onclick="deleteClass(${cl.id})" class="text-red-600 hover:underline text-xs">Delete</button>
      </div>
    `).join('') || '<p class="text-xs text-gray-500">No classes found.</p>';

    // Populate Class Modal Dropdowns
    document.getElementById('class-course').innerHTML = allCourses.map(c => `<option value="${c.id}">${c.code} - ${c.name}</option>`).join('');
    document.getElementById('class-term').innerHTML = allTerms.map(t => `<option value="${t.id}">${t.name} (${t.status})</option>`).join('');
    document.getElementById('class-teacher').innerHTML = `<option value="">-- Unassigned --</option>` + usersRes.users.map(u => `<option value="${u.id}">${u.first_name} ${u.last_name}</option>`).join('');

  } catch (err) {
    alert(err.message || 'Failed to load academics data');
  }
}

window.openTermModal = () => document.getElementById('term-modal').classList.remove('hidden');
window.openCourseModal = () => document.getElementById('course-modal').classList.remove('hidden');
window.openClassModal = () => document.getElementById('class-modal').classList.remove('hidden');
window.closeModals = () => {
  document.querySelectorAll('.fixed').forEach(m => m.classList.add('hidden'));
};

async function handleCreateTerm(e) {
  e.preventDefault();
  const name = document.getElementById('term-name').value;
  const start_date = document.getElementById('term-start').value;
  const end_date = document.getElementById('term-end').value;

  try {
    await apiRequest('/academics/terms', 'POST', { name, start_date, end_date });
    closeModals();
    loadAcademicsData();
  } catch (err) {
    alert(err.message);
  }
}

async function handleCreateCourse(e) {
  e.preventDefault();
  const code = document.getElementById('course-code').value;
  const name = document.getElementById('course-name').value;
  const description = document.getElementById('course-desc').value;

  try {
    await apiRequest('/academics/courses', 'POST', { code, name, description });
    closeModals();
    loadAcademicsData();
  } catch (err) {
    alert(err.message);
  }
}

async function handleCreateClass(e) {
  e.preventDefault();
  const name = document.getElementById('class-name').value;
  const course_id = document.getElementById('class-course').value;
  const term_id = document.getElementById('class-term').value;
  const teacher_id = document.getElementById('class-teacher').value;

  try {
    await apiRequest('/academics/classes', 'POST', { name, course_id, term_id, teacher_id: teacher_id || null });
    closeModals();
    loadAcademicsData();
  } catch (err) {
    alert(err.message);
  }
}

window.toggleTermStatus = async function(id, currentStatus) {
  const newStatus = currentStatus === 'open' ? 'closed' : 'open';
  try {
    await apiRequest(`/academics/terms/${id}/status`, 'PATCH', { status: newStatus });
    loadAcademicsData();
  } catch (err) {
    alert(err.message);
  }
};

window.deleteClass = async function(id) {
  if (!confirm('Are you sure you want to delete this class?')) return;
  try {
    await apiRequest(`/academics/classes/${id}`, 'DELETE');
    loadAcademicsData();
  } catch (err) {
    alert(err.message);
  }
};