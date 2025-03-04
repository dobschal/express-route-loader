const prefix = "/test";

function fakePromise() {
    return new Promise(resolve => {
        setTimeout(resolve);
    });
}

function get() {
    return "Yeah!";
}

function post({body}) {
    return {message: body.message};
}

function put({res}) {
    res.send({worked: "yes"});
}

function deleteUser() {
    throw new Error("OMG");
}

async function patchPromise() {
    await fakePromise();
    return {
        yeah: "uuuh"
    };
}

async function patchPromiseError() {
    await fakePromise();
    throw new Error("OMG");
}

module.exports = {
    prefix,
    get,
    post,
    put,
    deleteUser,
    patchPromise,
    patchPromiseError
};
