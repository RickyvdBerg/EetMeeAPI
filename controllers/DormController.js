const db = require('../datasource/mysql-connector');
const auth = require('../auth/authentication');

module.exports = {
    getSpecificDorm(req, res, next) {
        const houseId = req.params.id;

        db.query('SELECT * FROM studentenhuis WHERE ID = ?',
            [houseId],
            (error, result, fields) => {
                if (error) {
                    res.status(500).json({ "error": "An error occured while fetching the data" })
                } else if (!result[0]) {
                    res.status(500).json({ "error": "No houses found!" })
                }
                else {
                    res.status(200).json(result)
                }
                res.end();
            })
    },
    getAll(req, res, next) {
        db.query({
            sql: "SELECT * FROM studentenhuis"
        }, function (error, result, fields) {
            if (error) {
                res.status(500).json(error.toString())
            } else {
                res.status(200).json(result)
            }
            res.end();
        });
    },
    postDorm(req, res, next) {

        let studentenhuis = req.body;

        assert.equal(typeof (req.body.naam), 'string', "Argument 'Naam' must be a string.");
        assert.equal(typeof (req.body.adres), 'string', "Argument 'Adres' must be a string.");

        const query = {
            sql: 'INSERT INTO `studentenhuis`(Naam, Adres) VALUES (?, ?)',
            values: [studentenhuis.naam, studentenhuis.adres],
            timeout: 2000
        };

        console.log('QUERY: ' + query.sql);

        db.query(query, (error, rows, fields) => {
            if (error) {
                res.status(412).json({ "error": "Error while trying to insert data" })
            } else {
                res.status(200).json(rows)
            }
        })
    },
    posttest(req, res, next) {
        let email = '';
        let token = req.header('X-Access-Token');
        auth.decodeToken(token, function (err, payload) {
            if (err) {
                res.status(401).json({ error: new Error("Not authorised").message });
            } else {
                email = payload.sub;
            }
        });

        var name = req.body.naam || '';
        var adres = req.body.adres || '';

        if (name.length < 2 || !name) { res.status(412).json({ "error": "name too short" }); return }
        if (adres.length < 2 || !adres) { res.status(412).json({ "error": "adres too short" }); return }

        const query = {
            sql: 'INSERT INTO `studentenhuis`(`Naam`, `Adres`) VALUES (?, ?)',
            values: [name, adres],
            timeout: 2000
        };

        db.query('SELECT ID FROM user WHERE Email = ?', [email], (error, result, fields) => {
            db.query(query,
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
}
