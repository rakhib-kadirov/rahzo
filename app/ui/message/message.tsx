'use client'

import { Suspense, useEffect, useState } from "react";
import Search from "../search";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";
import { format } from "date-fns"
import '../global.css'
// import { PrismaClient } from "@prisma/client";
// import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";
// import { StaticImport } from "next/dist/shared/lib/get-img-props";

// const prisma = new PrismaClient()

// const socket = io('http://localhost:3001', {
//     path: '/api/socket.io',
//     transports: ['websocket']
// })

interface Message {
    id: number;
    userId: number;
    text: string;
    createdAt: string;
    first_name: string;
    last_name: string;
    profile_photo: string;
}

// const socket: Socket = io("ws://localhost:3001/")
const socket: Socket = io("wss://node.rahzo.ru:443", { path: "/socket.io/", extraHeaders: { origin: 'Access-Control-Allow-Origin' } })
// socket = io("http://26.137.137.103:3001")

interface User {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
}

interface Message {
    id: number;
    text: string;
    createdAt: string;
}

interface Chat {
    id: number;
    createdAt: string;
    participants: {
        chatId: number;
        userId: number;
        user: {
            id: number;
            text: string;
            userId: number;
            createdAt: string;
            first_name: string;
            last_name: string;
            profile_photo: string;
        }
    };
    message: {
        id: number;
        text: string[];
        userId: number;
        createdAt: string;
        first_name: string;
        last_name: string;
        profile_photo: string;
    }
}

export default function Message() {
    const [messages, setMessages] = useState<Message[]>([])
    const [chats, setChats] = useState<Chat[]>([])
    const [text, setText] = useState("");

    const { data: session } = useSession()
    const user = session?.user as User
    const currentUserId = user?.id
    const first_name = user?.first_name
    const last_name = user?.last_name

    const searchParams = useSearchParams()
    const otherUserId = searchParams.get('otherUserId');

    useEffect(() => {
        if (!currentUserId || !otherUserId) return;

        const fetchData = async () => {
            const response = await fetch(`/api/auth/chats?otherUserId=${otherUserId}&currentUserId=${currentUserId}`)
            if (!response.ok) {
                console.error("Ошибка ответа API: ", response.status);
                return;
            }

            const data: { chat: Chat[] } = await response.json()
            console.log("Чаты: ", data.chat)
            setChats(data.chat)
        }
        fetchData()
    }, [otherUserId, currentUserId])
    console.log('CHATS: ', chats)


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch('/api/auth/messages')
                const response: { messages: Message[] } = await data.json()

                if (Array.isArray(response.messages)) {
                    setMessages(response.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
                } else {
                    console.error("Unexpected data format:", response);
                }

            } catch (error) {
                console.log(error)
            }
        }
        fetchData()

        socket.on('newMessage', (message) => {
            setMessages((prev) => [...prev, message])
        })

        return () => { socket.off('newMessage') }
    }, [])

    const sendMessage = () => {
        socket.emit('sendMessage', { text, currentUserId, first_name, last_name, otherUserId })
        setText('')
    }

    return (
        <>
            <div className="w-3/4 md:w-full">
                {/* <section className="flex flex-col"> */}
                <div className="flex flex-row box-content h-[calc(100vh-50px)] md:px-6">
                    <div className="w-2/5 md:hidden lg:block p-6 pt-0">
                        <div className="bg-white shadow-md">
                            <h3 className="text-lg font-semibold">Чаты</h3>
                            <Suspense fallback={<div>Загрузка...</div>}>
                                <Search />
                            </Suspense>
                        </div>
                        Другие
                        {chats.map((Chat) => {
                            const participantsArray = Array.isArray(Chat.participants) ? Chat.participants : [Chat.participants];
                            const messagesArray = Array.isArray(Chat.message) ? Chat.message : [Chat.message];
                            const currentDate = format(new Date(Chat.createdAt), 'H:mm')
                            return (
                                <div key={Chat.message.id}>
                                    <div className={clsx(
                                        "relative bg-red-300 rounded-[8px] min-w-[60px] min-h-[60px] gap-2 pl-[8px] pr-[8px] pt-[4px] pb-[4px] text-left",
                                    )}>
                                        <div className="grid gap-2">
                                            <strong className="text-[14px]">
                                                {/* {participants.user?.id.toString() !== currentUserId ? <span>{participants.user?.first_name} {participants.user?.last_name}</span> : ''} */}
                                                {participantsArray.map(part => (<span>{part.user?.id.toString() !== currentUserId ? <span>{part.user?.first_name} {part.user?.last_name}</span> : ''}</span>))}
                                            </strong>
                                            {messagesArray.length > 0 && (
                                                <div className="flex">
                                                    <div className="pr-[40px] max-w-[300px]">
                                                        <p>{messagesArray[messagesArray.length - 1]?.text}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <span className="absolute bottom-[2px] right-[8px] text-[12px]">
                                            {currentDate}
                                        </span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="grid w-full">
                        {chats.map((Chat) => {
                            // console.log('userId: ', Chat.message.userId)
                            return (
                                <div key={Chat.id} className="grid gap-3 p-[10px] scroll-smooth overflow-y-auto bg-red-200 chat-container">
                                    {/* {messages.map((msg) => {return (<div></div>)})} */}
                                    <div className="inline-block w-full ">
                                        {(Array.isArray(Chat.message) ? Chat.message : []).map((chat: { id: number; text: string; userId: number; createdAt: string; first_name: string; last_name: string; profile_photo: string; }) => {
                                            const currentDate = format(new Date(chat.createdAt), 'H:mm')
                                            console.log('USER_ID_CHAT_MSG: ', chat.userId)
                                            return (
                                                <div key={chat.id}>
                                                    <div id="blockRight" className={chat.userId.toString() === session?.user?.id ? "text-right" : "text-left"}>
                                                        <div className={clsx(
                                                            "inline-flex items-end gap-3",
                                                            {
                                                                "flex-row-reverse": chat.userId.toString() === session?.user?.id
                                                            }
                                                        )}>
                                                            <div className="h-full items-end">
                                                                <Image
                                                                    className="rounded-full w-[40px] h-[40px]"
                                                                    src={chat.profile_photo ? chat.profile_photo : "/stock.png"}
                                                                    alt=""
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            </div>
                                                            <div className={clsx(
                                                                "relative bg-red-300 rounded-[8px] min-w-[60px] min-h-[60px] gap-2 pl-[8px] pr-[8px] pt-[4px] pb-[4px] text-left",
                                                            )}>
                                                                <div className="grid gap-2">
                                                                    <strong className="text-[14px]">{chat.first_name}</strong>
                                                                    <div className="flex">
                                                                        <div className="pr-[40px] max-w-[300px]">
                                                                            <p>{chat.text}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <span className="absolute bottom-[2px] right-[8px] text-[12px]">{currentDate}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                        <div className="flex items-center gap-2 p-2 bg-white border-t shadow-md md:mb-[36px]">
                            <input
                                className="flex-grow p-2 border rounded-lg"
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Напишите сообщение..."
                            />
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={sendMessage}>
                                Отправить
                            </button>
                        </div>
                    </div>
                </div>
                {/* </section> */}
            </div>
        </>
    )
}