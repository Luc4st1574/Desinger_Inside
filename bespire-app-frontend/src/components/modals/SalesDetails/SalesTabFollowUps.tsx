"use client";
import React, { Fragment, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, Transition, Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Image from 'next/image';
import salesData from "@/data/salesData.json"; // Make sure this path is correct
import {
    Plus, Calendar, UserPlus, MoreHorizontal, CalendarClock,
    Bold, Italic, Underline, Smile, ChevronLeft, ChevronRight, Search,
    ChevronDown, ChevronUp // ✅ Icons added
} from "lucide-react";
import EmojiPicker from '@/components/ui/EmojiPicker';

// Lexical Editor Imports
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND, EditorState, $getRoot } from 'lexical';
import { mergeRegister } from '@lexical/utils';


// --- Type Definitions ---
type Prospect = typeof salesData.prospects.list[0];
type Member = {
    id: number;
    name: string;
    avatar: string;
    role?: string; // Role is now optional
};
type FollowUp = {
    type: 'Meeting Log' | 'Reminder' | 'Notes';
    date: string;
    attendees: Member[];
    title: string;
    author: string;
    timestamp: string;
    content: string;
    link?: string;
};
type NewFollowUpData = {
    title: string;
    content: string;
    attendees: Member[];
    link?: string;
};


// --- Lexical Editor Configuration ---
const editorTheme = {
    ltr: 'text-left',
    rtl: 'text-right',
    paragraph: 'relative',
    text: { bold: 'font-bold', italic: 'italic', underline: 'underline' },
};

const editorConfig = {
    namespace: 'FollowUpEditor',
    theme: editorTheme,
    nodes: [],
    onError: (error: Error) => console.error(error),
};

class CustomErrorBoundary extends React.Component<{ children: React.ReactElement; onError: (error: Error) => void; }> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(error: Error) { this.props.onError(error); }
    render() { if (this.state.hasError) return null; return this.props.children; }
}

// --- Reusable Rich Text Editor ---
const RichTextEditor = ({ placeholder, onChange, minHeight = 'min-h-[100px]' }: { placeholder: string, onChange: (text: string) => void, minHeight?: string }) => {
    const handleOnChange = (editorState: EditorState) => {
        editorState.read(() => {
            const root = $getRoot();
            onChange(root.getTextContent());
        });
    };
    return (
        <div className="relative">
            <RichTextPlugin
                contentEditable={<ContentEditable className={`w-full p-3 text-sm text-gray-800 rounded-md resize-y focus:outline-none focus:ring-0 ${minHeight}`} />}
                placeholder={<div className="absolute top-3 left-3 text-sm text-gray-400 pointer-events-none">{placeholder}</div>}
                ErrorBoundary={CustomErrorBoundary}
            />
            <HistoryPlugin />
            <OnChangePlugin onChange={handleOnChange} />
        </div>
    );
};

// --- Toolbar Plugin ---
function ToolbarPlugin() {
    const [editor] = useLexicalComposerContext();
    const [isBold, setIsBold] = useState(false);
    const [isItalic, setIsItalic] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
    const emojiButtonRef = useRef<HTMLButtonElement>(null);

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
        }
    }, []);

    useEffect(() => {
        return mergeRegister(
            editor.registerUpdateListener(({ editorState }) => editorState.read(updateToolbar)),
            editor.registerCommand(SELECTION_CHANGE_COMMAND, () => (updateToolbar(), false), COMMAND_PRIORITY_LOW),
        );
    }, [editor, updateToolbar]);

    const insertEmoji = (emoji: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) selection.insertText(emoji);
        });
        setIsEmojiPickerOpen(false);
    };

    return (
        <div className="flex items-center gap-1">
            <button type="button" title="Bold" onMouseDown={e => e.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')} className={`p-1.5 rounded text-gray-600 focus:outline-none focus:ring-0 ${isBold ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><Bold size={16} /></button>
            <button type="button" title="Italic" onMouseDown={e => e.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')} className={`p-1.5 rounded text-gray-600 focus:outline-none focus:ring-0 ${isItalic ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><Italic size={16} /></button>
            <button type="button" title="Underline" onMouseDown={e => e.preventDefault()} onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')} className={`p-1.5 rounded text-gray-600 focus:outline-none focus:ring-0 ${isUnderline ? 'bg-gray-200' : 'hover:bg-gray-100'}`}><Underline size={16} /></button>
            <div className="relative">
                <button ref={emojiButtonRef} type="button" title="Insert Emoji" onMouseDown={e => e.preventDefault()} onClick={() => setIsEmojiPickerOpen(prev => !prev)} className="p-1.5 rounded text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-0"><Smile size={16} /></button>
                <EmojiPicker isOpen={isEmojiPickerOpen} onClose={() => setIsEmojiPickerOpen(false)} onEmojiSelect={insertEmoji} buttonRef={emojiButtonRef} />
            </div>
        </div>
    );
}

// --- Calendar Popover Component ---
const CalendarPopover = ({ selectedDate, onDateChange }: { selectedDate: Date, onDateChange: (date: Date) => void }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const changeMonth = (offset: number) => setCurrentMonth(prev => {
        const newMonth = new Date(prev);
        newMonth.setMonth(prev.getMonth() + offset);
        return newMonth;
    });

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const leadingEmptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);
    const handleDayClick = (day: number, close: () => void) => {
        onDateChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
        close();
    };
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

    return (
        <Popover className="relative">
            {({ close }) => (
                <>
                    <PopoverButton className="flex items-center gap-1.5 h-7 px-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-0">
                        <Calendar size={15} />
                        {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </PopoverButton>
                    <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 translate-y-1" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 translate-y-1">
                        <PopoverPanel className="absolute z-10 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 focus:outline-none focus:ring-0">
                            <div className="p-2">
                                <div className="flex items-center justify-between mb-2 px-2 py-1 rounded-md bg-[#ebfdd8]">
                                    <button title="Previous month" onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-gray-200/50 text-gray-600 focus:outline-none focus:ring-0"><ChevronLeft size={20} /></button>
                                    <span className="text-sm font-semibold text-gray-800">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                    <button title="Next month" onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-gray-200/50 text-gray-600 focus:outline-none focus:ring-0"><ChevronRight size={20} /></button>
                                </div>
                                <div className="grid grid-cols-7 text-center text-xs text-gray-500">
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <div key={day} className="py-1">{day}</div>)}
                                </div>
                                <div className="grid grid-cols-7 text-center text-sm">
                                    {leadingEmptyDays.map((_, index) => <div key={`empty-${index}`} />)}
                                    {days.map(day => {
                                        const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isSelected = isSameDay(dayDate, selectedDate);
                                        const isToday = isSameDay(dayDate, today);
                                        return (
                                            <div key={day} className="py-1 flex justify-center items-center">
                                                <button onClick={() => handleDayClick(day, close)} className={`relative w-8 h-8 rounded-full transition-colors focus:outline-none focus:ring-0 ${isSelected ? 'bg-[#5b6f59] text-white' : 'hover:bg-gray-100'}`}>
                                                    {day}
                                                    {isToday && <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-[#5b6f59]'}`}></span>}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

// --- Members Popover Component ---
const MembersPopover = ({ selectedMembers, onSelectionChange, availableMembers }: { selectedMembers: Member[], onSelectionChange: (members: Member[]) => void, availableMembers: Member[] }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentSelection, setCurrentSelection] = useState<Member[]>(selectedMembers);

    const filteredMembers = availableMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleMember = (member: Member) => {
        setCurrentSelection(prev =>
            prev.find(m => m.id === member.id)
                ? prev.filter(m => m.id !== member.id)
                : [...prev, member]
        );
    };

    const handleDone = (close: () => void) => {
        onSelectionChange(currentSelection);
        close();
    };

    useEffect(() => {
        setCurrentSelection(selectedMembers);
    }, [selectedMembers]);

    return (
        <Popover className="relative">
            {({ close }) => (
                <>
                    <PopoverButton className="flex items-center gap-1.5 h-7 px-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 focus:outline-none focus:ring-0">
                        <UserPlus size={15} />
                        <span>Add People</span>
                    </PopoverButton>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <PopoverPanel className="absolute z-20 mt-2 w-64 origin-top-left bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col focus:outline-none focus:ring-0">
                            <div className="p-2 border-b border-gray-200">
                                <div className="relative">
                                    <Search size={16} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search a member"
                                        className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto max-h-60 p-1">
                                <div className="text-xs font-semibold text-gray-500 px-2 py-1">Select Members</div>
                                {filteredMembers.map(member => {
                                    const isSelected = currentSelection.some(m => m.id === member.id);
                                    return (
                                        <div key={member.id} onClick={() => toggleMember(member)} className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-gray-100' : ''}`}>
                                            <div className="flex items-center gap-2">
                                                <Image src={member.avatar} alt={member.name} width={32} height={32} className="rounded-full" />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{member.name}</p>
                                                    {member.role && <p className="text-xs text-gray-500">{member.role}</p>}
                                                </div>
                                            </div>
                                            {isSelected && <div className="w-2.5 h-2.5 bg-[#697d67] rounded-full"></div>}
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="p-2 border-t border-gray-200">
                                <button
                                    onClick={() => handleDone(close)}
                                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[#697d67] rounded-full hover:bg-[#5b6f59] focus:outline-none focus:ring-0"
                                >
                                    Done
                                </button>
                            </div>
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};


// --- Form Components ---
const LogMeetingForm = ({ onCancel, onSave, availableMembers }: { onCancel: () => void, onSave: (data: NewFollowUpData) => void, availableMembers: Member[] }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [meetingDate, setMeetingDate] = useState(new Date());
    const [attendees, setAttendees] = useState<Member[]>([]);
    const isSaveDisabled = !title.trim();

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="p-4 border border-gray-300 rounded-lg mb-4 shadow-sm bg-white">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <CalendarPopover selectedDate={meetingDate} onDateChange={setMeetingDate} />
                        <MembersPopover selectedMembers={attendees} onSelectionChange={setAttendees} availableMembers={availableMembers} />
                        <div className="flex -space-x-2">
                            {attendees.map(p => <Image key={p.id} src={p.avatar} alt={p.name} width={28} height={28} className="rounded-full border-2 border-white" title={p.name} />)}
                        </div>
                    </div>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Subject of Meeting" className="w-full p-2 text-sm font-light text-gray-800 outline-none border-b border-gray-200 focus:outline-none focus:ring-0" />
                    <RichTextEditor placeholder="Write what happened during the meeting..." onChange={setContent} />
                </div>
                <div className="flex justify-between items-center mt-4">
                    <ToolbarPlugin />
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-[#5b6f59] bg-white border border-[#5b6f59] rounded-full hover:bg-gray-50 focus:outline-none focus:ring-0">Cancel</button>
                        <button onClick={() => onSave({ title, content, attendees })} disabled={isSaveDisabled} className={`px-4 py-2 text-sm font-medium text-white rounded-full focus:outline-none focus:ring-0 ${isSaveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5b6f59] hover:bg-[#4a5948]'}`}>Log Meeting</button>
                    </div>
                </div>
            </div>
        </LexicalComposer>
    );
};

const AddReminderForm = ({ onCancel, onSave, availableMembers }: { onCancel: () => void, onSave: (data: NewFollowUpData) => void, availableMembers: Member[] }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [reminderDate, setReminderDate] = useState(new Date());
    const [attendees, setAttendees] = useState<Member[]>([]);
    const isSaveDisabled = !title.trim();

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="p-4 border border-gray-300 rounded-lg mb-4 shadow-sm bg-white">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 flex-wrap">
                        <CalendarPopover selectedDate={reminderDate} onDateChange={setReminderDate} />
                        <MembersPopover selectedMembers={attendees} onSelectionChange={setAttendees} availableMembers={availableMembers} />
                        <div className="flex -space-x-2">
                            {attendees.map(p => <Image key={p.id} src={p.avatar} alt={p.name} width={28} height={28} className="rounded-full border-2 border-white" title={p.name} />)}
                        </div>
                    </div>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Subject of Reminder" className="w-full p-2 text-sm font-light text-gray-800 outline-none border-b border-gray-200 focus:outline-none focus:ring-0" />
                    <RichTextEditor placeholder="Write notes for this reminder..." onChange={setContent} />
                </div>
                <div className="flex justify-between items-center mt-4">
                    <ToolbarPlugin />
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-[#5b6f59] bg-white border border-[#5b6f59] rounded-full hover:bg-gray-50 focus:outline-none focus:ring-0">Cancel</button>
                        <button onClick={() => onSave({ title, content, attendees })} disabled={isSaveDisabled} className={`px-4 py-2 text-sm font-medium text-white rounded-full focus:outline-none focus:ring-0 ${isSaveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5b6f59] hover:bg-[#4a5948]'}`}>Add Reminder</button>
                    </div>
                </div>
            </div>
        </LexicalComposer>
    );
};

const AddNoteForm = ({ onCancel, onSave }: { onCancel: () => void, onSave: (data: Omit<NewFollowUpData, 'attendees'>) => void }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const isSaveDisabled = !title.trim();

    return (
        <LexicalComposer initialConfig={editorConfig}>
            <div className="p-4 border border-gray-300 rounded-lg mb-4 shadow-sm bg-white">
                <div className="space-y-4">
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title of the Note" className="w-full p-2 text-sm font-light text-gray-800 outline-none border-b border-gray-200 focus:outline-none focus:ring-0" />
                    <RichTextEditor placeholder="Write notes..." onChange={setContent} minHeight="min-h-[60px]" />
                </div>
                <div className="flex justify-between items-center mt-4">
                    <ToolbarPlugin />
                    <div className="flex gap-2">
                        <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-[#5b6f59] bg-white border border-[#5b6f59] rounded-full hover:bg-gray-50 focus:outline-none focus:ring-0">Cancel</button>
                        <button onClick={() => onSave({ title, content })} disabled={isSaveDisabled} className={`px-4 py-2 text-sm font-medium text-white rounded-full focus:outline-none focus:ring-0 ${isSaveDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#5b6f59] hover:bg-[#4a5948]'}`}>Add Note</button>
                    </div>
                </div>
            </div>
        </LexicalComposer>
    );
};

// --- Main Follow-Ups Component ---
export default function SalesTabFollowUps({ prospect }: { prospect: Prospect }) {
    const [openForm, setOpenForm] = useState<string | null>(null);
    const [followUps, setFollowUps] = useState<FollowUp[]>(prospect.followUps as FollowUp[] || []);

    const allSalesPeople = useMemo(() => {
        const allAssignees = salesData.prospects.list.flatMap(p => p.assigned);
        const uniqueAssigneesMap = new Map<string, { name: string; avatar: string }>();
        allAssignees.forEach(assignee => {
            if (!uniqueAssigneesMap.has(assignee.name)) {
                uniqueAssigneesMap.set(assignee.name, assignee);
            }
        });
        
        const salesManager = salesData.salesManager;
        if (!uniqueAssigneesMap.has(salesManager.name)) {
             uniqueAssigneesMap.set(salesManager.name, { name: salesManager.name, avatar: salesManager.avatar });
        }

        return Array.from(uniqueAssigneesMap.values()).map((member, index) => ({
            ...member,
            id: index + 1,
            role: 'Sales Team'
        }));
    }, []);


    const handleSaveFollowUp = (data: Partial<NewFollowUpData>, type: FollowUp['type']) => {
        const salesManager = salesData.salesManager;
        const newFollowUp: FollowUp = {
            type: type,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            attendees: data.attendees || [],
            title: data.title!,
            author: salesManager.name,
            timestamp: new Date().toLocaleString(),
            content: data.content!,
            ...(data.link && { link: data.link })
        };
        setFollowUps(prev => [newFollowUp, ...prev]);
        setOpenForm(null);
    };

    const renderForm = () => {
        switch (openForm) {
            case 'Log Meeting':
                return <LogMeetingForm onCancel={() => setOpenForm(null)} onSave={(data) => handleSaveFollowUp(data, 'Meeting Log')} availableMembers={allSalesPeople} />;
            case 'Reminders':
                return <AddReminderForm onCancel={() => setOpenForm(null)} onSave={(data) => handleSaveFollowUp(data, 'Reminder')} availableMembers={allSalesPeople} />;
            case 'Notes':
                return <AddNoteForm onCancel={() => setOpenForm(null)} onSave={(data) => handleSaveFollowUp(data, 'Notes')} />;
            default:
                return null;
        }
    };

    return (
        <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-700">Follow-ups</h2>
                <Menu as="div" className="relative inline-block text-left">
                    <div>
                        <MenuButton className="flex items-center gap-1 py-1 px-3 rounded-full text-sm font-semibold text-[#5b6f59] border border-[#5b6f59] hover:bg-[#5b6f59]/10 transition-colors focus:outline-none focus:ring-0">
                            <span>Add</span><Plus size={16} />
                        </MenuButton>
                    </div>
                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                        <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg z-20 focus:outline-none focus:ring-0">
                            <div className="py-1">
                                {['Log Meeting', 'Reminders', 'Notes'].map((option) => (
                                    <MenuItem key={option}>
                                        {({ active }) => (<button onClick={() => setOpenForm(option)} className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center px-4 py-2 text-sm text-gray-700 focus:outline-none focus:ring-0`}>{option}</button>)}
                                    </MenuItem>
                                ))}
                            </div>
                        </MenuItems>
                    </Transition>
                </Menu>
            </div>

            {renderForm()}

            <div className="space-y-4">
                {followUps.length > 0 ? (
                    followUps.map((item, index) => <FollowUpCard key={index} item={item} />)
                ) : !openForm ? (
                    <div className="flex flex-col items-center justify-center text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                        <CalendarClock size={48} className="text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No follow-ups yet</h3>
                        <p className="mt-1 text-sm text-gray-500 max-w-sm">Add a note, reminder, or log a meeting to get started.</p>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

// --- Follow-up Display Card Component ---
const tagColors: { [key: string]: string } = {
    'Meeting Log': 'bg-yellow-100 text-yellow-800',
    'Reminder': 'bg-green-100 text-green-800',
    'Notes': 'bg-blue-100 text-blue-800'
};

const FollowUpCard = ({ item }: { item: FollowUp }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLongContent = item.content.length > 180;
    const truncatedContent = isLongContent ? item.content.substring(0, 180) + '...' : item.content;
    const cardStyles: { [key: string]: string } = {
        'Meeting Log': 'bg-[#fbfbfb] border-[#e2e6e4]',
        'Reminder': 'bg-[#fbfff7] border-[#defcbd]',
        'Notes': 'bg-[#fbfbfb] border-[#e2e6e4]'
    };
    const typeSpecificStyles = cardStyles[item.type] || 'bg-white border-gray-300';

    return (
        <div className={`p-4 border rounded-lg shadow-sm space-y-3 transition-all ${typeSpecificStyles}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                    {item.type !== 'Notes' && <Calendar size={18} className="text-gray-500" />}
                    {item.date && <span className="text-sm font-medium">{item.date}</span>}

                    {item.attendees.length > 0 && (
                        <div className="flex -space-x-2">
                            {item.attendees.map(p => <Image key={p.id} src={p.avatar} alt={p.name} width={24} height={24} className="rounded-full border-2 border-white" />)}
                        </div>
                    )}

                </div>
                <button className="p-1 text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none focus:ring-0" aria-label="More options"><MoreHorizontal size={18} /></button>
            </div>

            <div>
                <h4 className="font-semibold text-gray-800">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${tagColors[item.type]}`}>{item.type}</span>
                    <span>{item.author}</span>
                    <span>{item.timestamp}</span>
                </div>
            </div>

            {item.link &&
                <a
                    href={`https://${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm hover:underline focus:outline-none focus:ring-0 ${item.type === 'Reminder' ? 'text-[#697d67]' : 'text-blue-600'}`}
                >
                    <span>{item.link}</span>
                </a>
            }

            <hr className="border-gray-200" />

            <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {isExpanded ? item.content : truncatedContent}
            </p>
            {isLongContent && (
                // ✅ Button updated to be black with chevron icons
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-1 text-sm font-medium text-black hover:underline focus:outline-none focus:ring-0"
                >
                    <span>Show {isExpanded ? 'less' : 'more'}</span>
                    {isExpanded ? <ChevronUp size={16} className="text-black" /> : <ChevronDown size={16} className="text-black" />}
                </button>
            )}
        </div>
    );
};