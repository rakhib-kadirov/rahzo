import NextAuth from "next-auth";
// import { NextAuthOptions } from 'next-auth'
// import Credentials from 'next-auth/providers/credentials'

// const NextAuthFn = NextAuth as NextAuthOptions;

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request }: { auth: any, request: Request }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = request.url.includes('/dashboard')

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false
            }
            else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', request.url))
            }
            return true
        }
    },
    // providers: [auth()]
    providers: []
} 
// satisfies typeof NextAuthFn