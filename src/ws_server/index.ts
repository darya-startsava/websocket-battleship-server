import { WebSocketServer } from 'ws';
import { WS_PORT } from '../constants';
import { StorageRoomsType, StorageWinnersType } from '../types/storage';
import reg from '../utils/reg';
import updateRoom from '../utils/updateRoom';
import updateWinners from '../utils/updateWinners';

const webSocketServer = new WebSocketServer({ port: WS_PORT });

const webSocketServerStorageRooms: StorageRoomsType[] = [
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

const webSocketServerStorageWinners: StorageWinnersType[] = [
  // clear webSocketServerStorage
  {
    name: 'Winner!',
    wins: 2,
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
        const updateRoomResponse = updateRoom(webSocketServerStorageRooms);
        socket.send(JSON.stringify(updateRoomResponse));
        const updateWinnersResponse = updateWinners(webSocketServerStorageWinners);
        socket.send(JSON.stringify(updateWinnersResponse));
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
