import { ChatClient } from './chat-client.module';

export interface ChatMessage {
  message: string;
  sender: ChatClient;
}
