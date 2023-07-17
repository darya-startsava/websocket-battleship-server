type RoomUsersStorageType = {
  name: string;
  index: number;
};

type StorageRoomsType = {
  roomId: number;
  roomUsers: RoomUsersStorageType[];
};

type StorageWinnersType = {
  name: string;
  wins: number;
};

enum ShipSize {
  S = 'small',
  M = 'medium',
  L = 'large',
  H = 'huge',
}

type ShipsType = {
  position: {
    x: number;
    y: number;
  };
  direction: boolean;
  length: number;
  type: ShipSize | 'small' | 'medium' | 'large' | 'huge';
};

enum ShotStatusType {
  miss = 'miss',
  killed = 'killed',
  shot = 'shot',
}

type ShotsType = {
  x: number;
  y: number;
  status: ShotStatusType;
};

type StorageGameType = {
  gameId: number;
  firstPlayerName: string;
  secondPlayerName: string;
  firstPlayerShips: ShipsType[];
  secondPlayerShips: ShipsType[];
  firstPlayerShipsMatrix: Array<[Array<[number, number]>]>;
  secondPlayerShipsMatrix: Array<[Array<[number, number]>]>;
  currentPlayerIndex: number;
  firstPlayerShots: Array<[number | ShotStatusType]>;
  secondPlayerShots: Array<[number | ShotStatusType]>;
  firstPlayerKilledShipsCounter: number;
  secondPlayerKilledShipsCounter: number;
  temporaryAttackResults: ShotsType[];
};

export {
  StorageRoomsType,
  StorageWinnersType,
  StorageGameType,
  ShipsType,
  ShotStatusType,
  ShotsType,
  ShipSize,
};
