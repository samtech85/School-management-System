(function () {
  const list = document.querySelector("[data-grades]");
  if (!list) return;
  window.SMSApi.get("/api/grades")
    .then(({ grades }) => {
      window.SMSFormatters.renderRows(list, grades, [
        { value: (grade) => window.SMSFormatters.fullName(grade) },
        { value: (grade) => grade.course_code },
        { value: (grade) => grade.grade }
      ]);
    })
    .catch((error) => { list.textContent = error.message; });
})();
