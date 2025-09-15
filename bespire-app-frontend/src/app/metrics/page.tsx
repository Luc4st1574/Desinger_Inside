"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
export default function MetricsPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_METRICS}>
      <DashboardLayout >
        <div>
            Metrics page
        </div>
      </DashboardLayout>
    </PermissionGuard>
  );
}
