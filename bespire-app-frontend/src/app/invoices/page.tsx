"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import InvoicesPage from "@/components/invoices/InvoicesPage";
export default function InvoicesPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_INVOICES}>
      <DashboardLayout >
        <InvoicesPage />
      </DashboardLayout>
    </PermissionGuard>
  );
}
