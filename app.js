var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

 

var index = require('./routes/index'); //allows access  to js , and what has be exported from the js file
var users = require('./routes/users');



var app = express();
//creates the session, prevents error : oauth needs to be used with session, express-session
 var MemoryStore =session.MemoryStore;
    app.use(session({
        name : 'app.sid',
        secret: "1234567890QWERTY",
        resave: true,
        store: new MemoryStore(),
        saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);//module.export router is used here
app.use('/users', users);

var twitterApi = require('node-twitter-api');

var secret={
	  consumer_key: '',
	  consumer_secret: '',
	  access_token_key: '',
	  access_token_secret: ''
}

var twitter = new twitterApi(secret);



var passport = require('passport'),
TwitterStrategy = require('passport-twitter').Strategy;



passport.use(new TwitterStrategy({
    consumerKey: secret.consumer_key,
    consumerSecret: secret.consumer_secret,
    callbackURL: "http://localhost:3000/twitterSignup"
  },
  function(token, tokenSecret, profile, cb) {
      return cb(err, profile);
  }
));




app.use(passport.initialize());
app.use(passport.session());

// Keep user in their respective session (logged in).
passport.serializeUser(function(user, done) {
  done(null, user);
});
// Log user out of their session.
passport.deserializeUser(function(user, done) {
  done(null, user);
});




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
