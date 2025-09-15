"use client";

import React from "react";
import Image from "next/image";

type User = { avatar?: string; name?: string };

export default function AvatarStack({ users, size = 40 }: { users: User[]; size?: number }) {
  return (
    <div className="flex -space-x-2 overflow-hidden">
      {users.slice(0, 4).map((user, idx) => (
        <div key={idx} className="inline-block rounded-full ring-2 ring-green-50 overflow-hidden" style={{ width: size, height: size }}>
          <Image
            src={user.avatar ?? "/assets/avatars/default.png"}
            alt={user.name ?? "avatar"}
            width={size}
            height={size}
          />
        </div>
      ))}
    </div>
  );
}
