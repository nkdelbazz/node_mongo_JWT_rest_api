const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    roles: {type: String , default:'user'},
    hash: String,
    salt: String
});

mongoose.model('User', UserSchema);