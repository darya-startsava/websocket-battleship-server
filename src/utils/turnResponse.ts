import { StorageGameType } from '../types/storage';

export default function turnResponse(game: StorageGameType) {
  const currentPlayer = game.currentPlayerIndex;
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
