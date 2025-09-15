"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import TeamPage from "@/components/team/TeamPage";

export default function TeamPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_CLIENTS}>
      <DashboardLayout>
        <TeamPage />
      </DashboardLayout>
    </PermissionGuard>
  );
}
