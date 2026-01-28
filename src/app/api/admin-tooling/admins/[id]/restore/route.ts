import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existingAdmin = await prisma.admin.findFirst({
    where: { id, deletedAt: { not: null } },
  });

  if (!existingAdmin) {
    return NextResponse.json(
      { error: 'Admin not found or already active' },
      { status: 404 }
    );
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: { deletedAt: null },
  });

  return NextResponse.json(admin);
}
