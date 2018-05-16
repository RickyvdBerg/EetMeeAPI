const db = require('../datasource/mysql-connector');
const auth = require('../auth/authentication');


module.exports = {
    postParticipantToMeal(req, res, next) {

        const token = req.header('X-Access-Token');
        let email = auth.getEmailFromToken(token) || '';

        const houseId = req.params.id;
        const mealId = req.params.mid;
        

        db.query('INSERT INTO deelnemers (UserID, StudentenhuisID, MaaltijdID) VALUES ((SELECT ID from user where Email = ?),?,?)',
            [email, houseId, mealId],
            (error, result, fields) => {
                console.log(error);
                if(!result){
                    res.status(404).json({ "error": "one or more params incorrect" })
                }
                if (result.affectedRows == 0) {
                    res.status(412).json({ "error": "No changes were made an error occured" })
                }
                else {
                    res.status(200).json({ "succes": "You registered for this meal" })
                }
            })
            //TODO check if already subscribed to meal
    },
    getParticipantsForMeal(req, res, next) {
        const houseId = req.params.id;
        const mealId = req.params.mid;

        db.query('SELECT * FROM deelnemers WHERE StudentenHuisID = ? AND MaaltijdID = ?',
            [houseId, mealId],
            (error, result, fields) => {
                if (error) {
                    res.status(500).json({ "error": "An error occured while fetching the data" })
                } else if (!result[0]) {
                    res.status(404).json({ "error": "No meals found found for house id: " + huisId })
                }
                else {
                    res.status(200).json(result)
                }
                res.end();
            })
    },
    DeleteParticipantFromMeal(req, res, next) {
        const token = req.header('X-Access-Token');
        let email = auth.getEmailFromToken(token) || '';
        const houseId = req.params.id;
        const mealId = req.params.mid;

        db.query('DELETE deelnemers FROM deelnemers INNER JOIN user ON deelnemers.UserID = user.ID WHERE user.Email = ? AND deelnemers.MaaltijdID = ? AND deelnemers.StudentenhuisID = ?',
        [email, mealId,houseId],
        (errorInner, resultInner, fieldsInner) => {
            if(errorInner)
            {
                res.status(500).json({"error" : "Something went wrong while trying to delete entry from meals"})
            }
            if(!resultInner){
                res.status(404).json({ "error": "one or more params incorrect" })
            }
            if (resultInner.affectedRows > 0) {
                res.status(200).json({ "succes" : "Changes were made"});
            }
            else{
                res.status(409).json({ "error": "Could not delete participant, are you the owner of this record?" })
            }
        })
    },
}