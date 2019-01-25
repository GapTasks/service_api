const mongoose = require('mongoose');

const User = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    stacks: { type: [String], required: false, default: [] }
});

mongoose.model('User', User)

module.exports = {
    User
}