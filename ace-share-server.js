module.exports = function (shareConfig)
{
  var http = require('http');
  var express = require('express');
  _ = require('lodash');

  console.log (shareConfig.tables);
  var r = require('./db')(shareConfig);

  var shareJSServer = require('./sharejs-server')(shareConfig);
  var socketHandler = require('./socket-handler')(shareConfig); // statement has no effect (?)

  var app = express();
  var server = require('http').Server(app);
  var io = require('socket.io')(server);
  io.set('transports', ['websocket', 'polling']);

  app.use(express.static(__dirname + '/examples'));

  shareJSServer.listen(shareConfig.ports.sharejs);
  server.listen(shareConfig.ports.http);

  console.log ('io.on(connection)');
  io.on('connection', function (socket) {
      // Listen to changes on a specific table
      // Emit a socket event with the name of the table when anything changes on that table
      var listenToTable = function (tableName) {
          r.connect(shareConfig.rethinkdb).then(function (conn) {
            r.table(tableName)
             .changes()
             .run(conn)
             .then(function (cursor) {
               cursor.each(function (err, row) {
                socket.emit(tableName, row);
               });
             });
          });
      };
      /*
      console.log ('len: ', shareConfig.tables.length);
      for (i = 0; i != shareConfig.tables.length; ++i) {
        listenToTable(shareConfig.tables[i]);
        console.log ('listenToTable(shareConfig.tables[i]);');
      }
      */
      listenToTable('documents2');
      listenToTable('documents2_ops');
  });
}
