if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
// console.log(process.env.SECRET);

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const { title } = require('process');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const listingRouter = require('./routes/listing.js'); //router part
const reviewsRouter = require('./routes/review.js'); //router part
const userRouter = require('./routes/user.js'); //router part

const session = require('express-session'); //session handling
const flash = require('connect-flash'); //to display messages of session

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js'); //For auth purpose of user

// DB connection
const db_url = 'mongodb://127.0.0.1:27017/Air';
async function main() {
  await mongoose.connect(db_url);
}

main()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

// Handling
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// ejs-mate npm package
app.engine('ejs', ejsMate);

// Form handling
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Sessions
const sessionOptions = {
  secret: process.env.SECRET,
  saveUninitialized: 'true',
  resave: 'false',
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

//auth using passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flashing messages on any crud operation
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
});

//demo user using passport
app.get('/demo', async (req, res) => {
  let demoUser = new User({
    email: 'ex1@gmail.com',
    username: 'Rn',
  });

  let registeredUser = await User.register(demoUser, 'password');
  res.send(registeredUser);
});

// app.get()  // all routes are added to routes -> listing.js
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewsRouter);
app.use('/', userRouter);

// app.get('/', (req, res) => {
//   res.send('SpiderMan');
// });

// ExpressError
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = 'Something went wrong' } = err;
  res.status(statusCode).render('Error', { message });
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
