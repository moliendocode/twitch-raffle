/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ChatClient } from '@twurple/chat';
import { authProvider } from './auth/auth.js';
import 'dotenv/config';

const channelName: string = process.env.CHANNEL_NAME!;

const chatClient = new ChatClient({ authProvider, channels: [channelName] });
await chatClient.connect();

export default chatClient;
