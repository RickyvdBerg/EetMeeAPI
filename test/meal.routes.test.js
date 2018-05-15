const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

describe('Maaltijd API POST', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis/1/maaltijd')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })

    it('should return a Maaltijd when posting a valid object', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .post('/api/studentenhuis/1/maaltijd') //TODO more secure test
            .set('x-access-token', token)
            .send({
                "naam": "TestMaaltijd",
                "beschrijving": "Erg hard(coded)",
                "ingredienten": "bugs",
                "allergie": "bugs",
                "prijs": 1337
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('should throw an error when naam is missing', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .post('/api/studentenhuis/1/maaltijd')
            .set('x-access-token', token)
            .send(
                {
                    "beschrijving": "Erg hard(coded)",
                    "ingredienten": "bugs",
                    "allergie": "bugs",
                    "prijs": 1337
                })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });

    it('should throw an error when prijs is missing', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .post('/api/studentenhuis/1/maaltijd')
            .set('x-access-token', token)
            .send(
                {
                    "naam": "TestMaaltijd",
                    "beschrijving": "Erg hard(coded)",
                    "ingredienten": "bugs",
                    "allergie": "bugs",
                })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });

})


describe('Maaltijd API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis/1/maaltijd')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })

    it('should return all studentenhuizen when using a valid token', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .get('/api/studentenhuis/1/maaltijd')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })
})

describe('Maaltijd API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        token = 'invalid'
        chai.request(server)
            .get('/api/studentenhuis/1/maaltijd/1')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                done()
            })
    })

    it('should return the correct Maaltijd when using an existing huisId and mealId', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .get('/api/studentenhuis/1/maaltijd/1')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                done()
            })
    })

    it('should return an error when using an non-existing huisId', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .get('/api/studentenhuis/0/maaltijd/1')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(500);
                done()
            })
    })

})

describe('Maaltijd API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = 'invalid';
        chai.request(server)
            .put('/api/studentenhuis/1/maaltijd/9')
            .set('x-access-token', token)
            .send({
                "naam": "TestMaaltijdUpdate",
                "beschrijving": "Niet langer hard!",
                "ingredienten": "geen bugs",
                "allergie": "geen bugs",
                "prijs": 1337
            })
            .end(function (err, res) {
                res.should.have.status(401);
                done()
            })
    })

    it('should return a Maaltijd with ID when posting a valid object', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .put('/api/studentenhuis/1/maaltijd/9')
            .set('x-access-token', token)
            .send({
                "naam": "TestMaaltijdUpdate",
                "beschrijving": Date.now().toString(),
                "ingredienten": "geen bugs",
                "allergie": "geen bugs",
                "prijs": 1337
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done()
            })
    })
})

describe('Maaltijd API DELETE', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return a Maaltijd when posting a valid object', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when naam is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should throw an error when adres is missing', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })
})

