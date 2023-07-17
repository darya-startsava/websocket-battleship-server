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
  addAdditionalAttackResultsToStorage,
  getAdditionalResponsesIfKilled,
} from '../utils/getAttackResponse';
import createGame, {
  addUsersNameToGameStorage,
  getNewIdGame,
} from '../utils/createGame';
import getPlayerInRoomName from '../utils/getPlayerInRoomName';
import getRoomIndex from '../utils/getRoomIndex';
import reg from '../utils/reg';
import removeRoomFromList, {
  removeRoomFromListIfUserJoinAnotherGame,
} from '../utils/removeRoomFromList';
import startGame from '../utils/startGame';
import turnResponse from '../utils/turnResponse';
import updateGameStorageAfterAttack from '../utils/updateGameStorageAfterAttack';
import updateRoom from '../utils/updateRoom';
import updateWinners, { updateWinnersStorage } from '../utils/updateWinners';
import { checkIfGameIsFinished, getFinishGameResponse } from '../utils/finishGame';
import randomAttack from '../utils/randomAttack';
import getRandomBotShips from '../botShipsArray';
import dataBase from '../dataBase';

const webSocketServer = new WebSocketServer({ port: WS_PORT });

const webSocketServerStorageRooms: StorageRoomsType[] = [];

const webSocketServerStorageWinners: StorageWinnersType[] = [];

const webSocketServerStorageGames: StorageGameType[] = [];

const userSocketMap = new Map<string, WebSocket>();

const sockets = new Set<WebSocket>();

webSocketServer.on('connection', (socket) => {
  sockets.add(socket);
  console.log('New connection opened');

  function attackResponse(
    x: number,
    y: number,
    indexPlayer: number,
    game: StorageGameType
  ) {
    const result = updateGameStorageAfterAttack(x, y, indexPlayer, game);
    console.log('result:', result || 'this field has already been attacked');
    const firstPlayerName = game.firstPlayerName;
    const secondPlayerName = game.secondPlayerName;
    if (result) {
      const attackResponse = getAttackResponse(x, y, indexPlayer, result);
      userSocketMap.get(firstPlayerName).send(JSON.stringify(attackResponse));
      userSocketMap.get(secondPlayerName).send(JSON.stringify(attackResponse));
    }
    if (result === ShotStatusType.killed) {
      addAdditionalAttackResultsToStorage(indexPlayer, game);
      const responses = getAdditionalResponsesIfKilled(indexPlayer, game);
      responses.forEach((response) => {
        userSocketMap.get(firstPlayerName).send(JSON.stringify(response));
        userSocketMap.get(secondPlayerName).send(JSON.stringify(response));
      });
      const winnerName = checkIfGameIsFinished(game);
      if (winnerName) {
        const finishGameResponse = getFinishGameResponse(game);
        console.log('winner:', winnerName);
        userSocketMap.get(firstPlayerName).send(JSON.stringify(finishGameResponse));
        userSocketMap.get(secondPlayerName).send(JSON.stringify(finishGameResponse));
        updateWinnersStorage(webSocketServerStorageWinners, winnerName);
        const updateWinnersResponse = updateWinners(webSocketServerStorageWinners);
        sockets.forEach((socket) =>
          socket.send(JSON.stringify(updateWinnersResponse))
        );
        return;
      }
    }
    if (result === ShotStatusType.miss) {
      if (game.currentPlayerIndex) {
        game.currentPlayerIndex = 0;
      } else {
        game.currentPlayerIndex = 1;
      }
    }
    const turn = turnResponse(game);
    userSocketMap.get(firstPlayerName).send(JSON.stringify(turn));
    userSocketMap.get(secondPlayerName).send(JSON.stringify(turn));
  }

  function attackResponsePlayWithBot(
    x: number,
    y: number,
    indexPlayer: number,
    game: StorageGameType
  ) {
    const result = updateGameStorageAfterAttack(x, y, indexPlayer, game);
    console.log('result:', result || 'this field has already been attacked');
    if (result) {
      const attackResponse = getAttackResponse(x, y, indexPlayer, result);
      socket.send(JSON.stringify(attackResponse));
    }
    if (result === ShotStatusType.killed) {
      addAdditionalAttackResultsToStorage(indexPlayer, game);
      const responses = getAdditionalResponsesIfKilled(indexPlayer, game);
      responses.forEach((response) => {
        socket.send(JSON.stringify(response));
      });
      const winnerName = checkIfGameIsFinished(game);
      if (winnerName) {
        const finishGameResponse = getFinishGameResponse(game);
        console.log('winner:', winnerName);
        socket.send(JSON.stringify(finishGameResponse));
        updateWinnersStorage(webSocketServerStorageWinners, winnerName);
        const updateWinnersResponse = updateWinners(webSocketServerStorageWinners);
        sockets.forEach((socket) =>
          socket.send(JSON.stringify(updateWinnersResponse))
        );
        return;
      }
    }
    if (result === ShotStatusType.miss) {
      botAttack(game);
    }
    const turn = turnResponse(game);
    socket.send(JSON.stringify(turn));
  }

  function botAttack(game: StorageGameType) {
    const [x, y] = randomAttack(game, 1);
    const result = updateGameStorageAfterAttack(x, y, 1, game);
    console.log('botAttack:', result);
    if (result) {
      const attackResponse = getAttackResponse(x, y, 1, result);
      socket.send(JSON.stringify(attackResponse));
    }
    if (result === ShotStatusType.killed) {
      addAdditionalAttackResultsToStorage(1, game);
      const responses = getAdditionalResponsesIfKilled(1, game);
      responses.forEach((response) => {
        socket.send(JSON.stringify(response));
      });
      const winnerName = checkIfGameIsFinished(game);
      if (winnerName) {
        game.currentPlayerIndex = 1;
        const finishGameResponse = getFinishGameResponse(game);
        console.log('winner:', winnerName);
        socket.send(JSON.stringify(finishGameResponse));
        return;
      }
    }
    if (result === ShotStatusType.killed || result === ShotStatusType.shot) {
      botAttack(game);
    }
    const turn = turnResponse(game);
    socket.send(JSON.stringify(turn));
  }

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
        removeRoomFromList(webSocketServerStorageRooms, roomIndex, userName);
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
        const playerShipsData = JSON.parse(JSON.parse(message.toString()).data);
        const { gameId, indexPlayer, ships } = playerShipsData;
        const game = webSocketServerStorageGames.find(
          (game) => game.gameId === gameId
        );
        const areBothPlayersAddShips = addShipsToStore(indexPlayer, ships, game);
        console.log('areBothPlayersAddShips', areBothPlayersAddShips);
        if (areBothPlayersAddShips) {
          if (game.secondPlayerName === 'BOT') {
            const response = startGame(webSocketServerStorageGames, gameId, 0);
            socket.send(JSON.stringify(response));
            const turn = turnResponse(game);
            socket.send(JSON.stringify(turn));
          } else {
            const firstPlayerInRoomResponse = startGame(
              webSocketServerStorageGames,
              gameId,
              0
            );
            const firstPlayerName = game.firstPlayerName;
            userSocketMap
              .get(firstPlayerName)
              .send(JSON.stringify(firstPlayerInRoomResponse));
            const secondPlayerInRoomResponse = startGame(
              webSocketServerStorageGames,
              gameId,
              1
            );
            const secondPlayerName = game.secondPlayerName;
            userSocketMap
              .get(secondPlayerName)
              .send(JSON.stringify(secondPlayerInRoomResponse));
            const turn = turnResponse(game);
            userSocketMap.get(firstPlayerName).send(JSON.stringify(turn));
            userSocketMap.get(secondPlayerName).send(JSON.stringify(turn));
          }
        }
        break;
      case 'attack': {
        const { x, y, gameId, indexPlayer } = JSON.parse(
          JSON.parse(message.toString()).data
        );
        const game = webSocketServerStorageGames.find(
          (game) => game.gameId === gameId
        );
        if (game.currentPlayerIndex !== indexPlayer) {
          console.log("it's not this player turn");
          break;
        }
        if (game.secondPlayerName !== 'BOT') {
          attackResponse(x, y, indexPlayer, game);
        } else {
          attackResponsePlayWithBot(x, y, indexPlayer, game);
        }

        break;
      }
      case 'randomAttack': {
        const { gameId, indexPlayer } = JSON.parse(
          JSON.parse(message.toString()).data
        );
        const game = webSocketServerStorageGames.find(
          (game) => game.gameId === gameId
        );
        const [x, y] = randomAttack(game, indexPlayer);
        if (game.secondPlayerName !== 'BOT') {
          attackResponse(x, y, indexPlayer, game);
        } else {
          attackResponsePlayWithBot(x, y, indexPlayer, game);
        }
        break;
      }
      case 'single_play': {
        removeRoomFromListIfUserJoinAnotherGame(
          webSocketServerStorageRooms,
          userName
        );
        const updateRoomResponse = updateRoom(webSocketServerStorageRooms);
        sockets.forEach((socket) => socket.send(JSON.stringify(updateRoomResponse)));
        const idGame = getNewIdGame(webSocketServerStorageGames);
        const game = webSocketServerStorageGames.find(
          (game) => game.gameId === idGame
        );
        game.firstPlayerName = userName;
        const playerResponse = createGame(idGame, 0);
        socket.send(JSON.stringify(playerResponse));
        game.secondPlayerName = 'BOT';
        const botShips = getRandomBotShips();
        addShipsToStore(1, botShips, game);
      }
    }
  });
  socket.on('close', () => {
    let userName = '';
    sockets.delete(socket);
    userSocketMap.forEach((value, key) => {
      if (value === socket) {
        userName = key;
        userSocketMap.delete(key);
      }
    });
    dataBase.forEach((user, index) => {
      if (user.name === userName) {
        dataBase.splice(index, 1);
      }
    });
    removeRoomFromListIfUserJoinAnotherGame(webSocketServerStorageRooms, userName);
    const updateRoomResponse = updateRoom(webSocketServerStorageRooms);
    sockets.forEach((socket) => socket.send(JSON.stringify(updateRoomResponse)));
    console.log('Connection closed');
  });
});
