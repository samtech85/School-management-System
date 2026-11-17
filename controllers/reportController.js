const db = require('../config/db');

async function getFinancialSummary(req, res, next) {
  try {
    const summaryQuery = `
      SELECT 
        COUNT(e.id) as total_enrollments,
        SUM(e.fee) as total_expected_fees,
        SUM(e.fee_paid) as total_collected_fees,
        SUM(CASE WHEN e.scholarship = TRUE THEN 1 ELSE 0 END) as total_scholarships,
        SUM(e.fee - e.fee_paid) as total_outstanding_balance
      FROM enrollments e
    `;
    const summaryResult = await db.query(summaryQuery);

    const termRevenueQuery = `
      SELECT t.name as term_name,
             COUNT(e.id) as enrollments_count,
             SUM(e.fee_paid) as collected_revenue
      FROM enrollments e
      JOIN classes cl ON e.class_id = cl.id
      JOIN terms t ON cl.term_id = t.id
      GROUP BY t.id, t.name
      ORDER BY t.start_date DESC
    `;
    const termRevenueResult = await db.query(termRevenueQuery);

    res.json({
      summary: summaryResult.rows[0],
      term_breakdown: termRevenueResult.rows
    });
  } catch (err) {
    next(err);
  }
}

async function getAcademicSummary(req, res, next) {
  try {
    const query = `
      SELECT crs.code, crs.name as course_name, cl.name as class_name,
             COUNT(e.id) as student_count
      FROM classes cl
      JOIN courses crs ON cl.course_id = crs.id
      LEFT JOIN enrollments e ON cl.id = e.class_id
      GROUP BY cl.id, crs.code, crs.name, cl.name
      ORDER BY student_count DESC
    `;
    const result = await db.query(query);
    res.json({ academic_summary: result.rows });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getFinancialSummary,
  getAcademicSummary
};