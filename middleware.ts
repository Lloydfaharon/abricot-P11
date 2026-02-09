// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // On récupère le token dans les cookies
    const token = request.cookies.get('token')?.value;

    // Définir les routes protégées
    const protectedRoutes = ['/profile', '/dashboard'];

    // Vérifier si l'utilisateur est sur une route protégée
    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        if (!token) {
            // Si pas de token, on redirige vers le login
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Inversement : si on est déjà connecté, on ne doit pas pouvoir retourner sur /login
    if (request.nextUrl.pathname === '/login' && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

// Configurer sur quelles routes le middleware s'applique
export const config = {
    matcher: ['/profile/:path*', '/dashboard/:path*', '/login', '/register'],
};