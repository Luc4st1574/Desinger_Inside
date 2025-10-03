"use client";
import DashboardLayout from "./layout/DashboardLayout";
import DashboardMain from "../../components/dashboard/Main";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import { useAppContext } from "@/context/AppContext";
import PermissionGuard from "@/guards/PermissionGuard";
import { PERMISSIONS } from "@/constants/permissions";
import SalesInfoSidebar from "@/components/dashboard/salesview/SalesInfoSidebar";

export default function DashboardPage() {
  const { user } = useAppContext();
  const isSalesManager = user?.role === 'sales_manager';
  console.log("DashboardLayout user", user);
  
  if (isSalesManager) {
    return (
    <PermissionGuard required={PERMISSIONS.VIEW_DASHBOARD}>
      <DashboardLayout sidebar={<SalesInfoSidebar />}>
        <DashboardMain isSalesManager={isSalesManager} />
      </DashboardLayout>
    </PermissionGuard>
    )
  }

  return (
    <PermissionGuard required={PERMISSIONS.VIEW_DASHBOARD}>
      <DashboardLayout  sidebar={<DashboardSidebar />}>
        <DashboardMain isSalesManager={isSalesManager} />
      </DashboardLayout>
    </PermissionGuard>
  );
}
