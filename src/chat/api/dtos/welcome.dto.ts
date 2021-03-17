import { ChatClient } from '../../core/models/chat-client.module';
import { ChatMessage } from '../../core/models/chat-message.module';

export interface WelcomeDto {
  clients: ChatClient[];
  client: ChatClient;
  messages: ChatMessage[];
}
