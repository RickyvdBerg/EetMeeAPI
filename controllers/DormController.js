const db = require('../datasource/mysql-connector');
const auth = require('../auth/authentication');

module.exports = {
    getSpecificDorm(req, res, next) {
        const houseId = req.params.id;

        db.query('SELECT * FROM studentenhuis WHERE ID = ?', [houseId],
            (error, result, fields) => {
                if (error) {
                    res.status(500).json({
                        "error": "An error occured while fetching the data"
                    })
                } else if (!result[0]) {
                    res.status(404).json({
                        "error": "No houses found!"
                    })
                } else {
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
                res.status(500).json({"error": "Could not fetch dorms from db"})
            } else {
                res.status(200).json(result)
            }
            res.end();
        });
    },
    postDorm(req, res, next) {
        let email = '';
        let token = req.header('X-Access-Token');
        auth.decodeToken(token, function (err, payload) {
            if (err) {
                res.status(401).json({
                    error: new Error("Not authorised").message
                });
            } else {
                email = payload.sub;
            }
        });

        var name = req.body.naam || '';
        var adres = req.body.adres || '';

        if (name.length < 2 || !name) {
            res.status(412).json({
                "error": "name too short"
            });
            return
        }
        if (adres.length < 2 || !adres) {
            res.status(412).json({
                "error": "adres too short"
            });
            return
        }

        const query = {
            sql: 'INSERT INTO studentenhuis (Naam, Adres, UserID) VALUES (?,?, (SELECT ID from user where Email = ?))',
            values: [name, adres, email],
            timeout: 2000
        };

        db.query('SELECT ID FROM user WHERE Email = ?', [email], (error, result, fields) => {
            db.query(query,
                (error, result) => {
                    if (error) {
                        console.log(error)
                        res.status(500).json({
                            "error": "An error occured while fetching the data"
                        })
                    } else if (!result) {
                        res.status(500).json({
                            "error": "No houses found"
                        })
                    } else if (result.affectedRows > 0) {
                        res.status(200).json(
                            {
                                'succes':'Row inserted', 'ID' : result.insertId
                            }
                        );
                    }
                    res.end();
                })
        })
    },

    putDorm(req, res, next) {
        let email = '';
        let token = req.header('X-Access-Token');
        auth.decodeToken(token, function (err, payload) {
            if (err) {
                res.status(401).json({
                    error: new Error("Not authorised").message
                });
            } else {
                email = payload.sub;
            }
        });

        var name = req.body.naam || '';
        var adres = req.body.adres || '';
        const houseId = req.params.id;


        if (name.length < 2 || !name) {
            res.status(412).json({
                "error": "name too short"
            });
            return
        }
        if (adres.length < 2 || !adres) {
            res.status(412).json({
                "error": "adres too short"
            });
            return
        }

        const query = {
            sql: 'UPDATE studentenhuis INNER JOIN user ON studentenhuis.UserID = user.ID SET Naam = ?, Adres = ? WHERE user.Email = ? AND studentenhuis.ID = ?',
            values: [name, adres, email, houseId],
            timeout: 2000
        };

        db.query('SELECT ID FROM user WHERE Email = ?', [email], (error, result, fields) => {
            db.query(query,
                (error, result, fields) => {
                    if (error) {
                        res.status(500).json({
                            "error": "An error occured while fetching the data"
                        })
                    } else if (!result) {
                        res.status(404).json({
                            "error": "No email found for houseId: " + houseId
                        })
                    } else if (result.affectedRows > 0) {
                        res.status(200).json('Row updated')
                    }
                    res.end();
                })
        })
    },
    deleteDormTest(req, res, next) {
        const houseId = req.params.id;
        const token = req.header('X-Access-Token');

        let email = auth.getEmailFromToken(token) || '';

        db.query('DELETE deelnemers FROM deelnemers INNER JOIN user ON deelnemers.UserID = user.ID WHERE user.Email = ? AND deelnemers.StudentenhuisID = ?', [email, houseId],
            (error, result, fields) => {
                if (error) {
                    console.log(error)
                    res.status(500).json({
                        "error": "Something went wrong while trying to delete entry from participents"
                    })
                }
                if (result.affectedRows > 0 || result) {
                    db.query('DELETE maaltijd FROM maaltijd INNER JOIN user ON maaltijd.UserID = user.ID WHERE user.Email = ? AND maaltijd.StudentenhuisID = ?', [email, houseId],
                        (errorInner, resultInner, fieldsInner) => {
                            if(resultInner.affectedRows > 0 || resultInner)
                            {
                                db.query('DELETE studentenhuis FROM studentenhuis INNER JOIN user ON studentenhuis.UserID = user.ID WHERE user.Email = ? AND studentenhuis.ID = ?', [email, houseId],
                                (errorEnd, resultEnd, fieldsEnd) => {
                                    if (errorEnd) {
                                        console.log(errorEnd)
                                        res.status(500).json({
                                            "error": "Something went wrong while trying to delete entry from studentenhuis"
                                    
                                        })
                                        return;
                                    }
                                    if(!resultEnd)
                                    {
                                        res.status(404).json({
                                            "succes": "Dorm id not found"
                                        });
                                    }
                                    if (resultEnd.affectedRows > 0) {
                                        res.status(200).json({
                                            "succes": "Changes were made"
                                        });
                                    }
                                });
                            }
                            else{
                                res.status(500).json({
                                    "error": "could not delete from meals"
                                });
                            }
                        })
                } else {
                    res.status(409).json({
                        "error": "Something went wrong, are you the creator of this house?"
                    });
                }
            }
        )
    }

}