import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { authConfig } from '@/config/auth';

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|bmp|tiff|woff|woff2|ttf|eot|otf|css|scss|sass|less|js|mjs|pdf|doc|docx|txt|md|zip|rar|7z|tar|gz|mp3|mp4|avi|mov|wav|flac)$|sitemap\\.xml|robots\\.txt|manifest\\.json|sw\\.js|workbox-.*\\.js).*)',
    ],
};

const authCookieNames = ['better-auth.session_token', '__Secure-better-auth.session_token'];

const hasAuthCookie = (request: NextRequest) =>
    authCookieNames.some((name) => request.cookies.has(name));

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 需要认证的页面路由
    const protectedRoutes = authConfig.protectedPages;
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
        return authPageProtectedHandler(request);
    }
    if (pathname.startsWith('/auth/login')) {
        return authSignInHandler(request);
    }

    // 默认处理
    return NextResponse.next();
}
// 认证路由处理函数
const authPageProtectedHandler = (request: NextRequest) => {
    if (!hasAuthCookie(request)) {
        // 创建登录URL并添加回调参数
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname + request.nextUrl.search);
        return NextResponse.redirect(loginUrl);
    }

    // 用户已认证，继续处理请求
    return NextResponse.next();
};

const authSignInHandler = (request: NextRequest) => {
    if (hasAuthCookie(request)) {
        const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
        const redirectUrl = new URL(callbackUrl ?? '/', request.url);

        return NextResponse.redirect(redirectUrl);
    }

    return NextResponse.next();
};
