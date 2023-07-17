import { StorageGameType } from '../types/storage';

export function getFinishGameResponse(storage: StorageGameType[], gameId: number) {
  console.log('response:', 'finish');
  const game = storage.find((game) => game.gameId === gameId);
  const data = {
    winPlayer: game.currentPlayerIndex,
  };
  return {
    type: 'finish',
    data: JSON.stringify(data),
    id: 0,
  };
}

export function checkIfGameIsFinished(storage: StorageGameType[], gameId: number) {
  let result = '';
  const game = storage.find((game) => game.gameId === gameId);
  if (game.firstPlayerKilledShipsCounter === 10) {
    result = game.firstPlayerName;
    return result;
  }
  if (game.secondPlayerKilledShipsCounter === 10) {
    result = game.secondPlayerName;
    return result;
  }
  return result;
}
