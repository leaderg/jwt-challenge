const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Set up user table.
const user = new mongoose
.Schema({
  username: {
    type: String,
    unique: true
  },
  password: String
  },
  {timestamps: true}
);

user.pre('save', function(next) {
  let self = this
  if (!self.isModified('password')) {
    return next();
  }
  bcrypt.hash(self.password,12)
  .then(hashedPass => {
    self.password = hashedPass;
    next();
  })
}, (err) => {
  next(err);
})

user.methods.passwordCheck = function (password, next) {
  bcrypt.compare(password, this.password, (err, authorized) => {
    if(err) return next(err);
    next(null, authorized)
  })
}

module.exports = mongoose.model('user', user)