'use client';

import { CalendarDays, LogOut, Menu, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  user: {
    firstName: string;
    lastName: string;
    email?: string | null;
  };
  signOutAction: () => Promise<void>;
}

const navItems = [
  {
    label: 'Bookings',
    href: '/admin-tooling/bookings',
    icon: CalendarDays,
  },
  {
    label: 'Admins',
    href: '/admin-tooling/admins',
    icon: Users,
  },
];

function SidebarContent({
  user,
  signOutAction,
  onNavigate,
}: AdminSidebarProps & { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="mb-3">
          <p className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </p>
          {user.email && (
            <p className="text-xs text-muted-foreground">{user.email}</p>
          )}
        </div>
        <form action={signOutAction}>
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdminSidebar({ user, signOutAction }: AdminSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: Fixed sidebar */}
      <aside className="hidden w-60 shrink-0 border-r bg-background md:block">
        <SidebarContent user={user} signOutAction={signOutAction} />
      </aside>

      {/* Mobile: Menu button integrated via Sheet (no extra bar) */}
      <div className="fixed bottom-4 left-4 z-50 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open admin menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle>Admin Menu</SheetTitle>
            </SheetHeader>
            <SidebarContent
              user={user}
              signOutAction={signOutAction}
              onNavigate={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
