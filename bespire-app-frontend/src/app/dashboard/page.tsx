"use client";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardMain from "../../components/dashboard/Main";
import { useAppContext } from "@/context/AppContext";
import PermissionGuard from "@/guards/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";

export default function DashboardPage() {
  const { user } = useAppContext();
  const isSalesManager = user?.role === 'sales_manager';
  console.log("DashboardLayout user", user);

  return (
    <PermissionGuard required={PERMISSIONS.VIEW_DASHBOARD}>
      <DashboardLayout>
        <DashboardMain isSalesManager={isSalesManager} />
      </DashboardLayout>
    </PermissionGuard>
  );
}