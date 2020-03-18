const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
//Passport config
require('./config/passport')(passport);
//DB Config
const db = require('./config/keys').MongoURI;
//connection MongoDB
mongoose
  .connect(db, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log('MongoDB connection Stablish...'))
  .catch(err => console.log(err));
//view handler
// app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
// app.set('view engine', '.hbs');
//Ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect Flash
app.use(flash());
//Global Variable
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('seccess_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server Started on port:${PORT}`));
