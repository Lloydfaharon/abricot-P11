// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    // Définir les routes publiques (ne nécessitant pas de connexion)
    const publicRoutes = ['/login', '/register', '/'];
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route);

    // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Si l'utilisateur est connecté et essaie d'accéder aux pages de login/register
    if (token && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Matcher toutes les routes sauf :
    // - api (les routes API)
    // - _next/static (fichiers statiques)
    // - _next/image (images optimisées)
    // - favicon.ico (icône du site)
    // - images (dossier public d'images)
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};