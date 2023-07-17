import { StorageGameType } from '../types/storage';

export function randomAttack(game: StorageGameType, indexPlayer: number) {}

function getRandomPosition() {
  const min = Math.ceil(0);
  const max = Math.floor(9);
  const x = Math.floor(Math.random() * (max - min + 1) + min);
  const y = Math.floor(Math.random() * (max - min + 1) + min);
  return [x, y];
}
