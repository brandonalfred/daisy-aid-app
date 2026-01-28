import { redirect } from 'next/navigation';
import { auth, signOut } from '@/auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Header } from '@/components/header';

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/admin-tooling/login');
  }

  const { user } = session;

  const signOutAction = async () => {
    'use server';
    await signOut({ redirectTo: '/admin-tooling/login' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-beige">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar
          user={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          }}
          signOutAction={signOutAction}
        />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
