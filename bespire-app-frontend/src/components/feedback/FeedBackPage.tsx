"use client";

import FeedBackList from "./FeedBackList";
import OverviewMetricsFeedBack from "./OverviewMetricsFeedBack";



export default function FeedBackPage() {

    return (
        <section className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 flex flex-col gap-6">
            <OverviewMetricsFeedBack />
            <FeedBackList />
        </section>
    );
}
