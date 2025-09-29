import { NextRequest, NextResponse } from 'next/server';
import { isAdminEnabled, isProtectedRoute } from './config/admin';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Si on accède à la racine, rediriger vers /fr
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/fr', request.url));
  }
  
  // Protection des routes admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Vérifier si l'admin est activé
    if (!isAdminEnabled()) {
      return NextResponse.redirect(new URL('/fr', request.url));
    }
    
    // Vérifier l'authentification
    const token = request.cookies.get('admin_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  // Pour toutes les autres routes, laisser passer
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/fr/:path*', '/en/:path*', '/admin/:path*']
};
