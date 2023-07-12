import { StorageRoomsType } from '../types/storage';

export default function updateRoom(storage: StorageRoomsType[]) {
  console.log('response', {
    type: 'update_room',
    data: JSON.stringify(storage),
    id: 0,
  });
  return { type: 'update_room', data: JSON.stringify(storage), id: 0 };
}
