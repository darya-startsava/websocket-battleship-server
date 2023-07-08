import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

import { WebSocketServer } from 'ws';

const webSocketServer = new WebSocketServer({ port: 3000 });

webSocketServer.on('connection', (socket) => {
  console.log('New connection opened');
  socket.on('message', (message) => {
    console.log(JSON.parse(message));
    socket.send(JSON.stringify(JSON.parse(message)));
  });
  socket.on('close', () => console.log('Connection closed'));
});


export const httpServer = http.createServer(function (req, res) {
  const __dirname = path.resolve(path.dirname(''));
  const file_path = __dirname + (req.url === '/' ? '/front/index.html' : '/front' + req.url);
  fs.readFile(file_path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
});
