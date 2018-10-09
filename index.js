const countAndFind = (schema) => {
  schema.static('countAndFind', function(...args) {
    let cb
    if (typeof args[args.length - 1] === 'function') {
      cb = args.pop()
    }

    const query        = this.find.apply(this, args)
    const originalExec = query.exec

    const Model = this

    query.exec = function(cb) {
      let promise
      if (typeof cb !== 'function') {
        promise = new Promise((resolve, reject) => {
          cb = (err) => {
            if (err) { return reject(err) }
            resolve()
          }
        })
      }

      let count
      let documents

      const finish = (err) => {
        if (typeof cb !== 'function') { return }
        if (err) { cb(err); cb = null; return }
        if (count === undefined || documents === undefined) { return }
        cb(null, documents, count)
      }

      originalExec.call(query, (err, _documents) => {
        if (err) { return finish(err) }
        documents = _documents
        finish(null)
      })

      Model.count(query.getQuery(), (err, _count) => {
        if (err) { return finish(err) }
        count = _count
        finish(null)
      })

      return promise
    }

    if (cb) { return query.exec(cb) }
    return query
  })
}

module.exports = countAndFind
