import { StorageWinnersType } from '../types/storage';

export default function updateWinners(storage: StorageWinnersType[]) {
  console.log('response:', 'update_winners');
  return { type: 'update_winners', data: JSON.stringify(storage), id: 0 };
}
