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

interface DashboardMainProps {
  isSalesManager: boolean;
}

export default function DashboardMain({ isSalesManager }: DashboardMainProps) {
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

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1 min-w-0">
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