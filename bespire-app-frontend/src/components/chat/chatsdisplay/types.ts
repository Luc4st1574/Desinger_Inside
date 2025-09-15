"use client";

// Represents a single file attachment
export interface Attachment {
    id: string;
    file: File;
    preview?: string; // Data URL for image previews
    status: 'uploading' | 'completed';
    senderName?: string;
    timestamp?: string;
}

// Represents a single message in a conversation
export interface ConversationMessage {
    id: string;
    sender: string;
    timestamp: string;
    text: object | string | null;
    attachments?: Attachment[];
    isPinned?: boolean;
    reactions?: string[];
    replyToId?: string;
    isForwarded?: boolean;
}

// Represents an entire chat object, including user details and conversation
export interface Chat {
    id: number;
    name: string;
    avatar: string;
    isOnline: boolean;
    conversation: ConversationMessage[];
    role: string;
    email: string;
    phone: string;
    organization: string;
    timezone: string;
    location: string;
    sharedLinks: string[];
    media: { url: string; thumbnail: string; type: string; timestamp: string; }[];
    sharedFiles: { name: string; size: string; type: string; }[];
}

// Represents the current logged-in user
export const currentUser = {
    name: "You",
    avatar: "/assets/icons/default_avatar.svg"
};