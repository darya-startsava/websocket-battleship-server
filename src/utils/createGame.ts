import { StorageGameType } from '../types/storage';

export function getNewIdGame(storage: StorageGameType[]) {
  let idGame: number;
  for (let i = 0; i <= storage.length; i++) {
    if (storage.find((game) => game.gameId === i)) {
      continue;
    } else {
      storage.push({
        gameId: i,
        firstPlayerName: '',
        secondPlayerName: '',
        firstPlayerShips: [],
        secondPlayerShips: [],
        firstPlayerShipsMatrix: [],
        secondPlayerShipsMatrix: [],
        currentPlayerIndex: 0,
        firstPlayerShots: [],
        secondPlayerShots: [],
        temporaryAttackResults: [],
      });
      idGame = i;
      break;
    }
  }
  return idGame;
}

export default function createGame(idGame: number, idPlayer: number) {
  console.log('response:', 'create_game');
  const data = {
    idGame,
    idPlayer,
  };
  return { type: 'create_game', data: JSON.stringify(data), id: 0 };
}

export function addUsersNameToGameStorage(
  firstPlayerName: string,
  SecondPlayerName: string,
  idGame: number,
  storage: StorageGameType[]
) {
  storage.forEach((game) => {
    if (game.gameId === idGame) {
      (game.firstPlayerName = firstPlayerName),
        (game.secondPlayerName = SecondPlayerName);
    }
  });
}
