const express = require('express');
const session = require("express-session"); 
const KnexStore = require("connect-session-knex")(session); 
const restricted = require("../auth/restricted-middleware.js");
const apiRouter = require('./api-router.js');
const configureMiddleware = require('./configure-middleware.js');

const server = express();

const sessionConfig = {
    name: "monster",
    secret: "keep it secret, keep it safe!",
    resave: false,
    saveUninitialized: true, 
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false, 
      httpOnly: true, 
    },
    
    store: new KnexStore({
      knex,
      tablename: "sessions",
      createtable: true,
      sidfieldname: "sid",
      clearInterval: 1000 * 60 * 15,
    }),
  };

configureMiddleware(server);
server.use(session(sessionConfig))
server.use('/api/auth', apiRouter);
server.use("/api/users", restricted, usersRouter);

module.exports = server;