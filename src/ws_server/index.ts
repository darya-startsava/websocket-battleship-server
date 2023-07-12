import { WebSocketServer } from 'ws';
import { WS_PORT } from '../constants';
import StorageType from '../types/storage';
import reg from '../utils/reg';
import updateRoom from '../utils/updateRoom';

const webSocketServer = new WebSocketServer({ port: WS_PORT });

const webSocketServerStorage: StorageType[] = [
  // clear webSocketServerStorage
  {
    roomId: 1,
    roomUsers: [
      {
        name: 'testUser',
        index: 0,
      },
    ],
  },
];

webSocketServer.on('connection', (socket) => {
  console.log('New connection opened');

  socket.on('message', (message) => {
    const messageType = JSON.parse(message.toString()).type;
    switch (messageType) {
      case 'reg': {
        const responseMessage = reg(message);
        socket.send(JSON.stringify(responseMessage));
        const updateRoomResponse = updateRoom(webSocketServerStorage);
        socket.send(JSON.stringify(updateRoomResponse));
        break;
      }
      case 'create_room': {
        console.log(JSON.parse(message.toString()));
        socket.send(JSON.stringify(JSON.parse(message.toString())));
      }
    }
  });
  socket.on('close', () => console.log('Connection closed'));
});
