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
  type: ShipSize;
};

type StorageGameType = {
  gameId: number;
  firstPlayerName: string;
  secondPlayerName: string;
  firstPlayerShips: ShipsType[];
  secondPlayerShips: ShipsType[];
};

export { StorageRoomsType, StorageWinnersType, StorageGameType, ShipsType };
