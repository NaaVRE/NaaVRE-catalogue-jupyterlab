// TODO: move to @naavre-communicator and import from there
import { useEffect, useState } from 'react';

import { requestAPI } from '@naavre/communicator-jupyterlab/lib/handler'; // FIXME import from module root

export interface IUserInfo {
  sub: string | null;
  preferred_username: string | null;
  username: string | null;
}

export const defaultUserInfo = {
  sub: null,
  preferred_username: null,
  username: null
};

export function useUserInfo() {
  const [userInfo, setUserInfo] = useState<IUserInfo>(defaultUserInfo);

  useEffect(() => {
    requestAPI<IUserInfo>('naavre-communicator/me').then(resp => {
      setUserInfo(resp);
    });
  }, []);

  return userInfo;
}
