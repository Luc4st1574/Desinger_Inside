"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import PlansPage from "@/components/plans/PlansPage";
export default function PlansPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_PLAN}>
      <DashboardLayout >
        <PlansPage />
      </DashboardLayout>
    </PermissionGuard>
  );
}
