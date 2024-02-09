import {type Request, type Response} from "express";

function fakePromise() {
    return new Promise(resolve => {
        setTimeout(resolve);
    });
}

export function getTest() {
    return "Yeah!";
}

export function postTest({ message }: { message: string }) {
    return { message };
}

export function putTest(body: unknown, req: Request, res: Response) {
    res.send({ worked: "yes" });
}

export function deleteTest() {
    throw new Error("OMG");
}

export async function patchPromiseTest() {
    await fakePromise();
    return {
        yeah: "uuuh"
    };
}

export async function patchPromiseErrorTest() {
    await fakePromise();
    throw new Error("OMG");
}
