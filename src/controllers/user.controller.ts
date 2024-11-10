import { CONTENT_TYPE_JSON, INVALID_MESSAGE } from '../constants/constants';
import { getRequestBodyData } from '../helpers/getBodyRequest';
import { get400Response, get404Response } from '../errorHandler/errorHandler';
import { RouteHandlerType } from '../types/route.interface';
import { create, getById, getAll, update, remove } from '../model/users.model';
import {
  isValidUserDto,
  isValidId,
  getIdFromUrl,
  getUserIdNotFoundMessage,
  getInvalidUserIdMessage,
} from '../model/helpers';

export const getUsers: RouteHandlerType = async (req, res) => {
  const data = getAll();

  res.writeHead(200, CONTENT_TYPE_JSON);
  res.end(JSON.stringify(data));
};

export const getUserById: RouteHandlerType = (req, res) => {
  const id = getIdFromUrl(req.url);

  if (!isValidId(id)) {
    return get400Response(res, getInvalidUserIdMessage());
  }

  const user = getById(id);

  if (user === null) {
    return get404Response(res, getUserIdNotFoundMessage(id));
  }

  res.writeHead(200, CONTENT_TYPE_JSON);
  res.end(JSON.stringify(user));
};

export const addUser: RouteHandlerType = async (req, res) => {
  const userDto = await getRequestBodyData(req);

  if (userDto === null || !isValidUserDto(userDto)) {
    return get400Response(res, INVALID_MESSAGE);
  }

  const newUser = create(userDto);

  res.writeHead(201, CONTENT_TYPE_JSON);
  res.end(JSON.stringify(newUser));
};

export const updateUser: RouteHandlerType = async (req, res) => {
  const id = getIdFromUrl(req.url);

  if (!isValidId(id)) {
    return get400Response(res, getInvalidUserIdMessage());
  }

  const userDto = await getRequestBodyData(req);

  if (userDto === null || !isValidUserDto(userDto)) {
    return get400Response(res, INVALID_MESSAGE);
  }

  const updatedUser = update(id, userDto);

  if (updatedUser === null) {
    return get404Response(res, getUserIdNotFoundMessage(id));
  }

  res.writeHead(200, CONTENT_TYPE_JSON);
  res.end(JSON.stringify(updatedUser));
};

export const deleteUser: RouteHandlerType = (req, res) => {
  const id = getIdFromUrl(req.url);

  if (!isValidId(id)) {
    return get400Response(res, getInvalidUserIdMessage());
  }

  const removed = remove(id);

  if (!removed) {
    return get404Response(res, getUserIdNotFoundMessage(id));
  }

  res.statusCode = 204;
  res.end();
};
