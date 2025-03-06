// import NextAuth from "next-auth";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const NextAuthFn = NextAuth as unknown as (options: typeof authConfig) => { auth: any };
export default NextAuthFn(authConfig).auth;

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}