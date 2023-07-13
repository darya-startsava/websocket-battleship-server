export function getNewIdGame(storage: number[]) {
  let idGame: number;
  for (let i = 0; i <= storage.length; i++) {
    if (storage.find((idGame) => idGame === i)) {
      continue;
    } else {
      storage.push(i);
      idGame = i;
      break;
    }
  }
  return idGame;
}

export default function createGame(idGame: number, idPlayer: number) {
  const data = {
    idGame,
    idPlayer,
  };
  return { type: 'create_game', data: JSON.stringify(data), id: 0 };
}
