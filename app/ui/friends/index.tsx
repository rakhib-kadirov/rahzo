import Image from 'next/image'
// import { fetchFilteredInvoices } from '@/app/lib/data';
import { useEffect, useState } from 'react';
import { plusJakarta } from '@/app/ui/fonts'

// const friends = [
//     {
//         name: 'Name2 Name2',
//         href: 'https://vk.com/rahakadir',
//         url: '/customers/amy-burns.png'
//     },
//     {
//         name: 'Name3 Name3',
//         href: 'https://vk.com/rahakadir',
//         url: '/customers/amy-burns.png'
//     },
//     {
//         name: 'Name4 Name4',
//         href: 'https://vk.com/rahakadir',
//         url: '/customers/amy-burns.png'
//     },
// ]

interface User {
    id: number;
    login: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
    status: string;
}

const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

export default function Friends() {
    const [users, setUsers] = useState<User[]>([])
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch('/api/auth/users')
                const response = await data.json()

                if (Array.isArray(response.users)) {
                    setUsers(response.users);
                } else {
                    console.error("Unexpected data format:", response);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])

    return (
        <main className={`${plusJakarta.className} grid gap-4`}>
            <h4 className='text-[16px] font-semibold text-gray-700'>Друзья</h4>
            {Array.isArray(users) && users.length > 0 ? (
                users.map(user => {
                    return (
                        <div key={user.id} className='flex items-center max-w-[191px]'>
                            <div className='flex justify-center'>
                                <Image
                                    src={user.profile_photo !== "" ? "/stock.png" : user.profile_photo}
                                    className="mr-2 rounded-full w-10 h-10 min-w-10 min-h-10"
                                    width={32}
                                    height={32}
                                    alt='profile picture'
                                />
                            </div>
                            <div className='grid'>
                                <div className='flex'>
                                    <p className="flex text-sm font-semibold text-gray-700">{user.first_name} {truncateText(user.last_name, 10)}</p>
                                </div>
                                <p className="text-[14px] text-[#475569]">{user.login.toLowerCase()}</p>
                            </div>
                        </div>
                    )
                })) : (
                <p>У Вас пока нет друзей :(</p>
            )}
        </main>
    )
}