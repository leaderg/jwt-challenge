//Setting up .env
require('dotenv').config();

//Server and dependencies
const express= require('express');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcrypt');
const App = express;

//Assigning sensitive data.
const PORT = process.env.PORT; //Port
const KEY = process.env.TOKEN; // Secret Key for jwt

App.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});