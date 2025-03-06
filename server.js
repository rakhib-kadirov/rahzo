const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const next = require("next");
const { PrismaClient } = require('@prisma/client');
const { readFileSync } = require("fs");

// const dev = process.env.NODE_ENV !== "production";
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//     const server = express();
//     const httpServer = http.createServer(server);
//     const io = new Server(httpServer, {
//         cors: { origin: "*" }
//     });

//     io.on("connection", (socket) => {
//         console.log("Пользователь подключился:", socket.id);

//         socket.on("sendMessage", (message) => {
//             io.emit("receiveMessage", message);
//         });

//         socket.on("disconnect", () => {
//             console.log("Пользователь отключился:", socket.id);
//         });
//     });

//     server.all("*", (req, res) => {
//         return handle(req, res);
//     });

//     httpServer.listen(3001, () => {
//         console.log("Сервер работает на http://localhost:3001");
//     });
// });



const prisma = new PrismaClient()
const app = express()
const server = http.createServer(app, {
    cert: readFileSync('cert.pem'),
    // key: readFileSync('path/to/key.pem')
})
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', (socket) => {
    console.log('Пользователь подключился: ', socket.id)

    socket.on('sendMessage', async ({ text, userId, first_name, last_name }) => {
        const user = await prisma.users.findUnique({
            where: { id: parseInt(userId) }
        })
        if (!user) {
            socket.emit('error', 'Пользователь не найден.')
            return
        }

        const message = await prisma.message.create({
            data: {
                text,
                userId: parseInt(userId),
                first_name,
                last_name,
            },
        })

        io.emit('newMessage', { ...message, user })
    })

    socket.on('disconnect', () => console.log('Пользователь отключился.'))
})

server.listen(3001, () => console.log('Сервер WebSocket запущен'))