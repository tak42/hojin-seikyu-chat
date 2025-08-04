import type { UserDto } from 'common/types/user';
import { atom, useAtom } from 'jotai';
import { useCallback } from 'react';

const userAtom = atom<{ inited: false; data: null } | { inited: true; data: UserDto | null }>({
  inited: false,
  data: null,
});

export const useUser = () => {
  const [user, setUser] = useAtom(userAtom);

  return {
    user,
    setUser: useCallback(
      (user: UserDto | null) => setUser({ inited: true, data: user }),
      [setUser],
    ),
  };
};
