import { Injectable } from '@nestjs/common';
import { ChatClient } from './chat-client.module';
import { ChatMessage } from './chat-message.module';

@Injectable()
export class ChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];

  newMessage(message: string, senderId: string): ChatMessage {
    const chatMessage: ChatMessage = {
      message: message,
      sender: this.clients.find((c) => c.id === senderId),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  newClient(id: string, name: string) {
    const chatClient: ChatClient = { id: id, name: name };
    this.clients.push(chatClient);
    console.log('All names:', this.clients);
  }

  getClients(): ChatClient[] {
    return this.clients;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  delete(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
  }
}
