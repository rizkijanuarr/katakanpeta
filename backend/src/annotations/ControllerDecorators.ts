import 'reflect-metadata';
import { RequestHandler, Router, Application } from 'express';

export const METADATA_KEYS = {
    BASE_PATH: 'base_path',
    ROUTERS: 'routers'
};

export enum Methods {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

export interface IRouter {
    method: Methods;
    path: string;
    handlerName: string | symbol;
    middlewares: RequestHandler[];
}

export function BaseController(basePath: string): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(METADATA_KEYS.BASE_PATH, basePath, target);
    };
}

function methodDecoratorFactory(method: Methods) {
    return function(path: string, middlewares: RequestHandler[] = []): MethodDecorator {
        return (target: any, propertyKey: string | symbol) => {
            const controllerClass = target.constructor;
            const routers: IRouter[] = Reflect.hasMetadata(METADATA_KEYS.ROUTERS, controllerClass) ?
                Reflect.getMetadata(METADATA_KEYS.ROUTERS, controllerClass) : [];

            routers.push({
                method,
                path,
                handlerName: propertyKey,
                middlewares
            });

            Reflect.defineMetadata(METADATA_KEYS.ROUTERS, routers, controllerClass);
        };
    };
}

export const GetEndpoint = methodDecoratorFactory(Methods.GET);
export const PostEndpoint = methodDecoratorFactory(Methods.POST);
export const PutEndpoint = methodDecoratorFactory(Methods.PUT);
export const DeleteEndpoint = methodDecoratorFactory(Methods.DELETE);

export function registerControllers(app: Application, controllers: any[]) {
    controllers.forEach(controllerInstance => {
        const controllerClass = controllerInstance.constructor;
        const basePath: string = Reflect.getMetadata(METADATA_KEYS.BASE_PATH, controllerClass) || '';
        const routers: IRouter[] = Reflect.getMetadata(METADATA_KEYS.ROUTERS, controllerClass) || [];

        const exRouter = Router();

        routers.forEach(({ method, path, handlerName, middlewares }) => {
            exRouter[method](path, ...middlewares, async (req, res, next) => {
                try {
                    await controllerInstance[handlerName as string](req, res, next);
                } catch (err) {
                    next(err);
                }
            });
        });

        app.use(basePath, exRouter);
    });
}
