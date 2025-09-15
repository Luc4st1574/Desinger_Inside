import React from "react";
import Star from "@/assets/icons/reviews/star.svg";
export interface Client {
  id: string;
  name: string;
  avatar?: string;
  startDate: string;
  rating: number;
}

interface ClientCardProps {
  client: Client;
  onClick?: (id: string) => void;
}

const Stars: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(value) ? "text-[#62864D]" : "text-gray-300"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm text-[#62864D] font-medium ml-2">
        {value.toFixed(1)} Stars
      </span>
    </div>
  );
};

const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const Stars: React.FC<{ value: number }> = ({ value }) => {
    const rounded = Math.round(value);
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star className="w-4 h-4 text-[#697D67]" key={i} />
        ))}
        <span className="text-sm text-[#62864D] font-medium ml-2">
          {value.toFixed(1)}
        </span>
      </div>
    );
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-4
       shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onClick?.(client.id)}
    >
      {/* Avatar Section */}
      <div className="flex justify-center mb-2">
        <div className="w-full rounded-full flex items-center justify-center">
          {client.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={client.avatar}
              alt={client.name}
              className="w-40 h-40 rounded-full object-cover"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center">
              <span className="text-xl font-semibold text-gray-600">
                {getInitials(client.name)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Client Info */}
      <div className="text-center">
        <h3
            className="text-lg font-medium text-green-gray-950 mb-2 truncate"
            style={{ maxWidth: "100%" }}
            title={client.name}
        >
            {client.name}
        </h3>
        <p className="text-sm text-green-gray-500 mb-2">
          Since {formatDate(client.startDate)}
        </p>

        {/* Rating */}
        <div className="flex justify-center items-center gap-3 mb-1">
          <Star className="w-4 h-4 text-[#697D67]" />
          <span>{client.rating} Stars</span>
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
