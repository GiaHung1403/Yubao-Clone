import {
  LOGIN,
  LOGIN_RC,
  LOGIN_RC_SUCCESS,
  LOGIN_SUCCESS,
} from './types/auth_type';

export const loginSystem = ({ User_ID, Password }) => ({
  type: LOGIN,
  data: {
    User_ID,
    Password,
  },
});

interface IPropsLoginRC {
  username?: string;
  password?: string;
  resume?: string;
}

export const loginRocketChat = ({ username, password, resume }: IPropsLoginRC) => ({
  type: LOGIN_RC,
  data: {
    username,
    password,
    resume,
  },
});

export const setDataUserSystem = ({ dataUser }) => ({
  type: LOGIN_SUCCESS,
  response: dataUser,
});

export const setDataUserRC = ({ dataUser }) => ({
  type: LOGIN_RC_SUCCESS,
  response: dataUser,
});
