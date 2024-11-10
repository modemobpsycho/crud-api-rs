import 'dotenv/config';

export const PORT = process.env.PORT || 3000;

export enum Methods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export const INVALID_MESSAGE = 'Missing or invalid fields.';

export const CONTENT_TYPE_JSON = { 'Content-Type': 'application/json' };
