import qs, { IStringifyOptions } from 'qs'

type AuthFunc = (header: Headers) => void

type Params = Record<string, any>
type Body = Record<string, any> | BodyInit

type Options = {
    auth?: boolean | AuthFunc
    params?: Params
    body?: Body,
    stringifyOptions?: IStringifyOptions
} & Omit<RequestInit, 'body'>

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
    constructor(baseUrl?: string, authFunc?: AuthFunc) {
        this.baseUrl = baseUrl
        this.authFunc = authFunc
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
        if (!res.ok) {
            const { error } = await res.json()
            throw new Error(error)
        }
        const contentType = res.headers.get("Content-Type") || ""
        let data
        if (contentType.includes('json')) {
            data = await res.json()
        } else if (contentType.includes('text')) {
            data = await res.text()
        } else {
            data = await res.blob()
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