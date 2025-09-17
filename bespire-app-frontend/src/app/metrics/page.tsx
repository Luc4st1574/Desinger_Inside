"use client";

import DashboardLayout from "../dashboard/layout/DashboardLayout";
import PerformanceMain from "../../components/metrics/MetricsMain";

export default function PerformanceMetricsPage() {
    return (
        <DashboardLayout>
        <PerformanceMain />
        </DashboardLayout>
    );
}