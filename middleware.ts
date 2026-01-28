import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === '/admin-tooling/login';
  const isAuthenticated = !!req.auth;

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin-tooling/bookings', req.url));
  }

  if (!isLoginPage && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin-tooling/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin-tooling/:path*'],
};
