'use strict';

var app = require('../..');
import request from 'supertest';

var newMonsta;

describe('Monsta API:', function() {

  describe('GET /api/monstas', function() {
    var monstas;

    beforeEach(function(done) {
      request(app)
        .get('/api/monstas')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          monstas = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      monstas.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/monstas', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/monstas')
        .send({
          name: 'New Monsta',
          info: 'This is the brand new monsta!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newMonsta = res.body;
          done();
        });
    });

    it('should respond with the newly created monsta', function() {
      newMonsta.name.should.equal('New Monsta');
      newMonsta.info.should.equal('This is the brand new monsta!!!');
    });

  });

  describe('GET /api/monstas/:id', function() {
    var monsta;

    beforeEach(function(done) {
      request(app)
        .get('/api/monstas/' + newMonsta._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          monsta = res.body;
          done();
        });
    });

    afterEach(function() {
      monsta = {};
    });

    it('should respond with the requested monsta', function() {
      monsta.name.should.equal('New Monsta');
      monsta.info.should.equal('This is the brand new monsta!!!');
    });

  });

  describe('PUT /api/monstas/:id', function() {
    var updatedMonsta;

    beforeEach(function(done) {
      request(app)
        .put('/api/monstas/' + newMonsta._id)
        .send({
          name: 'Updated Monsta',
          info: 'This is the updated monsta!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedMonsta = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedMonsta = {};
    });

    it('should respond with the updated monsta', function() {
      updatedMonsta.name.should.equal('Updated Monsta');
      updatedMonsta.info.should.equal('This is the updated monsta!!!');
    });

  });

  describe('DELETE /api/monstas/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/monstas/' + newMonsta._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when monsta does not exist', function(done) {
      request(app)
        .delete('/api/monstas/' + newMonsta._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
