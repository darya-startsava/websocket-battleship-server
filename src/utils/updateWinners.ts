import { StorageWinnersType } from '../types/storage';

export default function updateWinners(storage: StorageWinnersType[]) {
  console.log('response:', 'update_winners');
  return { type: 'update_winners', data: JSON.stringify(storage), id: 0 };
}

export function updateWinnersStorage(
  storage: StorageWinnersType[],
  winnerName: string
) {
  const winnerIndex = storage.findIndex((winner) => winner.name === winnerName);
  if (winnerIndex !== -1) {
    storage[winnerIndex].wins++;
    return;
  }
  storage.push({ name: winnerName, wins: 1 });
}
