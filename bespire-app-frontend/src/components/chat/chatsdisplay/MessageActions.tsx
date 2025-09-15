"use client";

import React, { Fragment, useState, useMemo } from 'react';
import Image from 'next/image';
import { Popover, Transition } from '@headlessui/react';
// 1. Import the 'Check' icon from lucide-react
import { Smile, MoreVertical, Search, Check } from 'lucide-react';
import { Chat, ConversationMessage } from './types';
import ShareIcon from '@/assets/icons/share_icon.svg';
import { containsUrl, getMessagePreviewText } from '@/utils/chatHelpers';

// --- NEW: Custom Checkbox Component ---
// This component replaces the native <input type="checkbox">
const CustomCheckbox = ({ checked }: { checked: boolean }) => {
    return (
        <div
            className={`h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                checked
                    ? 'bg-[#697d67] border-[#697d67]'
                    : 'bg-transparent border-gray-300'
            }`}
        >
            {checked && <Check size={12} className="text-white" strokeWidth={3} />}
        </div>
    );
};


// --- Sub-component for the Forwarding Popover ---
interface ForwardPopoverProps {
    message: ConversationMessage;
    allChats: Chat[];
    onForwardMessage: (message: ConversationMessage, targetChatIds: number[]) => void;
    closeMoreMenu: () => void;
}

const ForwardPopover = ({ message, allChats, onForwardMessage, closeMoreMenu }: ForwardPopoverProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedChatIds, setSelectedChatIds] = useState<number[]>([]);

    const filteredChats = useMemo(() => {
        return allChats.filter(chat =>
            chat.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [allChats, searchTerm]);

    const handleSelectChat = (chatId: number) => {
        setSelectedChatIds(prev =>
            prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
        );
    };

    const handleConfirmForward = () => {
        if (selectedChatIds.length > 0) {
            onForwardMessage(message, selectedChatIds);
            closeMoreMenu();
        }
    };

    return (
        <Popover className="relative w-full">
            <Popover.Button className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-0">
                Forward
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
                <Popover.Panel className="absolute right-full bottom-0 mr-2 z-20 w-64 origin-right rounded-md bg-white shadow-lg focus:ring-0 focus:outline-none p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="relative flex-grow">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                onClick={(e) => e.stopPropagation()}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                            />
                        </div>
                        <button
                            type="button"
                            disabled={selectedChatIds.length === 0}
                            onClick={handleConfirmForward}
                            className="inline-flex justify-center rounded-md border border-transparent bg-[#697d67] px-3 py-1.5 text-sm font-medium text-white hover:bg-[#5a6b58] focus:outline-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                    <div className="h-32 overflow-y-auto pr-2 -mr-2 space-y-1">
                        {filteredChats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat.id)}
                                className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer"
                            >
                                {/* 2. Use the new CustomCheckbox component */}
                                <CustomCheckbox checked={selectedChatIds.includes(chat.id)} />
                                <Image src={chat.avatar} alt={chat.name} width={32} height={32} className="rounded-full ml-3 mr-2" />
                                <span className="text-sm font-medium text-gray-800">{chat.name}</span>
                            </div>
                        ))}
                    </div>
                </Popover.Panel>
            </Transition>
        </Popover>
    );
};

// --- Main Message Actions Component ---
interface MessageActionsProps {
    message: ConversationMessage;
    onPinMessage: (messageId: string) => void;
    onAddReaction: (messageId: string, emoji: string) => void;
    onReply: (message: ConversationMessage) => void;
    openDirection: 'up' | 'down';
    onForwardMessage: (message: ConversationMessage, targetChatIds: number[]) => void;
    allChats: Chat[];
}

export default function MessageActions({ message, onPinMessage, onAddReaction, onReply, openDirection, onForwardMessage, allChats }: MessageActionsProps) {
    const reactionEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
    const plainText = getMessagePreviewText(message.text);
    const isLinkMessage = containsUrl(plainText);

    const handleCopyLink = () => {
        if (typeof plainText === 'string') {
            navigator.clipboard.writeText(plainText).catch(err => {
                console.error("Failed to copy link:", err);
            });
        }
    };

    return (
        <div className="absolute top-0 right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onReply(message)} className="p-1.5 rounded-md" title="Reply">
                <ShareIcon className="w-5 h-5 stroke-[#697d67] fill-transparent hover:stroke-black hover:fill-black" />
            </button>
            <Popover className="relative">
                {({ close }) => (
                    <>
                        <Popover.Button className="p-1.5 rounded-md text-[#697d67] hover:bg-gray-200 focus:outline-none" title="Add Reaction">
                            <Smile size={20} />
                        </Popover.Button>
                        <Popover.Panel className={`absolute right-0 z-10 focus:outline-none focus:ring-0 ${openDirection === 'up' ? 'bottom-full mb-2' : 'mt-2'}`}>
                            <div className="flex gap-2 bg-white p-2 rounded-full ring-1 ring-gray-300">
                                {reactionEmojis.map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => { onAddReaction(message.id, emoji); close(); }}
                                        className="text-2xl hover:scale-125 transition-transform"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </Popover.Panel>
                    </>
                )}
            </Popover>
            <Popover className="relative">
                {({ close: closeMoreMenu }) => (
                    <>
                        <Popover.Button className="p-1.5 rounded-md focus:outline-none" title="More">
                            <MoreVertical size={20} className="text-[#697d67] hover:text-black" />
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
                            <Popover.Panel className={`absolute right-0 z-10 w-48 origin-top-right rounded-md bg-white shadow-lg focus:ring-0 focus:outline-none ${openDirection === 'up' ? 'bottom-full mb-1' : 'mt-2'}`}>
                                <div className="py-1">
                                    <ForwardPopover
                                        message={message}
                                        allChats={allChats}
                                        onForwardMessage={onForwardMessage}
                                        closeMoreMenu={closeMoreMenu}
                                    />
                                    {isLinkMessage && (
                                        <button
                                            onClick={handleCopyLink}
                                            className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                        >
                                            Copy Link
                                        </button>
                                    )}
                                    <button onClick={() => onPinMessage(message.id)} className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                                        {message.isPinned ? 'Unpin' : 'Pin'}
                                    </button>
                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
};