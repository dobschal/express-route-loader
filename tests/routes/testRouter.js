function fakePromise() {
    return new Promise(resolve => {
        setTimeout(resolve);
    });
}

function getTest() {
    return "Yeah!";
}

function postTest({message}) {
    return {message};
}

function putTest(body, req, res) {
    res.send({worked: "yes"});
}

function deleteTest() {
    throw new Error("OMG");
}

async function patchPromiseTest() {
    await fakePromise();
    return {
        yeah: "uuuh"
    };
}

async function patchPromiseErrorTest() {
    await fakePromise();
    throw new Error("OMG");
}

module.exports = {
    getTest,
    postTest,
    putTest,
    deleteTest,
    patchPromiseTest,
    patchPromiseErrorTest
};
