// components/SalesTabFiles.tsx
"use client";
import { useState } from 'react';
import Image from 'next/image';
import salesData from "@/data/salesData.json";

// --- ICONS for actions ---
import { Download, Trash2 } from "lucide-react";

// --- Import the official getFileIcon utility ---
import { getFileIcon } from "@/utils/getFileIcon";

type Prospect = typeof salesData.prospects.list[0];
type AttachedFile = (typeof salesData.prospects.list)[0]['files'][0];


export default function SalesTabFiles({ prospect }: { prospect: Prospect }) {
    const [files, setFiles] = useState<AttachedFile[]>(prospect.files || []);

    const handleRemoveFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
    };

    return (
        <div className="p-6 flex flex-col gap-4">
            <h2 className="font-medium text-lg text-gray-800">All Files</h2>

            {files.length > 0 ? (
                <ul className="space-y-3">
                    {files.map((file) => (
                        <li 
                            key={file.name} 
                            className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Image
                              src={getFileIcon(file.name)}
                              width={40}
                              height={40}
                              alt="file icon"
                              className="flex-shrink-0"
                            />
                            <div className="flex-1 overflow-hidden">
                                <p className="font-medium text-sm text-gray-800 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">
                                  Uploaded by {file.author} on {file.date}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                <button type="button" className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md" title="Download">
                                    <Download size={18} />
                                </button>
                                <button type="button" onClick={() => handleRemoveFile(file.name)} className="p-1.5 text-gray-400 hover:text-red-600 rounded-md" title="Delete">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">No files have been uploaded for this prospect.</p>
                </div>
            )}
        </div>
    );
}