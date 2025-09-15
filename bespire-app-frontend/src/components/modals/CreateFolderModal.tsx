"use client";

import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import FolderCreatedToast from '../ui/FolderCreatedToast';
// ⬇️ quitamos TagsData import y usamos el hook contra el back
// import TagsData from '@/data/tags.json';
import CustomSelect from './Selects/CustomSelect';
import CreatableSelect from './Selects/CreatableSelect';
import { CreateFolderInput } from '@/types/workspaceFiles';
import { useTags } from '@/hooks/files/useTags';
import { useWorkspaceFiles } from '@/hooks/files/useWorkspaceFiles';

const accessOptions = [
  { value: 'All', label: 'All (default)' },
  { value: 'Team', label: 'Team' },
  { value: 'Private', label: 'Private' },
];

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  currentFolderId: string | null;
  onFolderCreated?: () => void; // Callback opcional para refrescar la lista
}

const CreateFolderModal: React.FC<CreateFolderModalProps> = ({ 
  isOpen, 
  onClose, 
  workspaceId, 
  currentFolderId,
  onFolderCreated 
}) => {
  const [folderName, setFolderName] = useState('');
  // Opciones que muestra el select (mezcla de back + creadas localmente)
  const [availableTags, setAvailableTags] = useState<{ value: string; label: string }[]>([]);
  // Para mantener las que el usuario crea en el momento (antes de que existan en back)
  const [localCreatedTags, setLocalCreatedTags] = useState<{ value: string; label: string }[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [access, setAccess] = useState<'All' | 'Team' | 'Private'>('All');
  const [isLoading, setIsLoading] = useState(false);
  const isFormValid = folderName.trim() !== '';

  const { createFolder } = useWorkspaceFiles({ 
    workspaceId, 
    parentId: currentFolderId || undefined 
  });

  // ⬇️ Traemos tags del back
  const { options: tagOptions, refetch: refetchTags } = useTags(workspaceId);

  // Sincronizamos opciones del back + las creadas localmente, evitando duplicados
  useEffect(() => {
    const byKey = new Map<string, { value: string; label: string }>();
    [...tagOptions, ...localCreatedTags].forEach(opt => {
      byKey.set(opt.value.toLowerCase(), opt);
    });
    setAvailableTags(Array.from(byKey.values()));
  }, [tagOptions, localCreatedTags]);

  const resetForm = () => {
    setFolderName('');
    setSelectedTag(null);
    setAccess('All');
    // No limpiamos availableTags: mantiene sugerencias
  };

  // Cuando el user crea una nueva tag desde el select
  const handleCreateTag = (newTagValue: string) => {
    const exists = availableTags.some(t => t.value.toLowerCase() === newTagValue.toLowerCase());
    if (!exists) {
      const newTag = { value: newTagValue, label: newTagValue };
      setLocalCreatedTags(prev => [...prev, newTag]);
    }
    // Seteamos inmediatamente como seleccionada
    setSelectedTag(newTagValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsLoading(true);

    try {
      const folderInput: CreateFolderInput = {
        name: folderName,
        // Si tu CreateFolderInput del back NO exige `type`, puedes remover esta línea:
        type: 'folder',
        workspaceId,
        parentId: currentFolderId || undefined,
        tags: selectedTag ? [selectedTag] : [],
        access: [access],
      };

      const newFolder = await createFolder(folderInput);

      if (newFolder) {
        // Refrescar la lista de tags para obtener cualquier nuevo tag creado
        refetchTags();
        
        const toastId = `folder-created-${newFolder._id}`;
        toast(
          <FolderCreatedToast
            toastId={toastId}
            folderId={newFolder._id}
            onUndo={() => {
              // TODO: Implementar delete folder
              console.log('Delete folder:', newFolder._id);
            }}
          />,
          { id: toastId, duration: 4000 }
        );
        
        onFolderCreated?.();
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Error creating folder');
    } finally {
      setIsLoading(false);
      onClose();
      resetForm();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-lg transform rounded-lg bg-white text-left align-middle shadow-xl transition-all overflow-visible">
                <div className="flex items-center justify-between px-6 pt-6">
                  <DialogTitle as="h3" className="text-xl font-medium leading-6 text-gray-900">
                    New Folder
                  </DialogTitle>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label="Close modal"
                    title="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-6 bg-white p-6">
                    <div>
                      <label htmlFor="folderName" className="mb-2 block text-sm font-medium text-gray-700">
                        Folder name
                      </label>
                      <input
                        id="folderName"
                        type="text"
                        placeholder="Enter folder name"
                        className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:outline-none sm:text-sm"
                        value={folderName}
                        onChange={(e) => setFolderName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <CreatableSelect
                        label="Tag"
                        value={selectedTag}
                        onChange={setSelectedTag}
                        options={availableTags}
                        onCreate={handleCreateTag}
                      />
                      <CustomSelect
                        label="Access"
                        value={access}
                        onChange={(val) => setAccess(val as 'All' | 'Team' | 'Private')}
                        options={accessOptions}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 px-6 py-4">
                    <button
                      type="button"
                      className="w-1/2 rounded-full border border-gray-500 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`w-1/2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                        isFormValid
                          ? 'bg-[#697d67] hover:bg-[#596b57]'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!isFormValid || isLoading}
                    >
                      {isLoading ? 'Creating...' : 'Create Folder'}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateFolderModal;
