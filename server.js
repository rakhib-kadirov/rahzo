const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const next = require("next");
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient()
const app = express()
const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

// TypeError: Cannot read properties of undefined (reading 'findFirst')
// 0|server  |     at Socket.<anonymous> (/root/server.js:29:43)


io.on('connection', (socket) => {
    console.log('Пользователь подключился: ', socket.id)

    socket.on('sendMessage', async ({ text, currentUserId, chatId, first_name, last_name, otherUserId }) => {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(currentUserId) }
        })
        if (!user) {
            socket.emit('error', 'Пользователь не найден.')
            return
        }

        const currentChatId = await prisma.chat.findFirst({
            where: {
                id: chatId,
                AND: [
                    { participants: { some: { userId: parseInt(currentUserId) } } },
                    { participants: { some: { userId: parseInt(otherUserId) } } },
                ],
            },
            include: { participants: true, message: true }
        })

        console.log("Отправка сообщения в чат: ", currentChatId.id);
        console.log("Отправляет пользователь: ", user.id);

        const message = await prisma.message.create({
            data: {
                text,
                userId: parseInt(currentUserId),
                chatId: currentChatId.id,
                first_name,
                last_name,
            },
        })
        console.log("Отправка сообщения в чат V_2: ", message.chatId);

        io.emit('newMessage', { ...message, user })
    })

    socket.on('disconnect', () => console.log('Пользователь отключился.'))
})

server.listen(3001, () => console.log('Сервер WebSocket запущен'))