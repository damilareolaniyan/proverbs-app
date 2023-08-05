const express = require('express')
const router = express.Router();

const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) =>{
    res.render('users/register')
})

router.post('/register', async(req, res, next) =>{
    try {
    const {username, email, password} = req.body;
    const user = new User({username, email})
    const registeredUser = await User.register(user, password)
    req.login(registeredUser, err =>{
        if(err) return next(err);
       req.flash('success','Welcome back!')
       res.redirect('/proverbs') 
    })  
    
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('register')
    }
})

router.get('/login', (req, res) =>{
    res.render('users/login')
})

router.post('/login',passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=>{
    req.flash('success', 'Logged In')
    const redirectUrl = req.session.returnTo || '/proverbs';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout', (req, res, next) =>{
    req.logout(function(err){
        if(err){
            return next(err)
        }
        res.redirect('/proverbs')
    })
})



module.exports = router;