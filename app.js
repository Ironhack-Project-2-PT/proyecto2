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
const hbs          = require('hbs');

connectDB();

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

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

hbs.registerPartials(path.join(__dirname, "/views/partials"));
hbs.registerHelper("ifCond", function(v1, v2, options) {
  console.log(String(v1) === String(v2));
  if (String(v1) === String(v2)) {
    return options.fn(this);
  }
  return options.inverse(this);
});



// default value for title local
app.locals.title = 'HEY WERO CDMX';

const auth = require("./routes/auth");
const index = require('./routes/index');
const profile = require("./routes/profile");
const puestos = require("./routes/puesto");
app.use('/', index);
app.use("/auth", auth);
app.use("/profile", profile);
app.use("/puestos", puestos);


module.exports = app;
