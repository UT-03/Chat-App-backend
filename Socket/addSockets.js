const socket = require('socket.io');
const ActiveUser = require('../models/ActiveUser');

const { addActiveUser, removeActiveUserByUserId, sendMessage, removeActiveUserBySocketId } = require('./socketsControllers');

const addSockets = (server) => {
    const io = socket(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        socket.on("user active", ({ userId }) => {
            addActiveUser(userId, socket.id);
        });

        socket.on("user inactive", ({ userId }) => {
            removeActiveUserByUserId(userId, socket.id);
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

        socket.on('disconnect', () => {
            removeActiveUserBySocketId(socket.id);
        })
    });
}

module.exports = {
    addSockets
};