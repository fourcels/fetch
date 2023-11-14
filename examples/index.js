import fetch, { Fetch } from '../dist/index.js'

async function defaultFetch() {
    const { data } = await fetch.GET("https://dummyjson.com/products", { limit: 10 })
    console.log(data)
}

async function customFetch() {
    const fetcher = new Fetch("https://dummyjson.com", {
        authFunc(headers) {
            headers.append("Authorization", "Bearer token")
        },
        handleError(res, data) {
            console.log(data)
        }
    })
    const { data } = await fetcher.POST("/products/add", {
        title: "BMW Pencil"
    })
    console.log(data)

}

await defaultFetch()

await customFetch()