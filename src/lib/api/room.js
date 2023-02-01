import client from './client';

// 방 생성
export const makeRoom = ({ maxPersonCount, ownerName, password }) =>
  client.post('/room/create', { maxPersonCount, ownerName, password });

export const enterRoom = ({ roomId, username, password }) =>
client.post('/room/enter', { roomId, username, password });

export const getRoom = ({roomId, token}) =>
client.get(`/room/info?roomId=${roomId}`, {headers: { 'Authorization': `Bearer ${token}` }});

export const leaveRoom = ({ roomId, userId, token }) =>
client.post('/room/leave', { roomId, userId }, {headers: { 'Authorization': `Bearer ${token}` }});

export const deleteRoom = ({ roomId, ownerId, token }) =>
client.delete('/room', { roomId, ownerId }, {headers: { 'Authorization': `Bearer ${token}` }});