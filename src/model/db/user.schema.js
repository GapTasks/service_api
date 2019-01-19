const mongoose = require('mongoose');

const User = new mongoose.Schema({
    _id: false,
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    stacks: { type: [String], required: false, default: [] }
});

module.exports = {
    User,
    UserModel: mongoose.model('User', User)
}