/* eslint-disable import/prefer-default-export */
import Redis from 'ioredis';
import 'dotenv/config';

const host: string = process.env.REDIS_HOSTNAME!;
const port: number = +process.env.REDIS_PORT!;
const username: string = process.env.REDIS_USERNAME!;
const password: string = process.env.REDIS_PASSWORD!;

const redis = new Redis({
  host, port, username, password,
});

export default redis;
