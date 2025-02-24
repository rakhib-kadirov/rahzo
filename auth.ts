import NextAuth, { JWT, Session } from "next-auth";
// import { authConfig } from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";
import { sql } from "@vercel/postgres";
import type { User } from '@/app/lib/definitions'
import bcrypt from 'bcrypt'
import { db } from '@/app/lib/db'
import { createSession } from "./app/lib/session";
import { redirect } from "next/navigation";

// export async function registerUser(login: string, password: string, first_name: string, last_name: string) {
//     try {
//         if (!login || !password || password.length < 6) {
//             throw new Error("Некорректные данные для регистрации.")
//         }

//         // User found
//         const [existingUser] = await db.query(
//             "SELECT * FROM users WHERE login = ?",
//             [login]
//         )
//         if ((existingUser as any[]).length > 0) {
//             throw new Error("Пользователь с таким логином уже существует.")
//         }

//         // password hash
//         const hashedPassword = await bcrypt.hash(password, 10)

//         const [result] = await db.query(
//             "INSERT INTO users (login, password, first_name, last_name) VALUES (?, ?, ?, ?)",
//             [login, hashedPassword, first_name, last_name]
//         )

//         return {
//             success: true,
//             userId: (result as any).insertId
//         }
//     } catch (error: any) {
//         console.error("Ошибка регистрации!", error.message)

//         return {
//             success: false,
//             error: error.message
//         }
//     }
// }

interface CustomUser {
    id: string;
    login: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
}

async function getUser(login: string): Promise<User | undefined> {
    try {
        console.log('Login: ', login)
        const [user] = await db.query(`SELECT * FROM users WHERE login = ?`, [login])
        console.log('Fetched user from database: ', user); // Логирование полученного пользователя

        if (!Array.isArray(user) || user.length === 0) {
            return undefined;
        }

        console.log('USER: ', user[0])
        return user[0] as User
    } catch (error) {
        console.error('Failed to fetch user: ', error)
        throw new Error('Failed to fetch user.')
    }
}

export const authConfig = ({
    // ...authConfig,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                login: { label: "Login", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.login || !credentials?.password) {
                    throw new Error("Не переданы учетные данные");
                }

                console.log("Credentials received: ", credentials.login, credentials.password);  // Логирование данных
                // if (credentials === null) return null

                // try {
                //     const user = getUser(credentials?.login as string)

                //     if (user) {
                //         const isMatch = user?.password === credentials?.password
                //         if (isMatch) {
                //             return user
                //         }
                //         else {
                //             throw new Error ('Check your password!')
                //         }
                //     }
                //     else {
                //         throw new Error ('User not found.')
                //     }
                // } catch (error) {
                //     throw new Error('Error.')
                // }
                const parsedCredentials = z
                    .object({ login: z.string().min(3), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {

                    const { login, password } = parsedCredentials.data;
                    console.log("Parsed credentials: ", parsedCredentials.data);  // Логирование после парсинга

                    const user = await getUser(login)
                    if (!user) {
                        console.log('User not found')
                        return null
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password)
                    if (!passwordsMatch) {
                        console.log('Password mismatch');
                        return null; // Пароль не совпал
                    }

                    // await createSession(user.id)
                    // redirect('/dashboard')
                    console.log("Returning user from authorize: ", user)
                    return {
                        id: user.id,
                        login: user.login,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        profile_photo: user.profile_photo,
                    }
                    // return user
                }

                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET || "fallback_secret",
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: "/login",
        error: "/login"
    },
    callbacks: {
        async jwt({ token, user }: { token: JWT; user?: User }) {
            // console.log("JWT CALLBACK - Before:", token);
            // console.log("JWT CALLBACK - User:", user);

            if (user) {
                const customUser = user as CustomUser
                token.id = customUser.id
                token.login = customUser.login
                token.first_name = customUser.first_name
                token.last_name = customUser.last_name
                token.profile_photo = customUser.profile_photo
            }

            // console.log("JWT CALLBACK - After:", token);
            return token
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            // console.log("SESSION CALLBACK - Token:", token);
            // if (token) {
            //     const [rows]: any = await db.query('SELECT id, login, first_name, last_name, profile_photo FROM users WHERE login = ?', [token.login])
            //     if (rows && rows.length > 0) {
            //         session.user = rows[0]
            //     }
            //     // session.user.id = user.id as string
            //     // session.user.email = user.email as string
            //     // session.user.name = user.name as string
            // }
            (session.user as any) = {
                ...session.user,
                id: token.id as string,
                login: token.login as string,
                first_name: token.first_name as string,
                last_name: token.last_name as string,
                profile_photo: token.profile_photo as string,
            };

            // console.log("SESSION CALLBACK - Session:", session);
            return session
        },
    },
    debug: true
})

export const { auth, signIn, signOut } = NextAuth(authConfig)