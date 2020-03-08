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

It's really easy to write the wrong abstraction when working with backend services. Even if you've written both the backend and frontend yourself, discrepancies are certain to arise between the two that you'll have to account for, somewhere. This becomes even more apparent when working with a backend that you don't own.

It would be nice to have a layer that defines how the app interfaces with these services. That way if our services change, we only need to look in one place to make our adjustments, and keep our app code nice and clean. And if updates in our app don't quite match up with the backend, or there is a one-off case that breaks a component you've implemented, you can make these changes in one place instead of introducing complexities all throughout your codebase.

Lastly, as a client of a backend service, the calls that you make in your app should feel familiar and represent what is actually happening - you're making a network request to an endpoint, so I wanted the api to communicate this.

## Installation

```bash
yarn add winona
```

## A little bit more

Hopefully the routing situation is somewhat familiar - paths work similar to how they would in an express app. The first matching route executes its handler, so the order in which you register routes is important.

This is handy for one-off cases where a service doesn't quite match up with how your app should work. For example, if one service endpoint differs slightly in structure from your other related calls - you can leverage the order of registered routes in such cases to capture this case and keep your client code clean:

```javascript
// example - playlist component

// say the playlist with the name "featured" needs to hit a different endpoint than the rest of our playlists

function Playlist({ name }) {
  React.useEffect(() => {
    api.get(`/playlists/${name}`).then(...)
  }, [name])
  ...
}

// we could write a new component for this one off case, or we could capture this change in our service instead:

const [app, api] = create()

// capture the featured route and map it to a different endpoint:
app.get('/playlists/featured', (req) => {
  return service.get('/not/the/same/endpoint/as/others')
})

// the rest of the playlists will fall through to this route
app.get('/playlists/:id', (req) => {
  return service.get(`/playlists/${req.params.id}`)
})

```

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
- gives you (the front-ender) the freedom to define your api calls to whatever makes sense for the app you are building
- works great with a library like miragejs - simply add your fetch calls wherever you define your service, and swap it out for the real thing when your backend is ready

## Drawbacks

- slightly harder on the client, there's more work being done to match your paths
- you don't get the typescript definitions that an explicit api function would give you - although the accuracy of those types is debatable anyways
- this might be a horrible idea, or just might not be your thing

## Roadmap

- support for middleware and error handling
