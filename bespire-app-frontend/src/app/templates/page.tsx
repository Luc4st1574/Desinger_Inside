'use client';

import React from 'react';
import PermissionGuard from "@/guards/PermissionGuard";
import DashboardLayout from "../dashboard/layout/DashboardLayout";
import { PERMISSIONS } from "@/constants/permissions";
import { useAppContext } from '@/context/AppContext';
import TemplatesPage from "@/components/templates/TemplatesPage";

export default function TemplatesPageMain() {
  const { user } = useAppContext();
  const isClient = user?.role === 'client';

  return (
    <PermissionGuard required={PERMISSIONS.VIEW_TEMPLATES}>
      <DashboardLayout>
        <TemplatesPage isClientView={isClient} />
      </DashboardLayout>
    </PermissionGuard>
  );
}