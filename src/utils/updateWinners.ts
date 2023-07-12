import { StorageWinnersType } from '../types/storage';

export default function updateWinners(storage: StorageWinnersType[]) {
  console.log('response', {
    type: 'update_winners',
    data: JSON.stringify(storage),
    id: 0,
  });
  return { type: 'update_winners', data: JSON.stringify(storage), id: 0 };
}
