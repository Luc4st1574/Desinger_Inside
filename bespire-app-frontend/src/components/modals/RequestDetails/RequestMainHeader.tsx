/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
// components/RequestMainHeader.tsx
import React, { useState } from 'react';
import { Bell, Link, X } from "lucide-react";
import ConfirmModal from '@/components/modals/ConfirmModal';
import useDeleteRequest from '@/hooks/team/useDeleteRequest';
import RequestStatusDropdown from "../../ui/RequestStatusDropdown";
import RequestReviewBadge from "@/components/ui/RequestReviewBadge";
import ActionMenu, { ActionMenuItem } from "@/components/ui/ActionMenu";
import { useAppContext } from '@/context/AppContext';
import ChangeLogModal from '../ChangeLogModal';
import { useArchiveRequest } from '@/hooks/requests/useArchiveRequest';


type RequestMainHeaderProps = {
  status: string;
  title: string;
  requestId: string | number;
  role: string;
  onClose: () => void;
  parentRequest?: any;
  onBackToMain?: () => void;
  parentRequestTitle?: string;
  onSeeReview?: () => void;
  loadingStatus: boolean;
  changeStatus: (status: string) => void;
};

export default function RequestMainHeader({
  status,
  title,
  requestId,
  role,
  onClose,
  parentRequest,
  parentRequestTitle,
  onSeeReview,
  loadingStatus,
  changeStatus
}: RequestMainHeaderProps) {
  console.log("RequestMainHeader rendered with status:", status, "role:", role);
  const { setRequestForEdit, setIsEditRequest, setShowModalRequest } = useAppContext();

   const [isLogOpen, setIsLogOpen] = useState(false);
  const { archiveRequest, loading: loadingArchive } = useArchiveRequest(onClose); // Pasa onClose como onSuccess

   //handleArchive
const handleArchive = async (id: string | number) => {
  console.log("Archiving request:", id);
   setConfirmArchiveOpen(true);
};

 const onConfirmArchive = async () => {
    if (!requestId) return;
    try {
      await archiveRequest(String(requestId));
      setConfirmArchiveOpen(false); // Cierra el modal después de archivar
      onClose(); // Cierra el modal principal
    } catch (err) {
      // Error ya manejado en el hook
      void err;
    }
  };

//handleEdit
const handleEdit = (requestId: string | number) => {
  console.log("Editing request:", requestId, status, role);
  if(status!=='queued' && role==='client'){
    return
  }
  setRequestForEdit(requestId); // Pasar requestId en lugar de request
  setIsEditRequest(true);
  setShowModalRequest(true);
};

//viewChangeLog
const viewChangeLog = (id: string | number) => {
  console.log("Viewing change log for request:", id);
  setIsLogOpen(true)
};

// handleDelete usando modal y mutation
const { deleteRequest, loading: deleting } = useDeleteRequest();
const [confirmOpen, setConfirmOpen] = React.useState(false);
const [toDeleteId, setToDeleteId] = React.useState<string | number | null>(null);
  const [confirmArchiveOpen, setConfirmArchiveOpen] = useState(false); // Nuevo estado para el modal de archive

const handleDelete = (id: string | number) => {
  setToDeleteId(id);
  setConfirmOpen(true);
};

const onConfirmDelete = async () => {
  if (!toDeleteId) return;
  try {
    await deleteRequest(String(toDeleteId));
    setConfirmOpen(false);
    onClose()
    // opcional: cerrar el modal principal si se necesita
  } catch (_err) {
    // El hook ya muestra los toasts de error
    void _err;
  } finally {
    setToDeleteId(null);
  }
};

const menuActions: ActionMenuItem[] = [
  {
    label: "Archive",
    action: () => handleArchive(requestId),
       disabled: loadingArchive, // Deshabilita mientras se archiva
      tooltip: loadingArchive ? "Archiving..." : "Archive this request"
  
  },
  {
    label: "Edit Request",
    action: () => handleEdit(requestId),
    disabled: status !== 'queued' && role === 'client',
    tooltip: "Cannot edit In Progress/For Approval. Kindly share updates in comments."
  },
  {
    label: "View Change Log",
    action: () => viewChangeLog(requestId),
  },
  {
    label: "Delete",
    action: () => handleDelete(requestId),
    isDanger: true,      // <-- Esto lo pone en color rojo
    hasSeparator: true,  // <-- Esto añade la línea de separación arriba
  },
];
  return (
    <>
      <div className="flex items-start justify-between ">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
              <RequestStatusDropdown
                status={status}
                loading={loadingStatus}
                onChange={changeStatus}
                role={role}
              />
            <RequestReviewBadge 
            //@ts-ignore
            requestId={requestId} onSeeReview={onSeeReview} />
          </div>
          {/* Migas de pan si es subtask */}
          {parentRequest && (
            <div className="flex items-center gap-1 mt-3">
              <span className="text-black">{parentRequestTitle}</span>
              <img src="/assets/icons/mayorq.svg" alt="" className="w-4 h-4" />
            </div>
          )}
          <div className="font-bold text-2xl">{title}</div>
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

      <ConfirmModal
        open={confirmOpen}
        title="Delete request"
        description="Are you sure you want to delete this request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleting}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirmDelete}
      />

       <ConfirmModal
        open={confirmArchiveOpen}
        title="Archive Request"
        description="Are you sure you want to archive this request? It will be moved to the archive and can be restored later."
        confirmText="Archive"
        cancelText="Cancel"
        loading={loadingArchive}
        onClose={() => setConfirmArchiveOpen(false)}
        onConfirm={onConfirmArchive}
      />


      <ChangeLogModal
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
       requestId={String(requestId)}
      />

    </>
  );
}
