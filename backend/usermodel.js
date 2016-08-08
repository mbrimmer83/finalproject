var mongoose = require('mongoose');

var User = mongoose.model('User', {
  _id: {type: String, required: true},
  email: {type: String, required: true},
  encrpytedPassword: { type: String, required: true},
  authenticationTokens: [String],
  transaction: [
    {
      _id: {type: String, required: true},
      lotId: {type: String, required: true},
      userId: {type: String, required: true},
    }
  ]
});
