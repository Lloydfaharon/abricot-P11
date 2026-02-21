// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Définir les routes publiques (ne nécessitant pas de connexion)
    const publicRoutes = ['/login', '/register', '/'];
    const publicApiRoutes = ['/api/auth/login', '/api/auth/register'];

    const isPublicRoute = publicRoutes.includes(pathname) || publicApiRoutes.includes(pathname);

    // 1. Si l'utilisateur n'est pas connecté et tente d'accéder à une route protégée
    if (!token && !isPublicRoute) {
        if (pathname.startsWith('/api/')) {
            return NextResponse.json({ message: 'Authentification requise' }, { status: 401 });
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Si l'utilisateur est connecté et essaie d'accéder aux pages de login/register
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Le matcher inclut tout SAUF les fichiers statiques et images
    // Correction audit 4.2 : on n'exclut plus /api
    matcher: ['/((?!_next/static|_next/image|favicon.ico|images).*)'],
};