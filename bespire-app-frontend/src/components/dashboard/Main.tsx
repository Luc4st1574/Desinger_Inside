"use client";

import React from "react";
import DashboardRequestsPreview from "./clientview/DashboardRequestsPreview";
import DashboardResources from "./clientview/DashboardResources";
import GetStartedWrapper from "./clientview/hiddensections/GetStartedWrapper";
import QuickLinksWrapper from "./clientview/hiddensections/QuickLinksWrapper";
import DashBoardProspects from "./salesview/DashboardProspects";
import ResourcesAndTutorials from "./salesview/Resources&Tutorials";
import SalesInfoSidebar from "./salesview/SalesInfoSidebar";
import DashboardSidebar from "./clientview/DashboardSidebar";
import DesignerRequestTable from "./designerview/DesignerRequestTable";
import DesignerSidebar from "./designerview/DesignerSidebar";
import AdminRequestTable from "./adminview/AdminRequestTable";
import AdminSidebar from "./adminview/AdminSidebar";
import KeyPerformanceMetrics from "./adminview/KeyPerformarceMetrics";
import ClientGrowth from "./adminview/ClientGrowth";
import RevenueOverview from "./adminview/RevenueOverview";


interface DashboardMainProps {
  isSalesManager: boolean;
  isClient: boolean;
  isAdmin: boolean;
  isTeamMember: boolean;
}

export default function DashboardMain({ isSalesManager, isClient, isAdmin, isTeamMember }: DashboardMainProps) {
  if (isSalesManager) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 max-w-fit">
          <DashBoardProspects />
          <ResourcesAndTutorials />
        </div>
        <aside className="w-full lg:w-[250px] shrink-0">
          <SalesInfoSidebar />
        </aside>
      </div>
    );
  }

  if (isClient) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 max-w-fit">
          <GetStartedWrapper />
          <QuickLinksWrapper />
          <DashboardRequestsPreview />
          <DashboardResources />
        </div>
        <aside className="w-full lg:w-[250px] shrink-0">
          <DashboardSidebar />
        </aside>
      </div>
    );
  }

  if (isTeamMember) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 max-w-fit">
          <DesignerRequestTable />
          <ResourcesAndTutorials />
        </div>
        <aside className="w-full lg:w-[250px] shrink-0">
          <DesignerSidebar />
        </aside>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 max-w-fit">
          <KeyPerformanceMetrics />
          <ClientGrowth />
          <RevenueOverview />
          <AdminRequestTable />
        </div>
        <aside className="w-full lg:w-[250px] shrink-0">
          <AdminSidebar />
        </aside>
      </div>
    );
  }
}