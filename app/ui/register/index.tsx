'use client'

import { useState, useActionState } from 'react';
import { plusJakarta } from '../fonts';
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '../button';

export default function Register() {
    const [formData, setFormData] = useState({ login: "", password: "", first_name: "", last_name: "" })
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })

            // обрабатываем ответ
            if (!response.ok) {
                const errorData = await response.json()
                setMessage(`Ошибка: ${errorData.error}`)
                return
            }

            const result = await response.json()
            setMessage(`Регистрация прошла успешно! Ваш ID: ${result.userId}}`)
        }
        catch (error) {
            console.error('Ошибка при регистрации:', error)
            setMessage('Что-то пошло не так. Попробуйте снова.')
        }
    }

    return (
        <>
            <form className={`${plusJakarta.className}`} onSubmit={handleSubmit}>
                <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4">
                    <h4 className={`mb-3 text-center text-[16px]`}>Регистрация</h4>
                    <div className="w-full">
                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    placeholder="Введите своё имя"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    required
                                />
                                <ChevronRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    id="last_name"
                                    name="last_name"
                                    type='text'
                                    placeholder="Введите свою фамилию"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    required
                                />
                                <ChevronRightIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                    id="login"
                                    name="login"
                                    type="text"
                                    placeholder="Логин"
                                    value={formData.login}
                                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                                    required
                                // onChange={e => setLogin(e.target.value)}
                                />
                                <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                            </div>
                        </div>
                    </div>
                    <Button type='submit' className="mt-4 w-full">
                        Зарегистрироваться <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
                    </Button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </>
    )
}