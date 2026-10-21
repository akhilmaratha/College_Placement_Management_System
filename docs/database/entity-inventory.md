# Candidate Entity Inventory — College Placement Management System (CPMS)

## 1. Overview and Design Principles

This document inventories candidate database entities for CPMS. To keep the database maintainable, performant, and aligned with Spring Data JPA conventions:

- **Entity Justification:** Every entity must represent an independent lifecycle, a distinct business aggregate, or a normalized many-to-many relationship.
- **Avoid Over-normalization:** Attributes that share the exact 1:1 lifecycle and cardinality of a parent entity without independent access requirements should be consolidated into that parent or mapped as an embeddable component rather than split into unnecessary join tables.
- **Preserve Auditability:** Transient operational states must not overwrite historical compliance data.
- **PostgreSQL & JPA Compatibility:** Candidate designs avoid complex multi-table inheritance trees where simpler single-table or mapped-superclass designs suffice, and avoid composite foreign key chains that hinder JPA mapping.

---

## 2. Candidate Entity Inventory

### 2.1 Identity and Access Management

#### Entity: `User`
- **Purpose:** Central authentication identity for all platform actors (students, recruiters, placement officers, administrators).
- **Status:** **Essential**
- **Primary Business Identifier:** `email` (unique, case-insensitive)
- **Important Candidate Attributes:**
  - `email`: System-wide login credential.
  - `password_hash`: Salted cryptographic hash (never plaintext).
  - `status`: Account lifecycle state (`ACTIVE`, `INACTIVE`, `LOCKED`, `PENDING_VERIFICATION`).
  - `created_at`: Account registration timestamp.
  - `last_login_at`: Authentication audit timestamp.
- **Relationships:**
  - 1:1 with `StudentProfile` (optional, present if user is a student).
  - 1:1 with `RecruiterProfile` (optional, present if user is a recruiter).
  - 1:1 or 1:N with `UserRole` / `Role`.
  - 1:N with `ApplicationStatusHistory` (as `changed_by_user`).
- **Justification:** Essential. Centralizes authentication credentials, login logic, and credential rotation in a single secure table, avoiding scattered or duplicated credentials across role-specific profile tables.

#### Entity: `Role` / `UserRole`
- **Purpose:** Models platform permissions and role assignments (`STUDENT`, `RECRUITER`, `PLACEMENT_OFFICER`, `ADMIN`).
- **Status:** **Dependent on an unanswered requirement**
  - *Option A (Single Role per User):* Embedded role string / enum attribute directly on the `User` table.
  - *Option B (Multiple Roles per User):* Normalized lookup entity `Role` joined to `User` via association entity `UserRole`.
- **Primary Business Identifier:** `role_name`
- **Important Candidate Attributes:**
  - `role_name`: Standardized string identifier.
  - `description`: Human-readable scope explanation.
- **Relationships:**
  - N:M with `User` (via `UserRole`).
- **Justification:** If any user can act as both Placement Officer and Admin, or Student and Placement Coordinator, a dedicated role mapping table is required. If roles are strictly mutually exclusive, an enumerated column directly on `User` is simpler and eliminates join overhead.

---

### 2.2 Student Profiles and Academics

#### Entity: `StudentProfile`
- **Purpose:** Captures core biographical, contact, and profile details of an enrolled student.
- **Status:** **Essential**
- **Primary Business Identifier:** `roll_number` / `university_reg_no`
- **Important Candidate Attributes:**
  - `user_id`: Reference to login account.
  - `roll_number`: Unique institutional student identifier.
  - `full_name`: Official student name.
  - `phone_number`: Primary contact number.
  - `alternate_email`: Secondary/personal email.
  - `gender`: Gender category.
  - `date_of_birth`: Birth date.
  - `current_address`: Current residential address.
  - `linkedin_url`: Professional profile link.
  - `github_url`: Portfolio/code repository link.
  - `profile_completion_status`: Progress indicator for registration checklist.
- **Relationships:**
  - 1:1 with `User` (Mandatory parent).
  - 1:1 with `AcademicRecord`.
  - 1:N with `Resume`.
  - 1:N with `StudentSkill`.
  - 1:N with `Application`.
- **Justification:** Essential. Separates mutable personal and demographic profile attributes from security/authentication concerns (`User`).

#### Entity: `AcademicRecord`
- **Purpose:** Stores academic performance metrics, degree program, and backlog counts used for placement eligibility evaluation.
- **Status:** **Essential** (either as an independent table or as an embedded component within `StudentProfile`)
- **Primary Business Identifier:** Tied to student `roll_number` or student profile identifier.
- **Important Candidate Attributes:**
  - `student_profile_id`: Reference to student profile.
  - `degree_program`: Program of study (e.g., B.Tech, M.Tech, MCA).
  - `department_branch`: Department specialization (e.g., CSE, IT, ECE, MECH).
  - `batch_graduation_year`: Year of graduation (e.g., 2026).
  - `current_cgpa`: Cumulative Grade Point Average (0.00 – 10.00).
  - `tenth_percentage`: 10th standard percentage or board score.
  - `twelfth_percentage`: 12th standard or Diploma percentage.
  - `active_backlogs_count`: Number of uncleared backlogs.
  - `cleared_backlogs_count`: Number of previously cleared backlogs.
  - `verification_status`: Academic credential verification state (`PENDING`, `VERIFIED`, `REJECTED`).
  - `verified_by_officer_id`: Placement officer who verified marks.
  - `verified_at`: Timestamp of verification lock.
- **Relationships:**
  - 1:1 with `StudentProfile`.
  - Target of eligibility evaluation for `JobOpening` and `PlacementDrive`.
- **Justification:** Essential as a separate entity. Academic records require strict verification, locking, and audit privileges by Placement Officers, which must be isolated from student-editable personal contact information in `StudentProfile`.

#### Entity: `Skill`
- **Purpose:** Master lookup table of recognized technical, operational, and soft skills (e.g., "Java", "Python", "React", "PostgreSQL").
- **Status:** **Recommended / Optional**
- **Primary Business Identifier:** `skill_name` (unique, lowercase/slugified)
- **Important Candidate Attributes:**
  - `skill_name`: Canonical name.
  - `category`: Category group (e.g., "Programming Language", "Framework", "Database", "DevOps").
- **Relationships:**
  - N:M with `StudentProfile` (via `StudentSkill`).
  - N:M with `JobOpening` (via `JobSkill`).
- **Justification:** Highly recommended. Storing free-form strings creates duplicates (e.g., "React", "ReactJS", "react.js"). A canonical catalog enables precise filtering, search matching, and candidate-job matching algorithms.

#### Entity: `StudentSkill`
- **Purpose:** Association entity linking a student to their verified or claimed skills.
- **Status:** **Recommended** (dependent on `Skill` entity)
- **Primary Business Identifier:** Composite of `(student_profile_id, skill_id)`
- **Important Candidate Attributes:**
  - `student_profile_id`: Reference to student.
  - `skill_id`: Reference to skill.
  - `proficiency_level`: Optional level indicator (`Beginner`, `Intermediate`, `Advanced`).
- **Relationships:**
  - Joins `StudentProfile` (N) to `Skill` (M).
- **Justification:** Standard associative entity to support normalized many-to-many relationship without storing comma-delimited strings in columns.

#### Entity: `Resume`
- **Purpose:** Tracks document metadata and storage references for student resumes.
- **Status:** **Essential**
- **Primary Business Identifier:** System-generated unique identifier / file reference code.
- **Important Candidate Attributes:**
  - `student_profile_id`: Owning student.
  - `title`: User-friendly label (e.g., "Software Engineering Resume 2026").
  - `file_storage_path`: Storage URI / relative file path.
  - `original_file_name`: Uploaded filename.
  - `file_size_bytes`: Size in bytes.
  - `mime_type`: File content type (e.g., `application/pdf`).
  - `is_default`: Flag indicating default resume for quick applications.
  - `uploaded_at`: Upload timestamp.
- **Relationships:**
  - N:1 with `StudentProfile`.
  - 1:N with `Application` (snapshots resume submitted with a specific application).
- **Justification:** Essential. Students may maintain multiple resumes tailored for different job profiles. The database stores metadata and URIs; binary payloads reside in the file system.

---

### 2.3 Companies and Recruiters

#### Entity: `Company`
- **Purpose:** Represents an employer organization participating in campus recruitment.
- **Status:** **Essential**
- **Primary Business Identifier:** `company_name` (canonical unique name)
- **Important Candidate Attributes:**
  - `name`: Official organization name.
  - `website_url`: Primary public corporate URL.
  - `industry_sector`: Industry category (e.g., "Information Technology", "Analytics", "Fintech").
  - `location`: Headquarters or primary hiring location.
  - `description`: Detailed corporate profile overview.
  - `contact_email`: Official campus hiring mailbox.
  - `contact_phone`: Primary corporate hiring contact number.
  - `logo_url`: Hosted image URL for organization logo.
  - `verification_status`: Accreditation status by placement cell (`PENDING`, `VERIFIED`, `REJECTED`, `INACTIVE`).
  - `created_at`: Registration timestamp.
- **Relationships:**
  - 1:N with `RecruiterProfile`.
  - 1:N with `JobOpening`.
  - N:M with `PlacementDrive` (or 1:N if drives are company-specific).
- **Justification:** Essential. Central entity for employer profiles. Independent of individual recruiter accounts because recruiters may rotate while corporate hiring history remains permanently attached to the institution.

#### Entity: `RecruiterProfile`
- **Purpose:** Connects a recruiter user account to a specific employer organization.
- **Status:** **Essential**
- **Primary Business Identifier:** Tied to `User.id`
- **Important Candidate Attributes:**
  - `user_id`: Reference to login account.
  - `company_id`: Reference to employer organization.
  - `designation`: Corporate title (e.g., "Senior Campus Recruiter", "Talent Acquisition Lead").
  - `phone_number`: Recruiter contact phone.
  - `is_primary_contact`: Flag for primary liaison with the college placement office.
- **Relationships:**
  - 1:1 with `User`.
  - N:1 with `Company`.
- **Justification:** Essential. Normalizes the boundary between personal account authentication (`User`) and organizational association (`Company`).

---

### 2.4 Opportunities, Drives, and Eligibility

#### Entity: `JobOpening`
- **Purpose:** Represents a specific employment opportunity published by a company.
- **Status:** **Essential**
- **Primary Business Identifier:** System-generated opportunity reference code.
- **Important Candidate Attributes:**
  - `company_id`: Sponsoring company.
  - `placement_drive_id`: Associated campus drive (optional if off-drive postings are allowed).
  - `title`: Role designation (e.g., "Graduate Software Engineer").
  - `description`: Full job description, responsibilities, and requirements.
  - `job_type`: Employment classification (`Full-time`, `Internship`, `Contract`).
  - `location`: Onsite work city or remote indicator.
  - `ctc_text`: Compensation description for display (e.g., "12 LPA", "25k / month").
  - `min_salary`: Structured minimum annual CTC (numeric for range filtering).
  - `max_salary`: Structured maximum annual CTC (numeric for range filtering).
  - `deadline`: Application submission cutoff timestamp.
  - `status`: Lifecycle state (`Draft`, `Published`, `Closed`).
  - `posted_at`: Publication timestamp.
  - `min_cgpa`: Minimum CGPA eligibility cutoff.
  - `allowed_branches`: Delimited or structured permissible departments.
  - `max_active_backlogs`: Maximum permissible uncleared backlogs.
- **Relationships:**
  - N:1 with `Company`.
  - N:1 with `PlacementDrive` (optional/dependent on model).
  - 1:N with `Application`.
  - N:M with `Skill` (via `JobSkill`).
- **Justification:** Essential. Core transactional entity of the system. Captures postings against which students apply and recruiters shortlist.

#### Entity: `PlacementDrive`
- **Purpose:** Represents a coordinated campus placement event or hiring season drive managed by the placement cell.
- **Status:** **Essential**
- **Primary Business Identifier:** Drive code / academic session drive title.
- **Important Candidate Attributes:**
  - `title`: Event title (e.g., "Annual Campus Placement Drive 2026").
  - `academic_year`: Batch / academic session (e.g., "2025-2026").
  - `start_date`: Scheduled drive commencement date.
  - `end_date`: Drive completion date.
  - `registration_deadline`: Last date for students to register for the drive.
  - `drive_mode`: Format (`On-Campus`, `Virtual`, `Pooled`).
  - `status`: Operational state (`Upcoming`, `Open`, `In Progress`, `Closed`).
  - `created_by_officer_id`: Placement officer who created the drive.
- **Relationships:**
  - 1:N with `JobOpening` (or N:M if multiple companies participate in a single mega drive).
  - N:1 with `Company` (if drives are company-specific visits).
- **Justification:** Essential. In a collegiate setting, placements are coordinated as organized institutional drives with fixed timelines, administrative deadlines, and interview facility bookings, rather than open-ended job boards.

#### Entity: `EligibilityCriterion`
- **Purpose:** Dedicated entity for advanced, multi-rule eligibility expressions.
- **Status:** **Dependent on an unanswered requirement / Optional for Phase 1**
- **Proposed Attributes:**
  - `criterion_type`: (`MIN_CGPA`, `ALLOWED_BRANCH`, `MAX_BACKLOGS`, `MIN_10TH_PERCENT`, `MIN_12TH_PERCENT`).
  - `operator`: (`GREATER_THAN_EQUAL`, `EQUALS`, `LESS_THAN_EQUAL`, `IN`).
  - `target_value`: Value to evaluate against.
- **Justification for Deferring as Separate Entity:** For the current CPMS scope, embedding structured eligibility cutoff columns directly in `JobOpening` (`min_cgpa`, `allowed_branches`, `max_active_backlogs`, `batch_year`) satisfies all mock UI requirements with zero join overhead. A separate dynamic rule table is over-engineering unless the institution requires complex arbitrary boolean expressions.

---

### 2.5 Applications, Shortlisting, and Pipeline

#### Entity: `Application`
- **Purpose:** Represents a student's formal submission to a specific job opening.
- **Status:** **Essential**
- **Primary Business Identifier:** Composite of `(student_profile_id, job_opening_id)`
- **Important Candidate Attributes:**
  - `student_profile_id`: Submitting student.
  - `job_opening_id`: Target job opportunity.
  - `applied_at`: Submission timestamp.
  - `current_status`: Current pipeline state (`Applied`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`).
  - `submitted_resume_id`: Reference to the resume version attached at submission.
  - `student_remarks`: Optional note submitted by applicant.
  - `recruiter_notes`: Internal evaluation notes visible only to recruiters.
  - `updated_at`: Timestamp of last status change.
- **Relationships:**
  - N:1 with `StudentProfile`.
  - N:1 with `JobOpening`.
  - N:1 with `Resume`.
  - 1:N with `ApplicationStatusHistory`.
  - 1:N with `Interview` / `InterviewRound`.
  - 1:1 with `PlacementOutcome` (optional, if finalized).
- **Justification:** Essential. The fundamental junction entity that ties the student journey to recruiter selection pipelines.

#### Entity: `ApplicationStatusHistory`
- **Purpose:** Immutable audit ledger tracking every status transition of an application.
- **Status:** **Essential / Recommended**
- **Primary Business Identifier:** Sequential audit log identifier.
- **Important Candidate Attributes:**
  - `application_id`: Reference to parent application.
  - `previous_status`: Status prior to change.
  - `updated_status`: Status after change.
  - `changed_by_user_id`: Reference to actor who initiated transition.
  - `changed_at`: Timestamp of transition.
  - `remarks`: Optional reason for rejection, reschedule, or progression.
- **Relationships:**
  - N:1 with `Application`.
  - N:1 with `User` (`changed_by_user_id`).
- **Justification:** Essential. Placement processes require legal and administrative transparency. Students and placement officers must have a verifiable audit trail showing who shortlisted, scheduled, selected, or rejected a candidate and when.

#### Entity: `Shortlist` / `Selection` (Candidate for Exclusion as Independent Table)
- **Status:** **Excluded / Consolidated into `Application`**
- **Reason:** Shortlisting and selection are lifecycle states (`Shortlisted`, `Selected`) of an `Application`. Storing them in separate standalone tables duplicates foreign keys and risks state desynchronization. Special attributes (such as shortlist date or test scores) are modeled via `ApplicationStatusHistory` and `InterviewRound`.

---

### 2.6 Interviews and Selections

#### Entity: `Interview` / `InterviewRound`
- **Purpose:** Tracks interview rounds, schedules, locations, and outcomes for shortlisted applicants.
- **Status:** **Essential**
- **Primary Business Identifier:** Round identifier linked to application.
- **Important Candidate Attributes:**
  - `application_id`: Candidate application under evaluation.
  - `round_number`: Sequence index (1 for Round 1, 2 for Round 2, etc.).
  - `round_name`: Stage type (e.g., "Aptitude Assessment", "Technical Interview 1", "HR Evaluation").
  - `scheduled_at`: Date and time of interview.
  - `duration_minutes`: Estimated slot length.
  - `interview_mode`: (`In-Person`, `Video Call`, `Phone`).
  - `venue_or_link`: Physical classroom/room number or virtual meeting URL.
  - `interviewer_name`: Name or code of interviewer.
  - `status`: Slot status (`Scheduled`, `Completed`, `Rescheduled`, `Cancelled`, `No Show`).
  - `result`: Stage outcome (`Pending`, `Cleared`, `Not Cleared`, `On Hold`).
  - `feedback`: Qualitative remarks / interview score.
- **Relationships:**
  - N:1 with `Application`.
- **Justification:** Essential. Campus hiring involves multi-stage evaluation pipelines (e.g., Coding Round -> Technical 1 -> Technical 2 -> HR). A candidate cannot have their schedule or round score represented in a single scalar column on `Application`.

#### Entity: `PlacementOutcome` / `Offer`
- **Purpose:** Records final placement offers, compensation packages, and student acceptance/rejection decisions.
- **Status:** **Recommended**
- **Primary Business Identifier:** Offer reference code.
- **Important Candidate Attributes:**
  - `application_id`: Reference to successful application.
  - `student_profile_id`: Placed student.
  - `company_id`: Hiring company.
  - `job_opening_id`: Position offered.
  - `offered_ctc`: Confirmed annual compensation (numeric).
  - `offer_letter_url`: Storage URI of official offer document.
  - `offered_date`: Date offer was extended.
  - `acceptance_deadline`: Expiration date for student response.
  - `student_response`: Acceptance state (`Pending`, `Accepted`, `Declined`, `Revoked`).
  - `response_date`: Timestamp of student decision.
  - `joining_date`: Proposed employment start date.
- **Relationships:**
  - 1:1 with `Application`.
  - N:1 with `StudentProfile`.
  - N:1 with `Company`.
- **Justification:** Recommended. While an application status can be set to `Selected`, capturing official offer details, joining dates, verified CTC numbers, and student acceptance decisions requires a distinct entity. It also enforces institutional "One Student, One Job" placement policies by tracking accepted offers.

---

### 2.7 System Settings and Reports

#### Entity: `SystemSetting`
- **Purpose:** Stores runtime configuration parameters for college placement policies.
- **Status:** **Optional / Deferred to Phase 2**
- **Candidate Attributes:** `setting_key`, `setting_value`, `description`, `updated_at`.
- **Reason for Deferral:** Basic settings (active academic year, application limits) can be maintained in application properties until dynamic runtime administration is explicitly requested.

#### Entity: `PlacementReport` (Excluded as Persistent Table)
- **Status:** **Excluded from Transactional Entities**
- **Reason:** Placement reports and dashboard metrics (total students placed, placement percentage, average salary) must be computed dynamically using SQL aggregation queries, window functions, or PostgreSQL analytical views. Storing duplicate summary numbers in tables causes immediate divergence when applications change.

---

## 3. Entity Classification Matrix

| Entity Name | Category | Status | Justification Summary |
|-------------|----------|--------|-----------------------|
| `User` | Auth / Security | **Essential** | Single source of truth for login credentials and authentication state. |
| `Role` / `UserRole` | Auth / Security | **Dependent** | Required if users have multiple roles; otherwise enum on `User`. |
| `StudentProfile` | Profile | **Essential** | Stores personal, contact, and profile details for students. |
| `AcademicRecord` | Profile / Academics | **Essential** | Isolates locked/verified academic metrics from student-editable data. |
| `Skill` | Master Data | **Recommended** | Standardizes skill terms to prevent duplicate text strings. |
| `StudentSkill` | Association | **Recommended** | Normalizes N:M relationship between students and skills. |
| `Resume` | Profile / Assets | **Essential** | Manages file metadata and URI references for uploaded resumes. |
| `Company` | Corporate | **Essential** | Represents employers independently of transient recruiter logins. |
| `RecruiterProfile` | Corporate | **Essential** | Links recruiter `User` accounts to their employer `Company`. |
| `PlacementDrive` | Placement Ops | **Essential** | Models scheduled institutional campus drives and timeline gates. |
| `JobOpening` | Placement Ops | **Essential** | Core posting entity defining positions, descriptions, and criteria. |
| `EligibilityCriterion` | Placement Ops | **Optional / Consolidated** | Structured columns in `JobOpening` are preferred over a separate join table. |
| `Application` | Pipeline | **Essential** | Core transactional junction between students and job openings. |
| `ApplicationStatusHistory` | Audit / Compliance | **Essential** | Append-only audit trail for transparency and dispute resolution. |
| `InterviewRound` | Pipeline | **Essential** | Supports multi-stage assessment scheduling and round feedback. |
| `PlacementOutcome` | Placement Ops | **Recommended** | Encapsulates formal offer terms, CTC, and student acceptance. |
| `SystemSetting` | Configuration | **Optional** | Deferred until dynamic admin settings are confirmed. |
| `PlacementReport` | Reporting | **Excluded** | Derived dynamically from transactional tables via SQL aggregation. |
