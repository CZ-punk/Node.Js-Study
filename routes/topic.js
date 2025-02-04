const express = require('express');
const router = express.Router();
const topic = require('../lib/topic');

router.get('/*', (req, res, next) => {
  console.log(`Topic Request! request Time: ${new Date()}`)
  next();
})

router.get('/create', (req, res) => {
    topic.create(req, res);
})
  
router.post('/create_process', (req, res) => {
    topic.create_process(req, res);
})

router.get('/update/:topicId', (req, res, next) => {
    topic.update(req, res, next);
})

router.post('/update_process', (req, res) => {
    topic.update_process(req, res);
})

router.get('/:topicId', (req, res) => { 
    topic.page(req, res);
})

router.post('/delete/:topicId', (req, res) => {
    topic.delete_process(req, res);
})

router.use((err, req, res, next) => {
    console.error(err.stack);

    if (err.message.startsWith('400')) res.status(400).json({
        message: err.message.slice(5).trim()
    });

    else if (err.message.startsWith('500')) res.status(500).json({
        message: err.message.slice(5).trim()
    });
})

module.exports = router;