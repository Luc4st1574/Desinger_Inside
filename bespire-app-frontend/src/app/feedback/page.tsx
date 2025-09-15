"use client";

import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import FeedBackPage from "@/components/feedback/FeedBackPage";
export default function FeedbackPageMain() {
  return (
    <PermissionGuard required={PERMISSIONS.VIEW_FEEDBACK}>
      <DashboardLayout >
       <FeedBackPage />
      </DashboardLayout>
    </PermissionGuard>
  );
}
