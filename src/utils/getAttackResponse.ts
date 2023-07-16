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

type AttackResponseType = {
  type: string;
  data: string;
  id: 0;
};

export function getAdditionalResponsesIfKilled(
  message: RawData,
  storage: StorageGameType[]
) {
  const responses: AttackResponseType[] = [];
  const attackRequest = JSON.parse(JSON.parse(message.toString()).data);
  const { gameId, indexPlayer } = attackRequest;
  const game = storage.find((game) => game.gameId === gameId);
  const { temporaryAttackResults } = game;
  temporaryAttackResults.forEach((i) =>
    responses.push({
      type: 'attack',
      data: JSON.stringify({
        position: { x: i.x, y: i.y },
        currentPlayer: indexPlayer,
        status: i.status,
      }),
      id: 0,
    })
  );
  return responses;
}
