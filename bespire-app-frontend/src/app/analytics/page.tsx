"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import AnalyticsMain from "@/components/analytics/AnalyticsMain";

export default function AnalyticsPage() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_ANALYTICS}>
      <DashboardLayout>
        <AnalyticsMain />
      </DashboardLayout>
    </PermissionGuard>
  );
}