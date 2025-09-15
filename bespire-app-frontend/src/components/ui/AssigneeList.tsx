/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { getInitials } from '@/utils/utils'; // Asegúrate de que la ruta sea correcta

interface Assignee {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface AssigneeListProps {
  assignees: Assignee[];
}

const AssigneeList: React.FC<AssigneeListProps> = ({ assignees }) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {assignees.map((assignee) => (
        <div 
          key={assignee.id} 
          className="flex items-center gap-2 bg-gray-100 rounded-full pr-3 py-1"
          // Ejemplo de cómo podrías diferenciar a un assignee, si tuvieras ese dato
          // style={{ backgroundColor: assignee.name === 'Zeus Roman' ? '#FEE2E2' : '#F3F4F6' }}
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
};

export default AssigneeList;