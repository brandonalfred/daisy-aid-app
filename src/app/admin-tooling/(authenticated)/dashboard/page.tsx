import { auth } from '@/auth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default async function AdminDashboardPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.firstName} {user?.lastName}
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Account Info</CardTitle>
          <CardDescription>Your admin account details</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Signed in as {user?.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
