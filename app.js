require('dotenv').config();
const express = require('express');

const app = express();
const compression = require('compression');
const helmet = require('helmet');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const mongoURI = `mongodb://${process.env.LOCAL_MONGODB_USER}:${process.env.LOCAL_MONGODB_PWD}@${process.env.LOCAL_HOST}:${process.env.LOCAL_MONGODB_PORT}/${process.env.LOCAL_MONGODB_DB}?authSource=admin`;
const sessionSecret = process.env.SESSION_SECRETKEY;
const sessionDuration = 1000 * 60 * 60; // 1 hour
const store = new MongoDBStore({
    uri: mongoURI,
    collection: process.env.SESSION_COLLECTION,
    expiresKey: sessionSecret,
    expiresAfterSeconds: sessionDuration / 1000 // seconds
});

app.use(session({
    secret: sessionSecret,
    // secure: true,   // https 에서만 session 정보를 주고 받게 하는 옵션
    // httpOnly: true, // Js 를 통해서 session cookie 를 사용할 수 없게 하는 옵션
    store: store,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: sessionDuration // 1 hour
    }
}));


var authData = {
    email: 'choi',
    password: 'hyun',
    nickname: 'monkey'
}

const passport = require("passport"),
    LocalStrategy = require("passport-local").Strategy;

passport.use(
    new LocalStrategy(
        { usernameField: "email", passwordField: "password" },
        (username, password, done) => {
            console.log('LocalStrategy ', username, password);

            if (username != authData.email) {
                console.log(1);
                done(null, false, { message: "Incorrect email." });
            } else if (password != authData.password) {
                console.log(2);
                done(null, false, { message: "Incorrect password." });
            } else {
                console.log(3);
                done(null, authData);
            }
        }
    )
);

app.post('/auth/login_process', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/auth/login"
}));

store.on('error', function (error) {
    console.log(error);

    console.log(process.env.LOCAL_HOST)
});

app.use(compression());
app.use(helmet());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {

    console.log(`Server is running on port ${PORT}`);
});