import { match, MatchFunction, MatchResult } from 'path-to-regexp';

type IHandler = (args: MatchData) => Promise<any>;

interface IClient {
  get: (path: string) => Promise<any>;
  post: (path: string, options: any) => Promise<any>;
  put: (path: string, options: any) => Promise<any>;
  delete: (path: string) => Promise<any>;
}

interface IRouter {
  get: (path: string, handler: IHandler) => void;
  post: (path: string, handler: IHandler) => void;
  put: (path: string, handler: IHandler) => void;
  delete: (path: string, handler: IHandler) => void;
}

interface MatchData {
  params: any;
  query: string;
  path: string;
}

function create(): [IRouter, IClient] {
  const routers = {
    get: createRouter(),
    post: createRouter(),
    put: createRouter(),
    delete: createRouter(),
  };

  function get(path: string) {
    const [pathString, queryString = ''] = path.split('?');

    const match = routers.get.findMatch(pathString);
    const handler = routers.get.getHandlerForMatch(match);

    if (match && handler) {
      const { index, ...rest } = match;
      const args = { ...rest, query: queryString };
      return handler(args);
    }

    throw new Error(`${path} is not a registered get() handler`);
  }

  function post(path: string, options: any) {
    const [pathString, queryString = ''] = path.split('?');

    const match = routers.post.findMatch(pathString);
    const handler = routers.post.getHandlerForMatch(match);

    if (match && handler) {
      const { index, ...rest } = match;
      const args = { ...rest, query: queryString, ...options };
      return handler(args);
    }

    throw new Error(`${path} is not a registered post() handler`);
  }

  function put(path: string, options: any) {
    const [pathString, queryString = ''] = path.split('?');

    const match = routers.put.findMatch(pathString);
    const handler = routers.put.getHandlerForMatch(match);

    if (match && handler) {
      const { index, ...rest } = match;
      const args = { ...rest, query: queryString, ...options };
      return handler(args);
    }

    throw new Error(`${path} is not a registered put() handler`);
  }

  function del(path: string) {
    const [pathString, queryString = ''] = path.split('?');

    const match = routers.delete.findMatch(pathString);
    const handler = routers.delete.getHandlerForMatch(match);

    if (match && handler) {
      const { index, ...rest } = match;
      const args = { ...rest, query: queryString };
      return handler(args);
    }

    throw new Error(`${path} is not a registered get() handler`);
  }

  const client = {
    get,
    post,
    put,
    delete: del,
  };

  const router = {
    get: routers.get.register,
    post: routers.post.register,
    put: routers.put.register,
    delete: routers.delete.register,
  };

  return [router, client];
}

function createRouter() {
  const handlers: IHandler[] = [];
  const matchers: MatchFunction[] = [];
  const paths: string[] = [];

  function register(path: string, handler: IHandler) {
    handlers.push(handler);
    paths.push(path);

    const matcher = match(path, {
      encode: encodeURI,
      decode: decodeURIComponent,
    });

    matchers.push(matcher);
  }

  function getHandlerForMatch(match?: MatchResult) {
    if (match) {
      const handler = handlers[match.index];

      if (handler) {
        return handler;
      }
    }

    return undefined;
  }

  function findMatch(path: string) {
    for (let index = 0; index < matchers.length; index++) {
      const matcher = matchers[index];
      const match = matcher(path);

      if (match) {
        match.index = index;
        match.params = match.params || {};
        return match;
      }
    }

    return undefined;
  }

  return {
    register,
    getHandlerForMatch,
    findMatch,
  };
}

export default create;
