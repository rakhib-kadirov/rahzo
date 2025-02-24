import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            login: string;
            first_name: string;
            last_name: string;
            profile_photo: string;
        } & DefaultSession["user"];
    }

    interface JWT {
        id: string;
        login: string;
        first_name: string;
        last_name: string;
        profile_photo: string;
    }
}
