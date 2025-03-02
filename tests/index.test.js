const express = require("express");
const path = require("node:path");
const {routeLoader} = require("../index");

const port = 3003;
let app = express();
let server;

function errorHandler(error, req, res, next) {
    if (error instanceof Error) {
        error = error.message;
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(500);
    res.send({error});
}

beforeAll(async () => {
    app.use(express.json());
    app.use(routeLoader(path.join(__dirname, "routes")));
    app.use(errorHandler);
    server = app.listen(port);
});

afterAll(async () => {
    server.close();
});

test("Test route is applied correctly", async () => {
    const rawResponse = await fetch(`http://localhost:${port}/test`);
    expect(rawResponse.status).toBe(200);
    const text = await rawResponse.text();
    expect(text).toBe("Yeah!");
});

test("Accepts JSON request params", async () => {
    const body = {message: "Yeah!"};
    const rawResponse = await fetch(`http://localhost:${port}/test`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body)
    });
    expect(rawResponse.status).toBe(200);
    const responseBody = await rawResponse.json();
    expect(responseBody.message).toBe(body.message);
});

test("Thrown errors are caught correctly", async () => {
    const rawResponse = await fetch(`http://localhost:${port}/test`, {
        method: "DELETE",
    });
    expect(rawResponse.status).toBe(500);
    const responseBody = await rawResponse.json();
    expect(responseBody.error).toBe("OMG");
});

test("Manually send response is handled correctly", async () => {
    const rawResponse = await fetch(`http://localhost:${port}/test`, {
        method: "PUT",
    });
    expect(rawResponse.status).toBe(200);
    const responseBody = await rawResponse.json();
    expect(responseBody.worked).toBe("yes");
});

test("Promises are working", async () => {
    const rawResponse = await fetch(`http://localhost:${port}/promise/test`, {
        method: "PATCH",
    });
    expect(rawResponse.status).toBe(200);
    const responseBody = await rawResponse.json();
    expect(responseBody.yeah).toBe("uuuh");
});

test("Error catching in promises is working", async () => {
    const rawResponse = await fetch(`http://localhost:${port}/promise/error/test`, {
        method: "PATCH",
    });
    expect(rawResponse.status).toBe(500);
    const responseBody = await rawResponse.json();
    expect(responseBody.error).toBe("OMG");
});
