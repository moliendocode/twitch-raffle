/* eslint-disable no-return-await */
/* eslint-disable no-console */
import { ChatClient } from '@twurple/chat';
import 'dotenv/config';
import { PubSubClient } from '@twurple/pubsub';
import { ApiClient } from '@twurple/api';
import Redis from 'ioredis';
import { RefreshingAuthProvider } from '@twurple/auth';
import { promises as fs } from 'fs';
import { setTimeout } from 'timers/promises';

const clientId: string = process.env.CLIENT_ID!;
const clientSecret: string = process.env.CLIENT_SECRET!;
const host: string = process.env.REDIS_HOSTNAME!;
const port: number = +process.env.REDIS_PORT!;
const username: string = process.env.REDIS_USERNAME!;
const password: string = process.env.REDIS_PASSWORD!;
const channelName: string = process.env.CHANNEL_NAME!;
const broadcasterId: string = process.env.BROADCASTER_ID!;

const redis = new Redis({
  host, port, username, password,
});

const getAllParticipants = async () => {
  const res = await redis.lrange('user-list', 0, -1);
  return res;
};

const main = async () => {
  const tokenData = JSON.parse(await fs.readFile('src/tokens.json', 'utf8'));
  const authProvider = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
      onRefresh: async (newTokenData) => await fs.writeFile('src/tokens.json', JSON.stringify(newTokenData, null, 4), 'utf8'),
    },
    tokenData,
  );

  const startRaffle = async () => {
    const twitchApi: ApiClient = new ApiClient({ authProvider });
    console.log(twitchApi);
    const apiCall = await twitchApi.channelPoints.createCustomReward(broadcasterId, {
      title: 'Sorteo',
      cost: 1,
      maxRedemptionsPerUserPerStream: 1,
      autoFulfill: true,
    });
    return apiCall.id;
  };

  const endRaffle = async (raffleId: string) => {
    const twitchApi: ApiClient = new ApiClient({ authProvider });
    await twitchApi.channelPoints.deleteCustomReward(broadcasterId, raffleId);
  };

  const chatClient = new ChatClient({ authProvider, channels: [channelName] });
  await chatClient.connect();

  // TODO: Puede haber mas de 1 ganador
  // TODO: Cancelar el sorteo si hay algun error de tipeo
  // TODO: Agregar anuncio en OBS
  chatClient.onMessage(async (channel, user, message) => {
    if (message === 'ping') {
      chatClient.say(channel, 'pong');
    } else if (message === '!dado') {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      chatClient.say(channel, `@${user} sacaste un ${diceRoll}`);
    } else if (channel === `#${user}` && message.startsWith('!sorteo')) {
      const minutes: any = message.split(' ').pop();
      const ms: number = Math.floor(+minutes * 60000);
      const createReward = await startRaffle();
      console.log('Se inicia el Sorteo', createReward);
      if (minutes > 1) {
        chatClient.announce(channel, `Se sorteará en ${minutes} minutos`);
      } else {
        chatClient.announce(channel, `Se sorteará en ${minutes} minuto`);
      }
      console.log('Se sorteará en ', minutes, ' minuto(s)');
      await setTimeout(ms);
      await endRaffle(createReward);
      const participants = await getAllParticipants();
      const random = Math.floor(Math.random() * participants.length);
      chatClient.announce(channel, `@${participants[random]} gana el sorteo molienWink molienWink molienWink`);
      console.log('Sorteo Finalizado');
      await redis.del('user-list');
      await setTimeout(100);
      chatClient.say(channel, `@${participants[random]} gana el sorteo molienWink molienWink molienWink`);
    }
  });

  const pubSubClient = new PubSubClient();
  const userId = await pubSubClient.registerUserListener(authProvider);

  await pubSubClient.onRedemption(userId, (message) => {
    if (message.rewardTitle === 'Sorteo') {
      redis.lpush('user-list', message.userDisplayName);
    }
  });
};

main();
