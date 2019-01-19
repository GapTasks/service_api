const mongoose = require('mongoose');

const Stack = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    deadline: { type: Number, required: true },
    priority: { type: Number, required: true }
});

module.exports = {
    Stack,
    StackModel: mongoose.model('Stack', Stack)
};
