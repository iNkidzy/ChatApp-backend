import { Injectable } from '@nestjs/common';
import { ChatClient } from '../models/chat-client.module';
import { ChatMessage } from '../models/chat-message.module';
import { IChatService } from '../primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../../infrastructure/client.entity';

@Injectable()
export class ChatService implements IChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];

  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
  ) {}

  newMessage(message: string, senderId: string): ChatMessage {
    const chatMessage: ChatMessage = {
      message: message,
      sender: this.clients.find((c) => c.id === senderId),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }
  async addClient(id: string, name: string): Promise<ChatClient> {
    const clientDb = await this.clientRepository.findOne({ name: name });
    if (!clientDb) {
      let client = this.clientRepository.create();
      client.id = id;
      client.name = name;
      client = await this.clientRepository.save(client);
      return { id: '' + client.id, name: client.name };
    }
    if (clientDb.id === id) {
      return { id: clientDb.id, name: clientDb.name };
    } else {
      throw new Error('Username exists!');
    }
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

  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id === id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
