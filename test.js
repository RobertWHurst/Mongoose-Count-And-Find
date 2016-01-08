var assert               = require('assert');
var sinon                = require('sinon');
var schemaMock           = require('./schema-mock');
var mongooseCountAndFind = require('./');

describe('mongooseCountAndFind()', function() {

  it('accepts a schema object', sinon.test(function() {
    mongooseCountAndFind(schemaMock);
  }));

  it('adds schema.static.countAndFind()', sinon.test(function() {
    mongooseCountAndFind(schemaMock);
    sinon.assert.calledWith(schemaMock.static, 'countAndFind');
  }));
});


describe('schema.methods.countAndFind()', function() {

  it('calls back with an array of documents and the total count matching', sinon.test(function() {
    mongooseCountAndFind(schemaMock);

    assert.equal(schemaMock.static.getCall(0).args[0], 'countAndFind');

    var countAndFind = schemaMock.static.getCall(0).args[1];
    var cb           = sinon.stub();
    var conditions   = { key: 'val' };
    var documents    = [{ key: 'val' }];
    var query = {
      exec    : sinon.stub().callsArgWith(0, null, documents),
      getQuery: sinon.stub().returns(conditions)
    };
    var Model = {
      find : sinon.stub().returns(query),
      count: sinon.stub().callsArgWith(1, null, 2)
    };

    countAndFind.call(Model, conditions, cb);

    sinon.assert.calledWith(Model.find, conditions);
    sinon.assert.calledWith(Model.count, conditions);
    sinon.assert.calledWith(cb, null, documents, 2);
  }));

  it('returns a query object if a callback is not provided', sinon.test(function() {
    mongooseCountAndFind(schemaMock);

    assert.equal(schemaMock.static.getCall(0).args[0], 'countAndFind');

    var countAndFind = schemaMock.static.getCall(0).args[1];
    var conditions   = { key: 'val' };
    var documents    = [{ key: 'val' }];
    var query = {
      exec    : sinon.stub().callsArgWith(0, null, documents),
      getQuery: sinon.stub().returns(conditions)
    };
    var Model = {
      find : sinon.stub().returns(query),
      count: sinon.stub().callsArgWith(1, null, 2)
    };

    var _query = countAndFind.call(Model, conditions);

    assert.equal(_query, query);
  }));

  describe('query.exec()', function() {

    it('calls back with an array of documents and the total count matching', sinon.test(function() {
      mongooseCountAndFind(schemaMock);

      assert.equal(schemaMock.static.getCall(0).args[0], 'countAndFind');

      var countAndFind = schemaMock.static.getCall(0).args[1];
      var cb           = sinon.stub();
      var conditions   = { key: 'val' };
      var documents    = [{ key: 'val' }];
      var query = {
        exec    : sinon.stub().callsArgWith(0, null, documents),
        getQuery: sinon.stub().returns(conditions)
      };
      var Model = {
        find : sinon.stub().returns(query),
        count: sinon.stub().callsArgWith(1, null, 2)
      };

      var _query = countAndFind.call(Model, conditions);
      _query.exec(cb);

      sinon.assert.calledWith(Model.find, conditions);
      sinon.assert.calledWith(Model.count, conditions);
      sinon.assert.calledWith(cb, null, documents, 2);
    }));
  });
});
