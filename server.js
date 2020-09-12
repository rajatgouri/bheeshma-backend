const express = require('express');
const app = express();


const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const mongoose = require('mongoose');
const path = require('path');
const passport = require('passport');
const config = require('./server-config');
const socket = require('./sockets');

const port = process.env.PORT || 3000;
const mongoURI = config.mongoURI;
const Router = require('./routes/router');
const { json } = require('express');

// Static Folders
app.use(express.urlencoded({extended: false}));
app.use(json());

// Cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(passport.initialize());
const passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);


// Post Routes
app.use('/', Router.init());


socket.init(io);


mongoose
  .connect(
    mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    console.log('Database Connected!');
    server.listen(port, () => console.log('server is running on ' + port));

  })
  .catch((err) => console.log(err));


