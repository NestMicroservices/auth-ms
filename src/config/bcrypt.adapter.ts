import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export const bcryptAdapter = {
  hash: async (password: string) => {
    const salt = genSaltSync();
    return await hashSync(password, salt);
  },
  compare: async (password: string, hash: string) => {
    return await compareSync(password, hash);
  },
};
