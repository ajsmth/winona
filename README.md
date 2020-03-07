# winona

`winona` is a bridge between your client code and your api services.

If you're not sure what that means (I'm not), hopefully this example is a bit clearer:

```javascript
// in a service file of a react app, for example
import create from 'winona'

const [app, api] = create()

// setup routes
app.get('/users/:id', (req) => {
  return fetch(`/my/service/${req.params.id}`)
})

app.post('/me', (req) => {
  return myService.post('/me', { body: req.myCustomData })
})



// use throughout your app
function UserProfile({ userId }) {

  React.useEffect(() => {
    api.get(`/users/${userId}`).then(...)
  }, [userId])

  function onSubmit() {
    api.post(`/me`, { myCustomData: { 'hi' }}).then(...)
  }
}
```

## Motivation

Implementing an api service layer for an app is a pain:

- you end up with a lot of functions that feel duplicate-y and bespoke
- or you sprinkle api calls ad-hoc and live in dread for when your backend changes
- most importantly - it's easy to write the wrong abstraction in your app!

It would be nice to have a layer that bridges our service level calls with how our app code uses them. That way if our services change, we only need to look in one place to make our adjustments, and keep our app code nice and clean.

## Installation

```bash
yarn add winona
```

## A little bit more

Hopefully the routing situation is somewhat familiar - paths work similar to how they would in an express app. The first matching route executes its handler, so the order in which you register routes is important.

This is handy for one-off cases where a service doesn't quite match up with how your app should work. For example, if one api call differs slightly in structure from your other related calls, but would be oh so nice to use as a single component or hook - you can leverage the order of registered routes in such cases

It's also possible to nest routers and group your calls by their roles:

```javascript
const [app, api] = create()
const [auth] = create()

// setup routing
auth.get('/user/:id', (req) => fetch(...))

// expose auth router in our main api
app.use('/auth', auth)

// use throughout your app
api.get(`/auth/user/123`)
```

## Benefits

- keeps all your integrations in one place in case you need to swap them out or mock them in tests
- gives you (the front-ender) the freedom to define your api calls to whatever makes sense to you
- will likely work quite nicely with something like miragejs (not right now though)
  pinde

## Drawbacks

- slightly harder on the client, there's more work being done to match your paths
- this might be a horrible idea, or just might not be your thing

## Roadmap

- support for middleware and error handling
