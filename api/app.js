var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var Keycloak = require('keycloak-connect');

const kcConfig = {
    realm: 'demoapp',
    resource: 'demoapp-api',
    'bearer-only': true,
    'auth-server-url': 'http://localhost:8080/auth/',
    'ssl-required': 'external'
};

var memoryStore = new session.MemoryStore();
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  }));
var keycloak = new Keycloak({ store: memoryStore }, kcConfig)

app.use(keycloak.middleware());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', keycloak.protect(), usersRouter);

module.exports = app;
