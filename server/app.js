// *** main dependencies ***//
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const boom = require('boom'); //HTTP-friendly error object
const errorManagement = require('./aspect/errorManagement');
const logger = require('./aspect/logger');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const auth = require('./routes/api/auth');


const getOperation = require('./expressMiddleware/setOperationMiddleware');
const checkToken = require('./expressMiddleware/checkIdTokenMiddleware');


var fileUpload = require('express-fileupload');


//route

const projectManagement = require('./routes/api/projectManagement');
const videoTaggingManagement = require('./routes/api/videoTaggingManagement');
const userSmartDoorManagement = require('./routes/api/userSmartDoorManagement');
const uploadFile = require('./routes/api/uploadFile');
const login = require('./routes/api/login');
const historyManagement = require('./routes/api/historyManagement');
const users = require('./routes/api/users');
const departmentManagement = require('./routes/api/departmentManagement');
// const photosRoute = require('./routes/api/photos');


const user_model = require('./models/User.js');
//*** routes ***//
// Express router include two steps: load the route, and use the route.
// load routes
//*** express instance ***//
const app = express();
// put logger high up the stack- so all requests pass through it.
// Putting morgan logger middleware before other middleware.
// app.use(fileUpload());
app.use(morgan('combined'));
app.use(cors());

// *** mongoose ***//
const db = require('./config/dev').mongoURI;
//Map global promise - get rid of warning
mongoose.Promise = global.Promise;
mongoose.connect(db).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

user_model.count(function (err, count) {
    if (err) {
        console.log(err)
    } else {
        if (count === 0) {
            user_model.create(require('./config/schema').user, function (err, post) {
                saveToCache(cus_name_collection, post._id.toString(), post.local.username.toString());
            });
        }
    }
    next();
});


//*** config middleware ***//
// put logger high up the stack- so all requests pass through it.
const loggerMiddleware = (req, res, next) => {
    // logger.info(`New request ${req.url}`);
    next();
};
app.use(loggerMiddleware);

//app.use(helmet());
// parse application/x-www-form-urlencoded for easier testing with Postman or plain HTML forms
//app.use(bodyParser.urlencoded({extended: true}));
// Body parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({limit: '100mb', extended: true}));
// app.use(bodyParser({limit: '50mb'}));
app.use(cookieParser());

//*** main routes **//
//Use routes - Express middleware in order so this use routes path should before app.listen()


app.use('/public', express.static('public'));
app.use('/api/projectManagement', checkToken, projectManagement);
app.use('/api/historyManagement', historyManagement);
app.use('/api/departmentManagement', checkToken, departmentManagement);
app.use('/api/videoTaggingManagement', checkToken, videoTaggingManagement);
app.use('/api/userSmartDoorManagement', checkToken, userSmartDoorManagement);
app.use('/api/users', checkToken, users);
app.use('/api/uploadFile', uploadFile);
app.use('/api/login', login);
app.use('/auth', auth);
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
// app.use('/api/historyManagement',checkToken,historyManagement);
// app.use('/photos', checkToken, photosRoute);
errorManagement.handling.registerAndHandleAllErrors(app);
module.exports = app;
