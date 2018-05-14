const express = require('express');
const router = express.Router();
const auth = require('../auth/authentication');
const db = require("../datasource/mysql-connector");

//
// Catch all except login
//
// router.all( new RegExp("[^(\/register)]"), function (req, res, next) {

//     //TODO register using email, first/last name and password
// });
router.all(new RegExp("[^(\/login)]"), function (req, res, next) {
    //
    console.log("VALIDATE TOKEN");
    var token = (req.header('X-Access-Token')) || '';
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            res.status(401).json({ error: new Error("Not authorised").message });
        } else {
            next();
        }
    });
});


//
// Login with {"username":"<username>", "password":"<password>"}
//
router.route('/login')

    .post(function (req, res) {

        //
        // Get body params or ''
        //
        var email = req.body.email || '';
        var password = req.body.password || '';

        //
        // Check in datasource for email & password combo.
        //
        //
        // db.query({
        //     sql: 'SELECT * FROM `user` WHERE `Email` = ? AND ``', 
        //     timeout: 40000, 
        //     values: [email]});
        result = users.filter(function (user) {
            if (user.email === email && user.password === password) {
                return (user);
            }
        });

        // Debug
        console.log("result: " + JSON.stringify(result[0]));

        // Generate JWT
        if (result[0]) {
            res.status(200).json({ "token": auth.encodeToken(username), "username": username });
        } else {
            res.status(401).json({ "error": "Invalid credentials, bye" })
        }

    });
// Get all studentenhuizen
router.get('/studentenhuis', (req, res, next) => {

    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM studentenhuis',
            (error, rows) => {
                if (error) {
                    res.status(500).json(error.toString())
                    connection.release();
                } else {
                    res.status(200).json(rows)
                    connection.release();
                }
            });
    });
});

router.get('/studentenhuis/:id', (req, res, next) => {

    const huisId = req.params.id;

    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM studentenhuis WHERE ID = ?',
            [huisId],
            (error, rows, fields) => {
                if (error) {
                    res.status(500).json(error.toString())
                } else {
                    res.status(200).json(rows)
                }
            })
    });
});

module.exports = router;