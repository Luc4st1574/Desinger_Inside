"use client";

import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import { Pin, X, Download, MoreVertical } from 'lucide-react';
import { getFileIcon } from '@/utils/getFileIcon';
import ShareFileModal, { SharedFile } from '@/components/modals/ShareFileModal';
import { Popover, Transition } from '@headlessui/react';
import { Chat, ConversationMessage, Attachment, currentUser } from './types';
import MessageActions from './MessageActions';
import ShareIcon from '@/assets/icons/share_icon.svg';
import { formatDateSeparator, getMessagePreviewText, renderMessageContent, formatFileSize } from '@/utils/chatHelpers';

// This is a sub-component that was part of the original file. It's kept here for completeness.
interface AttachmentActionsProps {
    attachment: Attachment;
    openDirection: 'up' | 'down';
    isFile: boolean;
    onShareFile: (attachment: Attachment) => void;
    onDeleteFile: () => void;
}

const AttachmentActions = ({ attachment, openDirection, isFile, onShareFile, onDeleteFile }: AttachmentActionsProps) => {
    return (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <a href={URL.createObjectURL(attachment.file)} download={attachment.file.name} className="p-1.5 rounded-full text-[#5e6b66] hover:text-black focus:outline-none focus:ring-0" title="Download">
                <Download size={18} />
            </a>
            <Popover className="relative">
                <Popover.Button className="p-1.5 rounded-full text-[#5e6b66] hover:text-black focus:outline-none focus:ring-0" title="More options">
                    <MoreVertical size={18} />
                </Popover.Button>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                    <Popover.Panel className={`absolute right-0 z-20 w-48 origin-top-right rounded-md bg-white shadow-lg focus:outline-none focus:ring-0 ${openDirection === 'up' ? 'bottom-full mb-2' : 'mt-2'}`}>
                        <div className="py-1">
                            <Popover className="relative w-full">
                                <Popover.Button className="flex w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-0">
                                    View file details
                                </Popover.Button>
                                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
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


interface MessageListProps {
    chat: Chat;
    messages: ConversationMessage[];
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onImageClick: (attachments: Attachment[], attachmentId: string) => void;
    isInputExpanded: boolean;
    onPinMessage: (messageId: string) => void;
    pinnedMessages: ConversationMessage[];
    onAddReaction: (messageId: string, emoji: string) => void;
    onSetReply: (message: ConversationMessage) => void;
    onDeleteAttachment: (messageId: string, attachmentId: string) => void;
    onForwardMessage: (message: ConversationMessage, targetChatIds: number[]) => void;
    allChats: Chat[];
}

export default function MessageList({
    chat,
    messages,
    messagesEndRef,
    onImageClick,
    isInputExpanded,
    onPinMessage,
    pinnedMessages,
    onAddReaction,
    onSetReply,
    onDeleteAttachment,
    onForwardMessage,
    allChats
}: MessageListProps) {
    const [sharingFile, setSharingFile] = useState<SharedFile | null>(null);

    const scrollToMessage = (messageId: string) => {
        document.getElementById(`message-${messageId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    const handleShareFile = (attachment: Attachment) => {
        const fileToShare: SharedFile = {
            name: attachment.file.name,
            lastModified: new Date().toISOString(),
            author: currentUser.name,
            icon: getFileIcon(attachment.file.name),
        };
        setSharingFile(fileToShare);
    };

    return (
        <>
            <div className="flex flex-col h-[calc(100vh-300px)] bg-white">
                {pinnedMessages.length > 0 && (
                    <div className="flex-shrink-0">
                        {pinnedMessages.slice(-1).map(pinnedMsg => (
                            <div
                                key={`pinned-${pinnedMsg.id}`}
                                className="flex items-center gap-3 bg-gray-50 p-3 border-b border-gray-200 cursor-pointer"
                                onClick={() => scrollToMessage(pinnedMsg.id)}
                            >
                                <Pin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-700">Pinned Message</p>
                                    <div className="text-sm text-gray-500 truncate">
                                        {renderMessageContent(pinnedMsg.text)}
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onPinMessage(pinnedMsg.id); }}
                                    className="p-1 rounded-full hover:bg-gray-200"
                                    title="Unpin message"
                                >
                                    <X className="w-4 h-4 text-gray-600" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={`overflow-y-auto px-6 pt-0 no-scrollbar transition-all duration-300 flex-1 ${isInputExpanded ? 'pb-30' : 'pb-8'}`}>
                    {messages.length > 0 ? (
                        <div className="space-y-1 pt-0">
                            {messages.map((msg, index) => {
                                const isNearBottom = index >= messages.length - 2;
                                const imageAttachments = msg.attachments?.filter(att => att.preview) || [];
                                const fileAttachments = msg.attachments?.filter(att => !att.preview) || [];

                                return (
                                    <Fragment key={msg.id}>
                                        {(!messages[index - 1] || new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1].timestamp).toDateString()) && (
                                            <div className="text-center my-4">
                                                <span className="text-xs text-gray-500 px-3 py-1 rounded-full">{formatDateSeparator(msg.timestamp)}</span>
                                            </div>
                                        )}
                                        <div
                                            id={`message-${msg.id}`}
                                            className="group relative flex items-start gap-4 px-4 py-2 -mx-4 rounded-lg hover:bg-gray-50"
                                        >
                                            <Image
                                                src={msg.sender === 'You' ? currentUser.avatar : chat.avatar}
                                                alt={msg.sender}
                                                width={40}
                                                height={40}
                                                className="rounded-full mt-1"
                                            />
                                            <div className="flex flex-col w-full">
                                                <div className="relative flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {msg.sender === 'You' ? currentUser.name : chat.name}
                                                    </h4>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    {msg.isPinned && <Pin className="w-3 h-3 text-gray-400" />}
                                                    <MessageActions
                                                        message={msg}
                                                        onPinMessage={onPinMessage}
                                                        onAddReaction={onAddReaction}
                                                        onReply={onSetReply}
                                                        openDirection={isNearBottom ? 'up' : 'down'}
                                                        allChats={allChats}
                                                        onForwardMessage={onForwardMessage}
                                                    />
                                                </div>

                                                {msg.isForwarded && (
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 italic">
                                                        <ShareIcon className="w-3 h-3 stroke-current" />
                                                        <span>Forwarded</span>
                                                    </div>
                                                )}

                                                {msg.replyToId && messages.find(m => m.id === msg.replyToId) && (
                                                    <div
                                                        className="flex items-baseline mt-1 mb-2 pl-1.5 border-l-3 border-[#5e6b66] cursor-pointer truncate"
                                                        onClick={() => scrollToMessage(msg.replyToId!)}
                                                    >
                                                        <span className="text-sm font-bold text-[#5e6b66] mr-1">Replied to:</span>
                                                        <span className="text-sm text-gray-500">
                                                            {getMessagePreviewText(messages.find(m => m.id === msg.replyToId)!.text)}
                                                        </span>
                                                    </div>
                                                )}

                                                {renderMessageContent(msg.text)}

                                                {(imageAttachments.length > 0 || fileAttachments.length > 0) && (
                                                    <div className="mt-2 flex flex-col gap-2">
                                                        <div className="flex items-center mb-1">
                                                            <p className="text-sm font-semibold text-black mr-1">
                                                                {`${imageAttachments.length + fileAttachments.length} files.`}
                                                            </p>
                                                            <button
                                                                onClick={() => console.log('Download All clicked!')}
                                                                className="text-sm font-medium text-[#5e6b66] underline hover:text-black focus:outline-none"
                                                            >
                                                                Download all
                                                            </button>
                                                        </div>

                                                        {imageAttachments.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 max-w-lg">
                                                                {imageAttachments.map(att => (
                                                                    <div
                                                                        key={att.id}
                                                                        className="group relative w-56 h-56 cursor-pointer"
                                                                        onClick={() => onImageClick(msg.attachments!, att.id)}
                                                                    >
                                                                        <Image src={att.preview!} alt={att.file.name} layout="fill" objectFit="cover" className="rounded-lg" />
                                                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <AttachmentActions
                                                                                attachment={att}
                                                                                openDirection={isNearBottom ? 'up' : 'down'}
                                                                                isFile={false}
                                                                                onShareFile={handleShareFile}
                                                                                onDeleteFile={() => onDeleteAttachment(msg.id, att.id)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {fileAttachments.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 max-w-lg">
                                                                {fileAttachments.map(att => (
                                                                    <div
                                                                        key={att.id}
                                                                        className="group relative flex items-center bg-white border border-gray-200 rounded-lg shadow-sm h-16 w-60 hover:bg-gray-50 transition-colors"
                                                                    >
                                                                        <div className="flex-shrink-0 flex items-center justify-center w-12 h-full pl-3">
                                                                            <Image src={getFileIcon(att.file.name)} alt="file icon" width={32} height={32} />
                                                                        </div>
                                                                        <div className="flex-1 px-3 min-w-0">
                                                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                                                {att.file.name.split('.').slice(0, -1).join('.')}
                                                                            </p>
                                                                            <p className="text-xs text-gray-500">
                                                                                {att.file.name.split('.').pop()?.toUpperCase()} file
                                                                            </p>
                                                                        </div>
                                                                        <div className="absolute right-2 top-1.2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <AttachmentActions
                                                                                attachment={att}
                                                                                openDirection={isNearBottom ? 'up' : 'down'}
                                                                                isFile={true}
                                                                                onShareFile={handleShareFile}
                                                                                onDeleteFile={() => onDeleteAttachment(msg.id, att.id)}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {msg.reactions && msg.reactions.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-2">
                                                        {msg.reactions.map((emoji, i) => (
                                                            <div key={`${emoji}-${i}`} className="px-2 py-0.5 border border-[#5e6b66] rounded-md bg-white cursor-pointer">
                                                                <span className="text-sm">{emoji}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Fragment>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-start pt-4 gap-4 text-center pb-24">
                            <div className="text-gray-500">
                                <p>This is your first conversation</p>
                                <p>with {chat.name}. Say hi!</p>
                            </div>
                            <span className="text-5xl">👋</span>
                        </div>
                    )}
                </div>
            </div>

            <ShareFileModal
                isOpen={!!sharingFile}
                onClose={() => setSharingFile(null)}
                file={sharingFile}
            />
        </>
    );
}