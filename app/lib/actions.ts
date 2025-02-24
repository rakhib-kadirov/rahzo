'use server'

import { sql } from '@vercel/postgres'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { AuthError } from 'next-auth'
import { signIn, signOut } from '@/auth'
import { db } from './db'

const FormSchema = z.object({
    id: z.number(),
    login: z.string(),
    password: z.string(),
    first_name: z.string(),
    last_name: z.string(),
    profile_photo: z.string(),
})

// const CreateProfile = FormSchema.omit({ id: true, login: true, first_name: true, last_name: true, profile_photo: true })
// const UpdateProfile = FormSchema.omit({ id: true, login: true, first_name: true, last_name: true, profile_photo: true })

export type State = {
    errors?: {
        id?: string[];
        login?: string[];
        first_name?: string[];
        last_name?: string[];
        profile_photo?: string[]
    }
    message?: string | null
}

// export async function createProfile(formData: FormData) {
//     const validatedFields = FormSchema.safeParse({
//         id: formData.get('id'),
//         login: formData.get('login'),
//         password: formData.get('password'),
//         first_name: formData.get('first_name'),
//         last_name: formData.get('last_name'),
//         profile_photo: formData.get('profile_photo'),
//     })

//     if (!validatedFields.success) {
//         return {
//             errors: validatedFields.error.flatten().fieldErrors,
//             message: 'Missing Fields. Failed to Create Invoice.'
//         }
//     }

//     const { id, login, password, first_name, last_name, profile_photo } = validatedFields.data

//     try {
//         await sql`
//             INSERT INTO users (id, login, password, first_name, last_name, profile_photo)
//             VALUES (${id}, ${login}, ${password}, ${first_name}, ${last_name}, ${profile_photo})
//         `
//     } catch (error) {
//         return {
//             message: 'Database Error: Failed to Create Invoice.',
//         };
//     }

//     revalidatePath('/dashboard')
//     redirect('/dashboard')
// }

export async function updateProfile(prevState: string | undefined, formData: FormData) {
    const validatedFields = FormSchema.safeParse({
        id: formData.get('id'),
        login: formData.get('login'),
        password: formData.get('password'),
        first_name: formData.get('first_name'),
        last_name: formData.get('last_name'),
        profile_photo: formData.get('profile_photo'),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Profile.'
        }
    }

    const { id, login, password, first_name, last_name, profile_photo } = validatedFields.data

    try {
        await db.query(`
            UPDATE users
            SET login = ${login}, password = ${password} first_name = ${first_name}, last_name = ${last_name}, profile_photo = ${profile_photo}
            WHERE id = ${id}
        `)
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Profile.',
        };
    }

    revalidatePath('/dashboard/profile')
    redirect('/dashboard/profile')
}

export async function deleteInvoice(id: string) {
    try {
        await sql`DELETE FROM users WHERE id = ${id}`
        revalidatePath('/dashboard/profile')
        return { message: 'Deleted Invoice' }
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }
}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData
) {
    const data = {
        login: formData.get('login') as string,
        password: formData.get('password') as string,
    }
    try {
        await signIn('credentials', {
            ...data,
            redirect: true,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.'
                default:
                    return 'Something went wrong.'
            }
        }
        throw error
    }
}

export async function serverSignOut() {
    await signOut({ redirectTo: "/login" });
}