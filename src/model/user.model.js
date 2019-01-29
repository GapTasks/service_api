const shortid = require('shortid');
const mongoose = require('mongoose');
require('./db/user.schema')
const db = mongoose.model('User');

class User {
    constructor(props) {
        this.username = props.username || props.id || props._id || shortid.generate();
        this.name = props.name || null;
        this.email = props.email || null;
        this.stacks = props.stacks || [];
    }
}

function all() {
    return find();
}

function find(query) {
    let q = {};
    if (query.username) q._id = query.username;
    if (query.name) q.name = query.name;
    return new Promise((resolve, reject) => {
        db.find(q)
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                if (!res || res.length === 0) return resolve(undefined);
                if (res.length === 1) return resolve(new User(res[0]));
                return resolve(res.map(doc => new User(doc)));
            });
    });
}

function merge(user) {
    return new Promise((resolve, reject) => {
        if (!user.username) reject(new Error('Cannot merge user without a username'));
        db.findOneAndUpdate({ _id: user.username }, user, { new: true, upsert: true })
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                return resolve(new User(res));
            });
    });
}

function remove(username) {
    return new Promise((resolve, reject) => {
        db.findOneAndDelete({ _id:  username})
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                if (!res) return resolve(undefined);
                return resolve(new User(res));
            });
    });
}

module.exports = {
    User,
    all,
    find,
    merge,
    remove
};
