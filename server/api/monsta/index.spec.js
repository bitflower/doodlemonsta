'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var monstaCtrlStub = {
  index: 'monstaCtrl.index',
  show: 'monstaCtrl.show',
  create: 'monstaCtrl.create',
  update: 'monstaCtrl.update',
  destroy: 'monstaCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var monstaIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './monsta.controller': monstaCtrlStub
});

describe('Monsta API Router:', function() {

  it('should return an express router instance', function() {
    monstaIndex.should.equal(routerStub);
  });

  describe('GET /api/monstas', function() {

    it('should route to monsta.controller.index', function() {
      routerStub.get
        .withArgs('/', 'monstaCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/monstas/:id', function() {

    it('should route to monsta.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'monstaCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/monstas', function() {

    it('should route to monsta.controller.create', function() {
      routerStub.post
        .withArgs('/', 'monstaCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/monstas/:id', function() {

    it('should route to monsta.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'monstaCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/monstas/:id', function() {

    it('should route to monsta.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'monstaCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/monstas/:id', function() {

    it('should route to monsta.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'monstaCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
