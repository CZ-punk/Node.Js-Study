require('dotenv').config();
const express = require('express');
const app = express();


const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');

app.use(compression());
app.use(helmet());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

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
app.use(flash());

var authData = {
    email: 'choi',
    password: 'hyun',
    nickname: 'monkey'
}

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {

    console.log('serializeUser', user);
    done(null, user.email);
  });
  
passport.deserializeUser(function(id, done) {

    console.log('deserializeUser', id);
    done(null, authData);
  });

passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function (username, password, done) {
      console.log('LocalStrategy', username, password);

        if (username != authData.email) {
            console.log('wrong email')
            return done(null, false, { message: 'Incorrect email.'}); 
        } else if (password != authData.password) {
            console.log('wrong password')
            return done(null, false, { message: 'Incorrect password.'});
        } else {
            console.log('ok')
            return done(null, authData);
        }
    }
  ));

app.post('/auth/login_process', passport.authenticate('local', {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true
}));

app.get('/flash', (req, res) => {

    req.flash('info', 'Flushed!');
    res.send('flash');
})

app.get('/flash-display', (req, res) => {
    var fmsg = req.flash();
    console.log(fmsg);
    res.send(fmsg);
    // res.render('index', { message: req.flash('info') });
    
})

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

store.on('error', function (error) {
    console.log(error);
    console.log(process.env.LOCAL_HOST)
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});