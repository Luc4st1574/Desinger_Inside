"use client";

import React, { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { Download, MoreVertical } from 'lucide-react';
import { Attachment } from './types';
import { formatFileSize } from '@/utils/chatHelpers';

interface AttachmentActionsProps {
    attachment: Attachment;
    openDirection: 'up' | 'down';
    isFile: boolean;
    onShareFile: (attachment: Attachment) => void;
    onDeleteFile: () => void;
}

export default function AttachmentActions({ attachment, openDirection, isFile, onShareFile, onDeleteFile }: AttachmentActionsProps) {
    return (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <a href={URL.createObjectURL(attachment.file)} download={attachment.file.name} className="p-1.5 rounded-full text-[#5e6b66] hover:text-black focus:outline-none focus:ring-0" title="Download">
                <Download size={18} />
            </a>
            <Popover className="relative">
                <Popover.Button className="p-1.5 rounded-full text-[#5e6b66] hover:text-black focus:outline-none focus:ring-0" title="More options">
                    <MoreVertical size={18} />
                </Popover.Button>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Popover.Panel
                        className={`absolute right-0 z-20 w-48 origin-top-right rounded-md bg-white shadow-lg focus:outline-none focus:ring-0 ${openDirection === 'up' ? 'bottom-full mb-2' : 'mt-2'
                            }`}
                    >
                        <div className="py-1">
                            <Popover className="relative w-full">
                                <Popover.Button className="flex w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-0">
                                    View file details
                                </Popover.Button>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Popover.Panel className="absolute left-full ml-2 z-30 w-64 rounded-md bg-white shadow-lg p-3 text-sm focus:outline-none focus:ring-0">
                                        <div className="space-y-2">
                                            <p className="font-bold text-gray-800 break-words">{attachment.file.name}</p>
                                            <p className="text-gray-600"><span className="font-semibold">Size:</span> {formatFileSize(attachment.file.size)}</p>
                                            <p className="text-gray-600"><span className="font-semibold">Type:</span> {attachment.file.type}</p>
                                        </div>
                                    </Popover.Panel>
                                </Transition>
                            </Popover>
                            
                            {isFile && (
                                <button onClick={() => onShareFile(attachment)} className="flex w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                                    Share file
                                </button>
                            )}
                            <button onClick={onDeleteFile} className="flex w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
                                Delete file
                            </button>
                        </div>
                    </Popover.Panel>
                </Transition>
            </Popover>
        </div>
    );
};