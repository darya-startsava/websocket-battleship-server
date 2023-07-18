import { StorageGameType } from '../types/storage';

export default function startGame(
  storage: StorageGameType[],
  idGame: number,
  currentPlayerIndex: number
) {
  console.log('response:', 'start_game');
  const gameStorage = storage.find((game) => game.gameId === idGame);
  const ships = currentPlayerIndex
    ? gameStorage.secondPlayerShips
    : gameStorage.firstPlayerShips;
  const data = {
    ships,
    currentPlayerIndex,
  };
  return { type: 'start_game', data: JSON.stringify(data), id: 0 };
}
