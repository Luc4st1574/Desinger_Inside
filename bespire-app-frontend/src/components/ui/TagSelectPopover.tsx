
import { Fragment, useState, useEffect } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useTags } from '@/hooks/files/useTagsV2';

interface TagSelectPopoverProps {
    workspaceId: string;
    onSelectTag: (tag: string) => void;
    onClose: () => void;
}

export default function TagSelectPopover({ workspaceId, onSelectTag, onClose }: TagSelectPopoverProps) {
   
  // console.log('TagSelectPopover rendered with workspaceId:', workspaceId);
    const [newTag, setNewTag] = useState('');
    const { options, loading, createTag, creating, refetch } = useTags(workspaceId);
    const [inputError, setInputError] = useState('');

    // Limpiar error al escribir
    useEffect(() => { if (newTag) setInputError(''); }, [newTag]);

    const handleAddTag = async () => {
        const tagName = newTag.trim();
        if (!tagName) return;
        // Si ya existe, selecciona
        const exists = options.find(t => t.value.toLowerCase() === tagName.toLowerCase());
        if (exists) {
            onSelectTag(exists.value);
            setNewTag('');
            onClose();
            return;
        }
        try {
            const created = await createTag(tagName);
            if (created) {
                onSelectTag(created.name);
                setNewTag('');
                onClose();
            }
        } catch (e) {
            setInputError('No se pudo crear el tag');
        }
    };

    return (
        <Popover as="div" className="relative">
            {({ close }) => (
                <>
                    <PopoverButton className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200">
                        + Add
                    </PopoverButton>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    >
                        <PopoverPanel anchor="bottom end" className="z-10 mt-2 w-64 transform rounded-lg bg-white shadow-lg border border-gray-300 focus:outline-none">
                            <div className="p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-900">Add a tag</h4>
                                    <button
                                        type="button"
                                        onClick={() => close()}
                                        className="text-gray-400 hover:text-gray-600"
                                        title="Close"
                                        aria-label="Close"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {loading ? (
                                        <span className="text-xs text-gray-400">Cargando...</span>
                                    ) : options.length === 0 ? (
                                        <span className="text-xs text-gray-400">No hay tags</span>
                                    ) : options.map((tag) => (
                                        <button
                                            type="button"
                                            key={tag.value}
                                            onClick={() => {
                                                onSelectTag(tag.value);
                                                close();
                                            }}
                                            className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-black hover:bg-green-200"
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Create new tag..."
                                        className="block w-full rounded-md border-gray-300 px-3 py-1.5 shadow-sm focus:outline-none sm:text-sm"
                                        onKeyDown={e => { if (e.key === 'Enter') handleAddTag(); }}
                                        disabled={creating}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddTag}
                                        className="rounded-md bg-[#697d67] px-3 py-1.5 text-sm font-semibold text-white hover:bg-[#596b57]"
                                        disabled={creating}
                                    >
                                        {creating ? 'Agregando...' : 'Add'}
                                    </button>
                                </div>
                                {inputError && <div className="text-xs text-red-500 mt-1">{inputError}</div>}
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
}