"use client";

import OverviewMetricsPlans from "./OverviewMetricsPlans";
import PlansAndDiscounts from "./PlansAndDiscounts";


export default function OrdersPage() {

    return (
        <section className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex flex-col gap-6">
            <OverviewMetricsPlans />
            <PlansAndDiscounts />
        </section>
    );
}
