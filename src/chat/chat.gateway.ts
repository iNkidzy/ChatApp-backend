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
  @WebSocketServer() server;
  // Id, name
  userMap: Map<string, string> = new Map<string, string>();
  @SubscribeMessage('message')
  handleChatEvent(@MessageBody() data: string): string {
    console.log(data);
    this.server.emit('messages', data);
    return data + ' Hello';
  }

  @SubscribeMessage('name')
  handleNameEvent(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): string {
    this.userMap.set(client.id, name);
    this.server.emit('clients', Array.from(this.userMap.values()));
    console.log('map: ', Array.from(this.userMap));
    return name + ' Hello';
  }
  handleConnection(client: any, ...args: any[]): any {
    console.log('Client Connect', client.id);
    this.userMap.delete(client.id);
  }

  handleDisconnect(client: any): any {
    this.userMap.delete(client.id);
    this.server.emit('clients', this.userMap.values());
    console.log('Client Disconnect', client.id);
  }
}
