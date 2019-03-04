const shortid = require('shortid');
const mongoose = require('mongoose');
require('./db/stack.schema')
const db = mongoose.model('Stack');


class Stack {
    constructor(props, allowId = true) {
        if(allowId) {
            this.id = props.id || props._id || shortid.generate();
        } else {
            this.id = shortid.generate();
        }
        this.name = props.name || null;
        this.deadline = props.deadline || Date.now();
        this.priority = props.priority || 0;
        this.user = props.user;
    }
}

function all() {
    return find({_all: true});
}

function find(query) {
    let q = {};
    if (query && query.id) q._id = query.id;
    q = {...q, ...query};
    return new Promise((resolve, reject) => {
        db.find(q)
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                if (!res) {
                    return query._all ? resolve([]) : resolve(undefined);
                }
                if (res.length === 1) return resolve(new Stack(res[0]));
                return resolve(res.map(doc => new Stack(doc)));
            });
    });
}

function merge(stack) {
    return new Promise((resolve, reject) => {
        if (!stack.id) reject(new Error('Cannot merge stack without an ID'));
        db.findOneAndUpdate({ _id: stack.id }, stack, { new: true, upsert: true })
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                return resolve(new Stack(res));
            });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        db.findOneAndDelete({ _id: id })
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                if (!res) return resolve(undefined);
                return resolve(new Stack(res));
            });
    });
}

module.exports = {
    Stack,
    all,
    find,
    merge,
    remove
};
