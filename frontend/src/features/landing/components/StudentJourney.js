const STEPS = [
  {
    number: "01",
    title: "Complete your profile",
    description:
      "Keep your academics, skills, and resume current so recruiters see an accurate picture.",
  },
  {
    number: "02",
    title: "Apply to roles",
    description:
      "Browse campus opportunities and submit applications for roles that match your goals.",
  },
  {
    number: "03",
    title: "Track your progress",
    description:
      "Follow application status and next steps from shortlist through final outcomes.",
  },
];

export default function StudentJourney() {
  return (
    <section
      className="border-b border-border bg-background"
      aria-labelledby="journey-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="max-w-xl">
          <h2
            id="journey-heading"
            className="text-2xl font-semibold tracking-tight text-primary sm:text-3xl"
          >
            How students move through placements
          </h2>
          <p className="mt-2 text-sm leading-6 text-secondary-text sm:text-base">
            A clear path from profile setup to offer tracking.
          </p>
        </div>

        <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {STEPS.map((step) => (
            <li key={step.number} className="relative">
              <p className="text-sm font-semibold tracking-wide text-info">
                {step.number}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-secondary-text">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
