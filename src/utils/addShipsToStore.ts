import { RawData } from 'ws';
import { StorageGameType } from '../types/storage';

export default function addShipsToStore(message: RawData, store: StorageGameType[]) {
  let areBothPlayersAddShips = false;
  const playerShipsData = JSON.parse(JSON.parse(message.toString()).data);
  store.forEach((game) => {
    if (game.gameId === playerShipsData.gameId) {
      if (playerShipsData.indexPlayer === 0) {
        game.firstPlayerShips = playerShipsData.ships;
      } else {
        game.secondPlayerShips = playerShipsData.ships;
      }
      if (game.firstPlayerShips.length && game.firstPlayerShips.length) {
        areBothPlayersAddShips = true;
      }
    }
  });
  return areBothPlayersAddShips;
}
