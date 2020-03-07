import { match, MatchFunction, MatchResult } from 'path-to-regexp';

type IHandler = (args: IRequest) => Promise<any>;

interface IApi {
  get: (path: string) => Promise<any>;
  post: (path: string, options?: any) => Promise<any>;
  put: (path: string, options?: any) => Promise<any>;
  patch: (path: string, options?: any) => Promise<any>;
  delete: (path: string) => Promise<any>;
}

interface IRouter {
  use: (path: string, handler: IRouter) => void;
  get: (path: string, handler: IHandler) => void;
  post: (path: string, handler: IHandler) => void;
  put: (path: string, handler: IHandler) => void;
  patch: (path: string, handler: IHandler) => void;
  delete: (path: string, handler: IHandler) => void;
}

interface IRequest {
  params: any;
  query: string;
  path: string;
}

type IVerbs = 'get' | 'post' | 'put' | 'delete' | 'patch';
type IRouters = Record<IVerbs, IRoutes>;

function create(): [IRouter, IApi] {
  const routes: IRouters = {
    get: createRoutes(),
    post: createRoutes(),
    put: createRoutes(),
    patch: createRoutes(),
    delete: createRoutes(),
  };

  function use(path: string, handler: any) {
    path = `${path}/(.*)`;

    register('get')(path, handler);
    register('post')(path, handler);
    register('put')(path, handler);
    register('patch')(path, handler);
    register('delete')(path, handler);
  }

  function register(verb: IVerbs) {
    const router = routes[verb];

    return function(path: string, handler: any) {
      router.paths.push(path);
      router.handlers.push(handler);

      const matcher = match(path);
      router.matchers.push(matcher);
    };
  }

  function get(path: string) {
    const [handler, match] = findMatchingHandler(path, 'get');

    if (handler && match) {
      return handler(match);
    }
  }

  function post(path: string, options: any) {
    const [handler, match] = findMatchingHandler(path, 'post');

    if (handler && match) {
      return handler({ ...match, ...options });
    }
  }

  function put(path: string, options: any) {
    const [handler, match] = findMatchingHandler(path, 'put');

    if (handler && match) {
      return handler({ ...match, ...options });
    }
  }

  function patch(path: string, options: any) {
    const [handler, match] = findMatchingHandler(path, 'patch');

    if (handler && match) {
      return handler({ ...match, ...options });
    }
  }

  function del(path: string) {
    const [handler, match] = findMatchingHandler(path, 'delete');

    if (handler && match) {
      return handler(match);
    }
  }

  function findMatchingHandler(path: string, verb: IVerbs) {
    const _routes = routes[verb];

    for (let index = 0; index < _routes.matchers.length; index++) {
      const matcher = _routes.matchers[index];
      const match = matcher(path);

      if (match) {
        let handler = _routes.handlers[index];

        if (typeof handler === 'object') {
          let basepath = _routes.paths[index].replace('/(.*)', '');
          path = path.replace(basepath, '');

          // @ts-ignore
          return handler.findMatchingHandler(path, verb);
        }

        return [handler, match];
      }
    }

    return [];
  }

  const api = {
    get: get,
    post: post,
    patch: patch,
    put: put,
    delete: del,
  };

  const app = {
    get: register('get'),
    post: register('post'),
    put: register('put'),
    patch: register('patch'),
    delete: register('delete'),
    use: use,
    findMatchingHandler,
  };

  return [app, api];
}

interface IRoutes {
  paths: string[];
  handlers: IHandler[];
  matchers: MatchFunction[];
}

function createRoutes(): IRoutes {
  const paths: string[] = [];
  const handlers: IHandler[] = [];
  const matchers: MatchFunction[] = [];

  return {
    paths,
    handlers,
    matchers,
  };
}

export default create;
