const mongoose = require('mongoose');
require('./db/task.schema');
const db = mongoose.model('Task');
const shortid = require('shortid');

class Task {
    constructor(props) {
        this.id = props.id || props._id || shortid.generate();
        this.name = props.name || null;
        this.deadline = props.deadline || Date.now();
        this.mood = props.mood || null;
        this.timeNeeded = props.timeNeeded || props.time_needed || 0;
        this.stack = props.stack || null;
    }
}

function all() {
    return find();
}

function find(query) {
    let q = {};
    if (query.id) q._id = query.id;
    if (query.name) q.name = query.name;
    return new Promise((resolve, reject) => {
        db.find(q)
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                if (!res || res.length === 0) return resolve(undefined);
                if (res.length === 1) return resolve(new Task(res[0]));
                return resolve(res.map(doc => new Task(doc)));
            });
    });
}

function merge(task) {
    return new Promise((resolve, reject) => {
        if (!task.id) reject(new Error('Cannot merge task without an ID'));
        db.findOneAndUpdate({ _id: task.id }, task, { new: true, upsert: true })
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                return resolve(new Task(res));
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        db.findOneAndDelete({ _id: id })
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                if(!res) return resolve(undefined);
                return resolve(new Task(res));
            });
    });
}

module.exports = {
    Task,
    all,
    find,
    merge,
    remove
};
