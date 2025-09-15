/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Link, MoreVertical, X, Bell } from 'lucide-react';
import MessageTextIcon from "@/assets/icons/message-text-square.svg";
import LoginIcon from "@/assets/icons/Login.svg";

// Importación de iconos
import BriefcaseIcon from "@/assets/icons/client_detail/briefcase.svg";
import CalendarDueIcon from "@/assets/icons/client_detail/calendar-due.svg";
import ClipBoardIcon from "@/assets/icons/client_detail/clipboard-check.svg";
import GlobeIcon from "@/assets/icons/client_detail/globe.svg";
import UserIcon from "@/assets/icons/client_detail/user-circle.svg";
import MarketPinIcon from "@/assets/icons/client_detail/marker-pin.svg";
import MailIcon from "@/assets/icons/client_detail/mail.svg";
import PhoneIcon from "@/assets/icons/client_detail/phone.svg";
import Button from '@/components/ui/Button';
import PlanBadge from '@/components/ui/PlanBadge';
import IconWithText from '@/components/ui/IconWithText';
import Briefcase from '@/assets/icons/briefcase.svg';
import Cake from '@/assets/icons/cake.svg';
import { formatDate } from '@/utils/utils';

interface SidebarProps {
  member: any; // En una implementación real, usaríamos un tipo más específico
  onClose?: () => void;
}

const ClientSidebar: React.FC<SidebarProps> = ({ member, onClose }) => {
  function formatEmploymentType(employmentType: any): string {
    if (!employmentType) return '';
    if (typeof employmentType === 'string') {
      // Capitaliza la primera letra y reemplaza guiones bajos por espacios
      return employmentType
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
    }
    if (employmentType.label) return employmentType.label;
    return String(employmentType);
  }

  return (
    <div className="w-full md:w-[260px] bg-white border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto md:max-h-none max-h-[40vh]">
      {/* Header con botones de acción - Solo visible en móvil */}
      <div className="md:hidden flex justify-between items-center p-4 border-b border-gray-200">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">{member?.fullName}</h2>
          <span className="text-sm text-gray-500">{member?.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Link className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Sidebar Header con imagen de fondo */}
        <div className="h-16 md:h-32 bg-cover bg-center" style={{ backgroundImage: "url('/assets/illustrations/bg_profile_team.jpg')" }}></div>
        
        {/* Avatar */}
        <div className="absolute top-6 md:top-16 left-1/2 transform -translate-x-1/2">
          <div className="h-12 w-12 md:h-24 md:w-24 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member?.name)}&background=e5e7eb&color=374151&size=80`} 
              alt={member?.name} 
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        
        {/* Client name & info */}
        <div className="pt-8 md:pt-16 px-4 text-left">
          <h3 className="font-semibold text-sm md:text-lg">About {member?.firstName}</h3>
        
          
        </div>
        
        {/* Client details list */}
        <div className="px-4 mt-4 md:mt-6 space-y-2 md:space-y-4 grid grid-cols-2 md:grid-cols-1 gap-2 md:gap-2">
          <IconWithText
            icon={<UserIcon className="w-5 h-5 text-gray-700 mt-1" />}
            title={member?.manager?.fullName}
            titleLabel="Manager"
            isRaw={true}
            vertical={true}
          />

          <IconWithText
            icon={<ClipBoardIcon className="w-5 h-5 text-gray-700 mt-1" />}
            title={formatDate(member?.contractStart)}
            titleLabel="Contract Start"
            isRaw={true}
            vertical={true}
          />

          {member?.contractEnd && (
            <IconWithText
              icon={<ClipBoardIcon className="w-5 h-5 text-gray-700 mt-1" />}
              title={formatDate(member.contractEnd)}
              titleLabel="Contract End"
              isRaw={true}
              vertical={true}
            />
          )}

          <IconWithText
            icon={<Briefcase className="w-5 h-5 text-gray-700 " />}
            title={formatEmploymentType(member?.employmentType)}
          />

           <IconWithText
            icon={<GlobeIcon className="w-5 h-5 text-gray-700 " />}
            title={member?.timezone}
          />

           <IconWithText
            icon={<MarketPinIcon className="w-5 h-5 text-gray-700 " />}
            title={
              [member?.city, member?.state, member?.country]
          .filter(Boolean)
          .join(', ')
            }
          />

          <IconWithText
            icon={<MailIcon className="w-5 h-5 text-gray-700 " />}
            title={member?.email}
          />
          <IconWithText
            icon={<PhoneIcon className="w-5 h-5 text-gray-700 " />}
            title={member?.phone}
          />
            <IconWithText
            icon={<Cake className="w-5 h-5 text-gray-700 " />}
            title={formatDate(member?.birthday)}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
