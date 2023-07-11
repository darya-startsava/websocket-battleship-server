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
  console.log('request:', { ...parsedMessage, data });
  auth(data, userRegResponseData);
  console.log('response', { ...parsedMessage, data: userRegResponseData });
  return { ...parsedMessage, data: JSON.stringify(userRegResponseData) };
}

function auth(userAuthData: UserAuthData, userRegResponseData: UserRegResponseData) {
  userRegResponseData.name = userAuthData.name;
  if (dataBase.find((user) => user.name === userAuthData.name)) {
    if (
      dataBase.find(
        (user) =>
          user.name === userAuthData.name && user.password === userAuthData.password
      )
    ) {
      userRegResponseData.index = dataBase.findIndex(
        (user) =>
          user.name === userAuthData.name && user.password === userAuthData.password
      );
      return;
    } else {
      userRegResponseData.error = true;
      userRegResponseData.errorText = 'wrong password';
      return;
    }
  }
  userRegResponseData.name = userAuthData.name;
  userRegResponseData.index = dataBase.length;
  dataBase.push(userAuthData);
}
