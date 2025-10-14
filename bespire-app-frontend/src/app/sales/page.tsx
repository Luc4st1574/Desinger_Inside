"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import SalesMain from "@/components/sales/SalesMain";
export default function SalesPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_SALES}>
      <DashboardLayout  >
        <SalesMain />
      </DashboardLayout>
    </PermissionGuard>
  );
}
