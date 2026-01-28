import { Badge } from '@/components/ui/badge';

interface AdminStatusBadgeProps {
  deletedAt: Date | null;
}

export function AdminStatusBadge({ deletedAt }: AdminStatusBadgeProps) {
  const isActive = deletedAt === null;
  const className = isActive
    ? 'bg-green-100 text-green-800 hover:bg-green-100'
    : 'bg-red-100 text-red-800 hover:bg-red-100';

  return (
    <Badge variant="outline" className={className}>
      {isActive ? 'Active' : 'Deleted'}
    </Badge>
  );
}
