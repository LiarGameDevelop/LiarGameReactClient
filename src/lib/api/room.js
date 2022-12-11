import client from './client';

// 방 생성
export const makeRoom = ({ maxPersonCount, roomName, ownerName }) =>
  client.post('/room', { maxPersonCount, roomName, ownerName });

export const enterRoom = ({ roomId, senderId }) =>
client.post('/room/enter', { roomId, senderId });

export const leaveRoom = ({ roomId, senderId }) =>
client.post('/room/leave', { roomId, senderId });

export const deleteRoom = ({ roomId, ownerId }) =>
client.delete('/room', { roomId, ownerId });

export const getRoom = ({roomId}) =>
client.get(`/room/leave/${roomId}`);