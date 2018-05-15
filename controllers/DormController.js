const db = require('../datasource/mysql-connector');

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
    }
}