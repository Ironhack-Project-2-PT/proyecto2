require('dotenv').config();

const express      = require('express');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser'); 
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require("express-session");
const MongoStore   = require("connect-mongo")(session);
const passport     = require("./config/passport");
const connectDB    = require('./config/database');
connectDB();


const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Passport 

app.use(
  session({
    secret: process.env.SECRET,
    cookie: { maxAge: 3600000 },
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(
  require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


// default value for title local
app.locals.title = 'HEY WERO CDMX';

const auth = require("./routes/auth");
const index = require('./routes/index');
const puesto = require("./routes/puesto");

app.use('/', index);
app.use("/", auth);
app.use("/puesto", puesto);


module.exports = app;

