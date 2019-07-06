//Setting up .env
require('dotenv').config();

//Server and dependencies
const express= require('express');
const jwt= require('jsonwebtoken');
const body_parser = require('body-parser');


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

App.get('/data',
  function (req, res, next) {
    //Middleware function to gather token from header.
    //Assumes "authorization": "bearer tokenKey" format
    //If header is missing, will give a forbidden response.
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


App.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});