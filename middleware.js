// import { updateSession } from './lib/supabase/middleware'

// export async function middleware(request) {
//   return await updateSession(request)
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for:
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - any files with extensions (svg, png, jpg, etc.)
//      */
//     '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// }

import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // 1. Check if the user is trying to reach the Dashboard
  const isOnDashboard = nextUrl.pathname.startsWith('/Dashboard');

  // 2. The Logic: If they are on Dashboard but NOT logged in, send them home
  if (isOnDashboard && !isLoggedIn) {
    return Response.redirect(new URL('/', nextUrl));
  }
});

export const config = {
  // 3. The Matcher: This tells Next.js which routes to run this file on.
  // We want it to run on the Dashboard and any sub-pages.
  matcher: ['/Dashboard/:path*'], 
};