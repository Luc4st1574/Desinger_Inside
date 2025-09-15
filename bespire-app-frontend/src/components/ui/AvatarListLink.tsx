"use client";

import React from "react";
import AvatarStack from "./AvatarStack";
import Image from "next/image";
export default function AvatarListLink({
  href = "#",
  title,
  users,
}: {
  href?: string;
  title: string;
  users: { avatar?: string; name?: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-lg">{title}</h3>
        <Image src="/assets/icons/trend_icon-up.svg" alt="up" width={16} height={16} />
      </div>
         <AvatarStack users={users} size={36} />
    </div>
  );
}
