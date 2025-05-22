import React from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
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

const TicketHeader = ({ session }: { session: Session | null }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  <Link href="/tickets" className="text-sm font-medium">
                    Tickets
                  </Link>
                  <Link href="/investments" className="text-sm font-medium">
                    Investments
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-semibold">Dark Alpha</h1>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <Link href="/tickets" className="text-sm hover:text-primary">
                Tickets
              </Link>
              <span className="text-sm">•</span>
              <Link href="/investments" className="text-sm hover:text-primary">
                Investments
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="pl-8 h-9 w-[200px] rounded-md border bg-background px-3 py-1 text-sm"
              />
            </div>

            <ModeToggle />
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
          <AvatarFallback>HN</AvatarFallback>
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

export default TicketHeader;
