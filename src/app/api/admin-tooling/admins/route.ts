import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { createAdminSchema } from '@/lib/validations/admin';

export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const includeDeleted = searchParams.get('includeDeleted') === 'true';

  const admins = await prisma.admin.findMany({
    where: includeDeleted ? {} : { deletedAt: null },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(admins);
}

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = createAdminSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { email, firstName, lastName } = validation.data;

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    return NextResponse.json(
      { error: 'An admin with this email already exists' },
      { status: 409 }
    );
  }

  const admin = await prisma.admin.create({
    data: {
      email,
      firstName,
      lastName,
    },
  });

  return NextResponse.json(admin, { status: 201 });
}
