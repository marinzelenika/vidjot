const express=require('express');
const exphbs  = require('express-handlebars');
const mongoose= require('mongoose');
const bodyParser= require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

const app=express();

//Routes connect
const ideas = require('./routes/ideas')
const users = require('./routes/users')

//passport config
require('./config/passport')(passport)

mongoose.connect('mongodb://localhost/vidjot-dev', {
    useNewUrlParser: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err))



app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//Body parser
app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
//Method override middleware
app.use(methodOverride('_method'))

//Session Middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
  
}))

app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg= req.flash('success_msg');
    res.locals.error_msg= req.flash('error_msg');
     res.locals.error= req.flash('error');
     res.locals.user = req.user || null;
     next();
})

app.get('/',(req, res) => {
    const title= 'Welcome';
    res.render('index',{
        title:title
    });
})

app.get('/about',(req, res) => {
    res.render('about');
})


//static folder
app.use(express.static(path.join(__dirname,'public')))


//use routes
app.use('/ideas', ideas)
app.use('/users', users)

const port=5000;

app.listen(port,() => {
    console.log('server stared on port ', +port);
    
})