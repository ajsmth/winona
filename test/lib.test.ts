import createApi from '../src';

test('works', () => {
  const [router, client] = createApi();

  const userFn = jest.fn();

  router.get('/123', userFn);

  expect(userFn).not.toHaveBeenCalled();
  expect(() => client.get('/')).toThrow();

  client.get('/123');
  expect(userFn).toHaveBeenCalled();
});

test('passes params to calls', () => {
  const [router, client] = createApi();

  const myService = jest.fn();

  router.get('/user/:id', myService);
  client.get('/user/123');

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ params: { id: '123' } })
  );

  router.delete('/user/:id', myService);
  client.delete('/user/456');

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ params: { id: '456' } })
  );
});

test('passes data to post, put calls', () => {
  const [router, client] = createApi();

  const myService = jest.fn();

  router.post('/user/:id', myService);
  client.post('/user/123', { data: '123' });

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ data: '123' })
  );

  router.put('/hello/:id', myService);
  client.put('/hello/123', { hello: 'joe' });

  expect(myService).toHaveBeenLastCalledWith(
    expect.objectContaining({ hello: 'joe' })
  );
});
