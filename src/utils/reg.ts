import { RawData } from 'ws';

type UserRegRequest = {
  type: string;
  data: UserAuthData;
  id: number;
};
import dataBase from '../dataBase';

type UserRegResponse = {
  type: string;
  data: UserRegResponseData;
  id: number;
};

type UserRegResponseData = {
  name: string;
  index: number;
  error: boolean;
  errorText: string;
};

type UserAuthData = {
  name: string;
  password: string;
};

export default function reg(message: RawData) {
  const userRegResponseData = {
    name: '',
    index: 0,
    error: false,
    errorText: '',
  };
  const parsedMessage = JSON.parse(message.toString());
  const data = JSON.parse(parsedMessage.data);
  auth(data, userRegResponseData);
  console.log('response:', parsedMessage.type);
  return { ...parsedMessage, data: JSON.stringify(userRegResponseData) };
}

function auth(userAuthData: UserAuthData, userRegResponseData: UserRegResponseData) {
  userRegResponseData.name = userAuthData.name;
  if (dataBase.find((user) => user.name === userAuthData.name)) {
    userRegResponseData.error = true;
    userRegResponseData.errorText =
      'User with this name is already in game. Choose another name';
    return;
  }
  userRegResponseData.name = userAuthData.name;
  userRegResponseData.index = dataBase.length;
  dataBase.push(userAuthData);
}
