INSERT INTO academic_years (name, starts_on, ends_on, is_current)
VALUES ('2026-2027', DATE '2026-08-01', DATE '2027-07-31', TRUE)
ON CONFLICT (name) DO NOTHING;

INSERT INTO courses (course_code, course_name, description, credits)
VALUES
  ('MATH-101', 'Introduction to Mathematics', 'Foundational mathematical concepts.', 3),
  ('ENG-101', 'English Language Arts', 'Reading, writing, and communication.', 3),
  ('SCI-101', 'General Science', 'An introduction to scientific inquiry.', 3)
ON CONFLICT (course_code) DO NOTHING;
