DELETE FROM users WHERE username IN ('admin', 'teacher', 'student', 'accounting');

INSERT INTO users (username, first_name, last_name, email, phone, password_hash, role, status) VALUES
('admin', 'Admin', 'User', 'admin@school.ht', '+50937000001', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'active'),
('teacher', 'Jean', 'Teacher', 'teacher@school.ht', '+50937000002', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teacher', 'active'),
('student', 'Marie', 'Student', 'student@school.ht', '+50937000003', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student', 'active'),
('accounting', 'Pierre', 'Accounting', 'accounting@school.ht', '+50937000004', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Accounting', 'active');