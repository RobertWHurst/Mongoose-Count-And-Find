
Mongoose Count & Find
=====================

Mongoose Count & Find is a Mongoose plugin that provides a method,
`countAndFind()`, for performing a count and a find at the same time. The
point is to provide a count in addition to a set of matching documents. The
important thing to note is that as with `countAndfind()` behaves just like
`find()` you can use `limit()` and `skip()`, but these will only affect the
set of matching documents fetched, not the count. This makes for simpler code
when dealing with paginated results via REST.

`countAndFind()` has exactly the same signature and behavior as the built in
`find()` method with one exception. The `countAndFind()` calls back with the
total count of documents matching the query conditions in addition to the
expected array of documents.

```javascript
Contact.countAndFind({ name: /^R/ }, function(err, contacts, contactCount) {
  // contacts is [
  //   {
  //     _id      : 568da29c1fd5055957c88f4c,
  //     name     : 'Robert Hurst',
  //     createdAt: Mon Jan 04 2016 16:39:23 GMT-0800 (PST),
  //     updatedAt: Wed Jan 06 2016 16:39:23 GMT-0800 (PST)
  //   }, {
  //     _id      : 568da29c1fd5055957c88f4c,
  //     name     : 'Rick Xu',
  //     createdAt: Thur Jan 07 2016 16:39:23 GMT-0800 (PST),
  //     updatedAt: Thur Jan 07 2016 16:39:24 GMT-0800 (PST)
  //   },
  // ];
  // contactCount is 2
});

Contact.countAndFind({ name: /^R/ })
  .limit(1)
  .skip(1)
  .sort([['name', -1]])
  .exec(function(err, contacts, contactCount) {
    // contacts is [
    //   {
    //     _id      : 568da29c1fd5055957c88f4c,
    //     name     : 'Robert Hurst',
    //     createdAt: Mon Jan 04 2016 16:39:23 GMT-0800 (PST),
    //     updatedAt: Wed Jan 06 2016 16:39:23 GMT-0800 (PST)
    //   }
    // ];
    // contactCount is 2
  });
```
