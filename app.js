const express = require('express')
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const {proverbSchema} = require('./schemas.js')
const UserModel = require('./models/user.js')
const ProverbModel = require('./models/proverbs')
const CommentModel = require('./models/comment.js')
const User = require('./models/user.js')
const catchAsync = require('./utils/cathAsync')
const ExpressError = require('./utils/ExpressError')

const user = require('./routes/users.js')
const proverbs = require('./routes/proverbs.js')
const comments = require('./routes/comments.js')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const app = express();


//Connecting Our Mongoose
mongoose.connect('mongodb://localhost:27017/proverb', {
    useNewUrlParser: true,
    //useCreateIndex: false,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () =>{
    console.log("Database Connected");
});
//Setting My Views Engine
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//Parsing the post body
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) =>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


app.use('/', user)
app.use('/proverbs', proverbs)
app.use('/proverbs/:id/comments', comments)

//Homepage
app.get('/', (req, res) =>{
    res.render('home')
})


//404
app.all('*', (req, res, next) =>{
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) =>{
    const {statusCode = 500} = err;
    if(!err.message) err.message= 'Oh no'
    res.status(statusCode).render('error', {err})
})
//Creating Our Port
const PORT = 5000;
app.listen(PORT, () =>{
    console.log(`Server Started on PORT ${PORT}`)
})