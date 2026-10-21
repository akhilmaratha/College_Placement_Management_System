-- =============================================================================
-- College Placement Management System (CPMS) — PostgreSQL Database Schema
-- Target Engine: PostgreSQL 14+
-- Generated for CodeInnov8ors Team
-- =============================================================================

-- Enable standard strict mode and transaction block
BEGIN;

-- -----------------------------------------------------------------------------
-- Clean up existing tables and functions (Reverse Dependency Order)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS placement_outcomes CASCADE;
DROP TABLE IF EXISTS interview_rounds CASCADE;
DROP TABLE IF EXISTS application_status_history CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS job_skills CASCADE;
DROP TABLE IF EXISTS job_openings CASCADE;
DROP TABLE IF EXISTS placement_drives CASCADE;
DROP TABLE IF EXISTS recruiter_profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS student_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS academic_records CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- -----------------------------------------------------------------------------
-- Automated updated_at Timestamp Trigger Function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. Identity and Access Management
-- =============================================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('STUDENT', 'RECRUITER', 'PLACEMENT_OFFICER', 'ADMIN')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED', 'PENDING_VERIFICATION'))
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE users IS 'Central identity and authentication accounts for all system actors';
COMMENT ON COLUMN users.email IS 'Unique institutional or corporate login email (stored lowercase)';
COMMENT ON COLUMN users.password_hash IS 'Cryptographically hashed password (BCrypt/Argon2); plaintext is prohibited';

-- =============================================================================
-- 2. Student Profiles and Academic Records
-- =============================================================================

CREATE TABLE student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    alternate_email VARCHAR(255),
    gender VARCHAR(20),
    date_of_birth DATE,
    current_address TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    is_profile_complete BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_student_profiles_user UNIQUE (user_id),
    CONSTRAINT uq_student_profiles_roll_number UNIQUE (roll_number),
    CONSTRAINT fk_student_profiles_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_student_profiles_gender CHECK (gender IS NULL OR gender IN ('Male', 'Female', 'Other', 'Prefer not to say'))
);

CREATE TRIGGER trg_student_profiles_updated_at
BEFORE UPDATE ON student_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE student_profiles IS 'Biographical and demographic details for enrolled students';

CREATE TABLE academic_records (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL,
    degree_program VARCHAR(100) NOT NULL,
    department_branch VARCHAR(100) NOT NULL,
    graduation_year INT NOT NULL,
    current_cgpa NUMERIC(4,2) NOT NULL DEFAULT 0.00,
    tenth_percentage NUMERIC(5,2),
    twelfth_percentage NUMERIC(5,2),
    active_backlogs INT NOT NULL DEFAULT 0,
    cleared_backlogs INT NOT NULL DEFAULT 0,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    verified_by_user_id BIGINT,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_academic_records_student UNIQUE (student_profile_id),
    CONSTRAINT fk_academic_records_student FOREIGN KEY (student_profile_id) 
        REFERENCES student_profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_academic_records_verifier FOREIGN KEY (verified_by_user_id) 
        REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_academic_records_cgpa CHECK (current_cgpa >= 0.00 AND current_cgpa <= 10.00),
    CONSTRAINT chk_academic_records_tenth CHECK (tenth_percentage IS NULL OR (tenth_percentage >= 0.00 AND tenth_percentage <= 100.00)),
    CONSTRAINT chk_academic_records_twelfth CHECK (twelfth_percentage IS NULL OR (twelfth_percentage >= 0.00 AND twelfth_percentage <= 100.00)),
    CONSTRAINT chk_academic_records_backlogs CHECK (active_backlogs >= 0 AND cleared_backlogs >= 0),
    CONSTRAINT chk_academic_records_grad_year CHECK (graduation_year >= 2000 AND graduation_year <= 2100),
    CONSTRAINT chk_academic_records_status CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED'))
);

CREATE TRIGGER trg_academic_records_updated_at
BEFORE UPDATE ON academic_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE academic_records IS 'Certified academic credentials and backlog metrics locked by Placement Officers';

CREATE TABLE resumes (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    file_storage_path VARCHAR(500) NOT NULL,
    original_file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL DEFAULT 'application/pdf',
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_resumes_student FOREIGN KEY (student_profile_id) 
        REFERENCES student_profiles(id) ON DELETE CASCADE ON UPDATE CASCADE
);

COMMENT ON TABLE resumes IS 'Document metadata and storage URIs for student resumes';

CREATE TABLE skills (
    id BIGSERIAL PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_skills_name UNIQUE (skill_name)
);

COMMENT ON TABLE skills IS 'Master standardized lookup catalog for technical and professional skills';

CREATE TABLE student_skills (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    proficiency_level VARCHAR(30) DEFAULT 'Intermediate',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_student_skills_pair UNIQUE (student_profile_id, skill_id),
    CONSTRAINT fk_student_skills_student FOREIGN KEY (student_profile_id) 
        REFERENCES student_profiles(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_student_skills_skill FOREIGN KEY (skill_id) 
        REFERENCES skills(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_student_skills_proficiency CHECK (proficiency_level IN ('Beginner', 'Intermediate', 'Advanced'))
);

COMMENT ON TABLE student_skills IS 'Associative mapping of student profiles to claimed/verified competencies';

-- =============================================================================
-- 3. Corporate and Recruiter Profiles
-- =============================================================================

CREATE TABLE companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    website_url VARCHAR(255),
    industry_sector VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(30),
    logo_url VARCHAR(500),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_companies_name UNIQUE (name),
    CONSTRAINT chk_companies_status CHECK (verification_status IN ('PENDING', 'VERIFIED', 'BLOCKED'))
);

CREATE TRIGGER trg_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE companies IS 'Employer organizations participating in campus placements';

CREATE TABLE recruiter_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    designation VARCHAR(100),
    phone_number VARCHAR(20),
    is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_recruiter_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_recruiter_profiles_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_recruiter_profiles_company FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TRIGGER trg_recruiter_profiles_updated_at
BEFORE UPDATE ON recruiter_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE recruiter_profiles IS 'Liaison recruiter profiles connecting User logins to employer Companies';

-- =============================================================================
-- 4. Placement Drives and Job Openings
-- =============================================================================

CREATE TABLE placement_drives (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    drive_mode VARCHAR(30) NOT NULL DEFAULT 'On-Campus',
    status VARCHAR(30) NOT NULL DEFAULT 'Upcoming',
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_placement_drives_creator FOREIGN KEY (created_by_user_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_placement_drives_dates CHECK (start_date <= end_date),
    CONSTRAINT chk_placement_drives_mode CHECK (drive_mode IN ('On-Campus', 'Virtual', 'Pooled')),
    CONSTRAINT chk_placement_drives_status CHECK (status IN ('Upcoming', 'Open', 'In Progress', 'Closed'))
);

CREATE TRIGGER trg_placement_drives_updated_at
BEFORE UPDATE ON placement_drives
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE placement_drives IS 'Coordinated campus placement campaigns managed by the placement office';

CREATE TABLE job_openings (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    placement_drive_id BIGINT,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    job_type VARCHAR(30) NOT NULL DEFAULT 'Full-time',
    location VARCHAR(100) NOT NULL,
    salary_text VARCHAR(100),
    min_salary NUMERIC(12,2),
    max_salary NUMERIC(12,2),
    application_deadline TIMESTAMPTZ NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Draft',
    min_cgpa NUMERIC(4,2) NOT NULL DEFAULT 0.00,
    allowed_branches VARCHAR(255) NOT NULL,
    max_active_backlogs INT NOT NULL DEFAULT 0,
    batch_year INT,
    posted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_job_openings_company FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_job_openings_drive FOREIGN KEY (placement_drive_id) 
        REFERENCES placement_drives(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT chk_job_openings_type CHECK (job_type IN ('Full-time', 'Internship', 'Contract')),
    CONSTRAINT chk_job_openings_status CHECK (status IN ('Draft', 'Published', 'Closed')),
    CONSTRAINT chk_job_openings_min_cgpa CHECK (min_cgpa >= 0.00 AND min_cgpa <= 10.00),
    CONSTRAINT chk_job_openings_backlogs CHECK (max_active_backlogs >= 0)
);

CREATE TRIGGER trg_job_openings_updated_at
BEFORE UPDATE ON job_openings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE job_openings IS 'Specific job opportunities published by recruiters with embedded criteria cutoffs';

CREATE TABLE job_skills (
    id BIGSERIAL PRIMARY KEY,
    job_opening_id BIGINT NOT NULL,
    skill_id BIGINT NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_job_skills_pair UNIQUE (job_opening_id, skill_id),
    CONSTRAINT fk_job_skills_job FOREIGN KEY (job_opening_id) 
        REFERENCES job_openings(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_job_skills_skill FOREIGN KEY (skill_id) 
        REFERENCES skills(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE job_skills IS 'Associative mapping of job requirements to canonical skill catalog';

-- =============================================================================
-- 5. Applications, Status History, Interviews, and Outcomes
-- =============================================================================

CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    student_profile_id BIGINT NOT NULL,
    job_opening_id BIGINT NOT NULL,
    resume_id BIGINT NOT NULL,
    current_status VARCHAR(30) NOT NULL DEFAULT 'Applied',
    student_remarks TEXT,
    recruiter_notes TEXT,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_applications_student_job UNIQUE (student_profile_id, job_opening_id),
    CONSTRAINT fk_applications_student FOREIGN KEY (student_profile_id) 
        REFERENCES student_profiles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_applications_job FOREIGN KEY (job_opening_id) 
        REFERENCES job_openings(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_applications_resume FOREIGN KEY (resume_id) 
        REFERENCES resumes(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_applications_status CHECK (current_status IN ('Applied', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'))
);

CREATE TRIGGER trg_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE applications IS 'Student job applications representing formal submissions';

CREATE TABLE application_status_history (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL,
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by_user_id BIGINT NOT NULL,
    remarks TEXT,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_ash_application FOREIGN KEY (application_id) 
        REFERENCES applications(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_ash_user FOREIGN KEY (changed_by_user_id) 
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE application_status_history IS 'Append-only audit trail recording every application lifecycle transition';

CREATE TABLE interview_rounds (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL,
    round_number INT NOT NULL,
    round_name VARCHAR(100) NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    interview_mode VARCHAR(30) NOT NULL DEFAULT 'In-Person',
    venue_or_link VARCHAR(500),
    interviewer_name VARCHAR(150),
    status VARCHAR(30) NOT NULL DEFAULT 'Scheduled',
    result VARCHAR(30) NOT NULL DEFAULT 'Pending',
    feedback TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_interview_rounds_seq UNIQUE (application_id, round_number),
    CONSTRAINT fk_interview_rounds_app FOREIGN KEY (application_id) 
        REFERENCES applications(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT chk_interview_rounds_num CHECK (round_number > 0),
    CONSTRAINT chk_interview_rounds_duration CHECK (duration_minutes > 0),
    CONSTRAINT chk_interview_rounds_mode CHECK (interview_mode IN ('In-Person', 'Video Call', 'Phone')),
    CONSTRAINT chk_interview_rounds_status CHECK (status IN ('Scheduled', 'Completed', 'Rescheduled', 'Cancelled', 'No Show')),
    CONSTRAINT chk_interview_rounds_result CHECK (result IN ('Pending', 'Cleared', 'Not Cleared', 'On Hold'))
);

CREATE TRIGGER trg_interview_rounds_updated_at
BEFORE UPDATE ON interview_rounds
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE interview_rounds IS 'Multi-stage interview rounds, schedules, locations, and stage outcomes';

CREATE TABLE placement_outcomes (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL,
    student_profile_id BIGINT NOT NULL,
    company_id BIGINT NOT NULL,
    job_opening_id BIGINT NOT NULL,
    offered_ctc NUMERIC(12,2) NOT NULL,
    offer_letter_url VARCHAR(500),
    offered_date DATE NOT NULL,
    acceptance_deadline DATE,
    student_response VARCHAR(30) NOT NULL DEFAULT 'Pending',
    response_date TIMESTAMPTZ,
    joining_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_placement_outcomes_application UNIQUE (application_id),
    CONSTRAINT fk_placement_outcomes_app FOREIGN KEY (application_id) 
        REFERENCES applications(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_placement_outcomes_student FOREIGN KEY (student_profile_id) 
        REFERENCES student_profiles(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_placement_outcomes_company FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_placement_outcomes_job FOREIGN KEY (job_opening_id) 
        REFERENCES job_openings(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT chk_placement_outcomes_ctc CHECK (offered_ctc > 0.00),
    CONSTRAINT chk_placement_outcomes_response CHECK (student_response IN ('Pending', 'Accepted', 'Declined', 'Revoked'))
);

CREATE TRIGGER trg_placement_outcomes_updated_at
BEFORE UPDATE ON placement_outcomes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE placement_outcomes IS 'Formal job offers and student acceptance decisions to enforce placement policies';

-- =============================================================================
-- 6. Performance and Foreign Key B-Tree Indexes
-- =============================================================================

-- Users
CREATE INDEX idx_users_role_status ON users(role, status);
CREATE INDEX idx_users_email_lower ON users(LOWER(email));

-- Student Profiles and Academics
CREATE INDEX idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX idx_academic_records_student_id ON academic_records(student_profile_id);
CREATE INDEX idx_academic_records_search ON academic_records(department_branch, graduation_year, current_cgpa);
CREATE INDEX idx_academic_records_status ON academic_records(verification_status);

-- Resumes and Skills
CREATE INDEX idx_resumes_student_id ON resumes(student_profile_id);
CREATE INDEX idx_student_skills_student_id ON student_skills(student_profile_id);
CREATE INDEX idx_student_skills_skill_id ON student_skills(skill_id);

-- Recruiters and Companies
CREATE INDEX idx_recruiter_profiles_user_id ON recruiter_profiles(user_id);
CREATE INDEX idx_recruiter_profiles_company_id ON recruiter_profiles(company_id);
CREATE INDEX idx_companies_verification_status ON companies(verification_status);

-- Placement Drives and Job Openings
CREATE INDEX idx_placement_drives_status_dates ON placement_drives(status, start_date);
CREATE INDEX idx_job_openings_company_id ON job_openings(company_id);
CREATE INDEX idx_job_openings_drive_id ON job_openings(placement_drive_id);
CREATE INDEX idx_job_openings_active ON job_openings(status, application_deadline);
CREATE INDEX idx_job_skills_job_id ON job_skills(job_opening_id);
CREATE INDEX idx_job_skills_skill_id ON job_skills(skill_id);

-- Applications, History, Interviews, and Outcomes
CREATE INDEX idx_applications_student_id ON applications(student_profile_id);
CREATE INDEX idx_applications_job_status ON applications(job_opening_id, current_status);
CREATE INDEX idx_ash_application_id ON application_status_history(application_id, changed_at DESC);
CREATE INDEX idx_ash_user_id ON application_status_history(changed_by_user_id);
CREATE INDEX idx_interview_rounds_app_seq ON interview_rounds(application_id, round_number);
CREATE INDEX idx_interview_rounds_schedule ON interview_rounds(scheduled_at, status);
CREATE INDEX idx_placement_outcomes_student ON placement_outcomes(student_profile_id, student_response);
CREATE INDEX idx_placement_outcomes_company ON placement_outcomes(company_id);

COMMIT;
-- =============================================================================
-- End of CPMS PostgreSQL Database Schema
-- =============================================================================
