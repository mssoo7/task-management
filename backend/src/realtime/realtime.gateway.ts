import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway {
	@WebSocketServer()
	server: Server;

	emitTaskCreated(task: any) {
		this.server.emit('task.created', task);
	}

	emitTaskUpdated(task: any) {
		this.server.emit('task.updated', task);
	}

	emitTaskDeleted(taskId: string) {
		this.server.emit('task.deleted', { id: taskId });
	}

	@SubscribeMessage('ping')
	handlePing(@MessageBody() data: any) {
		return { event: 'pong', data };
	}
}
