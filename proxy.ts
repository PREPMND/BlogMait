import { NextRequest, NextResponse } from "next/server";
import {getSessionCookie} from "better-auth/cookies"
const protectedRoutes=['/profile','/post/create','/post/edit'];

export async function proxy(request :NextRequest){
    const path=request.nextUrl.pathname;

    const session =getSessionCookie(request)

    const isProtectedRoute =protectedRoutes.some((route)=> path.startsWith(route))

    if(isProtectedRoute && !session){
        return NextResponse.redirect(new URL('/auth',request.url))
    }

    if(path==='/auth' && session){
        return NextResponse.redirect(new URL('/',request.url))
    }

    return NextResponse.next()
}

export const config={
    matcher:['/post/create','/auth','/profile/:path*','/post/edit/:path*']
}