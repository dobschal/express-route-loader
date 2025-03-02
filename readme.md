# Express Route Loader

Automatically load route handlers from script files, catch errors and map the function name to the URL path.

```javascript
function getArticles() {
} // becomes HTTP GET /articles 🙌
```

![Test](https://github.com/dobschal/express-route-loader/actions/workflows/test.yml/badge.svg)
[![NPM](https://img.shields.io/npm/v/@dobschal/express-route-loader)](https://www.npmjs.com/package/@dobschal/express-route-loader)

## Get Started

### Installation

```bash
# Install the package via NPM:
npm install --save @dobschal/express-route-loader
```

### Import

```javascript
// ES6
import {routeLoader} from "@dobschal/express-route-loader";

// CommonJS
const {routeLoader} = require("@dobschal/express-route-loader");
```

### Use

```javascript
// Expect to have all route handlers in routes/
app.use(routeLoader(path.join(__dirname, "routes")));
```

## Router Handler

```javascript
// Will add GET /users route handler
export function getUsers() {
    // ...
    return users;
}
```

## Example

`app.js`

```javascript
import express from "express";
import path from "path";
import {routeLoader} from "@dobschal/express-route-loader";

// Instantiate express app and configure...
const app = express();

// Apply auto loader
app.use(routeLoader(path.join(__dirname, "routes")));

app.listen(/* ... */);
```

`routes/user.js`

```javascript
// This will apply as route handler for GET /users

export async function getUsers(body, req, res) {
    const users = await loadUsers();
    res.send({users});
}
```

## Auto Response

Instead of calling `res.send(/* ... */)` you can use the return keyword to send a JSON HTTP response.

```typescript
export async function getUsers() {
    return {users: await loadUsers()};
}
```

## Error Handling

If an error is thrown inside a route handler, the error is automatically forwarded to
the [Express Error Handler](https://expressjs.com/en/guide/error-handling.html) via the NextFunction.

```javascript
export function postLogin({password}) {

    // This will automatically be caught 
    // Just implement a global ExpressJS Error Handler 
    if (passwordIsWrong(password)) {
        throw new Error("Password is wrong.");
    }
}
```

