(function () {
  const list = document.querySelector("[data-courses]");
  if (!list) return;
  window.SMSApi.get("/api/academics/courses")
    .then(({ courses }) => {
      window.SMSFormatters.renderRows(list, courses, [
        { value: (course) => course.course_code },
        { value: (course) => course.course_name },
        { value: (course) => course.credits }
      ]);
    })
    .catch((error) => { list.textContent = error.message; });
})();
