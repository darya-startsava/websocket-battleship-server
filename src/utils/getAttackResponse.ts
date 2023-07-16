import { RawData } from 'ws';
import { ShotStatusType, StorageGameType } from '../types/storage';

export default function getAttackResponse(message: RawData, result: ShotStatusType) {
  const attackRequest = JSON.parse(JSON.parse(message.toString()).data);
  console.log(attackRequest);
  const { x, y, indexPlayer } = attackRequest;
  console.log(
    'response:',
    'attack',
    `{x:${x}, y:${y}}, indexPlayer: ${indexPlayer}, result: ${result}`
  );

  const data = { position: { x, y }, currentPlayer: indexPlayer, status: result };
  return { type: 'attack', data: JSON.stringify(data), id: 0 };
}
