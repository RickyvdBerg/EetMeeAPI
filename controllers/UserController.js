const User = require('../models/User');
const db = require('../datasource/mysql-connector');
const auth = require('../auth/authentication');


module.exports = {
    registerUser(req, res, next) {
        var firstname = req.body.firstname || '';
        var lastname = req.body.lastname || '';
        var email = req.body.email || '';
        var password = req.body.password || '';

        if (firstname.length < 2 || !firstname) { res.status(401).json({ "error": "firstname too short" }); return }
        if (lastname.length < 2 || !lastname) { res.status(401).json({ "error": "lastname too short" }); return }
        if (!validateEmail || !email) { res.status(401).json({ "error": "email incorrect" }); return }

        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        db.query({
            sql: "SELECT * FROM `user` WHERE `Email` = ?",
            values: [email]
        }, (error, result, fields) => {
            console.log(result);
            if (result === undefined || result[0] === undefined || !result[0]) {
                db.query({
                    sql: "INSERT INTO `user` (Voornaam, Achternaam, Email, Password) VALUES (?,?,?,?)",
                    values: [firstname, lastname, email, password]
                }, function (errorInsert, resultInsert, fieldsInsert) {
                    if (errorInsert) {
                        res.status(401).json({ "error": "could not create user" });
                        return;
                    }
                    res.status(200).json({ "token": auth.encodeToken(email), "email": email });
                });
            }
            else {
                res.status(401).json({ "error": "user already registered" });
            }
        });
    },
    loginUser(req, res, next) {

        var email = req.body.email || '';
        var password = req.body.password || '';

        if (!email) { res.status(401).json({ "error": "email incorrect" }); return }
        if (!password) { res.status(401).json({ "error": "password incorrect" }); return }

        db.query({
            sql: 'SELECT * FROM `user` WHERE `Email` = ? AND `Password` = ?',
            timeout: 40000,
            values: [email, password]
        }, (error, result, fields) => {
            if (error) {
                res.status(401).json({ "error": "Credentials not found" })
            }
            if (result[0]) {
                res.status(200).json({ "token": auth.encodeToken(email), "email": email });
            } else {
                res.status(401).json({ "error": "Invalid credentials, bye" })

            }
        });
    }
}