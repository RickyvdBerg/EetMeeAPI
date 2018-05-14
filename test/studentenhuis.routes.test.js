const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')


chai.should()
chai.use(chaiHttp)

describe('Studentenhuis API POST', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })


    it('should return a studentenhuis when posting a valid object', (done) => {
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


describe('Studentenhuis API GET all', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        const token = '1253'
        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-acces-token', token)
            .end((err, res) => {
                res.should.have.status(401)
                done()

            })
    })

    it('should return all studentenhuizen when using a valid token', (done) => {
        chai.request(server)
            .get('/api/studentenhuis')
            .set('x-acces-token', token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('ID');
                res.body[0].should.have.property('Naam');
                res.body[0].should.have.property('Adres');
                res.body[0].Naam.should.equal('Lovensdijk');
                res.body[0].Adres.should.equal('Lovensdijkstraat, Breda');
                done();
            })
    })
})

describe('Studentenhuis API GET one', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        chai.request(server)
            .get('/api/studentenhuis/2')
            .set('x-acces-token', token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('ID');
                res.body[0].should.have.property('Naam');
                res.body[0].should.have.property('Adres');
                res.body[0].Naam.should.equal('Lovensdijk');
                res.body[0].Adres.should.equal('Lovensdijkstraat, Breda');
                done()
            })
    })

    it('should return the correct studentenhuis when using an existing huisId', (done) => {
        chai.request(server)
            .get('/api/studentenhuis/1')
            .set('x-acces-token', token)
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.have.property('ID');
                res.body[0].should.have.property('Naam');
                res.body[0].should.have.property('Adres');
                res.body[0].Naam.should.equal('Lovensdijk');
                res.body[0].Adres.should.equal('Lovensdijkstraat, Breda');
                done()
            })
    })

    it('should return an error when using an non-existing huisId', (done) => {
        chai.request(server)
            .get('/api/studentenhuis/2')
            .set('x-acces-token', token)
            .end(function (err, res) {
                res.should.have.status(401);
                done()
            })
    })

})

describe('Studentenhuis API PUT', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return a studentenhuis with ID when posting a valid object', (done) => {
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

describe('Studentenhuis API DELETE', () => {
    it('should throw an error when using invalid JWT token', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('should return a studentenhuis when posting a valid object', (done) => {
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

