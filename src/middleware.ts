import { NextRequest, NextResponse } from 'next/server';
import { isAdminEnabled, isProtectedRoute } from './config/admin';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Si on accède à la racine, rediriger vers /fr
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }
  
  // Rediriger /admin vers /cms (unification des interfaces admin)
  if (pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/cms', request.url));
  }
  
  // Note: On ne nettoie pas l'URL ici car cela peut causer des problèmes avec Next.js
  // Le frontend gérera le nettoyage de l'URL après avoir récupéré le token
  
  // Rediriger les routes inconnues vers l'accueil
  if (!pathname.startsWith('/fr') && !pathname.startsWith('/en') && !pathname.startsWith('/cms') && !pathname.startsWith('/api') && !pathname.startsWith('/_next') && !pathname.startsWith('/favicon') && !pathname.startsWith('/privacy-policy') && !pathname.startsWith('/terms-of-service') && !pathname.startsWith('/legal-notice') && !pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)$/)) {
    return NextResponse.redirect(new URL('/fr', request.url));
  }
  
  // Pour toutes les autres routes, laisser passer
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/fr/:path*', 
    '/en/:path*', 
    '/admin/:path*',
    '/cms/:path*',
    '/privacy-policy',
    '/terms-of-service',
    '/legal-notice',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
};
