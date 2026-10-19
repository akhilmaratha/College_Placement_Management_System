import Image from "next/image";
import Link from "next/link";

export default function LandingHero() {
  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
        <div className="max-w-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl lg:text-[2.75rem] lg:leading-tight">
            Your next opportunity starts here.
          </h1>
          <p className="mt-4 text-base leading-7 text-secondary-text sm:text-lg sm:leading-8">
            CampusPlacements connects students with campus roles and helps
            placement teams and recruiters manage the hiring process in one
            place.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/student/jobs"
              className="inline-flex items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Explore Jobs
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-[10px] border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground outline-none transition hover:bg-background focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Student Login
            </Link>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[12px] border border-border bg-card">
          <Image
            src="/images/campus-career.jpg"
            alt="Students collaborating around a table during a campus career session"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 560px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
