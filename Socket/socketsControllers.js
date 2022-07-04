const ActiveUser = require("../models/ActiveUser");


const addActiveUser = async (userId, socketId) => {
    try {
        console.log(userId, socketId, 'connected');
        // Checking is user already exists
        let existingUser = await ActiveUser.findOne({ userId: userId });

        // If user with this userId already exists
        if (existingUser)
            existingUser.socketId = socketId;
        else {
            // Else => create a new active user
            existingUser = new ActiveUser({
                userId: userId,
                socketId: socketId
            })
        }

        // Saving active user in DB
        await existingUser.save();
    } catch (err) {
        console.log(err);
    }
};

const removeActiveUser = async (userId, socketId) => {
    try {
        console.log(userId, socketId, 'disconnected');
        // Checking if there is any existing active user with the given userId
        let existingUser = await ActiveUser.findOne({ userId: userId });

        // If user does not exist => simply return the function
        if (!existingUser)
            return;

        // Else => remove active User
        await existingUser.remove();
    } catch (err) {
        console.log(err);
    }
};

const sendMessage = async (from, to, text, socket) => {
    const activeUser = await ActiveUser.findOne({ userId: to });

    if (activeUser) {
        socket.to(activeUser.socketId).emit("msg-recieve", {
            message: {
                text: text,
                fromSelf: false
            }
        });
    }
};

module.exports = {
    addActiveUser,
    removeActiveUser,
    sendMessage
}