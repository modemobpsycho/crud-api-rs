import { UserDataType, UserIdType } from '../types/user.interface';
import { v4 as uuidv4 } from 'uuid';

const idUser1 = uuidv4();
const idUser2 = uuidv4();
const idUser3 = uuidv4();
const idUser4 = uuidv4();

export const userDto1Fixture = {
  username: 'Vasya',
  age: 30,
  hobbies: ['art', 'music'],
};

export const userDto2Fixture = {
  username: 'Petya',
  age: 15,
  hobbies: ['games', 'anime'],
};

export const usersDataFixture: Record<UserIdType, UserDataType> = {
  [idUser1]: {
    id: idUser1,
    ...userDto1Fixture,
  },
  [idUser2]: {
    id: idUser2,
    ...userDto2Fixture,
  },
  [idUser3]: {
    id: idUser3,
    username: 'Stacy',
    age: 25,
    hobbies: ['programming', 'crypto'],
  },
  [idUser4]: { id: idUser4, username: 'Alina', age: 21, hobbies: [] },
};

export const usersData: Record<UserIdType, UserDataType> = {};
