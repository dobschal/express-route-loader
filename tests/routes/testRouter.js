const prefix = "/test";

function fakePromise() {
    return new Promise(resolve => {
        setTimeout(resolve);
    });
}

function get() {
    return "Yeah!";
}

function post({message}) {
    return {message};
}

function put(body, req, res) {
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
