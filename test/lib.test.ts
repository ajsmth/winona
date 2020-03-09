import createApi from '../src';

test('works', () => {
  const [app, api] = createApi();

  const userFn = jest.fn();

  app.get('/123', userFn);

  expect(userFn).not.toHaveBeenCalled();

  api.get('/123');
  expect(userFn).toHaveBeenCalled();
});

test('passes params to calls', () => {
  const [app, api] = createApi();

  const myService = jest.fn();

  app.get('/user/:id', myService);
  api.get('/user/123');

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ params: { id: '123' } })
  );

  app.delete('/user/:id', myService);
  api.delete('/user/456');

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ params: { id: '456' } })
  );
});

test('query strings passed through', () => {
  const [app, api] = createApi();

  const myService = jest.fn();

  const queryString = `test=value`;

  app.get('/user/:id', myService);
  api.get('/user/123?' + queryString);

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ query: queryString })
  );
});

test('passes data to post, put calls', () => {
  const [app, api] = createApi();

  const myService = jest.fn();

  app.post('/user/:id', myService);
  api.post('/user/123', { data: '123' });

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ data: '123' })
  );

  app.put('/hello/:id', myService);
  api.put('/hello/123', { hello: 'joe' });

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ hello: 'joe' })
  );
});

test('use() scopes routes to a subrouter', () => {
  const [app, api] = createApi();
  const [auth] = createApi();

  const myService = jest.fn();

  app.use('/auth', auth);

  auth.get('/login', myService);
  auth.post('/login', myService);

  api.post('/auth/login', { hello: 'joe' });
  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({
      hello: 'joe',
    })
  );

  api.get('/auth/login');

  auth.get('/user/:id', myService);
  api.get('/auth/user/123');

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({
      params: {
        id: '123',
      },
    })
  );

  auth.patch('/login', myService);

  api.patch('/auth/login', { data: 'test' });
  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({
      data: 'test',
    })
  );
});
