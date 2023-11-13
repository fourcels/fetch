import { IStringifyOptions } from 'qs';

type AuthFunc = (header: Headers) => void;
type Params = Record<string, any>;
type Body = Record<string, any> | BodyInit;
type Options = {
    auth?: boolean | AuthFunc;
    params?: Params;
    body?: Body;
    stringifyOptions?: IStringifyOptions;
} & Omit<RequestInit, 'body'>;
/**
 * fetch advance
 */
declare class Fetch {
    private baseUrl?;
    private authFunc?;
    constructor(baseUrl?: string, authFunc?: AuthFunc);
    request(url: string, options?: Options): Promise<{
        res: Response;
        data: any;
    }>;
    GET(url: string, params?: Params, options?: Options): Promise<{
        res: Response;
        data: any;
    }>;
    POST(url: string, body?: Body, options?: Options): Promise<{
        res: Response;
        data: any;
    }>;
    PUT(url: string, body?: Body, options?: Options): Promise<{
        res: Response;
        data: any;
    }>;
    PATCH(url: string, body?: Body, options?: Options): Promise<{
        res: Response;
        data: any;
    }>;
    DELETE(url: string, params?: Params, options?: Options): Promise<{
        res: Response;
        data: any;
    }>;
}
/**
 *  default fetcher
 */
declare const _default: Fetch;

export { Fetch, _default as default };
