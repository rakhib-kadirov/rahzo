'use client'

import { useEffect, useState } from "react";
import Search from "../search";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Image from "next/image";
import { format } from "date-fns"

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

const socket: Socket = io("http://31.130.148.174:8001")
// socket = io("http://26.137.137.103:3001")

interface User {
    id: string;
    first_name?: string | null;
    last_name?: string | null;
}

interface Message {
    id: number;
    text: string;
    createdAt: string; // или Date, если уже приходит как Date
}

export default function Message() {
    // const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [text, setText] = useState("");

    const { data: session } = useSession()
    const user = session?.user as User
    const userId = user?.id
    const first_name = user?.first_name
    const last_name = user?.last_name


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
        socket.emit('sendMessage', { text, userId, first_name, last_name })
        setText('')
    };

    // const messageEndRef = useRef(null)
    // useEffect(() => {
    //     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    // }, [messages])

    return (
        <>
            <div className="w-3/4">
                {/* <section className="flex flex-col"> */}
                <div className="flex flex-row box-content h-[calc(100vh-50px)] w-full">
                    <div className="w-2/5">
                        <div className="bg-white shadow-md">
                            <h3 className="text-lg font-semibold">Чаты</h3>
                            <Search />
                        </div>
                        Другие
                    </div>
                    <div className="grid w-full">
                        <div className="grid gap-3 p-[10px] scroll-smooth overflow-y-auto bg-red-200">
                            {messages.map((msg) => {
                                const currentDate = format(msg.createdAt, 'H:mm')
                                return (
                                    <div className="inline-block w-full" key={msg.id}>
                                        <div id="blockRight" className={msg.userId.toString() === session?.user?.id ? "text-right" : "text-left"}>
                                            <div className={clsx(
                                                "inline-flex items-end gap-3",
                                                {
                                                    "flex-row-reverse": msg.userId.toString() === session?.user?.id
                                                }
                                            )}>
                                                <div className="h-full items-end">
                                                    <Image
                                                        className="rounded-full w-[40px] h-[40px]"
                                                        src={msg.profile_photo ? msg.profile_photo : "/stock.png"}
                                                        alt=""
                                                        width={40}
                                                        height={40}
                                                    />
                                                </div>
                                                <div className={clsx(
                                                    "relative bg-red-300 rounded-[8px] min-w-[60px] min-h-[60px] gap-2 pl-[8px] pr-[8px] pt-[4px] pb-[4px] text-left",
                                                )}>
                                                    <div className="grid gap-2">
                                                        <strong className="text-[14px]">{msg.first_name}</strong>
                                                        <div className="flex">
                                                            <div className="pr-[40px] max-w-[300px]">
                                                                <p>{msg.text}</p>
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
                        <div className="flex items-center gap-2 p-2 bg-white border-t shadow-md">
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