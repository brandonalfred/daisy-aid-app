import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdminDeleteDialog } from '@/components/admin/admins/admin-delete-dialog';
import { AdminRestoreButton } from '@/components/admin/admins/admin-restore-button';
import { AdminStatusBadge } from '@/components/admin/admins/admin-status-badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { prisma } from '@/lib/prisma';

interface AdminDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getAdmin(id: string) {
  return prisma.admin.findUnique({
    where: { id },
  });
}

function formatDateTime(date: Date | null): string {
  if (!date) return 'Never';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
}

export default async function AdminDetailPage({
  params,
}: AdminDetailPageProps) {
  const { id } = await params;
  const admin = await getAdmin(id);

  if (!admin) {
    notFound();
  }

  const isDeleted = admin.deletedAt !== null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin-tooling/admins">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to admins</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Admin Details
          </h1>
          <p className="text-sm text-muted-foreground">ID: {admin.id}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                First Name
              </p>
              <p>{admin.firstName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Name
              </p>
              <p>{admin.lastName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{admin.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Login and update history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created At
              </p>
              <p>{formatDateTime(admin.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Last Login At
              </p>
              <p>{formatDateTime(admin.lastLoginAt)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Updated At
              </p>
              <p>{formatDateTime(admin.updatedAt)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Status & Actions</CardTitle>
            <CardDescription>Account status and management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Current Status
              </p>
              <div className="mt-1">
                <AdminStatusBadge deletedAt={admin.deletedAt} />
              </div>
            </div>
            <div className="flex gap-2">
              {isDeleted ? (
                <AdminRestoreButton adminId={admin.id} />
              ) : (
                <AdminDeleteDialog adminId={admin.id} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
