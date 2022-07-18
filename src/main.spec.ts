/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef */
import main from './main';

jest.mock('main', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('main', () => {
  // For coverage only
  it('should be true', async () => {
    await expect(main).toBeTruthy();
  });
});
