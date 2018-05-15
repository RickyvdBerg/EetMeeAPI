const express = require('express');
const router = express.Router();
const auth = require('../auth/authentication');
const db = require("../datasource/mysql-connector");
const usercontroller = require('../controllers/UserController')
const dormcontroller = require('../controllers/DormController')
const mealcontroller = require('../controllers/MealController')

//
// Catch all except login
//
// router.all( new RegExp("[^(\/register)]"), function (req, res, next) {

router.all(new RegExp("[^(\/login|\/register)]"), function (req, res, next) {

    console.log(req.header('X-Access-Token'))

    var token = (req.header('X-Access-Token')) || '';
    auth.decodeToken(token, (err, payload) => {
        if (err) {
            res.status(401).json({ error: new Error("Not authorised").message });
        } else {
            db.query('SELECT ID FROM user WHERE Email = ?',[payload.sub], (errq, resq, fieldq) => {

                if(resq)
                {
                    next();
                } else {
                    res.status(401).json({ error: new Error("Invalid credentials").message });
                }
            });
        }
    });
});

//authentication
router.post('/login', usercontroller.loginUser);
router.post('/register', usercontroller.registerUser);
router.get('/register', function (req, res) {res.status(404).json({"error": "Can't get, please use a post request to register for a token"});});

//dorm
router.post('/studentenhuis', dormcontroller.postDorm);
router.get('/studentenhuis', dormcontroller.getAll);
router.get('/studentenhuis/:id', dormcontroller.getSpecificDorm);
router.put('/studentenhuis/:id', dormcontroller.putDorm);
router.delete('/studentenhuis/:id', dormcontroller.deleteDorm);

//meal
router.post('/studentenhuis/:id/maaltijd', mealcontroller.postMealToDorm);
router.get('/studentenhuis/:id/maaltijd', mealcontroller.getAllMeals);


module.exports = router;