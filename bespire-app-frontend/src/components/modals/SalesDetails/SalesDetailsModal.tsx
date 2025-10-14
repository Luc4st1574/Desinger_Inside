
import { Dialog, DialogBackdrop } from "@headlessui/react";
import { useEffect, useState } from "react";
import salesData from "@/data/salesData.json";
import SalesOverviewSidebar from "./SalesOverviewSidebar";
import SalesMainContent from "./SalesMainContent";

// Define the type for a single prospect based on your JSON structure
type Prospect = (typeof salesData.prospects.list)[0];

export default function SalesDetailsModal({
  open,
  onClose,
  prospectId,
}: {
  open: boolean;
  onClose: () => void;
  prospectId: number | null;
}) {
  const [prospect, setProspect] = useState<Prospect | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Effect to load the prospect data when the modal opens or prospectId changes
  useEffect(() => {
    if (open && prospectId !== null) {
      setLoading(true);
      setError(null);
      // Simulate async fetch
      setTimeout(() => {
        const foundProspect = salesData.prospects.list.find(
          (p) => p.id === prospectId
        );
        if (foundProspect) {
          // Make sure the found prospect conforms to the Prospect type
          setProspect(foundProspect as Prospect);
        } else {
          setError("Prospect not found.");
        }
        setLoading(false);
      }, 200);
    } else if (!open) {
      setProspect(null);
    }
  }, [open, prospectId]);
  
  // State for managing the sales stage
  const [currentStage, setCurrentStage] = useState(prospect?.stage || "");

  useEffect(() => {
    if (prospect) {
      setCurrentStage(prospect.stage);
    }
  }, [prospect]);

  const changeStage = (newStage: string) => {
    console.log(`Stage for prospect ${prospectId} changed to: ${newStage}`);
    setCurrentStage(newStage);
  };

  if (!open) return null;

  if (loading) {
    return (
      <Dialog open={true} onClose={onClose} className="relative z-50 p-4">
        <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="fixed inset-0 flex justify-end p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-2xl flex w-full max-w-4xl overflow-hidden items-center justify-center">
            <div className="p-10 text-gray-500">Loading prospect details...</div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  if (error || !prospect) {
    return (
      <Dialog open={true} onClose={onClose} className="relative z-50 p-4">
        <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="fixed inset-0 flex justify-end p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-2xl flex w-full max-w-4xl overflow-hidden items-center justify-center">
            <div className="p-10 text-red-500">{error || "Could not load prospect details."}</div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50 p-4">
      <DialogBackdrop className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
      <div className="fixed inset-0 flex justify-end p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-2xl flex w-full max-w-4xl overflow-hidden">
          <SalesOverviewSidebar prospect={prospect} />
          <SalesMainContent
            prospect={prospect}
            onClose={onClose}
            stage={currentStage}
            changeStage={changeStage}
          />
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}