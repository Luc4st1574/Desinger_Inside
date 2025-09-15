"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
export default function SalesPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_SALES}>
      <DashboardLayout  >
        <div>
            Sales page
        </div>
      </DashboardLayout>
    </PermissionGuard>
  );
}
