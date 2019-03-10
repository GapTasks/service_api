const mongoose = require('mongoose');

const Friendship = new mongoose.Schema({
    _id: { type: String, required: true },
    friend1: { type: String, required: true },
    friend2: { type: String, required: true },
    status: {type: String, required: true},
    initiator: {type: String, required: true}
});

module.exports = mongoose.model('Friendship', Friendship);
