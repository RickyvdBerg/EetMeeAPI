const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

describe('Participation API POST', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis/1/maaltijd/1/deelnemers')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })

    it('should return a Deelnemer when posting a valid object', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .post('/api/studentenhuis/5/maaltijd/5/deelnemers') 
            .set('x-access-token', token)
            .send({
                    "UserID": "5",
                    "StudentenhuisID": "5",
                    "MaaltijdID": "5"
                  
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });
});

describe('Maaltijd API GET', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis/1/maaltijd/1/deelnemers')
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
});