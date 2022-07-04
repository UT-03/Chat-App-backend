const socket = require('socket.io');
const ActiveUser = require('../models/ActiveUser');

const { addActiveUser, removeActiveUser, sendMessage } = require('./socketsControllers');

const addSockets = (server) => {
    const io = socket(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log(socket.id + ' connected');
        socket.on("user active", ({ userId }) => {
            addActiveUser(userId, socket.id);
        });

        socket.on("user inactive", ({ userId }) => {
            removeActiveUser(userId, socket.id);
        });

        socket.on("send-msg", async ({ from, to, text }) => {
            const activeUser = await ActiveUser.findOne({ userId: to });

            if (activeUser) {
                socket.to(activeUser.socketId).emit("msg-recieve", {
                    sender: from,
                    message: {
                        text: text,
                        fromSelf: false
                    }
                });
            }
        })

        socket.on('disconnect', (reason) => {
            console.log(socket.id + ' disconnected');
        })
    });
}

module.exports = {
    addSockets
};