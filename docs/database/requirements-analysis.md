# Requirements Analysis — College Placement Management System (CPMS)

## 1. Project Context and Scope

The College Placement Management System (CPMS) is a centralized campus placement platform designed for four distinct stakeholder roles: **Students**, **Recruiters**, **Placement Officers**, and **Admins**. 

The system facilitates the end-to-end placement lifecycle:
- Students create verified academic profiles, discover campus hiring opportunities, apply for jobs/drives, and track their selection status.
- Recruiters manage organizational profiles, publish job postings, review student applicants, update hiring pipeline stages, and coordinate selections.
- Placement Officers manage campus placement drives, verify student eligibility and academic credentials, coordinate interview schedules, and monitor institutional placement health.
- Admins oversee user accounts, role allocations, system stability, and aggregate reporting.

### Target Technology Stack & Database Context
- **Database Engine:** PostgreSQL 14+
- **Backend Framework:** Java 21, Spring Boot 4.x / 3.x with Spring Data JPA and Hibernate ORM
- **Frontend Framework:** Next.js (App Router), React, JavaScript, Tailwind CSS
- **ORM Configuration:** `spring.jpa.hibernate.ddl-auto=none`, `spring.jpa.open-in-view=false` (explicit migration scripts and strict service-layer transaction boundaries)
- **Deployment / Tooling Note:** Docker is explicitly excluded. PostgreSQL runs as a standalone local/server instance. All database interactions will adhere to standard relational design principles with JPA compatibility.

---

## 2. Source of Requirements and Verification Baseline

To maintain architectural rigor, requirements are classified into **Confirmed Requirements** (extracted directly from existing repository code, configuration, and team project documentation) and **Inferred Requirements / Assumptions** (derived from standard placement domain patterns and UI stubs).

### 2.1 Confirmed Requirements & Evidence

| Requirement | Source / Evidence in Codebase |
|-------------|-------------------------------|
| Four application-level roles: `STUDENT`, `RECRUITER`, `PLACEMENT_OFFICER`, `ADMIN` | `frontend/src/services/authService.js` (`ROLES` constant), `README.md` |
| Primary dashboard routing per role (`/student/dashboard`, `/recruiter/dashboard`, `/placement/dashboard`, `/admin/dashboard`) | `frontend/src/services/authService.js` (`getDashboardPathForRole`) |
| Credentials must be secured; no plaintext passwords or secrets in Git; remember-me handles email only | Root `README.md`, `backend/.env.example`, `database/README.md`, `authService.js` |
| Database schema management is decoupled from Hibernate auto-generation (`ddl-auto=none`) | `backend/src/main/resources/application.properties` |
| Spring Boot backend uses Spring Data JPA, WebMVC, and PostgreSQL JDBC Driver | `backend/pom.xml` |
| Frontend and backend communicate via REST API (`NEXT_PUBLIC_API_URL`, default `http://localhost:8080`) | `frontend/.env.example`, `README.md` |
| Core application pipeline statuses: `Applied`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected` | `frontend/src/features/recruiter-applicants/data/recruiterApplicantsMockData.js` (`APPLICATION_STATUSES`) |
| Job posting statuses: `Draft`, `Published`, `Closed` | `frontend/src/features/recruiter-jobs/components/JobFormModal.js` |
| Placement drive statuses: `Upcoming`, `Open`, `Closed` | `frontend/src/features/placement-dashboard/data/placementDashboardMockData.js` |
| Recruiter company attributes: Name, website, industry, location, description, contact email, phone, logo URL/initials, profile status | `frontend/src/features/recruiter-company/components/CompanyProfileView.js` |
| Job opening attributes: Title, description, location, job type (Full-time, Internship, Contract), salary/CTC, eligibility, min CGPA, skills, deadline, status | `frontend/src/features/recruiter-jobs/components/JobFormModal.js` |
| Student profile completion tracking (academics, skills, resume upload, LinkedIn, preferred locations) | `frontend/src/features/student-dashboard/data/studentDashboardSampleData.js` |
| Placement officer metrics: registered students, active drives, total applications, placed students, scheduled interviews | `frontend/src/features/placement-dashboard/data/placementDashboardMockData.js` |

### 2.2 Inferred Requirements, UI Stubs, and Working Assumptions

1. **Frontend Mock Stubs (`isDemoData: true`):** All UI mock data (`STUDENT_DASHBOARD_SAMPLE`, `RECRUITER_JOBS_MOCK`, `RECRUITER_APPLICANTS_MOCK`, etc.) are isolated UI placeholders. They illustrate user workflows and required data points, but their schema and field types are subject to database normalization.
2. **Spring Boot Package Structure:** The backend has created empty packages with `.gitkeep` (`entity`, `repository`, `dto`, `service`, `controller`, `security`, `config`, `exception`). No entity classes, repositories, or services have been implemented yet.
3. **Application Roles vs Database Roles:** PostgreSQL connects using a dedicated application pool user (`placement_user`). Role-based access control (RBAC) is enforced at the application/API layer, not by creating individual PostgreSQL database users for students or recruiters.

---

## 3. Module-by-Module Functional Analysis

### 3.1 User Accounts, Authentication, and Roles
- **Information to Store:** Unique email address, securely hashed password (e.g., BCrypt/Argon2), account status (`ACTIVE`, `INACTIVE`, `LOCKED`), failed login attempts (optional for security), creation timestamp, last login timestamp.
- **Role Permissions:**
  - `Admin`: Creates placement officers/recruiters, manages account status, resets locks.
  - `Student` / `Recruiter`: Registers (or activates account), logs in, initiates password recovery.
- **Business Rules:**
  - Email must be unique across the system (case-insensitive).
  - Passwords must never be stored in plain text.
  - A user must have at least one assigned role upon activation.
- **Inter-module Relationships:** Root anchor entity for `StudentProfile` and `RecruiterProfile`.
- **Integrity Risks:** Account deletion cascading without archiving placement history; duplicate user records with varying casing.
- **Unconfirmed Items:** Is student self-registration permitted, or are student accounts bulk-provisioned by the placement cell/college ERP? Can a single user hold multiple roles simultaneously?

### 3.2 Student Profiles
- **Information to Store:** Reference to user account, university roll number / USN, full legal name, contact phone number, alternate email, gender, date of birth, current address, permanent address, LinkedIn profile URL, GitHub/portfolio URL, profile completion percentage.
- **Role Permissions:**
  - `Student`: Creates and updates personal contact details, links, and preferences.
  - `Placement Officer`: Views full profile, verifies student identity, flags profile discrepancies.
  - `Recruiter`: Views profiles of applicants who applied to their postings.
  - `Admin`: Administrative read/write access.
- **Business Rules:**
  - Exactly one `StudentProfile` per user with role `STUDENT`.
  - Roll number / USN must be unique across the college.
  - Incomplete profiles must be restricted from applying to placement drives.
- **Inter-module Relationships:** Links 1:1 with `User`; links 1:1 with `AcademicRecord`; links 1:N with `Resume`, `StudentSkill`, and `Application`.
- **Integrity Risks:** Inconsistent profile state; orphaned student profile upon user modification.
- **Unconfirmed Items:** Does a placement officer need to formally approve/verify a student profile before placement participation is unlocked?

### 3.3 Academic Records and Eligibility Information
- **Information to Store:** Enrolled degree program (e.g., B.Tech, MCA, M.Tech), department/branch (e.g., CSE, IT, ECE, MECH), batch/graduation year (e.g., 2026), current cumulative CGPA, 10th standard percentage/board, 12th standard or Diploma percentage/board, active backlogs count, total cleared backlogs count, academic verification status (`PENDING`, `VERIFIED`, `REJECTED`).
- **Role Permissions:**
  - `Student`: Initial entry or view-only depending on institutional policy.
  - `Placement Officer`: Exclusive authority to verify, modify, and lock academic credentials.
  - `Recruiter`: Read-only view for filtering and screening applicants.
- **Business Rules:**
  - Academic records must be locked against student editing once verified by the Placement Officer to prevent fraudulent eligibility bypasses.
  - CGPA must reside within defined scale constraints (0.00 to 10.00).
  - Backlog counts must be non-negative integers.
- **Inter-module Relationships:** Belongs strictly 1:1 to `StudentProfile`. Referenced by eligibility filters across `JobOpening` and `PlacementDrive`.
- **Integrity Risks:** Students altering CGPA or backlog counts immediately prior to submitting job applications.
- **Unconfirmed Items:** Does the college require semester-by-semester SGPA breakdowns, or is the aggregate CGPA sufficient?

### 3.4 Student Skills and Resumes
- **Information to Store:**
  - *Skills:* Master list of standardized skill names (e.g., "Java", "React", "PostgreSQL", "Data Structures") and student-skill mappings with optional proficiency/experience levels.
  - *Resumes:* Stored file metadata (file storage path/URL, original filename, MIME type, file size in bytes, upload timestamp, is_default flag).
- **Role Permissions:**
  - `Student`: Adds/removes skills, uploads resumes, sets default resume.
  - `Recruiter` / `Placement Officer`: Views skills, downloads/streams resumes.
- **Business Rules:**
  - Resumes are stored as binary files on the file system or object store; only the canonical URI/path and metadata are stored in the database.
  - Only allowed document MIME types (application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document) are accepted.
- **Inter-module Relationships:** Belongs to `StudentProfile`. A snapshot reference to the submitted resume is attached to each `Application`.
- **Integrity Risks:** Orphaned disk files when a resume record is updated; uncontrolled free-text skill duplication without canonical standardization.
- **Unconfirmed Items:** Can a student maintain multiple resumes (e.g., tailoring one for Data Science and another for Web Dev), and select which one to attach per application?

### 3.5 Companies and Recruiter Profiles
- **Information to Store:**
  - *Company:* Registered company name, corporate website URL, industry sector, corporate headquarters/location, corporate overview/description, contact email, primary phone, logo URL, verification status (`PENDING`, `VERIFIED`, `BLOCKED`).
  - *Recruiter Profile:* Reference to user account, reference to associated company, job title/designation, official phone.
- **Role Permissions:**
  - `Recruiter`: Manages assigned company profile details and updates contact info.
  - `Placement Officer` / `Admin`: Verifies and approves company onboarding; can block disreputable entities.
  - `Student`: Read-only discovery of company information.
- **Business Rules:**
  - Company name and official domain must be distinct.
  - A recruiter cannot post jobs until their associated company is marked as verified by the placement office.
- **Inter-module Relationships:** A `Company` has one or many `RecruiterProfile` records; a `Company` sponsors multiple `JobOpening` and `PlacementDrive` instances.
- **Integrity Risks:** Unverified recruiters posting unauthorized roles; deletion of a company cascading and destroying historic placement outcome records.
- **Unconfirmed Items:** Can multiple recruiters belong to the same company? Can a recruiter represent multiple affiliated companies?

### 3.6 Job Openings and Job Requirements
- **Information to Store:** Title, detailed description, work location (onsite city or remote), job type (`Full-time`, `Internship`, `Contract`), compensation/salary text or structured numeric figures (CTC in LPA, stipend per month), application deadline date/time, publication status (`Draft`, `Published`, `Closed`), creation timestamp, closing timestamp.
- **Role Permissions:**
  - `Recruiter`: Creates, updates, drafts, publishes, and closes jobs for their company.
  - `Placement Officer`: Approves/reviews jobs, has administrative override to close postings.
  - `Student`: Views published jobs whose deadlines have not passed.
- **Business Rules:**
  - Students cannot apply to jobs in `Draft` or `Closed` status.
  - Applications cannot be submitted after the specified application deadline timestamp.
- **Inter-module Relationships:** Belongs to `Company`. Optionally associated with a specific `PlacementDrive`. Target of student `Application` records.
- **Integrity Risks:** Modifying compensation or eligibility requirements after students have already applied.
- **Unconfirmed Items:** Does a job opening belong to a single placement drive, or can standalone jobs exist outside campus placement drives?

### 3.7 Placement Drives
- **Information to Store:** Drive title (e.g., "Campus Drive 2026 — Software Engineers"), academic year/batch, drive start date, drive end date, registration deadline, drive venue/mode (`On-Campus`, `Virtual`, `Pooled`), drive status (`Upcoming`, `Open`, `In Progress`, `Closed`), general instructions.
- **Role Permissions:**
  - `Placement Officer`: Primary owner; creates, schedules, manages, and closes placement drives.
  - `Recruiter`: Invited or attached to participate in the drive.
  - `Student`: Views scheduled drives, checks drive-level eligibility.
- **Business Rules:**
  - Drive timeline constraints: `start_date <= end_date` and `registration_deadline <= start_date`.
- **Inter-module Relationships:** Coordinated by `PlacementOfficer`. Associates with one or more `Company` and `JobOpening` entities.
- **Integrity Risks:** Drive dates conflicting with academic examination schedules; multiple overlapping drives causing candidate scheduling deadlocks.
- **Unconfirmed Items:** Is a Drive a container for multiple Job Openings across multiple companies (e.g., "Day 1 Mega Drive"), or is a Drive strictly 1:1 with a specific Company's visit?

### 3.8 Eligibility Criteria
- **Information to Store:** Minimum CGPA threshold (e.g., 7.0), permissible degree programs and branches (e.g., CSE, IT, ECE), maximum allowable active backlogs (e.g., 0), maximum allowable historical backlogs, permissible graduation years.
- **Role Permissions:**
  - `Recruiter` / `Placement Officer`: Configures eligibility criteria per job or drive.
  - `Student`: Reads criteria to understand qualification status.
  - `System Engine`: Evaluates eligibility rules automatically during the application submission flow.
- **Business Rules:**
  - Automated verification: System compares the student's locked `AcademicRecord` against the criteria before creating an `Application`.
  - Placement officers may be granted an explicit override privilege for edge cases.
- **Inter-module Relationships:** Associated with either `JobOpening`, `PlacementDrive`, or both.
- **Integrity Risks:** Parsing unstructured text (e.g., "CSE/IT min 7.0") leads to faulty filtering. Must be modeled as structured queryable attributes.
- **Unconfirmed Items:** Should eligibility criteria be modeled as dedicated relational tables with branch lookup mapping, or embedded directly within `JobOpening` columns?

### 3.9 Student Job Applications and Status Pipeline
- **Information to Store:** Reference to student, reference to job opening (and/or placement drive), submission timestamp, current lifecycle status (`Applied`, `Shortlisted`, `Interview Scheduled`, `Selected`, `Rejected`), snapshot of attached resume, student cover remarks (optional).
- **Role Permissions:**
  - `Student`: Submits application, views status and status history.
  - `Recruiter`: Reviews applications, shortlists, advances candidates to interview, marks final selections or rejections.
  - `Placement Officer`: Full visibility across all applications; monitors conversion rates.
- **Business Rules:**
  - **Uniqueness Constraint:** A student can apply **at most once** to a specific job opening.
  - Applications cannot be retracted once shortlisting has commenced.
- **Inter-module Relationships:** Joins `StudentProfile` and `JobOpening`. Parent entity for `ApplicationStatusHistory` and `Interview`.
- **Integrity Risks:** Concurrent application requests leading to duplicate submissions; inconsistent status transitions bypassing interview rounds.
- **Unconfirmed Items:** Can a student withdraw an application prior to the deadline? Does a rejection in one job disqualify the student from other openings in the same drive?

### 3.10 Application Status History and Auditability
- **Information to Store:** Reference to application, previous status, updated status, timestamp of change, user ID of actor making the change (recruiter, placement officer, or system), audit comments/remarks.
- **Role Permissions:**
  - `System`: Appends audit record upon every status modification.
  - `Placement Officer` / `Admin`: Reviews audit trail for dispute resolution.
- **Business Rules:**
  - Audit records are append-only. Updates and deletions are strictly disallowed.
- **Inter-module Relationships:** Foreign key to `Application` and `User`.
- **Integrity Risks:** Desynchronization between `Application.current_status` and the latest status recorded in history if not enclosed in an atomic transaction.

### 3.11 Shortlisting and Selection
- **Information to Store:** Stage-specific shortlisting notes, test scores/cutoff metrics (if placement tests are recorded), selection flag, offer letter reference (if issued).
- **Role Permissions:**
  - `Recruiter`: Conducts shortlisting and selects final candidates.
  - `Placement Officer`: Validates selections against college placement policies.
- **Business Rules:**
  - Selections must be traceable to a specific job opening and student.
- **Inter-module Relationships:** Typically captured as status transitions within `Application` and formalized in `PlacementOutcome`.
- **Integrity Risks:** Marking a candidate selected without capturing final compensation or offer validity dates.

### 3.12 Interview Scheduling, Rounds, and Results
- **Information to Store:** Reference to application (or job opening and student), round sequence number, round name/type (`Aptitude Test`, `Technical Round 1`, `Technical Round 2`, `HR Round`, `Managerial`), scheduled date and time, duration in minutes, venue/meeting link, interviewer name/notes, round outcome (`Pending`, `Cleared`, `Not Cleared`, `Absent`), interviewer feedback/rating.
- **Role Permissions:**
  - `Recruiter` / `Placement Officer`: Creates interview schedules, updates room links, inputs feedback and results.
  - `Student`: Views scheduled time, venue, and attendance status.
- **Business Rules:**
  - Interview scheduling timestamp must be in the future when created.
  - A candidate can advance to Round *N+1* only if Round *N* has been marked `Cleared`.
- **Inter-module Relationships:** Child of `Application`.
- **Integrity Risks:** Scheduling overlapping interview slots for the same student on the same day across two competing recruiters.
- **Unconfirmed Items:** Are interview rounds standardized across all jobs in a drive, or dynamically configured per job posting?

### 3.13 Placement Reports and Statistics
- **Information to Store:** Placement metrics should be **dynamically derived from transactional records** rather than stored as duplicate, desynchronized rows.
  - Derived figures: Total registered students, eligible students, active drives, total applications, students placed, placement percentage per branch/year, average and median CTC, top recruiting companies.
- **Role Permissions:**
  - `Placement Officer` / `Admin`: Full access to generate, filter, and export reports.
- **Business Rules:**
  - Operational dashboards query transactional tables (with appropriate indexes) or read-only analytical views/materialized views.
- **Integrity Risks:** Storing hardcoded aggregate counts in persistent tables creates immediate divergence when applications or student statuses change.
- **Unconfirmed Items:** Does the college require permanent historical archival of annual placement reports (e.g., a frozen annual snapshot for accreditation purposes)?

### 3.14 System Settings
- **Information to Store:** Current academic session (e.g., "2025-2026"), maximum simultaneous active applications allowed per student, maximum job offers allowed per student (e.g., "One Student, One Job" policy enforcement with dream company exceptions).
- **Role Permissions:**
  - `Admin`: Updates global institutional parameters.
  - `Placement Officer`: Configures session-specific placement rules.
- **Business Rules:**
  - Persistent key-value configuration table is only justified if administrators need to alter placement rules at runtime without redeploying backend code.
- **Integrity Risks:** Overcomplicating early database phases with speculative configuration tables.
- **Unconfirmed Items:** Are placement policies uniform and static, or do they require dynamic database-driven runtime configuration?

---

## 4. Cross-Module Data Ownership and Integrity Boundaries

```
[User / Identity Layer]
       │ (1:1)
       ├─────────────────────────┬────────────────────────┐
       ▼                         ▼                        ▼
 [StudentProfile]       [RecruiterProfile]       [PlacementOfficer]
       │ (1:1)                   │ (N:1)
       ├──────────────┐          ▼
       ▼              ▼      [Company]
[AcademicRecord]   [Resume]      │ (1:N)
       │              │          ├────────────────────────┐
       │              │          ▼                        ▼
       │              │    [JobOpening] ◄───(N:1)─── [PlacementDrive]
       │              │          │
       ▼              ▼          ▼
       └──────────────┴──► [Application]
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
     [ApplicationStatusHistory]              [Interview]
                                                 │ (1:N)
                                                 ▼
                                          [InterviewRound]
```

### 4.1 Data Ownership Rules
1. **Student Personal & Academic Data:** The student owns contact details; the **Placement Officer is the sole authority** for verifying and modifying academic records.
2. **Corporate & Job Data:** The **Recruiter owns job descriptions and initial screening**; the **Company entity is shared** among authorized recruiters of that firm.
3. **Drive Coordination:** The **Placement Officer owns placement drives, drive schedules, and eligibility rules**.
4. **Application Progression:** State transitions require dual-party integrity: recruiters initiate shortlists/interview outcomes; the placement office maintains overarching policy compliance.

### 4.2 Critical Integrity Constraints to Enforce in Database Design
- **Single Source of Truth:** Student marks and backlogs must reside solely in `AcademicRecord`. Jobs and applications must reference this record rather than copying CGPA strings.
- **No Duplicate Submissions:** A unique index across `(student_id, job_opening_id)` must prevent race conditions and duplicate applications.
- **Referential Protection:** Soft deletes or restricted foreign keys (`ON DELETE RESTRICT`) must prevent the deletion of a `User`, `Company`, or `JobOpening` if active placement records or historical offers depend on them.
- **Audit Immutability:** `ApplicationStatusHistory` rows must be insert-only.
- **Secure Password Storage:** Plain-text passwords must never enter the database; password fields must accommodate secure hash lengths (e.g., 60 characters for BCrypt or up to 255 for Argon2).
