export default function AboutSection() {
  return (
    <section
      id="about"
      className="border-b border-border bg-background"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <h2
            id="about-heading"
            className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
          >
            About CampusPlacements
          </h2>
          <p className="mt-3 text-sm leading-7 text-secondary-text sm:text-base">
            CampusPlacements is the college placement portal for students,
            recruiters, and placement officers. It is built to organize job
            postings, applications, and outcomes in a single, role-aware
            workspace.
          </p>
        </div>
      </div>
    </section>
  );
}
