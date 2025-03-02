const Router = require("express").Router;
const fs = require("fs");
const path = require("path");

/**
 * @description Read the directory at the given path and loads all modules.
 * Each function inside the module is passed to the Express Router instance created in advance.
 * The function name determines which URL path for the route is used.
 *
 * @param {string} pathToRoutes
 * @returns {Router}
 */
function routeLoader(pathToRoutes) {
    const router = Router();
    _loadAllRouteModules(pathToRoutes)
        .forEach((module) => _loadRouteHandlers(router, module));
    return router;
}

function _wrapRouteHandler(method) {
    return async (req, res, next) => {
        try {
            let response = method(req.body, req, res, next);
            if (_isPromise(response)) {
                response = await response;
            }
            if (!res.headersSent) {
                res.send(response);
            }
        } catch (e) {
            next(e);
        }
    };
}

function _applyRouterHandler(module, methodName, router) {
    const method = module[methodName];
    if (typeof method !== "function") return;
    const [httpMethod, ...pathParts] = methodName.split(/(?=[A-Z])/).map(s => s.toLowerCase());
    router[httpMethod](`/${pathParts.join("/")}`, _wrapRouteHandler(method));
}

async function _loadRouteHandlers(router, module) {
    for (const methodName in module) {
        _applyRouterHandler(module, methodName, router);
    }
}

function _isPromise(val) {
    return Boolean(val && typeof val.then === "function");
}

function _loadAllRouteModules(pathToRoutes) {
    const routeFilenames = fs.readdirSync(pathToRoutes);
    return routeFilenames.map(routeFilename => {
        const pathToFile = path.join(pathToRoutes, routeFilename);
        return require(pathToFile);
    });
}

module.exports = routeLoader;
