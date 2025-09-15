"use client";

import React, { useEffect, useRef, useState } from 'react';
import ChatHeader from './chatsdisplay/ChatHeader';
import ChatInput from './chatsdisplay/ChatInput';
import ImageViewer from './chatsdisplay/ImageViewer';
import MessageList from './chatsdisplay/MessageList';
import { Chat, ConversationMessage, Attachment, currentUser } from './chatsdisplay/types';

interface ChatsDisplayProps {
    chat: Chat | null;
    allChats: Chat[];
    onForwardMessage: (message: ConversationMessage, targetChatIds: number[]) => void;
}

export default function ChatsDisplay({ chat, allChats, onForwardMessage }: ChatsDisplayProps) {
    const [messages, setMessages] = useState<ConversationMessage[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [imageViewer, setImageViewer] = useState({ isOpen: false, images: [] as Attachment[], currentIndex: 0 });
    const [isInputExpanded, setIsInputExpanded] = useState(false);
    const [replyingTo, setReplyingTo] = useState<ConversationMessage | null>(null);

    useEffect(() => {
        if (chat) {
            const currentChatData = allChats.find(c => c.id === chat.id);
            setMessages(currentChatData ? currentChatData.conversation : []);
        }
    }, [chat, allChats]);

    useEffect(() => {
        if (messages.length) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
        }
    }, [messages.length]);

    const handleSendMessage = (text: object | null, attachments: Attachment[]) => {
        if (!chat) return;
        if (!text && attachments.length === 0) return;

        const newMessage: ConversationMessage = {
            id: crypto.randomUUID(),
            sender: 'You',
            text: text,
            timestamp: new Date().toISOString(),
            attachments: attachments,
            replyToId: replyingTo ? replyingTo.id : undefined,
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setReplyingTo(null);
    };

    const handlePinMessage = (messageId: string) => {
        setMessages(prevMessages =>
            prevMessages.map(msg =>
                msg.id === messageId
                    ? { ...msg, isPinned: !msg.isPinned }
                    : msg
            )
        );
    };
    
    const handleAddReaction = (messageId: string, emoji: string) => {
        setMessages(prevMessages =>
            prevMessages.map(msg => {
                if (msg.id === messageId) {
                    const currentReactions = msg.reactions || [];
                    if (currentReactions.includes(emoji)) {
                        return { ...msg, reactions: currentReactions.filter(r => r !== emoji) };
                    } 
                    else {
                        return { ...msg, reactions: [...currentReactions, emoji] };
                    }
                }
                return msg;
            })
        );
    };

    const handleDeleteAttachment = (messageId: string, attachmentId: string) => {
        setMessages(prevMessages => 
            prevMessages.reduce((acc, msg) => {
                if (msg.id === messageId) {
                    const updatedAttachments = msg.attachments?.filter(att => att.id !== attachmentId) || [];
                    const isTextEmpty = !msg.text || (typeof msg.text === 'string' && msg.text.trim() === '');

                    if (isTextEmpty && updatedAttachments.length === 0) {
                        return acc;
                    }

                    acc.push({ ...msg, attachments: updatedAttachments });
                } else {
                    acc.push(msg);
                }
                return acc;
            }, [] as ConversationMessage[])
        );
    };

    const findMessageForAttachment = (attachmentId: string): ConversationMessage | undefined => {
        for (const msg of messages) {
            if (msg.attachments?.some(att => att.id === attachmentId)) {
                return msg;
            }
        }
        return undefined;
    };
    
    const openImageViewer = (msgAttachments: Attachment[], currentId: string) => {
        const message = findMessageForAttachment(currentId);
        const imagesWithData = msgAttachments
            .filter(att => att.preview)
            .map(att => ({
                ...att,
                senderName: message?.sender === 'You' ? currentUser.name : chat?.name,
                timestamp: message?.timestamp,
            }));

        const currentIndex = imagesWithData.findIndex(img => img.id === currentId);
        if (currentIndex !== -1) {
            setImageViewer({
                isOpen: true,
                images: imagesWithData,
                currentIndex: currentIndex,
            });
        }
    };

    const closeImageViewer = () => {
        setImageViewer({ isOpen: false, images: [], currentIndex: 0 });
    };

    if (!chat) return null;
    
    const pinnedMessages = messages.filter(msg => msg.isPinned);

    return (
        <div className="flex flex-col h-full w-full border border-gray-200 rounded-md shadow-sm overflow-hidden bg-white">
            <ChatHeader chat={chat} />

            <MessageList
                chat={chat}
                messages={messages}
                messagesEndRef={messagesEndRef}
                onImageClick={openImageViewer}
                isInputExpanded={isInputExpanded}
                onPinMessage={handlePinMessage}
                pinnedMessages={pinnedMessages}
                onAddReaction={handleAddReaction}
                onSetReply={setReplyingTo}
                onDeleteAttachment={handleDeleteAttachment}
                onForwardMessage={onForwardMessage}
                allChats={allChats}
            />

            <ChatInput 
                onSendMessage={handleSendMessage} 
                onAttachmentPreviewToggle={setIsInputExpanded}
                replyingTo={replyingTo}
                onCancelReply={() => setReplyingTo(null)} 
            />

            {imageViewer.isOpen && (
                <ImageViewer
                    images={imageViewer.images}
                    currentIndex={imageViewer.currentIndex}
                    onClose={closeImageViewer}
                />
            )}
        </div>
    );
}