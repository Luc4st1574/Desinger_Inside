/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FeedbackItem } from "@/hooks/feedback/useFeedbackList";
import CommonPhrasesBadge from "@/components/ui/CommonPhrasesBadge";
import clsx from "clsx";
import { formatDate, getInitials } from "@/utils/utils";
import PriorityUI from "@/components/ui/PriorityUI";

// --- Sub-componente reutilizable para los items de metadatos ---
const MetadataItem = ({ iconSrc, label, children }: { iconSrc: string, label: string, children: React.ReactNode }) => (
  // Cada item es una fila de la grilla principal
  <>
    {/* Columna 1: Icono y Etiqueta (ocupa 1/3 del espacio) */}
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <img src={iconSrc} alt="" className="w-5 h-5" />
      <span>{label}</span>
    </div>
    {/* Columna 2: Valor (ocupa 2/3 del espacio) */}
    <div className="text-sm font-medium text-gray-800">
      {children}
    </div>
  </>
);

// --- Sub-componente para la lista de Asignados ---
const AssigneeList = ({ assignees }: { assignees: FeedbackItem['assignees'] }) => (
  <div className="flex flex-wrap items-center gap-2">
    {assignees.map((assignee) => (
      <div 
        key={assignee.id} 
        className={clsx(
          "flex items-center gap-2 rounded-full pr-3 pl-2 py-1",
          // Ejemplo de cómo colorear un assignee específico
          assignee.name === 'Zeus Roman' ? 'bg-red-100' : 'bg-gray-100'
        )}
      >
        {assignee.avatarUrl ? (
          <img
            src={assignee.avatarUrl}
            alt={assignee.name}
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
            {getInitials(assignee.name)}
          </div>
        )}
        <span className="text-sm font-medium text-gray-800">{assignee.name}</span>
      </div>
    ))}
  </div>
);

// --- Componente principal ---
interface FeedbackDetailsModalProps {
  feedback: FeedbackItem;
}

const FeedbackDetailsTab: React.FC<FeedbackDetailsModalProps> = ({ feedback }) => {
  return (
    <div className="p-2 space-y-8">
      {/* Grilla de Metadatos con columnas de ancho personalizado */}
      <div className="grid grid-cols-[40%_60%] md:grid-cols-[30%_70%] gap-x-6 gap-y-4 items-center">
        
        <MetadataItem iconSrc="/assets/icons/feedback/category-icon.svg" label="Category">
          <CommonPhrasesBadge phrase={feedback.category} variant="colored" />
        </MetadataItem>

        <MetadataItem iconSrc="/assets/icons/feedback/submitted-by.svg" label="Submitted by">
           <div className="flex items-center gap-2">
                {feedback.submittedBy.avatarUrl ? (
                    <img src={feedback.submittedBy.avatarUrl} alt={feedback.submittedBy.name} className="w-6 h-6 rounded-full" />
                ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                        {getInitials(feedback.submittedBy.name)}
                    </div>
                )}
                <span>{feedback.submittedBy.name}</span>
            </div>
        </MetadataItem>

        <MetadataItem iconSrc="/assets/icons/feedback/briefcase-outline.svg" label="Role">
          {feedback.role}
        </MetadataItem>

        <MetadataItem iconSrc="/assets/icons/feedback/calendar.svg" label="Submitted Date">
          {formatDate(feedback.submittedDate)}
        </MetadataItem>

        <MetadataItem iconSrc="/assets/icons/feedback/submitted-by.svg" label="Assignee">
            <AssigneeList assignees={feedback.assignees} />
        </MetadataItem>

        <MetadataItem iconSrc="/assets/icons/feedback/layout-grid.svg" label="Priority">
              <PriorityUI priority={feedback.priority.toLowerCase() as any} />
        </MetadataItem>

      </div>

      {/* Descripción (fuera de la grilla) */}
      <div className="space-y-2">
        <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm text-gray-500">Description</h3>

          <p className="text-sm text-green-gray-950 font-medium leading-relaxed">
            {feedback.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDetailsTab;