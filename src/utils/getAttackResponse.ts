import { ShotStatusType, StorageGameType } from '../types/storage';

export default function getAttackResponse(
  x: number,
  y: number,
  indexPlayer: number,
  result: ShotStatusType
) {
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
  indexPlayer: number,
  game: StorageGameType
) {
  const responses: AttackResponseType[] = [];
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

export function addAdditionalAttackResultsToStorage(
  indexPlayer: number,
  game: StorageGameType
) {
  const { temporaryAttackResults, firstPlayerShots, secondPlayerShots } = game;
  if (indexPlayer) {
    temporaryAttackResults.forEach((i) => {
      secondPlayerShots[i.y][i.x] = i.status;
    });
  } else {
    temporaryAttackResults.forEach((i) => {
      firstPlayerShots[i.y][i.x] = i.status;
    });
  }
}
