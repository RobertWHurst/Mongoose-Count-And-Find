

function coundAndFind(schema) {
  schema.static('countAndFind', function(    ) {
    var _this = this;
    var args  = Array.prototype.slice.call(arguments, 0);


    var cb;
    if (typeof args[args.length - 1] === 'function') {
      cb = args.pop();
    }

    var query   = this.find.apply(this, args);
    var orgExec = query.exec;

    query.exec = function(cb) {
      cb || (cb = function() {});

      var count;
      var documents;

      var finish = function(err) {
        if (!cb) { return; }
        if (err) { cb(err); return cb = null; }
        if (count === undefined || documents === undefined) { return; }
        cb(null, documents, count); cb = null;
      };

      orgExec.call(query, function(err, _documents) {
        if (err) { return finish(err); }
        documents = _documents;
        finish(null);
      });

      _this.count(query.getQuery(), function(err, _count) {
        if (err) { return finish(err); }
        count = _count;
        finish(null);
      });
    };

    if (cb) { return query.exec(cb); }

    return query;
  });
}


module.exports = coundAndFind;
