import fetch, { Fetch } from '../dist/index.js'

async function defaultFetch() {
    const { data } = await fetch.GET("https://dummyjson.com/products", { limit: 10 })
    console.log(data)
}

async function customFetch() {
    const fetcher = new Fetch("https://dummyjson.com", (headers) => {
        headers.append("Authorization", "Bearer token")
    })
    const { data } = await fetcher.POST("/products/add", {
        title: "BMW Pencil"
    })
    console.log(data)

}

await defaultFetch()

await customFetch()