import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { adminSeedSchema } from '@/lib/validations/admin';

export async function POST(request: Request): Promise<Response> {
  const expectedToken = process.env.ADMIN_SEED_SECRET;
  if (!expectedToken) {
    return NextResponse.json(
      { error: 'ADMIN_SEED_SECRET not configured' },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const result = adminSeedSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    );
  }

  const { email, firstName, lastName } = result.data;

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });
  if (existingAdmin) {
    return NextResponse.json(
      { error: 'Admin with this email already exists' },
      { status: 409 }
    );
  }

  const admin = await prisma.admin.create({
    data: { email, firstName, lastName },
  });

  return NextResponse.json({
    success: true,
    admin: {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
    },
  });
}
