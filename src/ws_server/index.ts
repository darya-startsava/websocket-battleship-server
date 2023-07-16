import { WebSocketServer, WebSocket } from 'ws';
import { WS_PORT } from '../constants';
import {
  StorageRoomsType,
  StorageWinnersType,
  StorageGameType,
  ShotStatusType,
} from '../types/storage';
import addShipsToStore from '../utils/addShipsToStore';
import getAttackResponse, {
  getAdditionalResponsesIfKilled,
} from '../utils/getAttackResponse';
import createGame, {
  addUsersNameToGameStorage,
  getNewIdGame,
} from '../utils/createGame';
import getPlayerInRoomName from '../utils/getPlayerInRoomName';
import getRoomIndex from '../utils/getRoomIndex';
import reg from '../utils/reg';
import removeRoomFromList from '../utils/removeRoomFromList';
import startGame from '../utils/startGame';
import turnResponse from '../utils/turnResponse';
import updateGameStorageAfterAttack from '../utils/updateGameStorageAfterAttack';
import updateRoom from '../utils/updateRoom';
import updateWinners from '../utils/updateWinners';
import { checkIfGameIsFinished, getFinishGameResponse } from '../utils/finishGame';

const webSocketServer = new WebSocketServer({ port: WS_PORT });

const webSocketServerStorageRooms: StorageRoomsType[] = [];

const webSocketServerStorageWinners: StorageWinnersType[] = [
  // clear webSocketServerStorage
  {
    name: 'Winner!',
    wins: 2,
  },
];

const webSocketServerStorageGames: StorageGameType[] = [];

const userSocketMap = new Map<string, WebSocket>();

const sockets = new Set<WebSocket>();

webSocketServer.on('connection', (socket) => {
  sockets.add(socket);
  console.log('New connection opened');
  let userName = '';
  socket.on('message', (message) => {
    const messageType = JSON.parse(message.toString()).type;
    if (messageType === 'reg') {
      userName = JSON.parse(JSON.parse(message.toString()).data).name;
      userSocketMap.set(userName, socket);
    }
    console.log('request:', messageType);
    switch (messageType) {
      case 'reg': {
        const responseMessage = reg(message);
        socket.send(JSON.stringify(responseMessage));
        const updateRoomResponse = updateRoom(webSocketServerStorageRooms);
        sockets.forEach((socket) => socket.send(JSON.stringify(updateRoomResponse)));
        const updateWinnersResponse = updateWinners(webSocketServerStorageWinners);
        sockets.forEach((socket) =>
          socket.send(JSON.stringify(updateWinnersResponse))
        );
        break;
      }
      case 'create_room': {
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
          sockets.forEach((socket) =>
            socket.send(JSON.stringify(updateRoomResponse))
          );
        }
        break;
      }
      case 'add_user_to_room': {
        const roomIndex = getRoomIndex(message);
        const firstPlayerInRoom = getPlayerInRoomName(
          webSocketServerStorageRooms,
          roomIndex
        );
        if (firstPlayerInRoom === userName) {
          break;
        }
        removeRoomFromList(webSocketServerStorageRooms, roomIndex);
        const updateRoomResponse = updateRoom(webSocketServerStorageRooms);
        sockets.forEach((socket) => socket.send(JSON.stringify(updateRoomResponse)));
        const idGame = getNewIdGame(webSocketServerStorageGames);
        const firstPlayerInRoomResponse = createGame(idGame, 0);
        userSocketMap
          .get(firstPlayerInRoom)
          .send(JSON.stringify(firstPlayerInRoomResponse));
        const secondPlayerInRoomResponse = createGame(idGame, 1);
        userSocketMap.get(userName).send(JSON.stringify(secondPlayerInRoomResponse));
        addUsersNameToGameStorage(
          firstPlayerInRoom,
          userName,
          idGame,
          webSocketServerStorageGames
        );
        break;
      }
      case 'add_ships':
        const gameId = JSON.parse(JSON.parse(message.toString()).data).gameId;
        const areBothPlayersAddShips = addShipsToStore(
          message,
          webSocketServerStorageGames
        );
        if (areBothPlayersAddShips) {
          const firstPlayerInRoomResponse = startGame(
            webSocketServerStorageGames,
            gameId,
            0
          );
          const firstPlayerName = webSocketServerStorageGames.find(
            (game) => game.gameId === gameId
          ).firstPlayerName;
          userSocketMap
            .get(firstPlayerName)
            .send(JSON.stringify(firstPlayerInRoomResponse));
          const secondPlayerInRoomResponse = startGame(
            webSocketServerStorageGames,
            gameId,
            1
          );
          const secondPlayerName = webSocketServerStorageGames.find(
            (game) => game.gameId === gameId
          ).secondPlayerName;
          userSocketMap
            .get(secondPlayerName)
            .send(JSON.stringify(secondPlayerInRoomResponse));
          const turn = turnResponse(webSocketServerStorageGames, gameId);
          userSocketMap.get(firstPlayerName).send(JSON.stringify(turn));
          userSocketMap.get(secondPlayerName).send(JSON.stringify(turn));
        }
        break;
      case 'attack': {
        const { gameId, indexPlayer } = JSON.parse(
          JSON.parse(message.toString()).data
        );
        const game = webSocketServerStorageGames.find(
          (game) => game.gameId === gameId
        );
        if (game.currentPlayerIndex !== indexPlayer) {
          console.log("it's not this player turn");
          break;
        }
        const result = updateGameStorageAfterAttack(
          message,
          webSocketServerStorageGames
        );
        console.log('result:', result);
        const firstPlayerName = game.firstPlayerName;
        const secondPlayerName = game.secondPlayerName;
        if (result) {
          const attackResponse = getAttackResponse(message, result);
          userSocketMap.get(firstPlayerName).send(JSON.stringify(attackResponse));
          userSocketMap.get(secondPlayerName).send(JSON.stringify(attackResponse));
        }
        if (result === ShotStatusType.killed) {
          const responses = getAdditionalResponsesIfKilled(
            message,
            webSocketServerStorageGames
          );
          responses.forEach((response) => {
            userSocketMap.get(firstPlayerName).send(JSON.stringify(response));
            userSocketMap.get(secondPlayerName).send(JSON.stringify(response));
          });
          const winnerName = checkIfGameIsFinished(
            webSocketServerStorageGames,
            gameId
          );
          if (winnerName) {
            const finishGameResponse = getFinishGameResponse(
              webSocketServerStorageGames,
              gameId
            );
            userSocketMap
              .get(firstPlayerName)
              .send(JSON.stringify(finishGameResponse));
            userSocketMap
              .get(secondPlayerName)
              .send(JSON.stringify(finishGameResponse));
          }
        }
        if (result === ShotStatusType.miss) {
          if (game.currentPlayerIndex) {
            game.currentPlayerIndex = 0;
          } else {
            game.currentPlayerIndex = 1;
          }
        }
        const turn = turnResponse(webSocketServerStorageGames, gameId);
        userSocketMap.get(firstPlayerName).send(JSON.stringify(turn));
        userSocketMap.get(secondPlayerName).send(JSON.stringify(turn));
        break;
      }
    }
  });
  socket.on('close', () => console.log('Connection closed'));
});
