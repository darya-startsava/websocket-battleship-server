import { RawData } from 'ws';
import { ShotStatusType, StorageGameType } from '../types/storage';

export default function updateGameStorageAfterAttack(
  message: RawData,
  storage: StorageGameType[]
) {
  const data = JSON.parse(JSON.parse(message.toString()).data);
  const { x, y, gameId, indexPlayer } = data;
  const game = storage.find((game) => game.gameId === gameId);
  if (indexPlayer) {
    if (!game.secondPlayerShots[y][x]) {
      const result = checkShotResult(game.firstPlayerShipsMatrix, x, y);
      game.secondPlayerShots[y][x] = result;
      return result;
    }
  } else {
    if (!game.firstPlayerShots[y][x]) {
      const result = checkShotResult(game.secondPlayerShipsMatrix, x, y);
      game.firstPlayerShots[y][x] = result;
      return result;
    }
  }
}

function checkShotResult(ships: Array<number[]>, x: number, y: number) {
  return ShotStatusType.shot;
}
