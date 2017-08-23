# nested-beautifier

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/ovidiuionut94/djin/nested_beautifier/LICENSE) 
[![npm](https://img.shields.io/npm/dt/express.svg)](https://www.npmjs.com/package/nested-beautifier)
[![Code Climate](https://codeclimate.com/github/ovidiuionut94/djin/badges/gpa.svg)](https://codeclimate.com/github/ovidiuionut94/djin)

Small library that beautifies MySql results

Usually, when you're trying to get some complex data from a MySql server, the response needs
more computation to get it into a tree form. For example, when you're joining two tables, TableA and TableB, that are bonded
with a one to many relationship, you get a response like the following:

```js
result: [
{
  TableA: { id: 1 },
  TableB: { id: 1 }
},
{
  TableA: { id: 1  someMoreData... },
  TableB: { id: 2, someMoreData... }
}
...
]
// Observe that for every different TableB that is bonded with a TableA record, the data
// from TableA is duplicated
```

Wouldn't it be nice if you could transform this kind of data into a tree-like structure like the followig ?!

```js
result: [
  {
    TableA: {
      id: 1,
      TableB: [
        {
          id: 1,
          someMoreData...
        },
        {
          id: 2,
          someMoreData...
        }
      ]
  }
]
```
You can now achieve that using the "nested-beautifier"

# First steps
- Install the beautifier

```
npm install --save nested-beautifier
```

### Parameters


The nested-beautifier takes two parameters (Yeah... 2)

The first one is, obviously, a response got from MySql.

The second parameter must contain some information about the very first table from MySql that is included in the query.

For example, if we are using <b> 'SELECT [someData] FROM TableA INNER JOIN [someOtherTables]' </b>,
the second parameter will become an object like the following : 
```js
{
  idAttr: [a uniq table column, like id],
  name: 'TableA'
}
```

If the parent table doesn't contain a uniq column, then the 'nested-beautifier' will create a uniq
hash for every diffrent parent data.


### Usage

```js
// You need to require the library
var Beautifier = require('nested-beautifier')

// Say that we have a MySql response
var mySqlQuery = `SELECT * FROM TableA 
  INNER JOIN TableB ON TableB.tableAId = TableA.id`;
  
var MySqlResponse = ExecuteMySqlQuery(mySqlQuery);


var parentData = {
  idAttr: 'id',
  name: 'TableA'
}
var beautifiedResponse = Beautifier.beautify(MySqlResponse, parentData);
// That's all folks
```

