"use client";
import { useState, useRef, Fragment } from "react";
import Image from "next/image";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/react";
import salesData from "@/data/salesData.json";
import CommentInputBar from "../../comments/CommentInputBar";

// --- ICONS for actions and new sections ---
import {
    Download,
    Trash2,
    EyeOff,
    Link,
    MoreHorizontal,
    Plus,
    Edit,
    X,
} from "lucide-react";

// --- Import the official getFileIcon utility ---
import { getFileIcon } from "@/utils/getFileIcon";

type Prospect = (typeof salesData.prospects.list)[0];
type Comment = (typeof salesData.prospects.list)[0]['comments'][0];
type AttachedFile = (typeof salesData.prospects.list)[0]['files'][0];

export default function SalesTabDetails({ prospect }: { prospect: Prospect }) {
    const [comments, setComments] = useState<Comment[]>(prospect.comments || []);
    const [files, setFiles] = useState<AttachedFile[]>(prospect.files || []);
    const [showActivity, setShowActivity] = useState<boolean>(true);
    const [isAddingWebsite, setIsAddingWebsite] = useState(false);
    const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleCommentSubmit = (
        _editorState: unknown,
        html: string,
        clear: (v: boolean) => void
    ) => {
        const newComment: Comment = {
            person: "Tony Brown",
            avatar: "/assets/avatars/tony.svg",
            action: html.replace(/<[^>]*>?/gm, ''),
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }),
        };
        setComments(prev => [...prev, newComment]);
        clear(true);
    };

    const handleRemoveFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
    };
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleSaveWebsite = () => {
        if (newWebsiteUrl.trim()) {
            console.log("Saving new website:", newWebsiteUrl);
            alert(`New website to add: ${newWebsiteUrl}`);
            setNewWebsiteUrl(''); 
            setIsAddingWebsite(false);
        }
    };

    return (
        <div className="flex flex-col h-full justify-between">
            <input type="file" ref={fileInputRef} className="hidden" multiple aria-label="Upload files" />

            <div className="text-base px-6 flex flex-col gap-6 pt-4 overflow-y-auto">
                <section className="flex flex-col gap-2">
                    <div className="text-base font-medium text-[#5E6B66]">Description</div>
                    <div className="border border-[#C4CCC8] rounded-lg p-4 whitespace-pre-wrap text-gray-800">
                        {prospect.description}
                    </div>
                </section>
                
                <section>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-medium text-[#5E6B66]">Website</div>
                        <button onClick={() => setIsAddingWebsite(true)} type="button" className="flex items-center gap-1 py-1 px-3 rounded-full text-sm font-semibold text-[#5b6f59] border border-[#5b6f59] hover:bg-[#5b6f59]/10 transition-colors">
                            <span>Add</span>
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* --- NEW: Inline input form for adding a website --- */}
                    {isAddingWebsite && (
                        <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50">
                            <Link size={18} className="text-gray-400" />
                            <input
                                type="text"
                                value={newWebsiteUrl}
                                onChange={(e) => setNewWebsiteUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="flex-1 bg-transparent outline-none text-sm"
                                autoFocus
                            />
                            <button onClick={handleSaveWebsite} className="text-sm font-semibold text-white bg-[#697d67] hover:bg-opacity-90 rounded-md py-1 px-3">Save</button>
                            <button
                                onClick={() => setIsAddingWebsite(false)}
                                className="p-1.5 text-gray-500 hover:text-gray-800 rounded-md hover:bg-gray-200"
                                title="Cancel"
                                aria-label="Cancel"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {prospect.website && (
                         <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                            <Image src={prospect.logo} alt={`${prospect.title} logo`} width={24} height={24} className="flex-shrink-0 rounded-full" />
                            <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="font-medium text-sm text-blue-600 truncate hover:underline">
                                {prospect.title}
                            </a>
                            <div className="flex items-center gap-1 ml-auto text-gray-500">
                                {/* FIX: "Copy Link" button is now separate */}
                                <button title="Copy link" className="p-1.5 hover:text-gray-800 rounded-md hover:bg-gray-100">
                                    <Link size={18} />
                                </button>
                                <Menu as="div" className="relative">
                                    <MenuButton className="p-1.5 hover:text-gray-800 rounded-md hover:bg-gray-100">
                                        <MoreHorizontal size={18} />
                                    </MenuButton>
                                    <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                        <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                            <div className="px-1 py-1">
                                                <MenuItem>
                                                    {({ active }) => ( <button className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}> <Edit size={14} className="mr-2" /> Edit </button> )}
                                                </MenuItem>
                                                <MenuItem>
                                                    {({ active }) => ( <button className={`${active ? 'bg-red-50' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-600`}> <Trash2 size={14} className="mr-2" /> Remove </button> )}
                                                </MenuItem>
                                            </div>
                                        </MenuItems>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    )}
                </section>

                <section>
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-medium text-[#5E6B66]">Attached Files</div>
                        <button onClick={handleUploadClick} type="button" className="flex items-center gap-1 py-1 px-3 rounded-full text-sm font-semibold text-[#5b6f59] border border-[#5b6f59] hover:bg-[#5b6f59]/10 transition-colors">
                          <span>Upload</span>
                          <Plus size={16} />
                        </button>
                    </div>
                    {files.length > 0 ? (
                        <ul className="space-y-3">
                            {files.map(file => (
                                <li key={file.name} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Image src={getFileIcon(file.name)} width={40} height={40} alt="file icon" className="flex-shrink-0" />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-medium text-sm text-gray-800 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">by {file.author} on {file.date}</p>
                                    </div>
                                    <div className="flex items-center gap-1 ml-auto">
                                        {/* FIX: "Download" button is now separate */}
                                        <button type="button" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100" title="Download">
                                            <Download size={18} />
                                        </button>
                                        <Menu as="div" className="relative">
                                            <MenuButton className="p-1.5 text-gray-400 hover:text-gray-800 rounded-md hover:bg-gray-100">
                                                <MoreHorizontal size={18} />
                                            </MenuButton>
                                            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                                                <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                                    <div className="px-1 py-1">
                                                        <MenuItem>
                                                            {({ active }) => ( <button className={`${active ? 'bg-gray-100' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700`}> <Edit size={14} className="mr-2" /> Rename </button> )}
                                                        </MenuItem>
                                                        <MenuItem>
                                                            {({ active }) => ( <button onClick={() => handleRemoveFile(file.name)} className={`${active ? 'bg-red-50' : ''} group flex rounded-md items-center w-full px-2 py-2 text-sm text-red-600`}> <Trash2 size={14} className="mr-2" /> Delete </button> )}
                                                        </MenuItem>
                                                    </div>
                                                </MenuItems>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : ( <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg"> <p className="text-sm text-gray-500">No files attached.</p> </div> )}
                </section>

                <section className="flex flex-col gap-3">
                    <div className="flex items-center justify-between mb-2">
                        <div className="text-base font-medium text-[#5E6B66]">Activity</div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked={showActivity} onChange={() => setShowActivity(!showActivity)} />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#697d67]"></div>
                            <span className="ml-3 text-sm font-medium text-[#697d67]">Show activity</span>
                        </label>
                    </div>

                    {showActivity ? (
                        comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Image src={comment.avatar} alt={comment.person} width={32} height={32} className="rounded-full w-8 h-8" />
                                    <div className="flex flex-col">
                                        <p className="text-sm text-gray-800">
                                            <span className="font-semibold">{comment.person}</span> {comment.action}
                                        </p>
                                        <p className="text-xs text-gray-400">{comment.timestamp}</p>
                                    </div>
                                </div>
                            ))
                        ) : ( <p className="text-sm text-gray-400">No activity yet.</p> )
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-gray-300 rounded-lg text-gray-500">
                            <EyeOff size={24} className="mb-2" />
                            <p className="text-sm">Activity is hidden.</p>
                        </div>
                    )}
                </section>
            </div>

            {showActivity && (
                <div className="sticky bottom-0 bg-white z-20 shadow-[0_-2px_12px_0px_rgba(0,0,0,0.03)] border-t border-[#f2f4f3] mt-4">
                    <CommentInputBar
                        onSubmit={handleCommentSubmit}
                        userAvatar="/assets/avatars/tony.svg"
                        loading={false}
                    />
                </div>
            )}
        </div>
    );
}