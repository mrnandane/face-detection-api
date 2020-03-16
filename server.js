// import express package
const express = require("express");

// import body-parser for parsing body of request
const bodyparser = require('body-parser')

// install and import bcrypt
const bcrypt = require('bcrypt');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// install and import knex for database connectivity
const knex = require('knex');
// connect to local database using knex 
// const db = knex({
// 	client: 'pg',
// 	connection: {
// 	  host : '127.0.0.1',
// 	  user : 'postgres',
// 	  password : 'synerzip',
// 	  database : 'facedetection'
// 	}
// });

// connect to heroku database using knex 
const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: true,
	}
});
// install and import cors for resolving cors issue while running on localhost
const cors = require('cors');

// create app by running express
const app = express();
// use body parser middleware to parse body
app.use(bodyparser.json());

// use cors
app.use(cors());

// create get request 
app.get('/', (req, res) => {
	res.json('success');
});

// create signin post request
app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));

// create register post request
app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));

// create fetch user object request using get
app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, db));

// increse image count by PUT method
app.put('/image', (req, res) => image.handleImage(req, res, db));

app.post('/imageUrl', (req, res) => image.detectFace(req, res));

// listen application on port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Application is running on port ${PORT}`);
});

console.log(process.env.PORT)