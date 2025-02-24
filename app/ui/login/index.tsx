'use client'

import {
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { useActionState, useEffect, useState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn, useSession } from "next-auth/react"

// const API_URL = 'http://localhost:3000/'

interface User {
    id: number;
    first_name: string;
    last_name: string;
    profile_photo: string;
    status: string;
}

export default function Login() {
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

    const [formData, setFormData] = useState({ login: "", password: "" })
    const [message, setMessage] = useState("")

    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined
    )

    return (
        <>
            <h4>Login</h4>
            <form action={formAction}>
                <input
                    id="login"
                    name="login"
                    type="text"
                    placeholder="Логин"
                    value={formData.login}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                    required
                // onChange={e => setLogin(e.target.value)}
                />
                <input
                    id="password"
                    type="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                // value={password}
                // onChange={e => setPassword(e.target.value)}
                />
                <input type="hidden" name='redirect' value={callbackUrl} />
                <button className='bg-blue'>Войти</button>
                <div className="flex h-8 items-end space-x-1" aria-live='polite' aria-atomic='true'>
                    {errorMessage && (
                        <>
                            <ExclamationCircleIcon className='h-5 w-5 text-red-500' />
                            <p className='text-sm text-red-500'>{errorMessage}</p>
                        </>
                    )}
                </div>
            </form>
            {message && <p>{message}</p>}
        </>
    )
}