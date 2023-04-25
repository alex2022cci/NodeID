if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()
}

const express = require('express')
const app = express();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const initializePassport = require('./passport-config') 
//const passport = require('passport')
const methodOverride = require('method-override')

initializePassport(
    passport,
     email =>  users.find(user => user.email === email)
     )

/* ONLY ACCEPTABLE IN DEV not in production*/
const users = []

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    ressave: false,
    saveUninitialized: false  /*On ne sauve pas un encart vide*/
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


/*Homepage*/
app.get('/', CheckAuthenticated , (req, res) => {
    res.render('index.ejs', { name : 'John'})
})

/*Login Page*/
app.get('/login', CheckNotAuthenticated ,(req, res) => {
    res.render('login.ejs')
})

/*Register Page*/
app.get('/register', (req, res) => {
    res.render('register.ejs')
})

/*La méthode POST*/
app.post('/login', CheckNotAuthenticated,passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))


app.post('/register', CheckNotAuthenticated ,async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
    // console.log( users)
})

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function CheckAuthenticated(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next()
    }
    res.redirect('/login')
}

function CheckNotAuthenticated(req, res, next)
{
    if(req.isAuthenticated())
    {
        return res.redirect('/')
    }
    next()
}

app.listen(3000)