import { AdminsList } from '@/components/admin/admins/admins-list';
import { prisma } from '@/lib/prisma';

async function getAdmins() {
  return prisma.admin.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export default async function AdminsPage() {
  const admins = await getAdmins();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admins</h1>
        <p className="text-muted-foreground">View and manage admin accounts.</p>
      </div>
      <AdminsList admins={admins} />
    </div>
  );
}
