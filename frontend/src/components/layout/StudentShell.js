"use client";

import { Suspense, useState } from "react";
import StudentSidebar from "@/components/layout/StudentSidebar";
import StudentTopBar from "@/components/layout/StudentTopBar";

function SidebarFallback() {
  return (
    <aside
      className="hidden w-64 shrink-0 border-r border-border bg-card lg:block"
      aria-hidden="true"
    />
  );
}

export default function StudentShell({
  children,
  title = "Overview",
  breadcrumb = "Student / Overview",
  student,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <StudentSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </Suspense>
      <div className="flex min-w-0 flex-1 flex-col">
        <StudentTopBar
          title={title}
          breadcrumb={breadcrumb}
          student={student}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
