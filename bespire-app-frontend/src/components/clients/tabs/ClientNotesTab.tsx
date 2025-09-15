/* eslint-disable @next/next/no-img-element */
import React, { useMemo, useState } from "react";
import NoteEditorLexical from "../NoteEditorLexical";
import ContextMenu from "../../ui/ContextMenu";
import useNotes, { Note as BackendNote } from "@/hooks/notes/useNotes";
import { useAppContext } from "@/context/AppContext";
import SpinnerSmall from "@/components/ui/Spinner";
import { showSuccessToast, showErrorToast } from "@/components/ui/toast";
import ConfirmModal from "@/components/modals/ConfirmModal";

interface Note {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  time: string;
}

interface ClientNotesTabProps {
  client?: { id: string; name: string } | null; 
}

const ClientNotesTab: React.FC<ClientNotesTabProps> = ({ client }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  // Auth (user id + workspace)
  const { user, workspace } = useAppContext();
  const currentUserId = user?._id ?? null;
  const currentWorkspaceId = workspace?._id ?? null;

  // useNotes hook: filter by workspace and client
  const { notes: backendNotes, loading, createNote, updateNote, removeNote } =
    useNotes({ workspaceId: currentWorkspaceId ?? undefined, userClient: client?.id ?? undefined });
  console.log("Notes:", backendNotes);
  // Map backend note to UI note shape
  const uiNotes: Note[] = useMemo(() => {
    return (backendNotes ?? []).map((n: BackendNote) => {
      const dateIso = n.createdAt ?? n.updatedAt ?? new Date().toISOString();
      const d = new Date(dateIso);
      const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const createdBy = n.createdBy as string | { firstName?: string; lastName?: string; _id?: string };
  const author = typeof createdBy === "string"
        ? createdBy || "Unknown"
        : `${createdBy?.firstName ?? ""} ${createdBy?.lastName ?? ""}`.trim() || createdBy?._id || "Unknown";

      return {
        id: n._id,
        title: n.title,
        content: n.content,
        author,
        date,
        time,
      };
    });
  }, [backendNotes]);

  const handleAddNote = async (title: string, content: string) => {
    setSaving(true);
    try {
      if (editingNote) {
        // update existing
        const updatedId = await updateNote({ id: editingNote.id, title, content });
        if (updatedId) showSuccessToast("Note updated successfully");
        else showErrorToast("Error al guardar la nota");
        setEditingNote(null);
      } else {
        // create new note in backend
        const newId = await createNote({
          title,
          content,
          createdBy: currentUserId ?? "",
          workspace: currentWorkspaceId ?? "",
          userClient: client?.id ?? null,
          tags: [],
        });
        if (newId) showSuccessToast("Note created successfully");
        else showErrorToast("Error al guardar la nota");
      }
    } finally {
      setSaving(false);
      setIsEditorOpen(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditorOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    // open confirm modal
    setToDeleteId(noteId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;
    setConfirmOpen(false);
    setDeletingId(toDeleteId);
    try {
      const removedId = await removeNote(toDeleteId);
      if (removedId) showSuccessToast("Note deleted");
      else showErrorToast("Error al eliminar la nota");
    } finally {
      setDeletingId(null);
      setToDeleteId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setIsEditorOpen(false);
  };

  const toggleExpanded = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Notes</h2>
        <button
          onClick={() => setIsEditorOpen(true)}
          className="border rounded-full px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50"
          disabled={saving}
        >
          {saving ? <SpinnerSmall color="text-black" /> : (
            <>
              Add <span>+</span>
            </>
          )}
        </button>
      </div>

      {isEditorOpen && (
        <NoteEditorLexical
          onSave={handleAddNote}
          onCancel={editingNote ? handleCancelEdit : () => setIsEditorOpen(false)}
          initialTitle={editingNote?.title}
          initialContent={editingNote?.content}
          isEditing={!!editingNote}
        />
      )}

      {(!loading && uiNotes.length === 0 && !isEditorOpen) && (
        <div className="text-center py-8 text-gray-500">
          <p>No notes yet. Click &quot;Add +&quot; to create your first note.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8 text-gray-500">Loading notes...</div>
      )}

  {uiNotes.map((note) => {
        const isExpanded = expandedNotes.has(note.id);
        const shouldShowToggle = note.content.length > 150;

        // Ocultar la nota si está siendo editada
        if (editingNote && editingNote.id === note.id) {
          return null;
        }

        return (
          <div key={note.id} className="border border-green-gray-100 bg-green-gray-25 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-lg">{note.title}</h3>
              {deletingId === note.id ? (
                <SpinnerSmall color="text-black" />
              ) : (
                <ContextMenu onEdit={() => handleEditNote(note)} onDelete={() => handleDeleteNote(note.id)} />
              )}
            </div>
            <div className="flex gap-2 text-xs items-center mb-2 border-b border-green-gray-100 pb-2">
              <span className="bg-pale-green-300 p-2 rounded-lg">Notes</span>
              <span className="font-semibold text-green-gray-800">{note.author}</span>
              <span>
                {note.date}, {note.time}
              </span>
            </div>
            <p className="text-sm text-green-gray-950">{isExpanded ? note.content : truncateText(note.content)}</p>
            {shouldShowToggle && (
              <button onClick={() => toggleExpanded(note.id)} className="text-sm text-green-gray-800 mt-2 hover:text-green-gray-950">
                {isExpanded ? (
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Show less</span>
                    <img src="/assets/icons/ChevronDown.svg" alt="" style={{ transform: "rotate(180deg)" }} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>Show more </span>
                    <img src="/assets/icons/ChevronDown.svg" alt="" />
                  </div>
                )}
              </button>
            )}
          </div>
        );
      })}

      <ConfirmModal
        open={confirmOpen}
        title="Delete note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        loading={!!deletingId}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ClientNotesTab;
