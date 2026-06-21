"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/auth.api";

interface UserMenuProps {
  user: any;
}

export function UserMenu({ user }: UserMenuProps) {
  const initials = user.email.slice(0, 2).toUpperCase();

  const { mutate, isPending } = useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      window.location.href = "/";
    },
    onError: (error) => {
      console.log("Sign Out Error", error);
    },
  });


  const handleSignOut = () => {
    if(isPending) return;
    mutate();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="size-9 cursor-pointer">
          <AvatarFallback className="bg-amber-100 text-sm font-semibold text-amber-700">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-sm font-medium text-zinc-800">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 focus:text-red-600">
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}