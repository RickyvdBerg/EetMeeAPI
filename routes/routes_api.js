const express = require('express');
const router = express.Router();
const auth = require('../auth/authentication');
const db = require("../datasource/mysql-connector");
const usercontroller = require('../controllers/UserController')
const dormcontroller = require('../controllers/DormController')
const mealcontroller = require('../controllers/MealController')
const participantcontroller = require('../controllers/ParticipantController')
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

// Post studentenhuis
router.post('/studentenhuis', dormcontroller.posttest)

//dorm
router.get('/studentenhuis', dormcontroller.getAll)
router.get('/studentenhuis/:id', dormcontroller.getSpecificDorm);

//meal
router.delete('/studentenhuis/:id/maaltijd/:mid', mealcontroller.deleteMealById);
router.put('/studentenhuis/:id/maaltijd/:mid', mealcontroller.updateMealById);
router.post('/studentenhuis/:id/maaltijd', mealcontroller.postMealToDorm);
router.get('/studentenhuis/:id/maaltijd', mealcontroller.getAllMeals);
router.get('/studentenhuis/:id/maaltijd/:mid', mealcontroller.getMealById);

//participant
router.post('/studentenhuis/:id/maaltijd/:mid/deelnemers', participantcontroller.postParticipantToMeal);
router.get('/studentenhuis/:id/maaltijd/:mid/deelnemers', participantcontroller.getParticipantsForMeal);
router.delete('/studentenhuis/:id/maaltijd/:mid/deelnemers', participantcontroller.DeleteParticipantFromMeal);

module.exports = router;