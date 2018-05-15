const db = require('../datasource/mysql-connector');

module.exports = {
    postMealToDorm(req, res, next) {
        let email = '';
        let token = req.header('X-Access-Token');
        auth.decodeToken(token, function (err, payload) {
            if (err) {
                res.status(401).json({ error: new Error("Not authorised").message });
            } else {
                email = payload.sub;
                console.log(email);
            }
        });

        var name = req.body.naam || '';
        var description = req.body.beschrijving || '';
        var ingredients = req.body.ingredienten || '';
        var allergy = req.body.allergie || '';
        let price = Number(req.body.prijs || '');

        console.log(req.body)

        const houseId = req.params.id;
        db.query('SELECT ID FROM user WHERE Email = ?', [email], (error, result, fields) => {
            console.log(result)
            db.query('INSERT INTO maaltijd (`Naam`, `Beschrijving`, `Ingredienten`, `Allergie`, `Prijs`, `UserID`, `StudentenhuisID`) VALUES (?,?,?,?,?,?,?)',
                [name, description, ingredients, allergy, price, result[0].ID, houseId],
                (errorMeals, resultMeals, fieldsMeals) => {
                    console.log(resultMeals);
                    if (error) {
                        console.log(error)
                        res.status(500).json({ "error": "An error occured while fetching the data" })
                    } else if (!result) {
                        res.status(500).json({ "error": "No meals found found for house id: " + houseId })
                    }
                    else {
                        res.status(200).json(result)
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
                console.log(error)
                if (error) {
                    res.status(500).json({ "error": "An error occured while fetching the data" })
                } else if (!result[0]) {
                    res.status(500).json({ "error": "No meals found found for house id: " + huisId })
                }
                else {
                    res.status(200).json(result)
                }
                res.end();
            })
    }
}