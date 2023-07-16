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
  const matrix: Array<[Array<[number, number]>]> = [];
  for (let i = 0; i < 10; i++) {
    matrix[i] = [[]];
    for (let j = 0; j < 10; j++) {
      matrix[i][j] = [];
    }
  }
  ships.forEach((ship) => {
    const { position, direction, length } = ship;
    const { x, y } = position;
    if (direction) {
      const array: Array<[number, number]> = [];
      for (let i = y; i < y + length; i++) {
        array.push([i, x]);
        matrix[i][x] = array;
      }
    } else {
      const array: Array<[number, number]> = [];
      for (let i = x; i < x + length; i++) {
        array.push([y, i]);
        matrix[y][i] = array;
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
