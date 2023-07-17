import { StorageRoomsType } from '../types/storage';

export default function removeRoomFromList(
  storage: StorageRoomsType[],
  roomIndex: number,
  userName: string
) {
  storage.splice(roomIndex, 1);
  storage.forEach((room, index) => {
    room.roomId = index;
  });
  removeRoomFromListIfUserJoinAnotherGame(storage, userName);
}

export function removeRoomFromListIfUserJoinAnotherGame(
  storage: StorageRoomsType[],
  userName: string
) {
  const roomToDeleteIndex = storage.findIndex(
    (room) => room.roomUsers[0].name === userName
  );
  if (roomToDeleteIndex !== -1) {
    storage.splice(roomToDeleteIndex, 1);
    storage.forEach((room, index) => {
      room.roomId = index;
    });
  }
}
