import { StorageRoomsType } from '../types/storage';

export default function removeRoomFromList(
  storage: StorageRoomsType[],
  roomIndex: number
) {
  storage.splice(roomIndex, 1);
  storage.forEach((room, index) => {
    room.roomId = index;
  });
}
