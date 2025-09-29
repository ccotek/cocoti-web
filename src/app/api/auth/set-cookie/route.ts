import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
    }

    // Créer la réponse avec le cookie
    const response = NextResponse.json({ success: true });
    
    // Définir le cookie
    response.cookies.set('admin_token', token, {
      path: '/',
      maxAge: 60 * 60 * 24, // 24 heures
      httpOnly: false, // Accessible côté client
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    return response;
  } catch (error) {
    console.error('Erreur lors de la définition du cookie:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
