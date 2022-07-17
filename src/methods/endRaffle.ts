/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { ApiClient } from '@twurple/api';
import { authProvider } from '../twitch/auth/auth.js';
import 'dotenv/config';

const broadcasterId: string = process.env.BROADCASTER_ID!;

const endRaffle = async (raffleId: string) => {
  const twitchApi: ApiClient = new ApiClient({ authProvider });
  await twitchApi.channelPoints.deleteCustomReward(broadcasterId, raffleId);
};

export default endRaffle;
