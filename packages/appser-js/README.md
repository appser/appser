# appser Javascript Client

## Supported Platforms

1. Browser
2. Node.js
3. React Native

## Usage

### Basic

```js
import Client from '@appser/appser-js'

const client = new Client({
  endpoint: 'http://localhost:8080',
})

const table = await client.table.getBase('3321123412131')
```

### Cancel Request

```js
const getBase = async () => {
  const request = client.table.get('3321123412131')

  setTimeout(() => {
    if (!request.isResolved() && !request.isRejected()) {
      console.warn('Canceling request due to timeout')
      request.cancel()
    }
  }, 1000)

  await request
}
```

### Update Token

```js
client.request.config.TOKEN = 'new token'
```
