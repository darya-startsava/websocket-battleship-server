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

export { StorageRoomsType, StorageWinnersType };
