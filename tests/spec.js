'use strict';

const app = require('../app');
const User = require('../models').User;
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = require('chai').should(); // jshint ignore:line

chai.use(chaiHttp);

const exampleUsers = [{
        email: 'test@example.com',
        forename: 'first',
        surname: 'second'
    },{
        email: 'test2@example.com',
        forename: 'first',
        surname: 'second'
    }
];

describe('GET /user', function() {
    beforeEach(done => {
        User.destroy({
            truncate: true
        }).then(() => {
            done();
        });
    });

    it('Works when empty', function(done) {
        chai.request(app)
            .get('/user')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
    });

    it('Responds with a list', function(done) {
        User.bulkCreate(exampleUsers).then(() => {
            chai.request(app)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(exampleUsers.length);
                    res.body[0].email.should.be.eql(exampleUsers[0].email);
                    res.body[1].email.should.be.eql(exampleUsers[1].email);
                    done();
                });
        });
    });

});

describe('POST /user', function() {
    beforeEach(done => {
        User.destroy({
            truncate: true
        }).then(() => {
            done();
        });
    });

    it('Fail with no post data', function(done) {
        chai.request(app)
            .post('/user')
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                done();
            });
    });

    it('Works with correct data', function(done) {
        chai.request(app)
            .post('/user')
            .send(exampleUsers[0])
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.not.have.property('errors');
                res.body.should.have.property('id');
                res.body.should.have.property('email');
                res.body.should.have.property('forename');
                res.body.should.have.property('surname');
                res.body.should.have.property('created');
                done();
            });
    });

    it('Ignores ID', function(done) {
        chai.request(app)
            .post('/user')
            .send(Object.assign({
                id: 9999999999
            }, exampleUsers[0]))
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.not.have.property('errors');
                res.body.should.have.property('id');
                res.body.id.should.not.eq(9999999999);
                done();
            });
    });

    it('Fail on missing email', function(done) {
        const userMissingEmail = Object.assign({}, exampleUsers[0]);
        delete userMissingEmail.email;

        chai.request(app)
            .post('/user')
            .send(userMissingEmail)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.error.should.eq('There was an issue creating this user');
                res.body.errors.length.should.eq(1);
                res.body.errors[0].type.should.eq('notNull Violation');
                res.body.errors[0].path.should.eq('email');
                done();
            });
    });

    it('Fail on missing forename', function(done) {
        const userMissingForename = Object.assign({}, exampleUsers[0]);
        delete userMissingForename.forename;

        chai.request(app)
            .post('/user')
            .send(userMissingForename)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.error.should.eq('There was an issue creating this user');
                res.body.errors.length.should.eq(1);
                res.body.errors[0].type.should.eq('notNull Violation');
                res.body.errors[0].path.should.eq('forename');
                done();
            });
    });

    it('Fail on missing surname', function(done) {
        const userMissingSurname = Object.assign({}, exampleUsers[0]);
        delete userMissingSurname.surname;

        chai.request(app)
            .post('/user')
            .send(userMissingSurname)
            .end((err, res) => {
                res.should.have.status(500);
                res.body.should.be.a('object');
                res.body.should.have.property('errors');
                res.body.error.should.eq('There was an issue creating this user');
                res.body.errors.length.should.eq(1);
                res.body.errors[0].type.should.eq('notNull Violation');
                res.body.errors[0].path.should.eq('surname');
                done();
            });
    });

    it('Fails on duplicate emails', function(done) {
        chai.request(app)
            .post('/user')
            .send(exampleUsers[0])
            .end(() => {
                chai.request(app)
                    .post('/user')
                    .send(exampleUsers[0])
                    .end((err, res) => {
                        res.should.have.status(500);
                        res.body.should.be.a('object');
                        res.body.should.have.property('errors');
                        res.body.error.should.eq('There was an issue creating this user');
                        res.body.errors.length.should.eq(1);
                        res.body.errors[0].type.should.eq('unique violation');
                        res.body.errors[0].path.should.eq('email');
                        done();
                    });
            });
    });

});

describe('GET /user/userId', function() {
    beforeEach(done => {
        User.destroy({
            truncate: true
        }).then(() => {
            done();
        });
    });

    it('Fails on non existant userId', function(done) {
        chai.request(app)
            .get('/user/999999999')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.eq('Unable to find this user');
                done();
            });
    });

    it('Fails correctly on NaN', function(done) {
        User.bulkCreate(exampleUsers).then(() => {
            chai.request(app)
                .get('/user/username')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.eq('Invalid user ID supplied');
                    done();
                });
        })
    });

    it('Returns a valid user', function(done) {
        User.create(exampleUsers[0]).then(user => {
            chai.request(app)
                .get('/user/'+user.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.not.have.property('errors');
                    res.body.should.have.property('id');
                    res.body.id.should.eq(user.id);
                    res.body.should.have.property('email');
                    res.body.email.should.eq(user.email);
                    res.body.should.have.property('forename');
                    res.body.forename.should.eq(user.forename);
                    res.body.should.have.property('surname');
                    res.body.surname.should.eq(user.surname);
                    res.body.should.have.property('created');
                    new Date(res.body.created).getTime().should.eq(user.created.getTime());
                    done();
                });
            });
    });

});

describe('DELETE /user/userId', function() {
    let userToDelete;
    beforeEach(done => {
        User.destroy({
            truncate: true
        }).then(() => {
            User.bulkCreate(exampleUsers).then(() => {
                User.findOne({
                    where: { email: exampleUsers[0].email }
                }).then(user => {
                    userToDelete = user;
                    done();
                });
            });
        });
    });

    it('Fails on non existant userId', function(done) {
        chai.request(app)
            .delete('/user/999999999')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('error');
                res.body.error.should.eq('Unable to find this user');
                done();
            });
    });

    it('Fails correctly on NaN', function(done) {
            chai.request(app)
                .delete('/user/username')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.eq('Invalid user ID supplied');
                    done();
                });
    });

    it('Deletes a valid user', function(done) {
        chai.request(app)
            .delete('/user/'+userToDelete.id)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.message.should.eq('User Deleted');
                done();
            });
        });

    it('Deletes a single user', function(done) {
        chai.request(app)
            .delete('/user/'+userToDelete.id)
            .end(() => {
                chai.request(app)
                .get('/user')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(exampleUsers.length - 1);
                    res.body[0].email.should.be.eql(exampleUsers[1].email);
                    done();
                });
            });
        });

});
