const express = require('express')
const router = express.Router()
const topic = require('../lib/topic')

router.get('/login', (req, res) => {
    topic.login(req, res);
})

// router.post('/login_process', (req, res) => {
//     topic.login_process(req, res);
// })

router.get('/logout', (req, res) => {
    topic.logout(req, res);
})

module.exports = router;