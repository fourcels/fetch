import qs, { IStringifyOptions } from 'qs'

type AuthFunc = (header: Headers) => void
type HandleError = (res: Response, data: any) => void

type Params = Record<string, any>
type Body = Record<string, any> | BodyInit

type Options = {
    auth?: boolean | AuthFunc
    params?: Params
    body?: Body,
    stringifyOptions?: IStringifyOptions
} & Omit<RequestInit, 'body'>


type FetchOptions = {
    authFunc?: AuthFunc
    handleError?: HandleError
}

function isPOJO(arg: any): arg is Record<string, any> {
    if (arg == null || typeof arg !== 'object') {
        return false;
    }
    const proto = Object.getPrototypeOf(arg);
    if (proto == null) {
        return true; // `Object.create(null)`
    }
    return proto === Object.prototype;
}

/**
 * fetch advance
 */
export class Fetch {

    private baseUrl?: string;
    private authFunc?: AuthFunc;
    private handleError?: HandleError;
    constructor(baseUrl?: string, options: FetchOptions = {}) {
        const { authFunc, handleError } = options
        this.baseUrl = baseUrl
        this.authFunc = authFunc
        this.handleError = handleError
    }

    async request(url: string, options: Options = {}) {
        let { headers: customHeaders, stringifyOptions, auth = true, params, body, ...rest } = options

        if (this.baseUrl && url.startsWith('/')) {
            url = this.baseUrl + url
        }
        const headers = new Headers(customHeaders)

        if (params) {
            const query = qs.stringify(params, {
                arrayFormat: 'comma',
                ...stringifyOptions
            })
            if (url.indexOf('?') >= 0) {
                url += '&' + query
            } else {
                url += '?' + query
            }
        }

        if (auth) {
            const authFunc = typeof auth === 'function' ? auth : this.authFunc
            authFunc?.(headers)
        }

        if (isPOJO(body)) {
            headers.append('Content-Type', 'application/json')
            body = JSON.stringify(body)
        }

        const res = await fetch(url, {
            body,
            headers,
            ...rest,
        })
        const contentType = res.headers.get("Content-Type") || ""
        let data
        if (contentType.includes('json')) {
            data = await res.json()
        } else if (contentType.includes('text')) {
            data = await res.text()
        } else {
            data = await res.blob()
        }
        if (!res.ok) {
            this.handleError?.(res, data)
        }

        return { res, data }
    }


    GET(url: string, params?: Params, options?: Options) {
        return this.request(url, {
            method: 'GET',
            params,
            ...options,
        })
    }

    POST(url: string, body?: Body, options?: Options) {
        return this.request(url, {
            method: 'POST',
            body,
            ...options,
        })
    }

    PUT(url: string, body?: Body, options?: Options) {
        return this.request(url, {
            method: 'PUT',
            body,
            ...options,
        })
    }

    PATCH(url: string, body?: Body, options?: Options) {
        return this.request(url, {
            method: 'PATCH',
            body,
            ...options,
        })
    }

    DELETE(url: string, params?: Params, options?: Options) {
        return this.request(url, {
            method: 'DELETE',
            params,
            ...options,
        })
    }
}

/**
 *  default fetcher
 */
export default new Fetch()