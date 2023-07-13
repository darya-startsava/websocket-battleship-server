import { StorageRoomsType } from '../types/storage';

export default function getPlayerInRoomName(
  storage: StorageRoomsType[],
  roomIndex: number
) {
  return storage.find((room) => room.roomId === roomIndex).roomUsers[0].name;
}
