# Prioritized Open Questions and Design Decisions — CPMS

This document details critical architectural, business rule, and data boundary questions that must be formally reviewed and approved by the team and the database developer before finalizing the Entity-Relationship (ER) diagram, PostgreSQL schema, and JPA entities.

> [!IMPORTANT]
> **Status Notice:** Every proposed default documented below is an **UNAPPROVED PROPOSAL** formulated from repository inspection, standard placement domain practices, and existing frontend UI patterns. No proposed default may be considered finalized until approved.

---

## 1. High-Priority Questions (Entity Boundaries, Uniqueness & Core Architecture)

### Question 1.1: Can a user hold multiple application roles simultaneously, or is role assignment strictly mutually exclusive?
- **Why it affects the design:** Determines whether the database needs a normalized many-to-many relationship (`users`, `roles`, `user_roles`) or a single `role` column/enum on the `users` table. This impacts Spring Security authentication queries, foreign key cascading, and user session management.
- **Proposed Default (UNAPPROVED):** **Single role per user (`role` enum attribute on `User`).**
  - *Rationale:* In the frontend UI (`frontend/src/services/authService.js`), roles (`STUDENT`, `RECRUITER`, `PLACEMENT_OFFICER`, `ADMIN`) route to dedicated, distinct dashboard shells. An individual actor operates in one clear capacity. If an administrator needs to act as a placement officer, the admin role inherently subsumes operational oversight privileges.
- **Consequence of Choosing a Different Answer:** If users require multiple simultaneous roles (e.g., a student who is also a student placement coordinator), the schema must introduce a `roles` table and a `user_roles` association table. Spring Data JPA entities would require `@ManyToMany` mappings, adding join overhead to every authenticated request.
- **Priority:** **HIGH**

---

### Question 1.2: What is the exact structural relationship between `Company`, `PlacementDrive`, and `JobOpening`?
- **Why it affects the design:** Determines foreign key ownership and navigation paths. Specifically:
  1. Does a `PlacementDrive` belong to a single `Company` (e.g., "Google On-Campus Drive 2026")?
  2. Or is a `PlacementDrive` an institutional mega-event containing openings from multiple companies (e.g., "Phase 1 Engineering Placements 2026")?
  3. Can a `JobOpening` exist independently of any placement drive?
- **Proposed Default (UNAPPROVED):** **A `JobOpening` belongs strictly to one `Company` and has an optional reference (`placement_drive_id`) to a `PlacementDrive`.**
  - *Rationale:* Placement drives in the mock UI (`placementDashboardMockData.js`) have titles like *"Campus Drive — Software Engineer (Nimbus Analytics)"* and *"Analyst Hiring Drive (Harbor Systems)"*, indicating that drives represent specific company hiring engagements coordinated by the placement office. Permitting standalone jobs allows off-campus or direct openings without forcing artificial drive creation.
- **Consequence of Choosing a Different Answer:** If a drive is an umbrella event for 50 companies at once, `PlacementDrive` cannot have a `company_id`. Instead, a many-to-many association table (`drive_companies` or `drive_job_openings`) would be required, altering how drives and jobs are listed and filtered across student dashboards.
- **Priority:** **HIGH**

---

### Question 1.3: How should candidate applications be routed: directly to a `JobOpening`, through a `PlacementDrive`, or both? How are duplicate application paths prevented?
- **Why it affects the design:** If students apply to a drive and *also* to jobs within that drive, there are two competing transactional records for the same hiring opportunity, risking desynchronized statuses and conflicting applicant counts.
- **Proposed Default (UNAPPROVED):** **Students apply exclusively to a `JobOpening`. A unique composite constraint is enforced on `(student_profile_id, job_opening_id)`.**
  - *Rationale:* A recruiter reviews and hires for a specific job title with specific salary and qualifications. When viewing a placement drive, the UI displays the drive's constituent job openings; clicking "Apply" creates an application for that specific `JobOpening`. If a drive has only one job, applying to that job is logically equivalent to applying to the drive.
- **Consequence of Choosing a Different Answer:** If students register at the drive level first and are later assigned to jobs by placement officers, the database requires a two-tiered application structure (`drive_registrations` and `job_applications`), doubling the state machine complexity.
- **Priority:** **HIGH**

---

### Question 1.4: How should eligibility criteria be modeled: as structured columns on `JobOpening` or as a dynamic `EligibilityCriterion` table?
- **Why it affects the design:** Determines whether eligibility evaluation is a direct SQL `WHERE` clause on the job table or requires polymorphic joins across an eligibility rules table.
- **Proposed Default (UNAPPROVED):** **Structured cutoff columns embedded directly within `JobOpening` (`min_cgpa`, `allowed_branches`, `max_active_backlogs`, `batch_year`).**
  - *Rationale:* In the existing UI modals (`JobFormModal.js`), recruiters enter `minCgpa`, `eligibility` (e.g., "CSE / IT"), and skills. Standard placement filtering relies on: minimum CGPA, permissible branches, and maximum backlogs. Embedding these attributes enables fast, index-supported queries for student dashboard opportunity matching without complex join tables.
- **Consequence of Choosing a Different Answer:** If the college introduces complex dynamic criteria (e.g., *"Min 75% in 10th AND 12th, or 7.5 CGPA in B.Tech, with no backlogs, plus certification in AWS"*), a dedicated rules engine and normalized `eligibility_criteria` entity will be required.
- **Priority:** **HIGH**

---

### Question 1.5: What is the authority and verification lifecycle for student academic records?
- **Why it affects the design:** Determines whether `AcademicRecord` can be merged directly into `StudentProfile` or must remain an isolated entity with strict audit and locking mechanisms.
- **Proposed Default (UNAPPROVED):** **`AcademicRecord` is a separate 1:1 entity linked to `StudentProfile`, equipped with an `is_verified` flag, `verified_by_officer_id`, and `verified_at` timestamp. Once verified, the record is locked against student modification.**
  - *Rationale:* Allowing students to edit their own CGPA or backlogs immediately before applying to high-package jobs creates massive data integrity and fraud risks. The Placement Officer must be the sole authority to certify marks.
- **Consequence of Choosing a Different Answer:** Merging academic marks into `StudentProfile` without locking would require complex column-level authorization checks in Spring Boot services to prevent unauthorized updates during personal profile edits (e.g., updating a phone number).
- **Priority:** **HIGH**

---

## 2. Medium-Priority Questions (Operational Workflows & Associations)

### Question 2.1: Can an employer organization have multiple recruiter accounts, and can a recruiter represent multiple companies?
- **Why it affects the design:** Dictates whether `RecruiterProfile` has a foreign key `company_id` (N:1, many recruiters per company) or requires an N:M association entity (`recruiter_company_mapping`).
- **Proposed Default (UNAPPROVED):** **Many-to-one (N:1): Multiple recruiter users can belong to a single `Company`, but each recruiter profile is bound to exactly one `Company`.**
  - *Rationale:* Corporate hiring teams frequently assign multiple recruiters (e.g., technical recruiters and HR leads) to a single campus season. However, campus recruitment rarely involves third-party agency recruiters representing competing firms simultaneously under one college login.
- **Consequence of Choosing a Different Answer:** If an external agency recruiter manages hiring for multiple distinct companies, an associative table is required, and all job posting operations must force the recruiter to select their active company context.
- **Priority:** **MEDIUM**

---

### Question 2.2: How should interview rounds, schedules, and feedback be structured?
- **Why it affects the design:** Affects whether interviews are linked to the overall `Application` or exist as independent drive-level events. Also determines whether round results are simple enum states or rich feedback structures.
- **Proposed Default (UNAPPROVED):** **An `InterviewRound` entity linked to `Application` (`application_id`, `round_number`, `round_name`, `scheduled_at`, `venue_or_link`, `status`, `result`, `feedback`).**
  - *Rationale:* Interviews are conducted for specific candidates progressing through a company's hiring stages for a specific role. A child entity of `Application` cleanly supports sequential rounds (e.g., Round 1 Aptitude, Round 2 Tech, Round 3 HR) and maintains independent outcomes per stage.
- **Consequence of Choosing a Different Answer:** If initial aptitude screening is conducted as a massive collective exam across all applicants of a drive, a separate `DriveAssessment` batch entity would be needed to manage group schedules.
- **Priority:** **MEDIUM**

---

### Question 2.3: How are final selections, job offers, and institutional placement policies represented?
- **Why it affects the design:** Determines whether an application status of `Selected` is sufficient, or if a dedicated `PlacementOutcome` entity is necessary to enforce the college's "One Student, One Job" policy.
- **Proposed Default (UNAPPROVED):** **A dedicated `PlacementOutcome` entity linked 1:1 to successful applications, capturing confirmed offered CTC, offer letter storage path, acceptance status (`Pending`, `Accepted`, `Declined`), and response timestamp.**
  - *Rationale:* Most colleges enforce strict placement policies (e.g., once a student accepts an offer >= 8 LPA, they are de-registered from lower-tier drives unless applying to a "Dream Company" >= 15 LPA). Tracking accepted offers in a dedicated entity provides a single source of truth for student placement status and prevents duplicate acceptances.
- **Consequence of Choosing a Different Answer:** If final placement is modeled solely as `Application.current_status = 'Selected'`, the system cannot track whether the student accepted or declined the offer, nor can it record salary variations negotiated during placement.
- **Priority:** **MEDIUM**

---

### Question 2.4: Can a student upload multiple resumes, and how are resumes bound to submitted applications?
- **Why it affects the design:** Affects whether `Resume` is a 1:1 entity (or simple URL attribute on `StudentProfile`) or a 1:N entity with versioning.
- **Proposed Default (UNAPPROVED):** **1:N relationship between `StudentProfile` and `Resume`. Students may upload up to 3 resumes (e.g., one tailored for software engineering, one for core engineering), with one marked as `is_default`. The `Application` entity stores a foreign key reference (`submitted_resume_id`) to preserve the exact resume submitted.**
  - *Rationale:* Students frequently tailor resumes for different job profiles. Snapshotting the submitted resume ID on `Application` ensures recruiters continue to see the exact resume evaluated during screening, even if the student later uploads a new resume.
- **Consequence of Choosing a Different Answer:** If only a single resume is permitted per student, updating the resume immediately alters all past, in-flight, and future applications.
- **Priority:** **MEDIUM**

---

## 3. Low-Priority Questions (Enhancements & Future Optimization)

### Question 3.1: Should skills be normalized into a master catalog or stored as delimited strings?
- **Why it affects the design:** Normalization requires `skills`, `student_skills`, and `job_skills` tables. Delimited strings (as seen in mock data: `"Java, React, SQL"`) eliminate joins but degrade search and filtering.
- **Proposed Default (UNAPPROVED):** **Normalized `Skill` entity with `StudentSkill` and `JobSkill` association tables.**
  - *Rationale:* A normalized catalog eliminates typos and variations (e.g., "Postgres", "PostgreSQL", "pgsql") and allows high-performance indexing for candidate skill-matching queries.
- **Consequence of Choosing a Different Answer:** Using comma-separated text or JSON arrays requires full table scans (`LIKE %skill%`) or PostgreSQL-specific array/JSONB operators that are harder to map cleanly in Spring Data JPA.
- **Priority:** **LOW**

---

### Question 3.2: Does the system require a persistent `SystemSetting` table in Phase 1?
- **Why it affects the design:** Determines whether application configuration (active academic session, maximum allowed active applications per student) is stored in PostgreSQL or kept in backend `application.properties` / environment variables.
- **Proposed Default (UNAPPROVED):** **Defer the `SystemSetting` table to a later phase; utilize backend configuration properties for initial deployment.**
  - *Rationale:* In early phases, institutional policies are static. Introducing dynamic settings tables adds administrative overhead without immediate functional need.
- **Consequence of Choosing a Different Answer:** Modifying institutional settings requires restarting the Spring Boot application or redeploying code.
- **Priority:** **LOW**

---

## 4. Decision Matrix Summary for Team Review

| # | Question Area | Proposed Default (Unapproved) | Design Impact | Priority | Status |
|---|---------------|-------------------------------|---------------|----------|--------|
| 1.1 | Role Cardinality | Single role per user (`User.role`) | Simplifies auth; avoids `user_roles` join table | **HIGH** | PENDING REVIEW |
| 1.2 | Company / Drive / Job Model | `JobOpening` belongs to `Company`; optional link to `PlacementDrive` | Supports company-specific drives and standalone jobs | **HIGH** | PENDING REVIEW |
| 1.3 | Application Routing | Direct application to `JobOpening`; unique `(student, job)` | Eliminates duplicate application paths | **HIGH** | PENDING REVIEW |
| 1.4 | Eligibility Structure | Embedded cutoff columns in `JobOpening` | Fast, indexable queries without dynamic rule joins | **HIGH** | PENDING REVIEW |
| 1.5 | Academic Record Authority | Separate 1:1 `AcademicRecord` locked by Placement Officer | Enforces integrity; prevents student grade tampering | **HIGH** | PENDING REVIEW |
| 2.1 | Recruiter Cardinality | N:1 (`Company` has many `Recruiters`) | Multiple recruiters per firm; clean ownership | **MEDIUM** | PENDING REVIEW |
| 2.2 | Interview Modeling | `InterviewRound` child of `Application` | Supports sequential rounds, scheduling, and feedback | **MEDIUM** | PENDING REVIEW |
| 2.3 | Placement Offer Outcome | Dedicated `PlacementOutcome` entity | Enforces college "One Student, One Job" rules | **MEDIUM** | PENDING REVIEW |
| 2.4 | Resume Versioning | 1:N `Resume` with application snapshot ID | Students can tailor resumes; snapshots past submissions | **MEDIUM** | PENDING REVIEW |
| 3.1 | Skill Standardization | Master `Skill` table with associative mappings | Clean searching and candidate matching | **LOW** | PENDING REVIEW |
| 3.2 | System Settings | Deferred to backend properties | Prevents premature database complexity | **LOW** | PENDING REVIEW |
