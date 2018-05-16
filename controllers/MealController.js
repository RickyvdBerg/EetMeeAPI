const db = require('../datasource/mysql-connector');
const auth = require('../auth/authentication');


module.exports = {
    postMealToDorm(req, res, next) {
        let token = req.header('X-Access-Token');
        let email = auth.getEmailFromToken(token) || '';

        var name = req.body.naam || '';
        var description = req.body.beschrijving || '';
        var ingredients = req.body.ingredienten || '';
        var allergy = req.body.allergie || '';
        let price = Number(req.body.prijs || '');

        if (name.length < 2 || !name) { res.status(412).json({ "error": "firstname too short" }); return }
        if (!price) { res.status(412).json({ "error": "lastname too short" }); return }


        const houseId = req.params.id;
        db.query('SELECT ID FROM user WHERE Email = ?', [email], (error, result, fields) => {
            db.query('INSERT INTO maaltijd (`Naam`, `Beschrijving`, `Ingredienten`, `Allergie`, `Prijs`, `UserID`, `StudentenhuisID`) VALUES (?,?,?,?,?,?,?)',
                [name, description, ingredients, allergy, price, result[0].ID, houseId],
                (errorMeals, resultMeals, fieldsMeals) => {
                    if (error) {
                        res.status(500).json({ "error": "An error occured while fetching the data" })
                    } else if (!result) {
                        res.status(404).json({ "error": "No meals found found for house id: " + houseId })
                    }
                    else {
                        res.status(200).json({ "succes": "Meal has been added"})
                    }
                    res.end();
                })
        })
    },
    getAllMeals(req, res, next) {

        const houseId = req.params.id;

        db.query('SELECT * FROM maaltijd WHERE StudentenHuisID = ?',
            [houseId],
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
    getMealById(req, res, next) {
        const houseId = req.params.id;
        const mealId = req.params.mid;

        db.query('SELECT * FROM maaltijd WHERE ID = ? AND StudentenHuisID = ?',
            [mealId, houseId],
            (error, result, fields) => {
                if (error) {
                    res.status(500).json({ "error": "An error occured while fetching the data" })
                } else if (!result[0]) {
                    res.status(404).json({ "error": "No meals found found with id: " + mealId })
                }
                else {
                    res.status(200).json(result)
                }
                res.end();
            })
    },
    updateMealById(req, res, next) {
        const mealId = req.params.mid;
        const token = req.header('X-Access-Token');

        let email = auth.getEmailFromToken(token) || '';

        let name = req.body.naam || '';
        let description = req.body.beschrijving || '';
        let ingredients = req.body.ingredienten || '';
        let allergy = req.body.allergie || '';
        let price = Number(req.body.prijs || 0);


        db.query('UPDATE maaltijd INNER JOIN user ON maaltijd.UserID = user.ID SET Naam = ?, Beschrijving = ?, ingredienten = ?, allergie = ?, prijs = ? WHERE user.Email = ? AND maaltijd.ID = ?',
            [name, description, ingredients, allergy, price, email, mealId],
            (error, result, fields) => {
                if(!result){
                    res.status(404).json({ "error": "one or more params incorrect" })
                }
                if (result.changedRows == 0) {
                    res.status(412).json({ "error": "No changes were made, are you the owner of the meal?" })
                }
                else {
                    res.status(200).json({ "succes": "Changes were made" })
                }
            })
    },
    deleteMealById(req, res, next) {
        const mealId = req.params.mid;
        const token = req.header('X-Access-Token');

        let email = auth.getEmailFromToken(token) || '';

        db.query('DELETE deelnemers FROM deelnemers INNER JOIN user ON deelnemers.UserID = user.ID WHERE user.Email = ? AND deelnemers.MaaltijdID = ?',
            [email, mealId],
            (error, result, fields) => {
                if(error)
                {
                    console.log(error)
                    res.status(500).json({"error" : "Something went wrong while trying to delete entry from participents"})
                }
                if(!result){
                    res.status(404).json({ "error": "one or more params incorrect" })
                }
                if (result.affectedRows > 0) {
                    db.query('DELETE maaltijd FROM maaltijd INNER JOIN user ON maaltijd.UserID = user.ID WHERE user.Email = ? AND maaltijd.ID = ?',
                        [email, mealId],
                        (errorInner, resultInner, fieldsInner) => {
                            if(errorInner)
                            {
                                console.log(errorInner)
                                res.status(500).json({"error" : "Something went wrong while trying to delete entry from meals"})
                            }
                            if(!resultInner){
                                res.status(404).json({ "error": "one or more params incorrect" })
                            }
                            if (resultInner.affectedRows > 0) {
                                res.status(200).json({ "succes" : "Changes were made"});
                            }
                        })
                }
                else {
                    console.log("no rows affected")
                    res.status(409).json({ "error": "No changes were made, are you the owner of the meal?" })
                }
            })

    }
}