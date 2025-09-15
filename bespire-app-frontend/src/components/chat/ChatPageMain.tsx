"use client";

import React, { useState } from "react";
import chatsData from "@/data/chats.json";
import ChatsDisplay from "@/components/chat/ChatsDisplay";
import ContactInfoPanel from "@/components/chat/ContactInfoPanel";
import IconMessage from "@/assets/icons/icon_message.svg";
import { Chat, ConversationMessage } from "@/components/chat/chatsdisplay/types"; // Import the updated types

// A component to show when no chat is selected.
const NoChatSelected = () => (
    <div className="flex flex-col items-center w-full text-center text-gray-500 pt-42">
        <IconMessage className="w-24 h-24 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Welcome to your Messages</h2>
        <p>Select a conversation from the left to start chatting</p>
    </div>
);

export default function ChatPageMain({ chatId }: { chatId: string | null }) {
    // Manage all chat data in state and type it correctly with the updated 'Chat' interface
    const [allChats, setAllChats] = useState<Chat[]>(() => chatsData as Chat[]);

    const selectedChat = chatId
        ? allChats.find((c) => c.id === parseInt(chatId))
        : null;

    const handleForwardMessage = (messageToForward: ConversationMessage, targetChatIds: number[]) => {
        const newForwardedMessage: ConversationMessage = {
            id: crypto.randomUUID(),
            sender: 'You',
            text: messageToForward.text,
            timestamp: new Date().toISOString(),
            attachments: messageToForward.attachments,
            isForwarded: true,
        };

        setAllChats(prevChats =>
            prevChats.map(chat => {
                if (targetChatIds.includes(chat.id)) {
                    return {
                        ...chat,
                        conversation: [...chat.conversation, newForwardedMessage],
                    };
                }
                return chat;
            })
        );
    };

    return (
        <div className="flex flex-1 gap-6 min-h-0">
            {selectedChat ? (
                <>
                    <ChatsDisplay
                        chat={selectedChat}
                        allChats={allChats}
                        onForwardMessage={handleForwardMessage}
                    />
                    <ContactInfoPanel user={selectedChat} />
                </>
            ) : (
                <NoChatSelected />
            )}
        </div>
    );
}