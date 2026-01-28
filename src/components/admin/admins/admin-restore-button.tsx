'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface AdminRestoreButtonProps {
  adminId: string;
}

export function AdminRestoreButton({ adminId }: AdminRestoreButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleRestore() {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/admin-tooling/admins/${adminId}/restore`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to restore admin');
      }

      toast.success('Admin restored successfully');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to restore admin'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button
      onClick={handleRestore}
      disabled={isLoading}
      className="bg-green-600 hover:bg-green-700"
    >
      {isLoading ? 'Restoring...' : 'Restore Admin'}
    </Button>
  );
}
