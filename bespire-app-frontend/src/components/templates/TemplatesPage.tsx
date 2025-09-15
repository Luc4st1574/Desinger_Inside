"use client";

import TemplatesList from "./TemplatesList";
import OverviewMetricsTemplates from "./OverviewMetricsTemplates";

export default function TemplatesPage() {
  return (
    <section className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex flex-col gap-6">
      <OverviewMetricsTemplates />
      <TemplatesList />
    </section>
  );
}
