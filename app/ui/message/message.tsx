'use client'

import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useRef, useState } from "react";
import Search from "../search";
import io, { Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import clsx from "clsx";

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
}

let socket: Socket
socket = io("http://localhost:3001")
// socket = io("http://26.137.137.103:3001")

export default function Message() {
    // const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [text, setText] = useState("");

    const { data: session } = useSession()
    const userId = session?.user?.id
    const first_name = session?.user?.first_name
    const last_name = session?.user?.last_name

    // useEffect(() => {
    //     fetch('/api/auth/messages').then((res) => res.json()).then((data) => {
    //         console.log("Fetched data:", data);
    //         setMessages(data || []);
    //         console.log("Messages:", messages);
    //     }).catch((err) => console.error("Error fetching messages:", err));

    //     socket.on('newMessage', (message) => {
    //         setMessages((prev) => [...prev, message])
    //     })

    //     return () => { socket.off('newMessage') }
    // }, [])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetch('/api/auth/messages')
                const response = await data.json()

                if (Array.isArray(response.messages)) {
                    setMessages(response.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
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
        // if (message.trim()) {
        //     socket.emit('sendMessage', message)
        //     setMessage('')
        // }
    };

    // const messageEndRef = useRef(null)
    // useEffect(() => {
    //     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    // }, [messages])

    return (
        <>
            <div className="h-screen w-3/4 flex flex-col">
                <section className="flex-grow flex flex-col">
                    <div className="bg-white shadow-md flex-shrink-0">
                        <h3 className="text-lg font-semibold">Чаты</h3>
                        <Search />
                    </div>
                    <div className="flex-grow min-h-0 box-content overflow-y-auto bg-red-200 p-4">
                        {messages.map((msg) => (
                            <div className="grid" key={msg.id}>
                                <div className={msg.userId.toString() === session?.user?.id ? "text-right" : "text-left"}>
                                    <strong>{msg.first_name}</strong>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-white border-t shadow-md flex-shrink-0">
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
                </section>
            </div>
        </>
    )
}