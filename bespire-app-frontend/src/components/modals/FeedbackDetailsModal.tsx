/* eslint-disable @next/next/no-img-element */
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { X, Link, Bell, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { FeedbackItem } from "@/hooks/feedback/useFeedbackList";
import CommonPhrasesBadge from "@/components/ui/CommonPhrasesBadge";
import { getInitials } from "@/utils/utils";
import ActionMenu, { ActionMenuItem } from "../ui/ActionMenu";
import RequestStatusDropdown from "../ui/RequestStatusDropdown";
import DetailsIcon from "@/assets/icons/request_tabs/details.svg";
import TrendIcon from "@/assets/icons/client_detail/Trend.svg";
import RequestIcon from "@/assets/icons/client_detail/send.svg";
import NotesIcon from "@/assets/icons/client_detail/document-text-outline.svg";
import AssetsIcon from "@/assets/icons/client_detail/cube.svg";
import AboutIcon from "@/assets/icons/client_detail/info-circle.svg";
import GenericTabs, { TabConfig } from "../ui/GenericTabs";
import FilesIcon from "@/assets/icons/request_tabs/files.svg";
import FeedbackDetailsTab from "./feedback/tabDetail";
import TabFilesByType from "./feedback/tabFiles";
import ClientNotesTab from "../clients/tabs/ClientNotesTab";
import Button from "../ui/Button";
interface FeedbackDetailsModalProps {
  open: boolean;
  onClose: () => void;
  feedback: FeedbackItem | null;
}

const FeedbackDetailsModal: React.FC<FeedbackDetailsModalProps> = ({
  open,
  onClose,
  feedback,
}) => {
  if (!feedback) return null;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [activeTab, setActiveTab] = useState<Tab>("details");

  // Handler para cambio de tab
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as Tab);
  };

  // Configuración de tabs para el feedback
  const FeedBackTabs: TabConfig[] = [
    {
      id: "details",
      label: "Details",
      icon: <DetailsIcon className="h-5 w-5" />,
    },
    {
      id: "files",
      label: "Files",
      icon: <FilesIcon className="h-5 w-5" />,
    },
    {
      id: "notes",
      label: "Notes",
      icon: <NotesIcon className="h-5 w-5" />,
    },
  ];

  const menuActions: ActionMenuItem[] = [
    {
      label: "Edit",
      action: () => {},
    },
    {
      label: "Delete",
      action: () => {},

      isDanger: true, // <-- Esto lo pone en color rojo
      hasSeparator: true, // <-- Esto añade la línea de separación arriba
    },
  ];

  type Tab = "details" | "files" | "notes";
  const renderTab = (tab: Tab) => {
    switch (tab) {
      case "details":
        return <FeedbackDetailsTab feedback={feedback} />;
      case "files":
        return (
          <TabFilesByType linkedToId={feedback.id} linkedToType="feedback" />
        );
      case "notes":
        return <ClientNotesTab client={feedback.submittedBy} />;
      default:
        return <FeedbackDetailsTab feedback={feedback} />;
    }
  };
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

      <div className="fixed inset-0 flex justify-end">
        <DialogPanel className="w-full text-sm max-w-xl m-2 bg-white overflow-hidden rounded-xl flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between p-4 ">
            <div className="flex items-center  ">
              <RequestStatusDropdown
                status={feedback.status}
                loading={false}
                onChange={() => {}}
                role={feedback.role}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                title="Copy Link"
                className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
              >
                <Link className="w-5 h-5" />
              </button>
              <button
                type="button"
                title="Notify"
                className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
              >
                <Bell className="w-5 h-5" />
              </button>
              <div
                title="More"
                onClick={(e) => e.stopPropagation()}
                className="hover:bg-gray-100 p-2 rounded-full cursor-pointer"
              >
                <ActionMenu items={menuActions} isHorizontal />
              </div>
              <button
                type="button"
                title="Close"
                className="hover:bg-gray-200 p-2 rounded-full cursor-pointer"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {/* Title */}
              <div className="text-sm font-medium text-gray-500">
                {feedback.id}
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {feedback.title}
              </h1>
            </div>

             {/* Tabs */}
                  <div className="px-3 md:px-6">
                    <GenericTabs 
                      tabs={FeedBackTabs}
                      activeTab={activeTab}
                      onTabChange={handleTabChange}
                    />
                  </div>
                  
                  {/* Tab Content */}
                  <div className="flex-grow overflow-y-auto p-3 md:p-6 w-full mx-auto">
                    <div className="max-w-4xl w-full">
                      {renderTab(activeTab)}
                    </div>
                  </div>
          </div>

          {/* Footer */}
         <div className="p-6 border-t border-gray-100 bg-white">
            <div className="flex justify-between items-center gap-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outlineG"
                className="w-full"
                size="lg"
              >
                Close
              </Button>
              <Button
                type="button"
                variant="green2"
                className="w-full"
                size="lg"
              >
                Message Sender
              </Button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default FeedbackDetailsModal;
