"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
export default function BlogsPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_BLOGS}>
      <DashboardLayout >
        <div>
            Blogs page
        </div>
      </DashboardLayout>
    </PermissionGuard>
  );
}
