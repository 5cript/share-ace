module.exports = function(config) {
  var r = require('rethinkdb');
  require('rethinkdb-init')(r);

  // Create database and tables
  debugger;
  r.promise = r.init(
    config.rethinkdb, config.tables)
    .then(function (conn) {
      console.log ('READY');
      r.conn = conn;
      r.conn.use(config.rerthinkdb.db);
    });

  // Create database and tables
  /*
  debugger;
  console.log ('init');
  r.promise = r.init({
    host: 'srv2',
    port: 28015,
    db: 'sharejs'
  }, [
    'documents',
    'document_ops'
  ])
  .then(function (conn) {
    console.log('READY');
    r.conn = conn;
    r.conn.use('sharejs');
  });
  */

  return r;
}
