document.addEventListener('DOMContentLoaded', async () => {
  renderLayout('Grades Entry');
  await loadClassesDropdown();

  document.getElementById('load-grades-btn').addEventListener('click', loadClassGrades);
});

async function loadClassesDropdown() {
  try {
    const res = await apiRequest('/academics/classes');
    const select = document.getElementById('class-select');
    select.innerHTML = `<option value="">-- Choose Class --` + res.classes.map(c => `<option value="${c.id}">${c.class_name} - ${c.course_name} (${c.term_name})</option>`).join('');
  } catch (err) {
    alert('Failed to load classes');
  }
}

async function loadClassGrades() {
  const classId = document.getElementById('class-select').value;
  if (!classId) {
    alert('Please select a class first.');
    return;
  }

  try {
    const [enrollRes, rulesRes, gradesRes] = await Promise.all([
      apiRequest('/enrollments'),
      apiRequest('/grading/rules'),
      apiRequest(`/grades?class_id=${classId}`)
    ]);

    const classEnrollments = enrollRes.enrollments.filter(e => e.class_id == classId);
    const tbody = document.getElementById('grades-table-body');
    tbody.innerHTML = '';

    if (classEnrollments.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="p-4 text-center text-gray-500">No students enrolled in this class.</td></tr>`;
      return;
    }

    // Map existing grades
    const gradeMap = {};
    gradesRes.grades.forEach(g => {
      gradeMap[`${g.enrollment_id}-${g.component_name}`] = g;
    });

    classEnrollments.forEach(enr => {
      ['Quiz 1', 'Midterm', 'Final'].forEach(comp => {
        const key = `${enr.id}-${comp}`;
        const existingGrade = gradeMap[key] || { score: '', max_score: 100 };

        const tr = document.createElement('tr');
        tr.className = 'hover:bg-gray-50 border-b';
        tr.innerHTML = `
          <td class="p-3 font-medium text-heading">${enr.student_first_name} ${enr.student_last_name}</td>
          <td class="p-3 font-semibold text-secondary">${comp}</td>
          <td class="p-3">
            <input type="number" step="0.01" id="score-${enr.id}-${comp}" value="${existingGrade.score}" class="w-24 px-2 py-1 border rounded text-sm">
          </td>
          <td class="p-3">
            <input type="number" step="0.01" id="max-${enr.id}-${comp}" value="${existingGrade.max_score}" class="w-24 px-2 py-1 border rounded text-sm">
          </td>
          <td class="p-3 text-right">
            <button onclick="saveGrade(${enr.id}, '${comp}')" class="bg-primary text-white px-3 py-1 rounded text-xs hover:bg-primary-dark">Save</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    });
  } catch (err) {
    alert(err.message || 'Failed to load grade sheets');
  }
}

window.saveGrade = async function(enrollmentId, componentName) {
  const scoreVal = document.getElementById(`score-${enrollmentId}-${componentName}`).value;
  const maxVal = document.getElementById(`max-${enrollmentId}-${componentName}`).value;

  if (scoreVal === '' || maxVal === '') {
    alert('Please enter both score and max score.');
    return;
  }

  try {
    await apiRequest('/grades', 'POST', {
      enrollment_id: enrollmentId,
      component_name: componentName,
      score: parseFloat(scoreVal),
      max_score: parseFloat(maxVal)
    });
    alert('Grade saved successfully.');
  } catch (err) {
    alert(err.message || 'Failed to save grade');
  }
};