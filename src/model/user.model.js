const uuid = require('uuid/v4');
const db = require('./db/user.db');
const errors = require('../util/error');

class User {
    constructor(properties) {
        if (!properties) properties = {};
        this.id = properties.id || properties._id || uuid();
        this.username = properties.username;
        this.name = properties.name;
        this.contact = {
            email: properties.contact !== undefined ? properties.contact.email : undefined
        };
    }
}

function merge(user) {
    return new Promise((resolve, reject) => {
        db.findOneAndUpdate({ _id: user.id }, user, { upsert: true, new: true })
            .lean()
            .exec((err, doc) => {
                if (err) return reject(errors.translate(err, 'save user'));
                if (!doc) {
                    return resolve(undefined);
                }
                return resolve(new User(doc));
            });
    });
}

function find(query) {
    q = {};
    if (query && query.id) {
        q._id = query.id;
    }
    return new Promise((resolve, reject) => {
        db.find(q)
            .lean()
            .exec((err, docs) => {
                if (err) return reject(errors.translate(err, 'retrieve user information'));
                if (!docs || docs.length === 0) {
                    return resolve(undefined);
                }
                if (docs.length == 1) {
                    return resolve(new User(docs[0]));
                }
                return resolve(docs.map(doc => new User(doc)));
            });
    });
}

function remove(query) {
    let q = {};
    if (query.id) {
        q._id = query.id;
    }
    return new Promise((resolve, reject) => {
        db.deleteMany(q)
            .lean()
            .exec((err, result) => {
                if (err) return reject(errors.translate(err, 'remove user information'));
                if (result && result.n === 0) {
                    return resolve(false);
                }
                return resolve(true);
            });
    });
}

module.exports = {
    User,
    merge,
    find,
    remove
};
