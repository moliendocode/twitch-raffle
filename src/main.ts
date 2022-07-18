/* eslint-disable import/prefer-default-export */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-return-await */
/* eslint-disable no-console */
import 'dotenv/config';
import { PubSubClient } from '@twurple/pubsub';
import { setTimeout } from 'timers/promises';

import startRaffle from './methods/startRaffle.js';

import endRaffle from './methods/endRaffle.js';
import chatClient from './twitch/chatClient.js';
import getAllParticipants from './twitch/participants.js';
import Redis from './redis/store.js';
import { authProvider } from './twitch/auth/auth.js';

const main = async () => {
  const redis = Redis;
  chatClient.onMessage(async (channel:any, user:any, message:any) => {
    if (message === 'ping') {
      chatClient.say(channel, 'pong');
    } else if (message === '!dado') {
      const diceRoll = Math.floor(Math.random() * 6) + 1;
      chatClient.say(channel, `@${user} sacaste un ${diceRoll}`);
    } else if (channel === `#${user}` && message.startsWith('!sorteo')) {
      const minutes: any = message.split(' ');
      const ms: number = Math.floor(+minutes[1] * 60000);
      const createReward = await startRaffle();
      console.log('Se inicia el Sorteo', createReward);
      if (minutes[1] > 1) {
        chatClient.announce(channel, `Se sorteará en ${minutes[1]} minutos`);
      } else {
        chatClient.announce(channel, `Se sorteará en ${minutes[1]} minuto`);
      }
      console.log('Se sorteará en ', minutes[1], ' minuto(s)');
      await setTimeout(ms);
      await endRaffle(createReward);
      const participants = await getAllParticipants(redis, 'user-list');
      const random: any = [];
      for (let i = 0; i < minutes[2]; i++) {
        const randomize = Math.floor(Math.random() * participants.length);
        random.push(randomize);
      }
      if (minutes[2] > 1) {
        let winnerText: string = 'Los ganadores son: ';
        for (const winner in random) {
          winnerText += `@${participants[random[winner]]} `;
        }
        winnerText += ' molienWink';
        chatClient.announce(channel, winnerText);
      } else {
        chatClient.announce(channel, `@${participants[random[0]]} gana el sorteo molienWink molienWink molienWink`);
      }
      console.log('Sorteo Finalizado');
      await redis.del('user-list');
      await setTimeout(100);
    }
  });

  const pubSubClient = new PubSubClient();
  const userId = await pubSubClient.registerUserListener(authProvider);

  await pubSubClient.onRedemption(userId, (message: any) => {
    if (message.rewardTitle === 'Sorteo') {
      redis.lpush('user-list', message.userDisplayName);
    }
  });
};

main();

export default main;
