const assert               = require('assert')
const sinon                = require('sinon')
const schemaMock           = require('./schema-mock')
const mongooseCountAndFind = require('./')

describe('mongooseCountAndFind()', () => {

  it('accepts a schema object', sinon.test(() => {
    mongooseCountAndFind(schemaMock)
  }))

  it('adds schema.static.countAndFind()', sinon.test(() => {
    mongooseCountAndFind(schemaMock)
    sinon.assert.calledWith(schemaMock.static, 'countAndFind')
  }))
})


describe('schema.methods.countAndFind()', () => {

  it('calls back with an array of documents and the total count matching', sinon.test(() => {
    mongooseCountAndFind(schemaMock)

    assert.equal(schemaMock.static.getCall(0).args[0], 'countAndFind')

    const countAndFind = schemaMock.static.getCall(0).args[1]
    const cb           = sinon.stub()
    const conditions   = { key: 'val' }
    const documents    = [{ key: 'val' }]
    const query = {
      exec    : sinon.stub().callsArgWith(0, null, documents),
      getQuery: sinon.stub().returns(conditions)
    }
    const Model = {
      find : sinon.stub().returns(query),
      count: sinon.stub().callsArgWith(1, null, 2)
    }

    countAndFind.call(Model, conditions, cb)

    sinon.assert.calledWith(Model.find, conditions)
    sinon.assert.calledWith(Model.count, conditions)
    sinon.assert.calledWith(cb, null, documents, 2)
  }))

  it('returns a query object if a callback is not provided', sinon.test(() => {
    mongooseCountAndFind(schemaMock)

    assert.equal(schemaMock.static.getCall(0).args[0], 'countAndFind')

    const countAndFind = schemaMock.static.getCall(0).args[1]
    const conditions   = { key: 'val' }
    const documents    = [{ key: 'val' }]
    const query = {
      exec    : sinon.stub().callsArgWith(0, null, documents),
      getQuery: sinon.stub().returns(conditions)
    }
    const Model = {
      find : sinon.stub().returns(query),
      count: sinon.stub().callsArgWith(1, null, 2)
    }

    const _query = countAndFind.call(Model, conditions)

    assert.equal(_query, query)
  }))

  describe('query.exec()', () => {

    it('calls back with an array of documents and the total count matching', sinon.test(() => {
      mongooseCountAndFind(schemaMock)

      assert.equal(schemaMock.static.getCall(0).args[0], 'countAndFind')

      const countAndFind = schemaMock.static.getCall(0).args[1]
      const cb           = sinon.stub()
      const conditions   = { key: 'val' }
      const documents    = [{ key: 'val' }]
      const query = {
        exec    : sinon.stub().callsArgWith(0, null, documents),
        getQuery: sinon.stub().returns(conditions)
      }
      const Model = {
        find : sinon.stub().returns(query),
        count: sinon.stub().callsArgWith(1, null, 2)
      }

      const _query = countAndFind.call(Model, conditions)
      _query.exec(cb)

      sinon.assert.calledWith(Model.find, conditions)
      sinon.assert.calledWith(Model.count, conditions)
      sinon.assert.calledWith(cb, null, documents, 2)
    }))

    it('returns a promise if no callback is provided', sinon.test(() => {
      mongooseCountAndFind(schemaMock)

      assert.equal(schemaMock.static.getCall(0).args[0], 'countAndFind')

      const countAndFind = schemaMock.static.getCall(0).args[1]
      const cb = sinon.stub()
      const conditions = { key: 'val' }
      const documents = [{ key: 'val' }]
      const query = {
        exec: sinon.stub().callsArgWith(0, null, documents),
        getQuery: sinon.stub().returns(conditions)
      }
      const Model = {
        find: sinon.stub().returns(query),
        count: sinon.stub().callsArgWith(1, null, 2)
      }

      const _query = countAndFind.call(Model, conditions)
      _query.exec().then(cb).catch(cb)

      process.nextTick(() => {
        sinon.assert.calledWith(Model.find, conditions)
        sinon.assert.calledWith(Model.count, conditions)
        sinon.assert.calledOnce(cb)
        sinon.assert.calledWith(cb, documents, 1)
      })
    }))
  })
})
