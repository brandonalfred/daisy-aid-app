import { NextResponse } from 'next/server';
import { auth } from '@/auth';

// TODO: Remove this bypass before merging
const BYPASS_AUTH = true;

export default auth((req) => {
  const isLoginPage = req.nextUrl.pathname === '/admin-tooling/login';
  const isAuthenticated = BYPASS_AUTH || !!req.auth;

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
