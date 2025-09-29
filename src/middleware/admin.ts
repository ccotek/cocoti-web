import { NextRequest, NextResponse } from 'next/server';

export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une route admin
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Vérifier le token d'authentification
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      // Rediriger vers la page de connexion
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    
    // Vérifier la validité du token (simulation)
    if (token !== 'fake-admin-token') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}
