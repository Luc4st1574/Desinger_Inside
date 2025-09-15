"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import ServicesPage from "@/components/services/ServicesPage";
export default function ServicesPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_SERVICES}>
      <DashboardLayout >
        <ServicesPage  />
      </DashboardLayout>
    </PermissionGuard>
  );
}
