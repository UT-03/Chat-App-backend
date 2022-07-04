const mongoose = require('mongoose');

const activeUsersSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User', unique: true },
    socketId: { type: String, required: true }
});

module.exports = mongoose.model('Active User', activeUsersSchema);