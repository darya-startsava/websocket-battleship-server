import { RawData } from 'ws';

export default function getRoomIndex(message: RawData) {
  return JSON.parse(JSON.parse(message.toString()).data).indexRoom;
}
