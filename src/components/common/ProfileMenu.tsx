"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";

export function ProfileMenu({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2" ref={menuRef}>
      <div className="flex gap-3 items-center cursor-pointer" onClick={() => setIsOpen((prev) => !prev)}>
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="text-purple-400 flex flex-col">
          <p className="font-medium">{name}</p>
          <p className="text-xs">{email}</p>
        </div>
      </div>

      <div
        className={`
          overflow-hidden transition-all duration-300
          ${isOpen ? "max-h-60 mt-2 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-col gap-2  rounded-xl p-3 ">
          <Link
            href="/profile"
            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-center"
            onClick={() => setIsOpen(false)}
          >
            View Profile
          </Link>
          <Link
            href="/profile/edit"
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-center"
            onClick={() => setIsOpen(false)}
          >
            Edit Profile
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-center"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
