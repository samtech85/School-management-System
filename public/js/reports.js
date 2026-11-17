(function () {
  const button = document.querySelector("[data-export-students]");
  if (!button) return;
  button.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/reports/students.csv", {
        headers: { Authorization: `Bearer ${localStorage.getItem("sms_token")}` }
      });
      if (!response.ok) throw new Error("Could not export students.");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "students.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      const message = document.querySelector("[data-message]");
      if (message) message.textContent = error.message;
    }
  });
})();
