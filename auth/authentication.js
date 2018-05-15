const settings = require('../config/config.js');
const moment = require('moment');
const jwt = require('jwt-simple');

//
// Encode (van username naar token)
//
function encodeToken(email) {
    const playload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: email
    };
    return jwt.encode(playload, CONFIG.jwt_encryption);
}

//
// Decode (van token naar email)
//
function decodeToken(token, cb) {

    try {
        const payload = jwt.decode(token, CONFIG.jwt_encryption);

        // Check if the token has expired. To do: Trigger issue in db ..
        const now = moment().unix();

        // Check if the token has expired
        if (now > payload.exp) {
            console.log('Token has expired.');
        }

        // Return
        cb(null, payload);

    } catch(err) {
        cb(err, null);
    }
}

 function getEmailFromToken(token) {

    try {
        const payload = jwt.decode(token, CONFIG.jwt_encryption);

        // Check if the token has expired. To do: Trigger issue in db ..
        const now = moment().unix();

        // Check if the token has expired
        if (now > payload.exp) {

        }

        // Return
        return payload.sub;

    } catch(err) {
        cb(null);
    }
}

module.exports = {
    encodeToken,
    decodeToken,
    getEmailFromToken
};