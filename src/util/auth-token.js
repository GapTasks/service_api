const jwt = require('jsonwebtoken');
const fs = require('fs');
const config = require('config');
const path = require('path');
const { GapTasksError, ErrorCodes } = require('./error');

let _config = config.get('security');

let _key = path.join(process.cwd(), _config.secretKey);

let _issuer = "gaptasks";

function generate(subject, audience) {
    return new Promise((resolve, reject) => {
        fs.readFile(_key, 'utf8', (err, secret) => {
            if (err) {
                return reject(err);
            }
            let payload = {
                iss: _issuer,
                sub: subject,
                aud: audience || [],
                exp: Math.floor(Date.now() / 1000) + 60 * 60
            };
            jwt.sign(payload, secret, (err, token) => {
                if (err) return reject(err);
                return resolve(token);
            });
        });
    });
}

function verify(token, subject, audience) {
    return new Promise((resolve, reject) => {
        fs.readFile(_key, 'utf8', (err, secret) => {
            if (err)
                return reject(new GapTasksError(ErrorCodes.F_FILE_FAILURE, `Failed to read secret: ${err.message}`));
            let options = { subject, audience, issuer: _issuer };
            jwt.verify(token, secret, options, (err, decoded) => {
                if (err)
                    return reject(
                        new GapTasksError(
                            ErrorCodes.A_AUTH_TOKEN_FAILURE,
                            `Failed to validate token: ${err.message}`
                        )
                    );
                return resolve(decoded);
            });
        });
    });
}

module.exports = {
    generate,
    verify
};
