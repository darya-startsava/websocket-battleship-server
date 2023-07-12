import StorageType from '../types/storage';

export default function updateRoom(storage: StorageType[]) {
  console.log('response', {
    type: 'update_room',
    data: JSON.stringify(storage),
    id: 0,
  });
  return { type: 'update_room', data: JSON.stringify(storage), id: 0 };
}
