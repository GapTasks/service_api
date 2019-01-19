const mongoose = require('mongoose');

const Task = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    deadline: { type: Number, required: true },
    mood: { type: Number, required: true },
    time_needed: { type: Number, required: true },
    stack: { type: String, required: true }
});

module.exports = {
    Task,
    TaskModel: mongoose.model('Task', Task)
}