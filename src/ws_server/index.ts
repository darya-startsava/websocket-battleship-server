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
    roomId: 0,
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

let userName = '';

webSocketServer.on('connection', (socket) => {
  console.log('New connection opened');
  socket.on('message', (message) => {
    const messageType = JSON.parse(message.toString()).type;
    if (messageType === 'reg') {
      userName = JSON.parse(JSON.parse(message.toString()).data).name;
    }
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
        let isNewRoomAlreadyCreated = false;
        webSocketServerStorageRooms.forEach((room) => {
          if (room.roomUsers[0].name === userName) {
            isNewRoomAlreadyCreated = true;
          }
        });
        if (!isNewRoomAlreadyCreated) {
          webSocketServerStorageRooms.push({
            roomId: webSocketServerStorageRooms.length,
            roomUsers: [
              {
                name: userName,
                index: 0,
              },
            ],
          });
          const updateRoomResponse = updateRoom(webSocketServerStorageRooms);
          socket.send(JSON.stringify(updateRoomResponse));
        }
        break;
      }
    }
  });
  socket.on('close', () => console.log('Connection closed'));
});
