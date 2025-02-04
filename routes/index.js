const express = require('express');
const { route } = require('./topic');
const topic = require('../lib/topic');
const router = express.Router();

router.get('/', (req, res) => { 
    topic.home(req, res);
})

module.exports = router;