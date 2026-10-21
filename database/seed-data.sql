-- =============================================================================
-- College Placement Management System (CPMS) — Seed Test Data Script
-- Target Engine: PostgreSQL 14+
-- =============================================================================

BEGIN;

-- -----------------------------------------------------------------------------
-- 1. Users (Admin, Placement Officer, Recruiters, Students)
-- Passwords are set to standard BCrypt hashes for test convenience (e.g., 'Password123!')
-- BCrypt hash for 'Password123!': $2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu
-- -----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, role, status) VALUES
(1, 'admin@college.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu', 'ADMIN', 'ACTIVE'),
(2, 'meera.joshi@college.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu', 'PLACEMENT_OFFICER', 'ACTIVE'),
(3, 'recruiter@nimbusanalytics.example', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu', 'RECRUITER', 'ACTIVE'),
(4, 'recruiter@harborsystems.example', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu', 'RECRUITER', 'ACTIVE'),
(5, 'aisha.khan@student.campus.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu', 'STUDENT', 'ACTIVE'),
(6, 'rohan.mehta@student.campus.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu', 'STUDENT', 'ACTIVE'),
(7, 'priya.nair@student.campus.edu', '$2a$10$7EqJtq98hPqEX7fNZaFWoO.8/qG1RkH4U8eS/g7G8N7bX7qYF3cTu', 'STUDENT', 'ACTIVE');

-- Synchronize sequence
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- -----------------------------------------------------------------------------
-- 2. Companies
-- -----------------------------------------------------------------------------
INSERT INTO companies (id, name, website_url, industry_sector, location, description, contact_email, contact_phone, verification_status) VALUES
(1, 'Nimbus Analytics', 'https://nimbusanalytics.example', 'Data Analytics', 'Bengaluru, Karnataka', 'Nimbus Analytics builds decision-support products for mid-market teams. Campus hiring focuses on software engineering, data analysis, and product roles.', 'campus@nimbusanalytics.example', '+91 80 4000 1200', 'VERIFIED'),
(2, 'Harbor Systems', 'https://harborsystems.example', 'Enterprise Software', 'Hyderabad, Telangana', 'Harbor Systems develops mission-critical workflow engines and enterprise data infrastructure.', 'campus@harborsystems.example', '+91 40 4000 3400', 'VERIFIED'),
(3, 'Cedar Soft', 'https://cedarsoft.example', 'Cloud Applications', 'Pune, Maharashtra', 'Cedar Soft delivers cloud-native web and microservice platforms for global educational and fintech clients.', 'careers@cedarsoft.example', '+91 20 4000 5600', 'VERIFIED');

SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies));

-- -----------------------------------------------------------------------------
-- 3. Recruiter Profiles
-- -----------------------------------------------------------------------------
INSERT INTO recruiter_profiles (id, user_id, company_id, designation, phone_number, is_primary_contact) VALUES
(1, 3, 1, 'Senior Talent Acquisition Lead', '+91 98765 43210', TRUE),
(2, 4, 2, 'University Relations Manager', '+91 98765 43211', TRUE);

SELECT setval('recruiter_profiles_id_seq', (SELECT MAX(id) FROM recruiter_profiles));

-- -----------------------------------------------------------------------------
-- 4. Student Profiles
-- -----------------------------------------------------------------------------
INSERT INTO student_profiles (id, user_id, roll_number, full_name, phone_number, alternate_email, gender, date_of_birth, current_address, linkedin_url, github_url, is_profile_complete) VALUES
(1, 5, '2022CS0101', 'Aisha Khan', '+91 98111 22331', 'aisha.personal@example.com', 'Female', '2004-03-15', 'College Hostel Block A, Room 204', 'https://linkedin.com/in/aisha-khan-example', 'https://github.com/aishakhan', TRUE),
(2, 6, '2022IT0145', 'Rohan Mehta', '+91 98111 22332', 'rohan.personal@example.com', 'Male', '2004-07-22', 'College Hostel Block B, Room 108', 'https://linkedin.com/in/rohan-mehta-example', 'https://github.com/rohanmehta', TRUE),
(3, 7, '2022EC0089', 'Priya Nair', '+91 98111 22333', 'priya.personal@example.com', 'Female', '2004-11-05', 'College Hostel Block A, Room 310', 'https://linkedin.com/in/priya-nair-example', 'https://github.com/priyanair', TRUE);

SELECT setval('student_profiles_id_seq', (SELECT MAX(id) FROM student_profiles));

-- -----------------------------------------------------------------------------
-- 5. Academic Records (Certified and Locked by Placement Officer)
-- -----------------------------------------------------------------------------
INSERT INTO academic_records (id, student_profile_id, degree_program, department_branch, graduation_year, current_cgpa, tenth_percentage, twelfth_percentage, active_backlogs, cleared_backlogs, verification_status, verified_by_user_id, verified_at) VALUES
(1, 1, 'B.Tech', 'CSE', 2026, 8.40, 92.50, 89.00, 0, 0, 'VERIFIED', 2, CURRENT_TIMESTAMP - INTERVAL '15 days'),
(2, 2, 'B.Tech', 'IT', 2026, 7.90, 88.00, 84.50, 0, 0, 'VERIFIED', 2, CURRENT_TIMESTAMP - INTERVAL '14 days'),
(3, 3, 'B.Tech', 'ECE', 2026, 8.10, 91.00, 87.50, 0, 0, 'VERIFIED', 2, CURRENT_TIMESTAMP - INTERVAL '12 days');

SELECT setval('academic_records_id_seq', (SELECT MAX(id) FROM academic_records));

-- -----------------------------------------------------------------------------
-- 6. Skills Catalog
-- -----------------------------------------------------------------------------
INSERT INTO skills (id, skill_name, category) VALUES
(1, 'Java', 'Programming Language'),
(2, 'Spring Boot', 'Framework'),
(3, 'PostgreSQL', 'Database'),
(4, 'JavaScript', 'Programming Language'),
(5, 'React', 'Framework'),
(6, 'TypeScript', 'Programming Language'),
(7, 'Python', 'Programming Language'),
(8, 'SQL', 'Database'),
(9, 'Tableau', 'Analytics'),
(10, 'Data Structures', 'Fundamentals'),
(11, 'Docker', 'DevOps'),
(12, 'Selenium', 'Testing');

SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));

-- -----------------------------------------------------------------------------
-- 7. Student Skills
-- -----------------------------------------------------------------------------
INSERT INTO student_skills (student_profile_id, skill_id, proficiency_level) VALUES
(1, 4, 'Advanced'), -- Aisha: JavaScript
(1, 5, 'Advanced'), -- Aisha: React
(1, 8, 'Intermediate'), -- Aisha: SQL
(2, 1, 'Advanced'), -- Rohan: Java
(2, 2, 'Intermediate'), -- Rohan: Spring Boot
(2, 3, 'Intermediate'), -- Rohan: PostgreSQL
(3, 7, 'Advanced'), -- Priya: Python
(3, 8, 'Advanced'), -- Priya: SQL
(3, 9, 'Intermediate'); -- Priya: Tableau

-- -----------------------------------------------------------------------------
-- 8. Resumes
-- -----------------------------------------------------------------------------
INSERT INTO resumes (id, student_profile_id, title, file_storage_path, original_file_name, file_size_bytes, mime_type, is_default) VALUES
(1, 1, 'Aisha Khan - Software Engineering 2026', '/uploads/resumes/2026/aisha_khan_se.pdf', 'Aisha_Khan_Resume.pdf', 142500, 'application/pdf', TRUE),
(2, 2, 'Rohan Mehta - Backend Developer 2026', '/uploads/resumes/2026/rohan_mehta_backend.pdf', 'Rohan_Mehta_Resume.pdf', 158200, 'application/pdf', TRUE),
(3, 3, 'Priya Nair - Data Analyst 2026', '/uploads/resumes/2026/priya_nair_analyst.pdf', 'Priya_Nair_Resume.pdf', 139800, 'application/pdf', TRUE);

SELECT setval('resumes_id_seq', (SELECT MAX(id) FROM resumes));

-- -----------------------------------------------------------------------------
-- 9. Placement Drives
-- -----------------------------------------------------------------------------
INSERT INTO placement_drives (id, title, academic_year, start_date, end_date, registration_deadline, drive_mode, status, created_by_user_id) VALUES
(1, 'Campus Recruitment Drive 2026 — Software Engineers', '2025-2026', '2026-10-20', '2026-11-15', CURRENT_TIMESTAMP + INTERVAL '10 days', 'On-Campus', 'Open', 2),
(2, 'Analyst Hiring Drive 2026', '2025-2026', '2026-11-01', '2026-11-25', CURRENT_TIMESTAMP + INTERVAL '14 days', 'Virtual', 'Open', 2);

SELECT setval('placement_drives_id_seq', (SELECT MAX(id) FROM placement_drives));

-- -----------------------------------------------------------------------------
-- 10. Job Openings
-- -----------------------------------------------------------------------------
INSERT INTO job_openings (id, company_id, placement_drive_id, title, description, job_type, location, salary_text, min_salary, max_salary, application_deadline, status, min_cgpa, allowed_branches, max_active_backlogs, batch_year, posted_at) VALUES
(1, 1, 1, 'Graduate Software Engineer', 'Design and implement customer-facing decision support analytics services using TypeScript, React, and SQL.', 'Full-time', 'Bengaluru', '12 LPA', 1200000.00, 1200000.00, CURRENT_TIMESTAMP + INTERVAL '12 days', 'Published', 7.00, 'CSE, IT', 0, 2026, CURRENT_TIMESTAMP - INTERVAL '5 days'),
(2, 1, 1, 'Backend Intern', 'Build high-performance microservices, REST APIs, and database migrations with Java and Spring Boot.', 'Internship', 'Remote', '25k / month', 300000.00, 300000.00, CURRENT_TIMESTAMP + INTERVAL '8 days', 'Published', 7.00, 'CSE, IT, ECE', 0, 2026, CURRENT_TIMESTAMP - INTERVAL '6 days'),
(3, 2, 2, 'Associate Product Analyst', 'Collaborate with product and operations teams to analyze placement and user funnels with Python and SQL.', 'Full-time', 'Hyderabad', '9 LPA', 900000.00, 900000.00, CURRENT_TIMESTAMP + INTERVAL '15 days', 'Published', 6.50, 'Any branch', 0, 2026, CURRENT_TIMESTAMP - INTERVAL '4 days'),
(4, 3, 1, 'Junior Full-Stack Developer', 'Develop modern responsive web applications across React and Spring Boot services for enterprise campus clients.', 'Full-time', 'Pune', '10 LPA', 1000000.00, 1000000.00, CURRENT_TIMESTAMP + INTERVAL '20 days', 'Published', 7.50, 'CSE, ECE', 0, 2026, CURRENT_TIMESTAMP - INTERVAL '7 days');

SELECT setval('job_openings_id_seq', (SELECT MAX(id) FROM job_openings));

-- Job Skills
INSERT INTO job_skills (job_opening_id, skill_id, is_mandatory) VALUES
(1, 4, TRUE),  -- Job 1 requires JavaScript
(1, 5, TRUE),  -- Job 1 requires React
(1, 8, TRUE),  -- Job 1 requires SQL
(2, 1, TRUE),  -- Job 2 requires Java
(2, 2, TRUE),  -- Job 2 requires Spring Boot
(2, 3, TRUE),  -- Job 2 requires PostgreSQL
(3, 7, TRUE),  -- Job 3 requires Python
(3, 8, TRUE),  -- Job 3 requires SQL
(3, 9, FALSE); -- Job 3 prefers Tableau

-- -----------------------------------------------------------------------------
-- 11. Applications
-- -----------------------------------------------------------------------------
INSERT INTO applications (id, student_profile_id, job_opening_id, resume_id, current_status, student_remarks, recruiter_notes, applied_at) VALUES
(1, 1, 1, 1, 'Shortlisted', 'Passionate about data visualization and front-end architecture.', 'Strong project portfolio aligned with product analytics stack.', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(2, 2, 2, 2, 'Applied', 'Interested in cloud microservices and scalable backends.', NULL, CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 3, 3, 3, 'Interview Scheduled', 'Analytical mindset with extensive experience in statistical querying.', 'Campus interview slot reserved for technical discussion.', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(4, 3, 4, 3, 'Selected', 'Eager to build robust full-stack campus software.', 'Exceptional performance throughout all technical rounds.', CURRENT_TIMESTAMP - INTERVAL '10 days');

SELECT setval('applications_id_seq', (SELECT MAX(id) FROM applications));

-- -----------------------------------------------------------------------------
-- 12. Application Status History (Audit Trail)
-- -----------------------------------------------------------------------------
INSERT INTO application_status_history (application_id, from_status, to_status, changed_by_user_id, remarks, changed_at) VALUES
(1, NULL, 'Applied', 5, 'Initial application submitted', CURRENT_TIMESTAMP - INTERVAL '3 days'),
(1, 'Applied', 'Shortlisted', 3, 'Candidate meets minimum CGPA cutoff and technical criteria', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(2, NULL, 'Applied', 6, 'Initial application submitted', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, NULL, 'Applied', 7, 'Initial application submitted', CURRENT_TIMESTAMP - INTERVAL '4 days'),
(3, 'Applied', 'Shortlisted', 4, 'Shortlisted based on Python and SQL test score', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(3, 'Shortlisted', 'Interview Scheduled', 4, 'Interview slot assigned for Technical Round 1', CURRENT_TIMESTAMP - INTERVAL '1 day'),
(4, NULL, 'Applied', 7, 'Initial application submitted', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(4, 'Applied', 'Shortlisted', 2, 'Shortlisted for Cedar Soft drive', CURRENT_TIMESTAMP - INTERVAL '8 days'),
(4, 'Shortlisted', 'Interview Scheduled', 2, 'Technical round scheduled', CURRENT_TIMESTAMP - INTERVAL '6 days'),
(4, 'Interview Scheduled', 'Selected', 2, 'Candidate cleared all rounds with top marks', CURRENT_TIMESTAMP - INTERVAL '3 days');

-- -----------------------------------------------------------------------------
-- 13. Interview Rounds
-- -----------------------------------------------------------------------------
INSERT INTO interview_rounds (id, application_id, round_number, round_name, scheduled_at, duration_minutes, interview_mode, venue_or_link, interviewer_name, status, result, feedback) VALUES
(1, 3, 1, 'Technical Interview 1 — Python & SQL', CURRENT_TIMESTAMP + INTERVAL '3 days', 45, 'Virtual', 'https://meet.harborsystems.example/interview-slot-102', 'Vikram Sen', 'Scheduled', 'Pending', NULL),
(2, 4, 1, 'Technical Evaluation — Full Stack', CURRENT_TIMESTAMP - INTERVAL '5 days', 60, 'In-Person', 'Lab Block 3, Interview Room A', 'Arun Kumar', 'Completed', 'Cleared', 'Demonstrated exceptional understanding of React and Spring Boot REST APIs.'),
(3, 4, 2, 'HR & Managerial Round', CURRENT_TIMESTAMP - INTERVAL '4 days', 30, 'In-Person', 'Admin Building, Board Room 2', 'Sunita Rao', 'Completed', 'Cleared', 'Strong communication skills and cultural alignment.');

SELECT setval('interview_rounds_id_seq', (SELECT MAX(id) FROM interview_rounds));

-- -----------------------------------------------------------------------------
-- 14. Placement Outcomes
-- -----------------------------------------------------------------------------
INSERT INTO placement_outcomes (id, application_id, student_profile_id, company_id, job_opening_id, offered_ctc, offer_letter_url, offered_date, acceptance_deadline, student_response, response_date, joining_date) VALUES
(1, 4, 3, 3, 4, 1000000.00, '/offers/2026/priya_nair_cedar_soft_offer.pdf', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '10 days', 'Accepted', CURRENT_TIMESTAMP - INTERVAL '1 day', '2026-07-01');

SELECT setval('placement_outcomes_id_seq', (SELECT MAX(id) FROM placement_outcomes));

COMMIT;
-- =============================================================================
-- End of Seed Test Data
-- =============================================================================
