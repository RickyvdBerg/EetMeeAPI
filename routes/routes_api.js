const express = require('express');
const router = express.Router();
const auth = require('../auth/authentication');
const db = require("../datasource/mysql-connector");

//
// Catch all except login
//
// router.all( new RegExp("[^(\/register)]"), function (req, res, next) {

router.all(new RegExp("[^(\/login|\/register)]"), function (req, res, next) {

    var token = (req.header('X-Access-Token')) || '';
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            res.status(401).json({ error: new Error("Not authorised").message });
        } else {
            next();
        }
    });
});

router.post('/login', function (req, res) {

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
);

router.post('/register', function (req, res) {

    //
    // Get body params or ''
    //
    var firstname = req.body.firstname || '';
    var lastname = req.body.lastname || '';
    var email = req.body.email || '';
    var password = req.body.password || '';

    if (firstname.length < 2 || !firstname) { res.status(401).json({ "error": "firstname too short"}); return }

    if (lastname.length < 2 || !lastname) { res.status(401).json({ "error": "lastname too short"}); return }

    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    if (!validateEmail || !email)
    {
        res.status(401).json({ "error": "email incorrect"});
        return
    }

    db.query({
        sql: "SELECT * FROM `User` WHERE `Email` = ?",
        values: [email]
    }, function (error, result, fields) {
        if(!result[0])
        {
            db.query({
                sql: "INSERT INTO `User` (Voornaam, Achternaam, Email, Password) VALUES (?,?,?,?)",
                values: [firstname,lastname,email,password]
            }, function (errorInsert, resultInsert, fieldsInsert) {
                if(errorInsert)
                {
                    res.status(401).json({ "error": "could not create user"});
                    return;
                }
                res.status(200).json({ "token": auth.encodeToken(email), "email": email });
            });
        }
        else{
            res.status(401).json({ "error": "user already registered"});
        }
    });
}
);
router.get('/register', function (req, res) {
    res.status(404).json({"error": "Can't get, please use a post request to register for a token"});
});
// Get all studentenhuizen
router.get('/studentenhuis', (req, res) => {

    db.query({
        sql: "SELECT * FROM Studentenhuis"
    }, function (error, result, fields) {
        if (error) {
            res.status(500).json(error.toString())
        } else {
            res.status(200).json(result)
        }
        res.end();
    });
});

// Generate JWT

router.get('/studentenhuis/:id', (req, res) => {

    const huisId = req.params.id;

    db.query('SELECT * FROM studentenhuis WHERE ID = ?',
        [huisId],
        (error, result, fields) => {
            if (error) {
                res.status(500).json({"error": "An error occured while fetching the data"})
            } else if (!result[0]){
                res.status(500).json({"error": "No houses found!"})
            }
            else{
                res.status(200).json(result)
            }
            res.end();
        })
});

module.exports = router;