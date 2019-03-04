const mongoose = require('mongoose');

const Stack = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    user: {type: String, required: true },
    deadline: { type: Number, required: true },
    priority: { type: Number, required: true }
});

mongoose.model('Stack', Stack)

module.exports = {
    Stack
};
