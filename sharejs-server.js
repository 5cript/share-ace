module.exports = function(config)
{
  var connect = require('connect'),
    http = require('http'),
    shareJSapp = connect(),
    shareJSServer = http.createServer(shareJSapp),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
      server: shareJSServer
    });

  var socketConnectionHandler = require('./socket-handler')(config);

  // Listen for socket connections
  wss.on('connection', socketConnectionHandler);

  return shareJSServer;
}
