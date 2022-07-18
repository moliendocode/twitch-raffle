/* eslint-disable func-names */
/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import redis from './store';

// TODO: Mock REDIS

describe('createStore', () => {
  it('should return store', async () => {
    const store = redis;
    expect(store).toBeTruthy();
  });
});
