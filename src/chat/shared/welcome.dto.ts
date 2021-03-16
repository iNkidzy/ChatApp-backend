import { ChatClient } from './chat-client.module';
import { ChatMessage } from './chat-message.module';

export interface WelcomeDto {
  clients: ChatClient[];
  client: ChatClient;
  messages: ChatMessage[];
  typing: ChatClient[];
}
