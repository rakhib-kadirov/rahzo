'use client'

import { User } from '@/app/lib/definitions';
import {
    FaceSmileIcon,
    MicrophoneIcon
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';

export default function WritePost() {
    const { data: session } = useSession()
    const user = session?.user as User
    const [formData, setFormData] = useState({ users_id: user?.id, body_text: "", date: Date })
    const [message, setMessage] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/auth/userPosts', {
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

            // setMessage(`Пост опубликован успешно! ID поста: ${result.postId}, ${result.date}`)
            alert(`Пост опубликован успешно!`)
            window.location.reload()
        }
        catch (error) {
            console.error('Ошибка при публикации:', error)
            setMessage('Что-то пошло не так. Попробуйте снова.')
        }
    }

    // const [users, setUsers] = useState()
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const data = await fetch('/api/auth/posts')
    //             const response = await data.json()

    //             if (Array.isArray(response.users)) {
    //                 setUsers(response.users);
    //             } else {
    //                 console.error("Unexpected data format:", response);
    //             }
    //         } catch (error) {
    //             console.log(error)
    //         }
    //     }
    //     fetchData()
    // }, [])

    return (
        <main className='w-full'>
            <div>
                <form onSubmit={handleSubmit}>
                    <div className='flex'>
                        <input
                            className="border-0 rounded-full w-full"
                            id="body_text"
                            name="body_text"
                            type="text"
                            placeholder="О чём хотите поделиться?"
                            value={formData.body_text}
                            onChange={(e) => setFormData({ ...formData, body_text: e.target.value })}
                            required
                        />
                    </div>
                    <div className='flex flex-row-reverse'>
                        <div className='flex pt-4 space-x-2'>
                            <button className='border rounded-full w-10 h-10 justify-center justify-items-center'>
                                <FaceSmileIcon width={24} height={24} />
                            </button>
                            <button className='border rounded-full w-10 h-10 justify-center justify-items-center'>
                                <MicrophoneIcon width={24} height={24} />
                            </button>
                            {/* <div className='flex'> */}
                            <button type='submit' className='flex items-center border rounded-3xl px-5 w-auto h-10 justify-center justify-items-center bg-blue-700 text-white'>
                                <span className='mr-[12]'>Опубликовать</span>
                                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.2701 8.63128L3.14038 1.1391C2.86355 0.984025 2.54607 0.916912 2.23017 0.946682C1.91427 0.976453 1.61491 1.1017 1.37193 1.30575C1.12894 1.50981 0.953842 1.78301 0.869916 2.08901C0.78599 2.39501 0.797217 2.71932 0.902103 3.01878L3.25992 10L0.902103 16.9813C0.819209 17.2168 0.793963 17.4688 0.828479 17.716C0.862996 17.9633 0.956269 18.1987 1.10049 18.4025C1.2447 18.6064 1.43567 18.7727 1.65737 18.8875C1.87908 19.0023 2.12508 19.0623 2.37476 19.0625C2.64326 19.062 2.90713 18.9926 3.14117 18.861L3.1482 18.8563L16.2732 11.3508C16.5138 11.2146 16.714 11.0169 16.8533 10.7781C16.9926 10.5392 17.066 10.2676 17.066 9.99105C17.066 9.71452 16.9926 9.44294 16.8533 9.20405C16.714 8.96515 16.5138 8.76751 16.2732 8.63128H16.2701ZM2.93648 16.8172L4.92242 10.9375H9.24976C9.4984 10.9375 9.73686 10.8388 9.91267 10.6629C10.0885 10.4871 10.1873 10.2487 10.1873 10C10.1873 9.75139 10.0885 9.51294 9.91267 9.33712C9.73686 9.16131 9.4984 9.06253 9.24976 9.06253H4.92242L2.9357 3.18128L14.8701 9.99144L2.93648 16.8172Z" fill="white" />
                                </svg>
                            </button>
                            {/* </div> */}
                        </div>
                    </div>
                </form>
                {message && <p>{message}</p>}
            </div>
        </main>
    )
}