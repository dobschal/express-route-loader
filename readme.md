# Express Auto Loader

Automaticaly load route handlers from script files, catch errors and map the function name to the URL path.

```javascript
function getArticles() {} // becomes HTTP GET /articles 🙌
```

## Get Started

### Installation
```bash
# Install the package via NPM:
npm install --save @dobschal/express-route-loader
```
### Import
```javascript
// CommonJS
const { routeLoader } = require("@dobschal/express-route-loader");
// ESM
import { routeLoader } from "@dobschal/express-route-loader";
// TypeScript
import { routeLoader } from "@dobschal/express-route-loader/src/index";
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

```javascript
// src/app.js

// Import dependencies
// via require...
const express = require('express');
const path = require('path');
const { routeLoader } = require("@dobschal/express-route-loader");
// ...or via import
import { routeLoader } from '@dobschal/express-route-loader';
import express from 'express';
import path from 'path';

// Instantiate express app and configure...
const app = express();

// Apply auto loader
app.use(routeLoader(path.join(__dirname, "routes")));

app.listen(/* ... */);
```

```javascript
// src/routes/user.js

// This will apply as route handler for GET /users

// Via CommonJS...
module.exports.getUsers = async function(body, req, res) {
    const users = await loadUsers();
    res.send({ users });
}
// or ESM
export async function getUsers(body, req, res) {
    const users = await loadUsers();
    res.send({ users });
}
```

## TypeScript Support

TypeScript build via `tsc` works, but via `ts-node` not.
To make TypeScript working in dev mode, you need to copy the `src/index.ts` file into your project and import `routeLoader` from there.

Add the copy command to the `postinstall` script in your `package.json`:
```json
{
  "scripts": {
    "start": "...",
    "postinstall": "rm -rf lib/dobschal && mkdir -p lib && mkdir -p lib/dobschal && cp node_modules/@dobschal/express-route-loader/src/index.ts lib/dobschal/route-loader.ts\n"
  }
}
```
Then import like so:
```typescript
import { routerLoader } from "../lib/dobschal/route-loader.ts";
```

## Auto Response

Instead of calling `res.send(/* ... */)` you can use the return keyword.
```typescript
export async function getUsers() {
    return { users: await loadUsers() };
}
```

## Error Handling

If an error is thrown inside a route handler, the error is automatically forwarded to the [Express Error Handler](https://expressjs.com/en/guide/error-handling.html) via the NextFunction.

```javascript
export function postLogin({ password }) {
    
    // This will automatically be caught 
    // Just implement a global ExpressJS Error Handler 
    if(passwordIsWrong(password)) {
        throw new Error("Password is wrong.");
    }
}
```

