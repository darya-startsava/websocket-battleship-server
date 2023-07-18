import { StorageGameType } from '../types/storage';

export function getFinishGameResponse(game: StorageGameType) {
  console.log('response:', 'finish');
  const data = {
    winPlayer: game.currentPlayerIndex,
  };
  return {
    type: 'finish',
    data: JSON.stringify(data),
    id: 0,
  };
}

export function checkIfGameIsFinished(game: StorageGameType) {
  let result = '';
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
