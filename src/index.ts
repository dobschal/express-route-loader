import {NextFunction, type Request, type Response, Router} from "express";
import path from "path";
import * as fs from "fs";

interface RouterModule {
    [methodName: string]: (body: unknown, req: Request, res: Response, next: NextFunction) => unknown
}

/**
 * @description Read the directory at the given path and loads all modules.
 * Each function inside the module is passed to the Express Router instance created in advance.
 * The function name determines which URL path for the route is used.
 *
 * @param {string} pathToRoutes
 * @returns {Router}
 */
export function routeLoader(pathToRoutes: string): Router {
    const router = Router();
    _loadAllRouteModules(pathToRoutes)
        .forEach((modulePromise: Promise<RouterModule>) => _loadRouteHandlers(router, modulePromise));
    return router;
}

function _wrapRouteHandler(method: (body: unknown, req: Request, res: Response, next: NextFunction) => unknown) {
    return async (req: Request, res: Response, next: NextFunction) => {
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

function _applyRouterHandler(module: RouterModule, methodName: string, router: Router) {
    const method = module[methodName];
    if (typeof method !== "function") return;
    const [httpMethod, ...pathParts] = methodName.split(/(?=[A-Z])/).map(s => s.toLowerCase());
    (router[httpMethod as keyof Router] as (path: string, handler: (req: Request, res: Response, next: NextFunction) => Promise<void>) => void)(
        `/${pathParts.join("/")}`,
        _wrapRouteHandler(method)
    );
}

async function _loadRouteHandlers(router: Router, modulePromise: Promise<RouterModule>) {
    const module = await modulePromise;
    for (const methodName in module) {
        _applyRouterHandler(module, methodName, router);
    }
}

function _isPromise(val: unknown): boolean {
    return Boolean(val && typeof (val as Promise<unknown>).then === "function");
}

function _loadAllRouteModules(pathToRoutes: string) {
    const routeFilenames = fs.readdirSync(pathToRoutes);
    return routeFilenames.map(routeFilename => {
        const pathToFile = path.join(pathToRoutes, routeFilename);
        return import(pathToFile);
    });
}
