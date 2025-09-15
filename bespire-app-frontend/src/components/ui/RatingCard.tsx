import React from 'react';
import Star from "@/assets/icons/reviews/star.svg"; // Asegúrate de tener un icono de estrella
export interface Rating {
  id: string;
  text: string;
  rating: number; // 0-5
  reviewerName: string;
  reviewerCompany?: string;
  reviewerAvatar?: string;
}

interface RatingCardProps {
  item: Rating;
  onView?: (id: string) => void;
}

const Stars: React.FC<{ value: number }> = ({ value }) => {
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star className="w-4 h-4 text-[#697D67]" key={i} />
      ))}
      <span className="text-sm text-[#62864D] font-medium ml-2">{value.toFixed(1)}</span>
    </div>
  );
};

const Avatar: React.FC<{ src?: string; name: string }> = ({ src, name }) => {
  if (src) {
    return <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover" />;
  }
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase();
  return (
    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
      {initials}
    </div>
  );
};

const RatingCard: React.FC<RatingCardProps> = ({ item, onView }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
      <div>
        <p className="text-sm text-gray-800 mb-3 leading-5 max-h-20 overflow-hidden">{item.text}</p>
        <div className="flex items-center gap-3 mb-3">
          <Stars value={item.rating} />
        </div>
        <div className="flex items-center gap-3">
          <Avatar src={item.reviewerAvatar} name={item.reviewerName} />
          <div>
            <div className="text-sm font-medium text-gray-800">{item.reviewerName}</div>
            {item.reviewerCompany ? (
              <div className="text-xs text-gray-500">{item.reviewerCompany}</div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={() => onView?.(item.id)}
          className=" text-sm font-medium inline-flex items-center gap-2 focus:outline-none cursor-pointer underline"
        >
          <span>View Request</span>
         <img src="/assets/icons/arrow-l.svg" alt="" className='w-4' />
        </button>
      </div>
    </div>
  );
};

export default RatingCard;