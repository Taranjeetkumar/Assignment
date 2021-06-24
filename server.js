const express = require("express");
const app = express();
var http = require("http").createServer(app);
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const errorHandler = require('./app/middleware/error');
const connectDB = require('./app/db/mongoose');
const router = express.Router();
const routes = require('./route');

//load env variables
dotenv.config({ path: './config/config.env' });
const PORT = process.env.PORT || 6600;

//loading database
connectDB();

app.set("view engine", "ejs");
app.set("views", "views");

//intializing cors
app.use(cors({ credentials: true }));

//setting up morgan for development mode
//middleware to interact with body// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('./uploads'));
app.use('/staticpdf', express.static('./invoicepdf'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//mapping routes
app.get('/', function (req, res) {
  console.log('Assignment');
})

routes.map(route => {
  app.use(route.path, route.handler);
});

//our errorHandler middleware(it is after brands route becuase node executes in linear order)
app.use(errorHandler);


server = http.listen(PORT, console.log(`Server is up and running at port number ${PORT} , Mode=${process.env.NODE_ENV}`));