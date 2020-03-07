# winona

`winona` is a bridge between your client code and your api services.

If you're not sure what that means (I'm not), hopefully this example is a bit clearer:

```javascript
import create from 'winona'

const [router, client] = create()

// setup routes in the service
router.get('/users/:id', ({ params, query }) => {
  return fetch(`/my/api/or/external/service/${params.id}`)
})

router.post('/me', ({ params, query, myCustomData }) => {
  return myApi.post('/me', { body: myCustomData })
})


// use throughout your client
function UserProfile({ userId }) {

  React.useEffect(() => {
    client.get(`/users/${userId}`).then(...)
  }, [userId])

  function onSubmit() {
    client.post(`/me`, { myCustomData: { 'hi' }}).then(...)
  }
}
```

## Motivation

Providing an api service layer to an app is a pain - you can end up with a lot of bespoke function calls that feel duplicate-y and verbose, or your calls are sprinkled throughout your app willy nilly and you live to dread the day you have to update one (or all) of them.

It would be nice to have a layer that bridges our service level calls with how our app code uses them. That way if our services change, we only need to look in one place to make our adjustments.

Express has a straighforward api that seems like a good fit for our client code (maybe I'm wrong), so I copied some of it.

## Installation

```bash
yarn add winona
```

## Benefits

- keeps all your integrations in one place in case you need to swap them out or mock them in tests
- gives you (the front-ender) the freedom to define your api calls to whatever makes sense to you
- will likely work quite nicely with something like miragejs (not right now though)

## Drawbacks

- slightly harder on the client, there's more work being done to match your paths
- might not be your thing

## Roadmap

- nested routers like `api.use('/auth', authRouter)`
- support for middleware and error handling
