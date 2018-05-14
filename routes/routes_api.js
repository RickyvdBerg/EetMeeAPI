const express = require('express');
const router = express.Router();
const auth = require('../auth/authentication');
const db = require("../datasource/mysql-connector");


router.all(new RegExp("[^(\/login|\/register)]"), function (req, res, next) {
    //
    console.log("VALIDATE TOKEN");
    var token = (req.header('X-Access-Token')) || '';
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status((err.status || 401)).json({ error: new Error("Not authorised").message });
        } else {
            next();
        }
    });
});

router.post('/login', function (req, res) {
    console.log(req.body)

    var email = req.body.email || '';
    var password = req.body.password || '';

    if (!email) { res.status(401).json({ "error": "email incorrect" }); return}
    if (!password) {res.status(401).json({ "error": "password incorrect"}); return}

    db.query({
        sql: 'SELECT * FROM `user` WHERE `Email` = ? AND `Password` = ?',
        timeout: 40000,
        values: [email, password]
    }, (error, result, fields) => {
        console.log("result: " + JSON.stringify(result));
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

// Generate JWT

module.exports = router;