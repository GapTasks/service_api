const shortid = require('shortid');
const mongoose = require('mongoose');
require('./db/auth.schema');
const db = mongoose.model('Auth');

class AuthInfo {
    constructor(properties) {
        this.id = properties.id || properties._id || shortid.generate();
        this.user = properties.user || '';
        this.salt = properties.salt || '';
        this.hash = properties.hash || '';
        this.algo = properties.algo || AuthInfo.Algorithm.SHA256;
        this.last = properties.last || Date.now();
    }
}

AuthInfo.Algorithm = {
    SHA256: 'sha256'
};

function find(query = {}) {
    let q = {};
    if (query.id) q._id = query.id;
    if (query.user) q.user = query.user;
    return new Promise((resolve, reject) => {
        db.find(q)
            .lean()
            .exec((err, docs) => {
                if (err) return reject(new Error('Failed to retrieve authentication info: ' + err.message));
                if (!docs || docs.length == 0) {
                    return resolve([]);
                }
                return resolve(docs.map(doc => new AuthInfo(doc)));
            });
    });
}

function merge(authInfo) {
    return new Promise((resolve, reject) => {
        db.findOneAndUpdate({ _id: authInfo.id }, authInfo, { new: true, upsert: true })
            .lean()
            .exec((err, doc) => {
                if (err) return reject(new Error('Failed to save authentication info: ' + err.message));
                return resolve(new AuthInfo(doc));
            });
    });
}

function remove(query) {
    return new Promise((resolve, reject) => {
        db.deleteMany(query, err => {
            if (err) return reject(new Error('Failed to remove authentication info: ' + err.message));
            return resolve(true);
        });
    });
}

module.exports = {
    AuthInfo,
    find,
    merge,
    remove
};
