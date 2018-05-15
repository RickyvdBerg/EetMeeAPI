const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')


chai.should()
chai.use(chaiHttp)

describe('Studentenhuis API POST', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-access-token', token)
            .send({
                'naam': 'Avans',
                'adres': 'Hoogeschoollaan, Breda'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('should throw an error when naam is missing', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-access-token', token)
            .send({
                'naam': '',
                'adres': 'Hoogeschoollaan, Breda'
            })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });

    it('should throw an error when adres is missing', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .post('/api/studentenhuis')
            .set('x-access-token', token)
            .send(
            {
                'naam': 'Avans',
                'adres': ''
            })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });

})


describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })

    it('should return all studentenhuizen when using a valid token', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                done();
            })
    })
})

describe('Studentenhuis API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        token = 'invalid'
        chai.request(server)
            .get('/api/studentenhuis/2')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(401);
                res.should.be.json;
                done()
            })
    })

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .get('/api/studentenhuis/1')
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
            .get('/api/studentenhuis/999')
            .set('x-access-token', token)
            .end(function (err, res) {
                res.should.have.status(500);
                done()
            })
    })

})

describe('Studentenhuis API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('x-access-token', token)
            .send({
                'naam': 'Avans',
                'adres': 'Hoogeschoollaan, Breda'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                done()
            })
    })

    it('should throw an error when naam is missing', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('x-access-token', token)
            .send({
                'naam': '',
                'adres': 'Hoogeschoollaan, Breda'
            })
            .end(function (err, res) {
                res.should.have.status(412);
                done();
            });
    });

    it('should throw an error when adres is missing', (done) => {
        const token = require('./authentication.routes.test').token;
        chai.request(server)
            .put('/api/studentenhuis/1')
            .set('x-access-token', token)
            .send({
                'naam': 'Avans',
                'adres': ''
            })
            .end(function (err, res) {
                res.should.have.status(412);
                done()
            })
    })
})

describe('Studentenhuis API DELETE', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()
            })
    })
    //TODO BUG in deleting users

    // it('should return a studentenhuis when posting a valid object', (done) => {
    //     const token = require('./authentication.routes.test').token;
    //     chai.request(server)
    //         .delete('/api/studentenhuis/1')
    //         .set('x-access-token', token)
    //         .end(function (err, res) {
    //             res.should.have.status(200);
    //             done()
    //         })
    // })

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

