import { WebSocketServer } from 'ws';
import { WS_PORT } from '../constants';
import reg from '../utils/reg';

const webSocketServer = new WebSocketServer({ port: WS_PORT });

webSocketServer.on('connection', (socket) => {
  console.log('New connection opened');

  socket.on('message', (message) => {
    const responseMessage = reg(message);
    socket.send(JSON.stringify(responseMessage));
  });
  socket.on('close', () => console.log('Connection closed'));
});
