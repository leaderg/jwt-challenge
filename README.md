# JWT Tokens Challenge

## Introduction

This is a small application that showcases how to create a simple JWT authentication system for users. The app is intended to be utilized with Postman or another API tester.

## Installation and Usage

A basic `npm install` will install all dependencies. The application is run with `node app.js`.

Rename `.env-public` to `.env`

Using Postman posting a GET request to `/register` will generate a new JWT token and return the authorization key.

A GET request to `/data` will show the functionality of the application finding the relevant JWT user and returning a new refreshed JWT on activity. Add this field to the header in the Postman GET request as follows:

`authorization: bearer <authorization key>`


## What I learned

- Creating middleware functions in Express to process request data.
- A base understanding of how to set up a simple JWT session. Here's an example react usage:

```javascript
fetch('/admin/dashboard', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer' + authToken
  }
})
.then(res => {... Using the res to set states and showing relevant information.}```
