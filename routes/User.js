const express = require('express');
const { getAllUsers, sendMessage, getMessages } = require('../controllers/User');
const checkAuth = require('../middlewares/checkAuth');

const router = express.Router();

router.get('/', checkAuth, getAllUsers);

router.post('/send-message', checkAuth, sendMessage);

router.get('/messages/:userId', checkAuth, getMessages);

module.exports = router;