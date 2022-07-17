/* eslint-disable no-console */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/prefer-default-export */

const getAllParticipants = async (redisStore: any, redisKey: string) => {
  if (await redisStore.exists(redisKey)) {
    const res = await redisStore.lrange(redisKey, 0, -1);
    return res;
  }
  return false;
};

export default getAllParticipants;
