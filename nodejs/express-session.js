var express = require('express')
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

var app = express()


const mongoURI = 'mongodb://root:1234@localhost:27017/my_mongodb?authSource=admin';
const sessionSecret = 'Secret Cat';
const sessionDuration = 1000 * 60 * 60; // 1 hour


const store = new MongoDBStore({
    uri: mongoURI,
    collection: 'mySessions',
    expiresKey: sessionSecret,
    expiresAfterSeconds: sessionDuration / 1000 // seconds
});

app.use(session({
    secret: sessionSecret,
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: sessionDuration // 1 hour
    }
}));

store.on('error', function(error) {
    console.log(error);
});

app.get('/', function (req, res, next) {

    console.log(req.session);
    console.log()

    if (req.session.num === undefined) {
        req.session.num = 1;
    } else {
        req.session.num++;
    }

    res.send(`Views: ${req.session.num}`);
})

app.listen(3000)