import { ShotStatusType, ShotsType, StorageGameType } from '../types/storage';

export default function updateGameStorageAfterAttack(
  x: number,
  y: number,
  indexPlayer: number,
  game: StorageGameType
) {
  game.temporaryAttackResults.length = 0;
  if (indexPlayer) {
    if (!game.secondPlayerShots[y][x]) {
      const result = checkShotResult(
        game.firstPlayerShipsMatrix,
        x,
        y,
        game.secondPlayerShots,
        game.temporaryAttackResults
      );
      game.secondPlayerShots[y][x] = result;
      if (result === ShotStatusType.killed) {
        game.secondPlayerKilledShipsCounter++;
      }
      return result;
    }
  } else {
    if (!game.firstPlayerShots[y][x]) {
      const result = checkShotResult(
        game.secondPlayerShipsMatrix,
        x,
        y,
        game.firstPlayerShots,
        game.temporaryAttackResults
      );
      game.firstPlayerShots[y][x] = result;
      if (result === ShotStatusType.killed) {
        game.firstPlayerKilledShipsCounter++;
      }
      return result;
    }
  }
}

function checkShotResult(
  ships: Array<[Array<[number, number]>]>,
  x: number,
  y: number,
  shots: Array<[number | ShotStatusType]>,
  temporaryAttackResults: ShotsType[]
) {
  if (!ships[y][x].length) {
    return ShotStatusType.miss;
  }
  shots[y][x] = ShotStatusType.shot;
  for (const ship of ships[y][x]) {
    if (shots[ship[0]][ship[1]] !== ShotStatusType.shot) {
      return ShotStatusType.shot;
    }
  }
  for (const ship of ships[y][x]) {
    shots[ship[0]][ship[1]] = ShotStatusType.killed;
    temporaryAttackResults.push({
      x: ship[1],
      y: ship[0],
      status: ShotStatusType.killed,
    });
  }
  const length = temporaryAttackResults.length;
  for (
    let i = temporaryAttackResults[0].x - 1;
    i <= temporaryAttackResults[0].x + 1;
    i++
  ) {
    for (
      let j = temporaryAttackResults[0].y - 1;
      j <= temporaryAttackResults[0].y + 1;
      j++
    ) {
      if (i >= 0 && i < 10 && j >= 0 && j < 10) {
        if (shots[j][i] !== ShotStatusType.killed) {
          console.log({
            x: i,
            y: j,
            status: ShotStatusType.miss,
          });
          temporaryAttackResults.push({
            x: i,
            y: j,
            status: ShotStatusType.miss,
          });
        }
      }
    }
  }

  for (
    let i = temporaryAttackResults[length - 1].x - 1;
    i <= temporaryAttackResults[length - 1].x + 1;
    i++
  ) {
    for (
      let j = temporaryAttackResults[length - 1].y - 1;
      j <= temporaryAttackResults[length - 1].y + 1;
      j++
    ) {
      if (i >= 0 && i < 10 && j >= 0 && j < 10) {
        if (shots[j][i] !== ShotStatusType.killed) {
          console.log({
            x: i,
            y: j,
            status: ShotStatusType.miss,
          });
          temporaryAttackResults.push({
            x: i,
            y: j,
            status: ShotStatusType.miss,
          });
        }
      }
    }
  }
  return ShotStatusType.killed;
}
