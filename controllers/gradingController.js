const db = require('../config/db');

async function getGradingRules(req, res, next) {
  try {
    const query = `
      SELECT gr.id, gr.course_id, gr.term_id, gr.passing_score, gr.components,
             crs.code as course_code, crs.name as course_name,
             t.name as term_name
      FROM grading_rules gr
      JOIN courses crs ON gr.course_id = crs.id
      JOIN terms t ON gr.term_id = t.id
      ORDER BY t.start_date DESC, crs.code ASC
    `;
    const result = await db.query(query);
    res.json({ grading_rules: result.rows });
  } catch (err) {
    next(err);
  }
}

async function upsertGradingRule(req, res, next) {
  try {
    const { course_id, term_id, passing_score, components } = req.body;

    if (!course_id || !term_id || passing_score === undefined || !components) {
      return res.status(400).json({ error: 'Course ID, term ID, passing score, and components are required.' });
    }

    // Validate component weights sum to 1.0
    const totalWeight = components.reduce((sum, comp) => sum + parseFloat(comp.weight || 0), 0);
    if (Math.abs(totalWeight - 1.0) > 0.01) {
      return res.status(400).json({ error: 'Grading component weights must sum to 1.0 (100%).' });
    }

    const queryText = `
      INSERT INTO grading_rules (course_id, term_id, passing_score, components)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (course_id, term_id)
      DO UPDATE SET passing_score = EXCLUDED.passing_score, components = EXCLUDED.components
      RETURNING *
    `;
    const result = await db.query(queryText, [course_id, term_id, passing_score, JSON.stringify(components)]);

    res.status(200).json({
      message: 'Grading rules saved successfully.',
      grading_rule: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getGradingRules,
  upsertGradingRule
};