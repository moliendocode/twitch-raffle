/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable func-names */
/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import getAllParticipants from './participants';

const IoRedis = require('ioredis-mock');

const redis = new IoRedis({
  data: {
    'user-list': [
      'user1',
      'user2',
      'user3',
    ],
  },
});

jest.mock('ioredis', () => function () {
  return redis;
});

describe('getAllParticipants', () => {
  it('should return all participants', async () => {
    const participants = await getAllParticipants(redis, 'user-list');
    expect(participants).toEqual(['user1', 'user2', 'user3']);
  });

  it('should return fail if there is no users', async () => {
    const participants = await getAllParticipants(redis, 'user-list');
    expect(participants).not.toEqual([]);
  });

  it('should return False if store doesnt exist', async () => {
    const participants = await getAllParticipants(redis, 'test-store');
    expect(participants).toBeFalsy();
  });
});
