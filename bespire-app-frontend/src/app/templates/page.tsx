"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import TemplatesPage from "@/components/templates/TemplatesPage";

export default function TemplatesPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_TEMPLATES}>
      <DashboardLayout>
        <TemplatesPage />
      </DashboardLayout>
    </PermissionGuard>
  );
}
