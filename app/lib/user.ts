// 'use server'

// import { db } from './db'
// import { auth } from '@/auth'

// export async function getUserData() {
//     const session = await auth()

//     if (!session || !session.user) {
//         return null
//     }

//     const [user] = await db.query(
//         'SELECT first_name, last_name, profile_photo FROM users WHERE id = ?',
//         [session.user.id]
//     )

//     return user
// }