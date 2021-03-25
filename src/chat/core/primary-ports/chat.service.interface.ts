import { ChatMessage } from '../models/chat-message.module';
import { ChatClient } from '../models/chat-client.module';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  newMessage(message: string, senderId: string): Promise<ChatMessage>;

  addClient(id: string, name: string): Promise<ChatClient>;

  getClient(id: string): Promise<ChatClient>;

  getClients(): Promise<ChatClient[]>;

  getMessages(): ChatMessage[];

  delete(id: string): Promise<void>;

  updateTyping(typing: boolean, id: string): ChatClient;
}
