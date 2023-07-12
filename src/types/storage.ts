type RoomUsersStorageType = {
  name: string;
  index: number;
};

type StorageType = {
  roomId: number;
  roomUsers: RoomUsersStorageType[];
};

export default StorageType;
