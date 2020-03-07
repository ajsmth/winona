# winona

`winona` is a bridge between your client code and your api services.

If you're not sure what that means (I'm not), hopefully this example is a bit clearer:

```javascript
import create from 'winona'

const [router, client] = create()

// setup routes in the service
router.get('/users/:id', ({ params, query }) => {
  return fetch(`/my/service/${params.id}`)
})

router.post('/me', ({ params, query, myCustomData }) => {
  return myService.post('/me', { body: myCustomData })
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

Implementing an api service layer for an app is a pain:

- you can end up with a lot of bespoke function calls that feel duplicate-y
- or you sprinkle calls everywhere and live in dread for when your backend changes
- most importantly - it's easy to write the wrong abstraction in your app!

It would be nice to have a layer that bridges our service level calls with how our app code uses them. That way if our services change, we only need to look in one place to make our adjustments, and keep our app code nice and clean.

## Installation

```bash
yarn add winona
```

## A little bit more

Hopefully the routing situation is somewhat familiar - paths work similar to how they would in an express app. The first matching route executes its handler, so the order in which you register routes is important.

This is handy for one-off cases where a service doesn't quite match up with how your app should work.

For example, if one api call is slightly different in structure from your other related calls, but it would be oh so nice to use as a single component or hook. You can leverage the routing order to capture such cases.

## Benefits

- keeps all your integrations in one place in case you need to swap them out or mock them in tests
- gives you (the front-ender) the freedom to define your api calls to whatever makes sense to you
- will likely work quite nicely with something like miragejs (not right now though)

## Drawbacks

- slightly harder on the client, there's more work being done to match your paths
- this might be a horrible idea, or just might not be your thing

## Roadmap

- nested routers like `api.use('/auth', authRouter)`
- support for middleware and error handling
