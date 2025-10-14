// components/SalesTabDetails.tsx
import { useState } from "react";
import Image from "next/image";
import salesData from "@/data/salesData.json";
import CommentInputBar from "../../comments/CommentInputBar";

type Prospect = (typeof salesData.prospects.list)[0];
type Comment = (typeof salesData.prospects.list)[0]['comments'][0];

export default function SalesTabDetails({ prospect }: { prospect: Prospect }) {
  const [comments, setComments] = useState<Comment[]>(prospect.comments || []);

  // FIX: The 'clear' function's type is now correctly defined as (v: boolean) => void
  const handleCommentSubmit = (
    _editorState: unknown, // We still don't use the editor state
    html: string,
    clear: (v: boolean) => void // This now matches the expected type
  ) => {
    const newComment: Comment = {
      person: "Tony Brown",
      avatar: "/assets/avatars/tony.svg",
      action: html.replace(/<[^>]*>?/gm, ''), // Sanitize HTML to plain text
      timestamp: new Date().toLocaleString(),
    };
    setComments(prev => [...prev, newComment]);
    
    // FIX: Call 'clear' with the required boolean argument.
    clear(true);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="text-base px-6 flex flex-col gap-6 pt-4">
        <section className="flex flex-col gap-2">
          <div className="text-base font-medium text-[#5E6B66]">Description</div>
          <div className="border border-[#C4CCC8] rounded-lg p-4 whitespace-pre-wrap">
            {prospect.description}
          </div>
        </section>

        <section>
             <div className="text-base font-medium text-[#5E6B66] mb-2">Attached Files</div>
             {prospect.files.length > 0 ? (
                <ul className="border border-[#C4CCC8] rounded-lg p-2 space-y-2">
                    {prospect.files.map(file => (
                        <li key={file.name} className="p-2 bg-gray-50 rounded-md">
                            <p className="font-medium text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">by {file.author} on {file.date}</p>
                        </li>
                    ))}
                </ul>
             ) : (
                <p className="text-sm text-gray-400">No files attached.</p>
             )}
        </section>

        <section className="flex flex-col gap-3">
            <div className="text-base font-medium text-[#5E6B66]">Activity</div>
            {comments.length > 0 ? (
                comments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <Image src={comment.avatar} alt={comment.person} width={32} height={32} className="rounded-full" />
                        <div className="flex flex-col">
                            <p className="text-sm">
                                <span className="font-semibold">{comment.person}</span> {comment.action}
                            </p>
                            <p className="text-xs text-gray-400">{comment.timestamp}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-400">No activity yet.</p>
            )}
        </section>
      </div>

      <div className="sticky bottom-0 bg-white z-20 shadow-[0_-2px_12px_0px_rgba(0,0,0,0.03)] border-t border-[#f2f4f3] mt-4">
        <CommentInputBar
          onSubmit={handleCommentSubmit}
          userAvatar="/assets/avatars/tony.svg"
          loading={false}
        />
      </div>
    </div>
  );
}