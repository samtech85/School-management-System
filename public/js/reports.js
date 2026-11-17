document.addEventListener('DOMContentLoaded', async () => {
  renderLayout('Reports & Summaries');

  try {
    const [finRes, acadRes] = await Promise.all([
      apiRequest('/reports/financial'),
      apiRequest('/reports/academic')
    ]);

    const sum = finRes.summary;
    document.getElementById('metric-collected').textContent = formatMoney(sum.total_collected_fees || 0);
    document.getElementById('metric-expected').textContent = formatMoney(sum.total_expected_fees || 0);
    document.getElementById('metric-outstanding').textContent = formatMoney(sum.total_outstanding_balance || 0);
    document.getElementById('metric-scholarships').textContent = sum.total_scholarships || 0;

    // Term Revenue Breakdown
    const termBody = document.getElementById('term-revenue-body');
    termBody.innerHTML = finRes.term_breakdown.map(t => `
      <tr class="hover:bg-gray-50 border-b">
        <td class="p-2.5 font-medium text-heading">${t.term_name}</td>
        <td class="p-2.5">${t.enrollments_count}</td>
        <td class="p-2.5 text-right font-semibold">${formatMoney(t.collected_revenue)}</td>
      </tr>
    `).join('') || `<tr><td colspan="3" class="p-3 text-center text-gray-500">No data available.</td></tr>`;

    // Academic Class Summary
    const acadBody = document.getElementById('academic-summary-body');
    acadBody.innerHTML = acadRes.academic_summary.map(a => `
      <tr class="hover:bg-gray-50 border-b">
        <td class="p-2.5 font-medium text-primary-dark">${a.code}</td>
        <td class="p-2.5">${a.class_name}</td>
        <td class="p-2.5 text-right font-semibold">${a.student_count}</td>
      </tr>
    `).join('') || `<tr><td colspan="3" class="p-3 text-center text-gray-500">No data available.</td></tr>`;

  } catch (err) {
    alert(err.message || 'Failed to load report data');
  }
});