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

//jwt autorization check on all server calls.
//userId from payload is put into req.user
App.use(function(req,res,next){
  try{
  const token = req.headers.authorization.split(" ")[1]
  jwt.verify(token, KEY, function (err, payload) {
    console.log(payload)
    if (payload) {
      User.findById(payload.userId).then(
        (doc)=>{
          req.user=doc;
          next()
        }
      )
    } else {
      next()
    }
  })
  } catch(e) {
    next()
  }
});

App.get('/register', (req, res) => {
  let token=jwt.sign({userId: 'TestUser'}, KEY, {expiresIn: 60 * 20 });
  res.json({token})
})

App.post('/data', (req, res) => {
  const token = req.body.token
  jwt.verify(token, KEY, function (err, payload) {
    res.json({payload})
  })
})
/*  Takes a post with the body containing a username and password.
    Checks with mongoDB entries to find a match. If it finds one it
    assigns a the current user using jwt.sign() which includes a 20 minute expiry. */
App.post('/login', (req,res) => {
  User.findOne({username:req.body.username}).then((user)=>{
    user.passwordCheck(req.body.password,(err,isMatch)=>{
      if(isMatch){
        let token=jwt.sign({userId:user.id}, KEY, {expiresIn: 60 * 20 });
        res.status(200).json({
            userId:user.id,
            username:user.username,
            token
        })
      } else {
        res.status(400).json({message:'Invalid Password/Username'});
      }
    })
  })
  .catch((err)=>{
    res.status(400).json({message:'Invalid Password/Username'});
  })
})



App.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});