# fetch advance

## Install

```bash
npm install @fourcels/fetch
```

## Usage

### default fetch

```js
import fetch from "@fourcels/fetch";

const { data } = await fetch.GET("https://dummyjson.com/products", {
  limit: 10,
});
console.log(data);
```

### custom fetch

```js
import { Fetch } from "@fourcels/fetch";

const fetcher = new Fetch("https://dummyjson.com", {
  authFunc(headers) {
    headers.append("Authorization", "Bearer token");
  },
  handleError(res, data) {
    console.log(data);
  },
});
const { data } = await fetcher.POST("/products/add", {
  title: "BMW Pencil",
});
console.log(data);
```
