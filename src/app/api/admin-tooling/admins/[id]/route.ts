import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { updateAdminSchema } from '@/lib/validations/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const includeDeleted = searchParams.get('includeDeleted') === 'true';

  const admin = await prisma.admin.findFirst({
    where: includeDeleted ? { id } : { id, deletedAt: null },
  });

  if (!admin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  return NextResponse.json(admin);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validation = updateAdminSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.errors },
      { status: 400 }
    );
  }

  const existingAdmin = await prisma.admin.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existingAdmin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: validation.data,
  });

  return NextResponse.json(admin);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const existingAdmin = await prisma.admin.findFirst({
    where: { id, deletedAt: null },
  });

  if (!existingAdmin) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  const admin = await prisma.admin.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(admin);
}
