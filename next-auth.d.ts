/// <reference types="next-auth" />
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            login?: string | null;
            first_name?: string | null;
            last_name?: string | null;
            profile_photo?: string | null;
        } & DefaultSession["user"];
    }

    interface JWT {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        login?: string | null;
        first_name?: string | null;
        last_name?: string | null;
        profile_photo?: string | null;
    }

    interface User {
        id: string;
        first_name?: string | null;
        last_name?: string | null;
        profile_photo?: string | null;
    }
}
export { NextAuth };

