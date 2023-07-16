import { RawData } from 'ws';
import { StorageGameType, ShipsType } from '../types/storage';

export default function addShipsToStore(message: RawData, store: StorageGameType[]) {
  let areBothPlayersAddShips = false;
  const playerShipsData = JSON.parse(JSON.parse(message.toString()).data);
  store.forEach((game) => {
    if (game.gameId === playerShipsData.gameId) {
      if (playerShipsData.indexPlayer === 0) {
        game.firstPlayerShips = playerShipsData.ships;
        game.firstPlayerShipsMatrix = transformToMatrix(playerShipsData.ships);
        game.firstPlayerShots = createMatrix();
      } else {
        game.secondPlayerShips = playerShipsData.ships;
        game.secondPlayerShipsMatrix = transformToMatrix(playerShipsData.ships);
        game.secondPlayerShots = createMatrix();
      }
      if (game.firstPlayerShips.length && game.firstPlayerShips.length) {
        areBothPlayersAddShips = true;
      }
    }
  });
  return areBothPlayersAddShips;
}

function transformToMatrix(ships: ShipsType[]) {
  const matrix = createMatrix();
  ships.forEach((ship) => {
    const { position, direction, length } = ship;
    const { x, y } = position;
    if (direction) {
      for (let i = y; i < y + length; i++) {
        matrix[i][x] = 1;
      }
    } else {
      for (let i = x; i < x + length; i++) {
        matrix[y][i] = 1;
      }
    }
  });
  return matrix;
}

function createMatrix() {
  const matrix: Array<[number]> = [];
  for (let i = 0; i < 10; i++) {
    matrix[i] = [0];
    for (let j = 0; j < 10; j++) {
      matrix[i][j] = 0;
    }
  }
  return matrix;
}
