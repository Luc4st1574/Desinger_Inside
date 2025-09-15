"use client";

import MetricsServices from "./MetricsServices";
import ServicesList from "./ServicesList";


export default function ServicesPage() {

    return (
        <section className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex flex-col gap-6">
            <MetricsServices />
            <ServicesList />
        </section>
    );
}
