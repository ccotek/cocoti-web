import { NextRequest, NextResponse } from 'next/server';

export function adminMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Vérifier si c'est une route CMS
  if (pathname.startsWith('/cms') && pathname !== '/cms/login') {
    // Vérifier le token d'authentification
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      // Rediriger vers la page de connexion CMS
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }
    
    // TODO: Vérifier la validité du token avec le backend
    // Pour l'instant, on accepte tout token non vide
    if (!token || token.length < 10) {
      return NextResponse.redirect(new URL('/cms/login', request.url));
    }
  }
  
  return NextResponse.next();
}
