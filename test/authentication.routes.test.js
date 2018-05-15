/**
 * Testcases aimed at testing the authentication process. 
 */
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')

const USER_FIRST_NAME = 'TEST';
const USER_LAST_NAME = 'TEST';
const USER_EMAIL_UNIQUE = Date.now().toString() + "@test.com";
const USER_PASSWORD = "password";

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
            "firstname": USER_FIRST_NAME,
            "lastname": USER_LAST_NAME,
            "email": USER_EMAIL_UNIQUE,
            "password": USER_PASSWORD
        })
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object');

            const response = res.body
            response.should.have.property('token').which.is.a('string')
            response.should.have.property('email').which.is.a('string')
        

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
            "firstname": USER_FIRST_NAME,
            "lastname": USER_LAST_NAME,
            "email": USER_EMAIL_UNIQUE,
            "password": USER_PASSWORD
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
            "lastname": USER_LAST_NAME,
            "email": USER_EMAIL_UNIQUE,
            "password": USER_PASSWORD
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
            "firstname": USER_LAST_NAME.charAt(0),
            "lastname": USER_LAST_NAME,
            "email": USER_EMAIL_UNIQUE,
            "password": USER_PASSWORD
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
            "firstname": USER_LAST_NAME,
            "email": USER_EMAIL_UNIQUE,
            "password": USER_PASSWORD
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
            "firstname": USER_LAST_NAME,
            "lastname": USER_LAST_NAME.charAt(0),
            "email": USER_EMAIL_UNIQUE,
            "password": USER_PASSWORD
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
            "firstname": USER_LAST_NAME,
            "lastname": USER_LAST_NAME,
            "password": USER_PASSWORD
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
            "email": 'test@server.nl',
            "password": 'secret'
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
            "password": USER_PASSWORD
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
            "email": USER_EMAIL_UNIQUE,
            "password": "wrongpassword"
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
            "email": "wrongemail",
            "password": USER_PASSWORD
        })
        .end((err, res) => {
            res.should.have.status(401)
            res.body.should.have.property('error')
            done();
        })
    })

})