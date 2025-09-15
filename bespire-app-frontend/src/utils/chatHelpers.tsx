"use client";

import React from 'react';
import { ConversationMessage } from "@/components/chat/chatsdisplay/types";
import ReadOnlyRenderer from "@/components/chat/chatsdisplay/ReadOnlyRenderer";

// Checks if the message text CONTAINS a valid URL.
export const containsUrl = (text: ConversationMessage['text']): boolean => {
    if (typeof text !== 'string') {
        return false;
    }
    const urlRegex = new RegExp(
        'https?://' + // protocol
        '([\\da-z.-]+)\\.([a-z.]{2,6})' + // domain name
        '([/\\w .-]*)*/?', // path
        'i' // case-insensitive
    );
    return urlRegex.test(text);
};

// Formats file size from bytes to a readable string.
export const formatFileSize = (bytes: number, decimals = 2): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Formats a date string into a separator like "Today", "Yesterday", or a full date.
export const formatDateSeparator = (dateString: string): string => {
    const messageDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const time = messageDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (messageDate.toDateString() === today.toDateString()) {
        return `Today ${time}`;
    }
    if (messageDate.toDateString() === yesterday.toDateString()) {
        return `Yesterday ${time}`;
    }
    return messageDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

// Renders the content of a message, handling both HTML strings and rich text objects.
export const renderMessageContent = (text: ConversationMessage['text']) => {
    if (typeof text === 'string' && text.trim()) {
        return <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: text }} />;
    }
    if (text && typeof text === 'object' && 'root' in text) {
        return <div className="text-gray-700"><ReadOnlyRenderer editorState={text as { root: object }} /></div>;
    }
    return null;
};

// Gets a plain text preview of a message for replies, pins, etc.
export const getMessagePreviewText = (text: ConversationMessage['text']): string => {
    if (typeof text === 'string') {
        if (typeof document !== 'undefined') {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = text;
            return tempDiv.textContent || tempDiv.innerText || "";
        }
        return text;
    }
    if (text && typeof text === 'object' && 'root' in text) {
        return "Message";
    }
    return "";
};