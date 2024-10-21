import { usersData } from './inMemory';
import { CreateUserDto, UserIdType } from '../types/user.interface';
import { v4 as uuidv4 } from 'uuid';

export const getAll = () => {
  return Object.values(usersData);
};

export const getById = (id: UserIdType) => {
  if (usersData.hasOwnProperty(id)) {
    return usersData[id];
  } else {
    return null;
  }
};

export const create = (userDto: CreateUserDto) => {
  const id = uuidv4();
  const { username, age, hobbies } = userDto;
  const newUser = {
    username,
    age,
    hobbies,
    id,
  };
  usersData[id] = newUser;
  return newUser;
};

export const update = (id: UserIdType, userDto: CreateUserDto) => {
  if (usersData.hasOwnProperty(id)) {
    const { username, age, hobbies } = userDto;
    usersData[id] = {
      username,
      age,
      hobbies,
      id,
    };
    return usersData[id];
  } else {
    return null;
  }
};

export const remove = (id: UserIdType) => {
  if (usersData.hasOwnProperty(id)) {
    delete usersData[id];
    return true;
  } else {
    return false;
  }
};
