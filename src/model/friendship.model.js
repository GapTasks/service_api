const shortid = require('shortid');
const mongoose = require('mongoose');
require('./db/friendship.schema.js');
const db = mongoose.model('Friendship');

class Friendship {
    constructor(props, allowId = true) {
        if (allowId) {
            this.id = props.id || props._id || shortid.generate();
        } else {
            this.id = shortid.generate();
        }
        this.friend1 = props.friend1 || null;
        this.friend2 = props.friend2 || null;
        this.status = props.status || null;
        this.initiator = props.initiator || null;
    }
}

function find(query = {}) {
    let q = {};
    if (query && query.id) q._id = query.id;
    q = {...q, ...query};
    return new Promise((resolve, reject) => {
        db.find(q)
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                if (!res) return resolve([]);
                return resolve(res.map(doc => new Friendship(doc)));
            });
    });
}

function merge(friendship) {
    return new Promise((resolve, reject) => {
        if (!friendship.id) reject(new Error('Cannot merge friendship without an ID'));
        db.findOneAndUpdate({ _id: friendship.id }, friendship, { new: true, upsert: true })
            .lean()
            .exec((err, res) => {
                if (err) return reject(err);
                return resolve(new Friendship(res));
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
                return resolve(new Friendship(res));
            });
    });
}

module.exports = {
    Friendship,
    find,
    merge,
    remove
}