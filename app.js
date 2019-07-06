//Setting up .env
require('dotenv').config();

//Server and dependencies
const express= require('express');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const body_parser = require('body-parser');
const User=require('./user');


//Assigning sensitive data.
const PORT = process.env.PORT; //Port
const KEY = process.env.TOKEN; // Secret Key for jwt

//Setting up App
const App = express();
App.use(body_parser.json());


App.get('/register', (req, res) => {
  //Sends jwt token as reply, in production would pass to front end client.
  let token=jwt.sign({userId: 'TestUser'}, KEY, {expiresIn: 60 * 20 });
  res.send(token)
})

App.get('/data', function (req, res, next) {
    //middleware function to gather token from header.
    //if missing will give a forbidden response.
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
      const bearer = header.split(' ');
      req.token = bearer[1];
      next();
    } else {
      res.sendStatus(403)
    }
  }, (req, res) => {
    jwt.verify(req.token, KEY, function (err, payload) {
      if(err){
        //If token does not match the key, will give a forbidden response.
        res.sendStatus(403);
      } else {
        //creates a new JWT token to refresh expiry on activity. Again would traditionally be sent to front end client.
        let refreshedToken=jwt.sign({userId: payload.userId}, KEY, {expiresIn: 60 * 20 });
        res.json({
          serverMessage: "JWT token valid.",
          refreshedToken,
          payload
        })
     }
    })
})


/*  Takes a post with the body containing a username and password.
    Checks with mongoDB entries to find a match. If it finds one it
    assigns a the current user using jwt.sign() which includes a 20 minute expiry. */




App.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});