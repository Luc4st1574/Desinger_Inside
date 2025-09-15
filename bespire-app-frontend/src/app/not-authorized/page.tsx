"use client";

import DashboardLayout from "../dashboard/layout/DashboardLayout";
export default function NotAuthorized() {
  return (
    <DashboardLayout >
      <div>
        <p>You do not have permission to view this section</p>
      </div>
    </DashboardLayout>
  );
}

