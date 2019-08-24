const express = require('express');
const chalk = require('chalk');
//const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require ('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const passport = require('passport');
const { mongodbUrl } = require('./config/database');
const app = express();



mongoose.Promise = global.Promise;
const port = process.env.PORT || 8080;

mongoose.set('useCreateIndex', true)
mongoose.connect( mongodbUrl, { useNewUrlParser: true })
    .then(db => {
        console.log('MONGO connected');
    }).catch(err => console.log('Could not connect'));



//Upload middleware
app.use(upload());

app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'karokojnr',
    cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
    store: new MongoStore({
      url: 'mongodb://karokojnr:karokojnr@cluster0-shard-00-00-ubthk.gcp.mongodb.net:27017,cluster0-shard-00-01-ubthk.gcp.mongodb.net:27017,cluster0-shard-00-02-ubthk.gcp.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
      autoReconnect: true,
    })  
}));
app.use(flash());

//Passport
app.use(passport.initialize());
app.use(passport.session());
 
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));
//! This should strictly be after passport.initialize and passport.session
//Local variables usind middleware
app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.form_errors = req.flash('form_errors');
    res.locals.error = req.flash('error');
    next();
});

//Load Routes
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');

//Use Routes
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);
app.use('/admin/comments',comments);


const {select, generateTime,paginate} = require('./helpers/handlebars-helpers');
//Set View Engine
app.engine('handlebars', exphbs({defaultLayout : 'home', helpers : {select : select, generateTime: generateTime, paginate: paginate}}));
app.set('view engine', 'handlebars');


app.listen(port, () => {
    console.log(`Server running on port ${chalk.green(port)}`);
});