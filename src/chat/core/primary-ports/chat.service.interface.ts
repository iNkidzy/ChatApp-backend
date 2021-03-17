import { ChatMessage } from '../models/chat-message.module';
import { ChatClient } from '../models/chat-client.module';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  newMessage(message: string, senderId: string): ChatMessage;

  addClient(id: string, name: string): ChatClient;

  getClients(): ChatClient[];

  getMessages(): ChatMessage[];

  delete(id: string): void;

  updateTyping(typing: boolean, id: string): ChatClient;
}
