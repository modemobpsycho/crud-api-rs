export type UserIdType = string;

export type UserDataType = CreateUserDto & {
  id: UserIdType;
};

export type CreateUserDto = {
  username: string;
  age: number;
  hobbies: Array<string>;
};
