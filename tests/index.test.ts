import express, {type Express, NextFunction, type Request, type Response} from "express";
import {routeLoader} from "../src";
import path from "path";
import * as net from "net";

const port: number = 3003;
const app: Express = express();
let server: net.Server;

function errorHandler (error: unknown, req: Request, res: Response, next: NextFunction) {
    if(error instanceof Error) {
        error = error.message;
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(500);
    res.send({ error });
}

beforeAll(() => {
    app.use(express.json());
    app.use(routeLoader(path.join(__dirname, "routes")));
    app.use(errorHandler);
    server = app.listen(port);
});

afterAll(() => {
    server.close();
});

test("Test route is applied correctly", async () => {
    const rawResponse = await fetch(`http://localhost:${port}/test`);
    expect(rawResponse.status).toBe(200);
    const text = await rawResponse.text();
    expect(text).toBe("Yeah!");
});

test("Accepts JSON request params", async () => {
    const body = { message: "Yeah!" };
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
