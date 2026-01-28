'use client';

import { Plus, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AdminCreateDialog } from './admin-create-dialog';
import { AdminStatusBadge } from './admin-status-badge';

interface Admin {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  lastLoginAt: Date | null;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface AdminsListProps {
  admins: Admin[];
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active Only' },
  { value: 'deleted', label: 'Deleted Only' },
  { value: 'all', label: 'All' },
];

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'email-asc', label: 'Email (A-Z)' },
  { value: 'date-desc', label: 'Date Created (Newest)' },
  { value: 'date-asc', label: 'Date Created (Oldest)' },
];

function formatDate(date: Date | null): string {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function AdminsList({ admins }: AdminsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const statusFilter = searchParams.get('status') || 'active';
  const sort = searchParams.get('sort') || 'date-desc';
  const search = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(search);

  const updateParams = useCallback(
    (key: string, value: string): void => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'active' && key === 'status') {
        params.delete(key);
      } else if (value === 'date-desc' && key === 'sort') {
        params.delete(key);
      } else if (value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (searchInput === search) return;

    const timeoutId = setTimeout(() => {
      updateParams('search', searchInput);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchInput, search, updateParams]);

  const filteredAdmins = useMemo(() => {
    let result = [...admins];

    if (statusFilter === 'active') {
      result = result.filter((a) => a.deletedAt === null);
    } else if (statusFilter === 'deleted') {
      result = result.filter((a) => a.deletedAt !== null);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (a) =>
          `${a.firstName} ${a.lastName}`.toLowerCase().includes(searchLower) ||
          a.email.toLowerCase().includes(searchLower)
      );
    }

    result.sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return `${a.firstName} ${a.lastName}`.localeCompare(
            `${b.firstName} ${b.lastName}`
          );
        case 'email-asc':
          return a.email.localeCompare(b.email);
        case 'date-desc':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'date-asc':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return result;
  }, [admins, statusFilter, sort, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 sm:w-64 border-2 border-gray-300 focus-visible:border-primary"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => updateParams('status', v)}
          >
            <SelectTrigger className="w-36 border-2 border-gray-300 focus-visible:border-primary">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => updateParams('sort', v)}>
            <SelectTrigger className="w-48 border-2 border-gray-300 focus-visible:border-primary">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No admins found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow
                  key={admin.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/admin-tooling/admins/${admin.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {admin.firstName} {admin.lastName}
                  </TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{formatDate(admin.createdAt)}</TableCell>
                  <TableCell>{formatDate(admin.lastLoginAt)}</TableCell>
                  <TableCell>
                    <AdminStatusBadge deletedAt={admin.deletedAt} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {isPending && (
        <div className="text-center text-sm text-muted-foreground">
          Loading...
        </div>
      )}

      <AdminCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
