import { StorageGameType } from '../types/storage';

export default function turnResponse(store: StorageGameType[], gameId: number) {
  const currentPlayer = store.find(
    (game) => game.gameId === gameId
  ).currentPlayerIndex;
  console.log('response:', 'turn', currentPlayer);
  const data = {
    currentPlayer,
  };
  return {
    type: 'turn',
    data: JSON.stringify(data),
    id: 0,
  };
}
