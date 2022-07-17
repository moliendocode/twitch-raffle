/* eslint-disable no-return-await */
/* eslint-disable import/prefer-default-export */
import { RefreshingAuthProvider } from '@twurple/auth';
import { promises as fs, existsSync } from 'fs';

interface TokenData {
    accessToken: string;
    refreshToken: string;
    scope: string[];
    expiresIn: number;
    obtainmentTimestamp: number;
  }

const userClientId: string = process.env.CLIENT_ID!;
const userClientSecret: string = process.env.CLIENT_SECRET!;
let tokenData: TokenData;
if (existsSync('src/tokens.json')) {
  tokenData = JSON.parse(await fs.readFile('./tokens.json', 'utf8'));
} else {
  tokenData = {
    accessToken: process.env.ACCESS_TOKEN!,
    refreshToken: process.env.REFRESH_TOKEN!,
    scope: ['channel:manage:redemptions',
      'channel:moderate',
      'channel:read:hype_train',
      'channel:read:redemptions',
      'channel:read:subscriptions',
      'chat:edit',
      'chat:read'],
    expiresIn: 0,
    obtainmentTimestamp: 0,
  };
}
export const authProvider = new RefreshingAuthProvider(
  {
    clientId: userClientId,
    clientSecret: userClientSecret,
    onRefresh: async (newTokenData) => await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'utf8'),
  },
  tokenData,
);
