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

  async newMessage(message: string, senderId: string): Promise<ChatMessage> {
    const clientDb = await this.clientRepository.findOne({ id: senderId });
    const chatMessage: ChatMessage = { message: message, sender: clientDb };
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
      const chatClient = JSON.parse(JSON.stringify(client));
      this.clients.push(chatClient);
      return chatClient;
    }
    if (clientDb.id === id) {
      return { id: clientDb.id, name: clientDb.name };
    } else {
      throw new Error('Username exists!');
    }
  }

  async getClients(): Promise<ChatClient[]> {
    const clients = await this.clientRepository.find();
    const chatClients: ChatClient[] = JSON.parse(JSON.stringify(clients));
    return chatClients;
  }

  async getClient(id: string): Promise<ChatClient> {
    const clientDb: Client = await this.clientRepository.findOne({ id: id });
    return clientDb;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  async delete(id: string): Promise<void> {
    await this.clientRepository.delete({ id: id });
  }

  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id === id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
