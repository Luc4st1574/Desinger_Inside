"use client";

import DashboardRequestsPreview from "./DashboardRequestsPreview";
import DashboardResources from "./DashboardResources";
import GetStartedWrapper from "./GetStartedWrapper";
import QuickLinksWrapper from "./QuickLinksWrapper";
import DashBoardProspects from "./salesview/DashboardProspects";
import ResourcesAndTutorials from "./salesview/Resources&Tutorials";

interface DashboardMainProps {
  isSalesManager: boolean;
}

export default function DashboardMain({ isSalesManager }: DashboardMainProps) {

  if (isSalesManager) {
    return (
      <div>
        <DashBoardProspects />
        <ResourcesAndTutorials />
      </div>
    );
  }

  return (
    <div>
      <GetStartedWrapper />
      <QuickLinksWrapper />
      <DashboardRequestsPreview />
      <DashboardResources />
    </div>
  );
}
