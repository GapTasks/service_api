const db = require('./db/auth.db');
const errors = require('../util/error');
const uuid = require('uuid/v4');

const Algorithm = {
    SHA256: 'sha256'
};

class AuthInfo {
    constructor(properties) {
        this.id = properties.id || properties._id || uuid();
        this.user = properties.user || '';
        this.salt = properties.salt || '';
        this.hash = properties.hash || '';
        this.algo = properties.algo || Algorithms.SHA256;
        this.last = properties.last || Date.now();
    }
}

function find(query) {
    return new Promise((resolve, reject) => {
        db.find(query)
            .lean()
            .exec((err, docs) => {
                if (err) return reject(errors.translate(err, 'retrieve authentication info'));
                if (!docs || docs.length == 0) {
                    return resolve(undefined);
                }
                if (docs.length == 1) {
                    return resolve(new AuthInfo(docs[0]));
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
                if (err) return reject(errors.translate(err, 'save authentication info'));
                return resolve(new AuthInfo(doc));
            });
    });
}

function remove(query) {
    return new Promise((resolve, reject) => {
        db.deleteMany(query, err => {
            if (err) return reject(errors.translate(err, 'remove authentication info'));
            return resolve(true);
        });
    });
}

module.exports = {
    Algorithm,
    AuthInfo,
    find,
    merge,
    remove
};
