import { StorageGameType, ShipsType } from '../types/storage';

export default function addShipsToStore(
  indexPlayer: number,
  ships: ShipsType[],
  game: StorageGameType
) {
  let areBothPlayersAddShips = false;
  if (indexPlayer === 0) {
    game.firstPlayerShips = ships;
    game.firstPlayerShipsMatrix = transformToMatrix(ships);
    game.firstPlayerShots = createMatrix();
  } else {
    game.secondPlayerShips = ships;
    game.secondPlayerShipsMatrix = transformToMatrix(ships);
    game.secondPlayerShots = createMatrix();
  }
  if (game.firstPlayerShips.length && game.secondPlayerShips.length) {
    areBothPlayersAddShips = true;
  }

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
