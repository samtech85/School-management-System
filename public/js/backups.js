document.addEventListener('DOMContentLoaded', () => {
  renderLayout('Backup & Restore');

  document.getElementById('download-backup-btn').addEventListener('click', async () => {
    try {
      const token = localStorage.getItem('sms_token');
      const response = await fetch('/api/backups/export', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to generate backup.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `school_ms_backup_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || 'Backup download failed.');
    }
  });
});