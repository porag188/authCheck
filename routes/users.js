const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');
//Login Page
// router.get('/login', (req, res) => res.send('login'));
router.get('/login', function(req, res) {
  res.render('login');
});

//Register Page
router.get('/register', (req, res) => res.render('register'));
//Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];
  //check reuired fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }
  //check password match
  if (password !== password2) {
    errors.push({ msg: 'Password do not match' });
  }
  //check pass length
  if (password.lenght < 6) {
    errors.push({ msg: 'Plaseword Should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    //Validation Passed
    User.findOne({ email: email }).then(user => {
      if (user) {
        //User exits
        errors.push({ msg: 'Email is already registered' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        //Hash password
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //set password to hashed
            newUser.password = hash;
            //save user
            newUser
              .save()
              .then(user => {
                req.flash('success_msg', 'You are now Registered');
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          })
        );
      }
    });
  }
});
//Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});
//Logout Handle
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are Logged out');
  res.redirect('/users/login');
});
module.exports = router;
