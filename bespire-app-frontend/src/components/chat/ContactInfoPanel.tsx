"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Mail from "@/assets/icons/mail_icon.svg";
import Phone from "@/assets/icons/smart_icon.svg";
import LocateIcon from "@/assets/icons/place_icon.svg";
import ArrowRight from "@/assets/icons/forward_right_icon.svg";
import {
    Clock, UserCircle, Search, ArrowRight as LucideArrowRight
} from 'lucide-react';
import SharedContentModal from '../modals/SharedContentModal';

export interface MediaItem {
    url: string;
    thumbnail: string;
    type: string;
    timestamp: string;
}

export interface SharedFile {
    name: string;
    size: string;
    type: string;
    timestamp: string;
}

export interface ChatUser {
    id: number;
    name: string;
    avatar: string;
    role: string;
    email: string;
    phone: string;
    organization: string;
    timezone: string;
    location: string;
    media: MediaItem[];
    sharedFiles: SharedFile[];
    sharedLinks: { url: string; timestamp: string; }[];
}

interface ContactInfoPanelProps {
    user: ChatUser | null;
}

type ModalMode = 'Media' | 'Files' | 'Links';

export default function ContactInfoPanel({ user }: ContactInfoPanelProps) {
    const [hoveredSection, setHoveredSection] = useState<string | null>(null);
    const [isHoveringContainer, setIsHoveringContainer] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<ModalMode>('Media');

    if (!user) return null;

    const handleLabelClick = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    return (
        <>
            <aside className="w-80 h-full bg-white flex-shrink-0 flex flex-col border border-gray-200 rounded-md shadow-sm overflow-hidden">
                <div className="relative">
                    <div className="h-[72px] w-full">
                        <Image
                            src="/assets/icons/cover_bg.svg"
                            alt="Cover background"
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                    <div className="absolute bottom-0 left-6 translate-y-1/2">
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            width={112}
                            height={112}
                            className="rounded-full border-4 border-white shadow-lg"
                        />
                    </div>
                </div>

                <div className="pt-[72px] p-6 flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.role}</p>

                        <div className="mt-4 flex items-center gap-3">
                            <button className="flex items-center justify-center gap-2 bg-[#697d67] text-white rounded-full px-3 py-2 text-sm font-light hover:bg-opacity-90 transition-colors">
                                <span>Profile</span>
                                <UserCircle size={16} />
                            </button>
                            <button className="flex items-center justify-center gap-2 border border-black text-black bg-white rounded-full px-3 py-2 text-sm font-light hover:bg-gray-50 transition-colors">
                                <span>Search</span>
                                <Search size={16} />
                            </button>
                        </div>
                        <div
                            className="mt-6 flex justify-start gap-8"
                            onMouseEnter={() => setIsHoveringContainer(true)}
                            onMouseLeave={() => setIsHoveringContainer(false)}
                        >
                            <div
                                className="flex flex-col items-start gap-1 cursor-pointer"
                                onMouseEnter={() => setHoveredSection('Media')}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => handleLabelClick('Media')}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-light transition-colors ${hoveredSection === 'Media' ? 'text-black' : 'text-[#5e6b66]'}`}>Media</span>
                                    {hoveredSection === 'Media' && <LucideArrowRight size={16} className="text-black" />}
                                </div>
                                <span className="text-gray-400 font-semibold">
                                    {isHoveringContainer ? (user.media?.length || 0) : '-'}
                                </span>
                            </div>
                            <div
                                className="flex flex-col items-start gap-1 cursor-pointer"
                                onMouseEnter={() => setHoveredSection('Files')}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => handleLabelClick('Files')}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-light transition-colors ${hoveredSection === 'Files' ? 'text-black' : 'text-[#5e6b66]'}`}>Files</span>
                                    {hoveredSection === 'Files' && <LucideArrowRight size={16} className="text-black" />}
                                </div>
                                <span className="text-gray-400 font-semibold">
                                    {isHoveringContainer ? (user.sharedFiles?.length || 0) : '-'}
                                </span>
                            </div>
                            <div
                                className="flex flex-col items-start gap-1 cursor-pointer"
                                onMouseEnter={() => setHoveredSection('Links')}
                                onMouseLeave={() => setHoveredSection(null)}
                                onClick={() => handleLabelClick('Links')}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-light transition-colors ${hoveredSection === 'Links' ? 'text-black' : 'text-[#5e6b66]'}`}>Links</span>
                                    {hoveredSection === 'Links' && <LucideArrowRight size={16} className="text-black" />}
                                </div>
                                <span className="text-gray-400 font-semibold">
                                    {isHoveringContainer ? (user.sharedLinks?.length || 0) : '-'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-black flex-shrink-0" />
                            <a href={`mailto:${user.email}`} className="text-sm text-black font-light hover:underline truncate">{user.email}</a>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-black flex-shrink-0" />
                            <span className="text-sm text-black font-light">{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <LocateIcon className="w-5 h-5 text-black flex-shrink-0" />
                            <span className="text-sm text-black font-light">{user.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-black flex-shrink-0" />
                            <span className="text-sm text-black font-light">{user.timezone}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <button className="flex items-center gap-3 text-sm font-light text-black hover:opacity-80 transition-opacity">
                            <ArrowRight/>
                            <span>Share this contact</span>
                        </button>
                    </div>
                </div>
            </aside>
            
            {user && (
                <SharedContentModal 
                    isOpen={isModalOpen}
                    user={user} 
                    initialMode={modalMode} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}
        </>
    );
}