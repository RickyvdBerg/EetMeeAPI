/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

chai.should()
chai.use(chaiHttp)

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.
let validToken

describe('Registration', () => {
    it('should return a token when providing valid information', (done) => {
        chai.request(server)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
            "firstname": "testRegistration",
            "lastname": "testRegistartion",
            "email": "test@registration.nl",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object');

            const response = res.body
            response.should.have.property('token').which.is.a('string')
            response.should.have.property('email').which.is.a('string')
        
            validToken = res.body.token
            module.exports = {
                token: validToken
            }

            done();
        })
    })

    it('should return an error on GET request', (done) => {
        chai.request(server)
        .get('/api/register')
        .end((err, res) => {
            res.should.have.status(404)
            res.body.should.have.property('error')
        })
        done()
    })

    it('should throw an error when the user already exists', (done) => {
        chai.request(server)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
            "firstname": "testRegistration",
            "lastname": "testRegistartion",
            "email": "test@registration.nl",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

    it('should throw an error when no firstname is provided', (done) => {
        chai.request(server)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
            "lastname": "testRegistartion",
            "email": "test@registration.nl",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

    it('should throw an error when firstname is shorter than 2 chars', (done) => {
        chai.request(server)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
            "firstname": "1",
            "lastname": "testRegistartion",
            "email": "test@registration.nl",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

    it('should throw an error when no lastname is provided', (done) => {
        chai.request(server)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
            "firstname": "testRegistration",
            "email": "test@registration.nl",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

    it('should throw an error when lastname is shorter than 2 chars', (done) => {
        chai.request(server)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
            "firstname": "testRegistration",
            "lastname": "1",
            "email": "test@registration.nl",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

    it('should throw an error when email is invalid', (done) => {
        chai.request(server)
        .post('/api/register')
        .set('Content-Type', 'application/json')
        .send({
            "firstname": "testRegistration",
            "lastname": "testRegistartion",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

})

describe('Login', () => {

    it('should return a token when providing valid information', (done) => {
        chai.request(server)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
            "email": "test@registration.nl",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object');

            const response = res.body
            response.should.have.property('token').which.is.a('string')
            response.should.have.property('email').which.is.a('string')
        
            validToken = res.body.token
            module.exports = {
                token: validToken
            }

            done();
        })
    })

    it('should throw an error when email does not exist', (done) => {
        chai.request(server)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

    it('should throw an error when email exists but password is invalid', (done) => {
        chai.request(server)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
            "email": "test@registration.nl",
            "password": "banana"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

    it('should throw an error when using an invalid email', (done) => {
        chai.request(server)
        .post('/api/login')
        .set('Content-Type', 'application/json')
        .send({
            "email": "testdata",
            "password": "registering"
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

})