"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function ProfileMenu({
  name,
  email,
  avatar,
}: {
  name: string;
  email: string;
  avatar?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="cursor-pointer h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 ml-14" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => console.log("Edit Profile")}
          className="cursor-pointer"
        >
          Edit Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => console.log("Logout")}
          className="cursor-pointer text-red-500 focus:text-red-600"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
