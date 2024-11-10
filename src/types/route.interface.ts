import { IncomingMessage, ServerResponse } from 'node:http';

export type RouteHandlerType<Response = void> = (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
) => Response | Promise<Response>;

export type ResponseErrorType = (
  res: ServerResponse<IncomingMessage>,
  message?: string,
) => void;
