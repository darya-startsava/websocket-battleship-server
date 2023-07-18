import { StorageGameType } from '../types/storage';

export default function randomAttack(game: StorageGameType, indexPlayer: number) {
  function attackEmptyPosition(): [number, number] {
    const [x, y] = getRandomPosition();
    if (indexPlayer) {
      if (game.secondPlayerShots[y][x]) {
        return attackEmptyPosition();
      } else {
        return [x, y];
      }
    } else {
      if (game.firstPlayerShots[y][x]) {
        return attackEmptyPosition();
      } else {
        return [x, y];
      }
    }
  }
  return attackEmptyPosition();
}

function getRandomPosition() {
  const min = Math.ceil(0);
  const max = Math.floor(9);
  const x = Math.floor(Math.random() * (max - min + 1) + min);
  const y = Math.floor(Math.random() * (max - min + 1) + min);
  return [x, y];
}
