import { AdminLoginForm } from '@/components/admin/admin-login-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SearchParams = Promise<{ error?: string }>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-beige px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            Sign in with your Google account to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error === 'AccessDenied' && (
            <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
              Access denied. Your email is not authorized to access the admin
              area.
            </div>
          )}
          <AdminLoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
