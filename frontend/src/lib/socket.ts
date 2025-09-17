import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket() {
	if (!socket) {
		socket = io(process.env.NEXT_PUBLIC_WS_BASE || 'http://localhost:3000');
	}
	return socket;
} 