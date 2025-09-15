"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import OrdersPage from "@/components/orders/OrdersPage";
export default function OrdersPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_ORDERS}>
      <DashboardLayout >
        <OrdersPage />
      </DashboardLayout>
    </PermissionGuard>
  );
}
