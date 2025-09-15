/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
import { getInitials } from "@/utils/utils";
import { useState, useRef, useMemo, useEffect } from "react";
import { useCommentsForEntity } from "../../hooks/comments/useCommentsForEntity";
import { useRequestChangeLog } from "../../hooks/requests/useRequestChangeLog";

type User = {
  id: string;
  name: string;
  avatarUrl: string;
};

type RawComment = {
  id: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  text: string;
};

type ChangeLogItem = {
  request: string;
  createdAt: string;
  updatedBy: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
  assignees: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  }[];
  changedFields: string[];
  actionType?: string;
  snapshot: Record<string, unknown>;
};

export type Comment = {
  id: string;
  user: User;
  createdAt: string;
  text?: string;
  type: "comment" | "activity";
  activityText?: string;
};

export default function CommentsList({
  requestId,
  className = "",
  onCommentCountChange,
}: {
  requestId: string | null;
  className?: string;
  onCommentCountChange?: (count: number) => void;
}) {
  const [showActivity, setShowActivity] = useState(true);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const {
    comments: rawComments,
    loading: loadingComments,
    error: errorComments,
  } = useCommentsForEntity(requestId);
  const {
    changeLog,
    loading: loadingLogs,
    error: errorLogs,
  } = useRequestChangeLog(requestId);

  // Transformar comentarios
  const comments: Comment[] = useMemo(() => {
    return rawComments.map((c: RawComment) => ({
      id: c.id,
      user: c.user,
      createdAt: c.createdAt,
      text: c.text,
      type: "comment" as const,
    }));
  }, [rawComments]);

  // Transformar change logs a actividades
  const activities: Comment[] = useMemo(() => {
    if (!changeLog) return [];
    return changeLog.map((log: ChangeLogItem, index: number) => {
      const activityText = (() => {
        if (log?.actionType?.includes("creation")) {
          return "created this task";
        }
        if (log?.actionType?.includes("priority")) {
          return `changed the priority to ${
            log.snapshot.priority || "unknown"
          }`;
        }
        if (log.actionType?.includes("status")) {
          return `changed status to ${log.snapshot.status || "unknown"}`;
        }

        if (log.actionType?.includes("assignee_removed")) {
          const assignees = Array.isArray(log.snapshot.assignees)
            ? (log.snapshot.assignees as { firstName: string; lastName: string }[])
            : [];
          return `removed the assignee ${assignees
            .map((a) => a.firstName + " " + (a.lastName ? a.lastName : ""))
            .join(", ")}`;
        }

        if (log.actionType?.includes("assignee_added")) {
          const assignees = Array.isArray(log.snapshot.assignees)
            ? (log.snapshot.assignees as { firstName: string; lastName: string }[])
            : [];
          return `added the assignee ${assignees
            .map((a) => a.firstName + " " + (a.lastName ? a.lastName : ""))
            .join(", ")}`;
        }
        return `updated the following:\n${log.changedFields
          .map((field) => `- ${field}`)
          .join("\n")}`;
      })();
      return {
        id: `activity_${index}`,
        user: {
          id: log.updatedBy.firstName + log.updatedBy.lastName,
          name: `${log.updatedBy.firstName} ${log.updatedBy.lastName}`,
          avatarUrl: log.updatedBy.avatarUrl || "",
        },
        createdAt: log.createdAt,
        type: "activity" as const,
        activityText,
      };
    });
  }, [changeLog]);

  // Combinar y ordenar por fecha ascendente (más antiguos primero)
  const allItems = useMemo(() => {
    const combined = [...comments, ...activities];
    return combined.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [comments, activities]);

  const visibleComments = showActivity
    ? allItems
    : allItems.filter((c) => c.type === "comment");

  useEffect(() => {
    if (onCommentCountChange) {
      onCommentCountChange(comments.length);
    }
  }, [comments.length, onCommentCountChange]);

  if (loadingComments || loadingLogs) {
    return <div className="text-sm text-gray-500">Loading comments...</div>;
  }

  if (errorComments || errorLogs) {
    return (
      <div className="text-sm text-red-500">
        Error loading comments or activity.
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className} text-sm`}>
      <div className="flex items-center justify-between">
        <div className="text-base font-medium text-[#5E6B66]">Comments</div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer select-none text-sm text-[#5E6B66]">
            <input
              type="checkbox"
              checked={showActivity}
              onChange={(e) => setShowActivity(e.target.checked)}
              className="accent-[#758C5D] w-4 h-4"
            />
            Show Activity
          </label>
        </div>
      </div>
      <ul className="flex flex-col gap-3 py-3">
        {visibleComments.map((comment) => {
          const iconLetter = getInitials(comment.user.name);

          return comment.type === "activity" ? (
            <li key={comment.id} className="flex items-start gap-2 text-sm ">
              {comment.user.avatarUrl ? (
                <img
                  src={comment.user.avatarUrl}
                  alt={comment.user.name}
                  className="w-7 h-7 rounded-full mt-1"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#E0E0E0] flex items-center justify-center mt-1 font-semibold text-[#5E6B66]">
                  {iconLetter}
                </div>
              )}
              <div>
                <span className="font-semibold">{comment.user.name}</span>{" "}
                <span className="whitespace-pre-line">
                  {comment.activityText}
                </span>
                <div className="text-xs text-[#5E6B66] ">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
              </div>
            </li>
          ) : (
            <li key={comment.id} className="flex items-start gap-2">
              {comment.user.avatarUrl ? (
                <img
                  src={comment.user.avatarUrl}
                  alt={comment.user.name}
                  className="w-7 h-7 rounded-full mt-1"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#E0E0E0] flex items-center justify-center mt-1 font-semibold text-[#5E6B66]">
                  {iconLetter}
                </div>
              )}
              <div>
                <div className="font-semibold  text-sm">
                  {comment.user.name}
                </div>
                <div className="text-xs text-[#5E6B66]">
                  {new Date(comment.createdAt).toLocaleString()}
                </div>
                <div
                  className="bg-[#F8F9F8] p-3 rounded-md mt-1 whitespace-pre-line"
                  //@ts-ignore
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                ></div>
              </div>
            </li>
          );
        })}
        <div ref={commentsEndRef} />
      </ul>
    </div>
  );
}
