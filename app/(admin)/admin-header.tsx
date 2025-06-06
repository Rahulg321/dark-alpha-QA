import React from "react";
import { ChevronDown, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Session } from "next-auth";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AdminHeader = ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4">
                  <Link href="/admin/tickets" className="text-sm font-medium">
                    Tickets
                  </Link>
                  <Link href="/admin/companies" className="text-sm font-medium">
                    Companies
                  </Link>
                  <Link
                    href="/admin/categories"
                    className="text-sm font-medium"
                  >
                    Categories
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <Link href="/admin">
              <h1 className="text-xl font-semibold">Dashboard</h1>
            </Link>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <Link
                href="/admin/tickets"
                className="text-sm hover:text-primary"
              >
                Tickets
              </Link>
              <span className="text-sm">•</span>
              <Link
                href="/admin/companies"
                className="text-sm hover:text-primary"
              >
                Companies
              </Link>
              <span className="text-sm">•</span>
              <Link
                href="/admin/categories"
                className="text-sm hover:text-primary"
              >
                Categories
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ProfileMenu session={session} />
          </div>
        </div>
      </div>
    </header>
  );
};

function ProfileMenu({ session }: { session: Session | null }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={"https://github.com/shadcn.png"} alt={"User"} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0)}
            {session?.user?.name?.charAt(1)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:flex items-center font-medium text-primary">
          Account <ChevronDown className="ml-1 h-4 w-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/profile`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AdminHeader;
