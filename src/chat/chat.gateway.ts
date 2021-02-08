import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket } from 'Socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  allMessages: string[] = [];
  // Id, name
  userMap: Map<string, string> = new Map<string, string>();
  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() message: string): string {
    console.log(message);
    this.allMessages.push(message);
    this.server.emit('newMessage', message);
    return message + ' Hello';
  }

  @SubscribeMessage('name')
  handleNameEvent(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): string {
    this.userMap.set(client.id, name);
    console.log('All names:', this.userMap);
    this.server.emit('clients', Array.from(this.userMap.values()));
    console.log('map: ', Array.from(this.userMap));
    return name + ' Hello';
  }
  handleConnection(client: Socket, ...args: any[]): any {
    console.log('Client is Connected', client.id);
    /* this.userMap.delete(client.id); */
    client.emit('allMessages', this.allMessages);
    this.server.emit('clients', Array.from(this.userMap.values()));
  }

  handleDisconnect(client: Socket): any {
    this.userMap.delete(client.id);
    this.server.emit('clients', Array.from(this.userMap.values()));
    console.log('Client is Disconnected', this.userMap);
  }
}
