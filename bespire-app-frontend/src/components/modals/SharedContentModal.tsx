"use client";

import React, { useState, Fragment, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import {
    X,
    Cloud,
    Share2,
    Download,
    MoreVertical,
    Image as ImageIcon,
    File as FileIcon,
    Link as LinkIcon
} from 'lucide-react';
import { format } from 'date-fns';
import ImageViewer from '../chat/chatsdisplay/ImageViewer';
import { ChatUser, MediaItem } from '../chat/ContactInfoPanel';
import { getFileIcon } from '@/utils/getFileIcon';
import { Attachment } from '../chat/chatsdisplay/types';

type ModalMode = 'Media' | 'Files' | 'Links';

interface SharedContentModalProps {
    user: ChatUser;
    initialMode: ModalMode;
    isOpen: boolean;
    onClose: () => void;
}

const MODES_CONFIG = [
    { name: 'Media', icon: ImageIcon },
    { name: 'Files', icon: FileIcon },
    { name: 'Links', icon: LinkIcon },
];

const groupItemsByMonth = <T extends { timestamp: string }>(items: T[]): Record<string, T[]> => {
    if (!items || items.length === 0) {
        return {};
    }
    const sortedItems = [...items].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return sortedItems.reduce((acc, item) => {
        const monthYear = format(new Date(item.timestamp), 'LLLL yyyy');
        if (!acc[monthYear]) {
            acc[monthYear] = [];
        }
        acc[monthYear].push(item);
        return acc;
    }, {} as Record<string, T[]>);
};

export default function SharedContentModal({ user, initialMode, isOpen, onClose }: SharedContentModalProps) {
    const [mode, setMode] = useState<ModalMode>(initialMode);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        setMode(initialMode);
    }, [initialMode]);

    const handleImageClick = (index: number) => {
        setCurrentImageIndex(index);
        setViewerOpen(true);
    };

    const formatLinkTitle = (url: string): string => {
        try {
            const { hostname, pathname } = new URL(url);

            const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
            const toTitleCase = (str: string) => str ? str.split(' ').map(word => capitalize(word)).join(' ') : '';

            const domain = hostname.replace('www.', '').split('.')[0];
            const page = capitalize(domain);

            const lastSegment = pathname.split('/').filter(Boolean).pop() || '';
            const cleanedSegment = lastSegment.replace(/-/g, ' ').replace(/_/g, ' ');
            const pageName = toTitleCase(cleanedSegment);

            if (page && pageName) {
                return `${page} - ${pageName}`;
            }
            return page || url;
        } catch { // FIX: Removed the unused 'error' variable
            return url;
        }
    };

    const mediaAsAttachments: Attachment[] = (user.media || []).map((m: MediaItem, index: number) => ({
        id: `media-${index}-${m.url}`,
        file: new File([], `Shared media ${index + 1}`),
        preview: m.url,
        status: 'completed',
        senderName: user.name,
        timestamp: m.timestamp,
    }));

    const groupedMedia = groupItemsByMonth(user.media || []);
    const groupedFiles = groupItemsByMonth(user.sharedFiles || []);
    const groupedLinks = groupItemsByMonth(user.sharedLinks || []);

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-40" onClose={!viewerOpen ? onClose : () => { }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="relative flex h-[85vh] w-full max-w-5xl transform flex-col overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all">
                                    <button
                                        onClick={onClose}
                                        aria-label="Close modal"
                                        className="absolute top-2 right-2 z-10 text-black opacity-60 transition hover:opacity-100"
                                    >
                                        <X size={42} />
                                    </button>

                                    <div className="flex items-center justify-center px-4 pt-6 pb-4 mt-2">
                                        <div className="flex items-center space-x-1 rounded-full border border-[#deefcf] bg-white p-1">
                                            {MODES_CONFIG.map((m) => {
                                                const isActive = mode === m.name;
                                                return (
                                                    <button
                                                        key={m.name}
                                                        onClick={() => setMode(m.name as ModalMode)}
                                                        className={`
                                                            flex w-40 items-center justify-center gap-2 rounded-full
                                                            py-2 text-sm font-medium transition-colors focus:outline-none
                                                            ${isActive ? 'bg-[#ceffa3] text-gray-900' : 'text-gray-500 hover:bg-[#ceffa3]'}
                                                        `}
                                                    >
                                                        <m.icon size={16} strokeWidth={2.5} />
                                                        <span>{m.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-6">
                                        {mode === 'Media' && (
                                            Object.keys(groupedMedia).length > 0 ? (
                                                <div className="space-y-6">
                                                    {Object.entries(groupedMedia).map(([monthYear, items]) => (
                                                        <div key={monthYear}>
                                                            <h3 className="mb-3 text-left text-sm font-light text-gray-600">
                                                                {monthYear}
                                                            </h3>
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {items.map((item, index) => (
                                                                    <div
                                                                        key={index}
                                                                        className="group relative aspect-square cursor-pointer"
                                                                        onClick={() => handleImageClick(user.media.findIndex(m => m.url === item.url))}
                                                                    >
                                                                        <Image
                                                                            src={item.thumbnail}
                                                                            alt={`Shared media ${index + 1}`}
                                                                            fill
                                                                            sizes="20vw"
                                                                            className="object-cover bg-gray-200"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/40"></div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-lg text-gray-500">
                                                    No media added yet.
                                                </div>
                                            )
                                        )}

                                        {mode === 'Files' && (
                                            Object.keys(groupedFiles).length > 0 ? (
                                                <div className="space-y-6">
                                                    {Object.entries(groupedFiles).map(([monthYear, items]) => (
                                                        <div key={monthYear}>
                                                            <h3 className="mb-3 text-left text-sm font-light text-gray-600">
                                                                {monthYear}
                                                            </h3>
                                                            <div className="space-y-3">
                                                                {items.map((file, index) => (
                                                                    <div key={index} className="flex items-center justify-between gap-4 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                                                        <div className="flex min-w-0 flex-grow items-center gap-4">
                                                                            <div className="h-8 w-8 flex-shrink-0">
                                                                                <Image src={getFileIcon(file.name)} alt={`${file.type} icon`} width={32} height={32} />
                                                                            </div>
                                                                            <div className="flex-1 truncate text-left">
                                                                                <p className="truncate text-sm font-medium">{file.name}</p>
                                                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                                                                    <Cloud size={14} />
                                                                                    {`${format(new Date(file.timestamp), 'MMM d, yyyy')} by ${user.name}`}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className="flex flex-shrink-0 items-center gap-1 text-gray-500">
                                                                            <button className="rounded p-1.5 hover:bg-gray-200 hover:text-black" title="Share"><Share2 size={16} /></button>
                                                                            <button className="rounded p-1.5 hover:bg-gray-200 hover:text-black" title="Download"><Download size={16} /></button>
                                                                            <button className="rounded p-1.5 hover:bg-gray-200 hover:text-black" title="More options"><MoreVertical size={16} /></button>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-lg text-gray-500">
                                                    No files added yet.
                                                </div>
                                            )
                                        )}

                                        {mode === 'Links' && (
                                            Object.keys(groupedLinks).length > 0 ? (
                                                <div className="space-y-6">
                                                    {Object.entries(groupedLinks).map(([monthYear, items]) => (
                                                        <div key={monthYear}>
                                                            <h3 className="mb-3 text-left text-sm font-light text-gray-600">
                                                                {monthYear}
                                                            </h3>
                                                            <div className="space-y-3">
                                                                {items.map((link, index) => (
                                                                    <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-md border border-gray-200 p-3 hover:bg-gray-50">
                                                                        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                                                                            <Image
                                                                                src={`https://www.google.com/s2/favicons?domain=${new URL(link.url).hostname}&sz=32`}
                                                                                alt="favicon"
                                                                                width={20}
                                                                                height={20}
                                                                                unoptimized
                                                                            />
                                                                        </div>
                                                                        <div className="flex-1 truncate text-left">
                                                                            <p className="truncate text-sm font-medium text-blue-600 hover:underline">
                                                                                {formatLinkTitle(link.url)}
                                                                            </p>
                                                                        </div>
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex h-full items-center justify-center text-lg text-gray-500">
                                                    No links added yet.
                                                </div>
                                            )
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {viewerOpen && (
                <ImageViewer
                    images={mediaAsAttachments}
                    currentIndex={currentImageIndex}
                    onClose={() => setViewerOpen(false)}
                />
            )}
        </>
    );
}