import client from './client';

// 방 생성
export const makeRoom = ({ maxPersonCount, roomName, ownerName }) =>
  client.post('/room', { maxPersonCount, roomName, ownerName });

export const enterRoom = ({ roomId, username }) =>
client.post('/room/enter', { roomId, username });

export const leaveRoom = ({ roomId, userId }) =>
client.post('/room/leave', { roomId, userId });

export const deleteRoom = ({ roomId, ownerId }) =>
client.delete('/room', { roomId, ownerId });

export const getRoom = ({roomId}) =>
client.get(`/room?roomId=${roomId}`);