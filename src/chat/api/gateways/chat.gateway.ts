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
import { WelcomeDto } from '../dtos/welcome.dto';
import {
  IChatService,
  IChatServiceProvider,
} from '../../core/primary-ports/chat.service.interface';
import { Inject } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MessageDto } from '../dtos/message.dto';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(IChatServiceProvider) private chatService: IChatService,
  ) {}

  @WebSocketServer() server;

  @SubscribeMessage('message')
  async handleChatEvent(
    @MessageBody() message: MessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chatMessage = await this.chatService.newMessage(
      message.message,
      message.senderId,
    );
    this.server.emit('newMessage', chatMessage);
  }
  @SubscribeMessage('typing')
  handleTypingEvent(
    @MessageBody() typing: boolean,
    @ConnectedSocket() client: Socket,
  ): void {
    const chatClient = this.chatService.updateTyping(typing, client.id);
    if (chatClient) {
      this.server.emit('clientTyping', chatClient);
    }
  }
  @SubscribeMessage('name')
  async handleNameEvent(
    @MessageBody() name: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const uid = uuidv4();
      const chatClient = await this.chatService.addClient(uid, name);
      const chatClients = await this.chatService.getClients();
      const welcome: WelcomeDto = {
        clients: chatClients,
        messages: this.chatService.getMessages(),
        client: chatClient,
      };
      client.emit('welcome', welcome);
      this.server.emit('clients', chatClients);
    } catch (error) {
      client.error(error.message);
    }
  }
  @SubscribeMessage('clientConnect')
  async handleClientConnectEvent(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    if (id) {
      const clientFound = await this.chatService.getClient(id);
      if (clientFound) {
        const chatClients = await this.chatService.getClients();
        const welcome: WelcomeDto = {
          clients: chatClients,
          messages: this.chatService.getMessages(),
          client: clientFound,
        };
        client.emit('welcome', welcome);
        this.server.emit('clients', chatClients);
      } else {
        client.emit('error', 'User Not Found');
      }
    }
  }
  async handleConnection(client: Socket, ...args: any[]): Promise<any> {
    client.emit('allMessages', this.chatService.getMessages());
    this.server.emit('clients', await this.chatService.getClients());
    console.log('clientId', client.id);
  }
  async handleDisconnect(client: Socket): Promise<any> {
    await this.chatService.delete(client.id);
    this.server.emit('clients', await this.chatService.getClients());
    // console.log('Client is Disconnected', this.chatService.getClients());
  }
}
