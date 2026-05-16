import axios from 'axios';
import { io, Socket } from 'socket.io-client';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

// ─── AXIOS INSTANCE (REST) ───────────────────────────────────────────
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lanchat_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── SOCKET.IO MANAGER ───────────────────────────────────────────────
export let socket: Socket;

export const initiateSocketConnection = (): Socket => {
  const token = localStorage.getItem('lanchat_token');

  // Only include the auth object if the token exists
  const socketOptions: any = {
    transports: ['websocket'],
    reconnectionAttempts: 5,
  };

  if (token) {
    socketOptions.auth = { token };
  }

  socket = io(SOCKET_URL, socketOptions);

  console.log(`Connecting to socket at ${SOCKET_URL}...`);
  return socket;
};

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};

// ─── API ENDPOINTS ──────────────────────────────────────────────────
export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  getAllUsers: () => api.get('/users'),
  getUserById: (id: string) => api.get(`/users/${id}`),
};

export const chatApi = {
  getRooms: () => api.get('/chat/rooms'),
  getHistory: (roomId: string) => api.get(`/chat/rooms/${roomId}/history`),
};

export const fileApi = {
  upload: (formData: FormData) => api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFileUrl: (filename: string) => `${API_URL}/files/${filename}`,
};