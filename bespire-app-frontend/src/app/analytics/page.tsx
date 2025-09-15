"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
export default function AnalyticsPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_ANALYTICS}>
      <DashboardLayout >
        <div>
            Analytics page
        </div>
      </DashboardLayout>
    </PermissionGuard>
  );
}
