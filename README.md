# axios-like-fetch
Use fetch as if it was a cheaper axios.

## Installation
```npm install axios-like-fetch```

## Usage
```
const axiosLikeFetch = require('axios-like-fetch').default'

axiosLikeFetch({ url: '/foo' })
  .then(function(res) { 
    // handle success
    console.log(res)
  })
  .catch(function (err) {
    // handle error
    console.log(err);
  })
```

## axiosLikeFetch API
**axiosLikeFetch(config)**
```
// Send a POST request
axios({
  method: 'post',
  url: '/fooBar',
  data: {
    foo: 'Foo',
    bar: 'Bar'
  }
})
  .then(function (res) {
    console.log(res);
  })
  .catch(function (err) {
    console.log(err);
  });
```
```
// Make a GET request
axios({
  method: 'get',
  url: '/foo',
})
  .then(function (res) {
    console.log(res);
  });
```

## Request config
These are the available config options for making requests. Only the url is required. Requests will default to GET if method is not specified.
```
{
  // `url` is the server URL that will be used for the request
  url: '/user',
 
  // `method` is the request method to be used when making the request
  method: 'get', // default
 
  // `baseURL` will be prepended to `url`.
  baseURL: 'https://some-domain.com/api/',
 
  // `transformResponse` allows changes to the response data to be made before
  // it is passed to then/catch
  transformResponse: [function (res) {
    // Do whatever you want to transform the data
 
    return res.blob().then(blob => {
        return blob;
    });
  }],
  
  // `headers` are custom headers to be sent
  headers: {'X-Requested-With': 'XMLHttpRequest'},
 
  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: {
    ID: 12345
  },
  
  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
  // Must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer
  data: {
    firstName: 'Fred'
  },
  
  // syntax alternative to send data into the body
  // method post
  // only the value is sent, not the key
  data: 'Country=Brasil&City=Belo Horizonte',
 
  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 1000, // default is `0` (no timeout)
 
  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default
  
  // `cancelToken` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  cancelToken: new CancelToken(function (cancel) {
  })
}
```

## Response Schema
The response for a request contains the following information.
```
{
  // `data` is the response that was provided by the server
  data: {},
 
  // `status` is the HTTP status code from the server response
  status: 200,
 
  // `statusText` is the HTTP status message from the server response
  statusText: 'OK',
 
  // `headers` the HTTP headers that the server responded with
  // All header names are lower cased and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: {},
 
  // `config` is the config that was provided to `axiosLikeFetch` for the request
  config: {}
}
```

