/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ApiClient } from '@twurple/api';
import { authProvider } from '../twitch/auth/auth.js';
import 'dotenv/config';

const broadcasterId: string = process.env.BROADCASTER_ID!;

const startRaffle = async () => {
  const twitchApi: ApiClient = new ApiClient({ authProvider });
  const apiCall = await twitchApi.channelPoints.createCustomReward(broadcasterId, {
    title: 'Sorteo',
    cost: 1,
    maxRedemptionsPerUserPerStream: 1,
    autoFulfill: true,
  });
  return apiCall.id;
};

export default startRaffle;
