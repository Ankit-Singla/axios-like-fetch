# axios-like-fetch
Use fetch as if it was a cheaper axios.

Based on [isomorphic-unfetch](https://www.npmjs.com/package/isomorphic-unfetch), but provides [axios](https://www.npmjs.com/package/axios) like syntax for most features. Hopefully, we won't need another wrapper around fetch anymore.

# Contributing
Please feel free to open issues that you observe, or to open pull requests to:
- fix issues
- update documentation
- add tests

## Installation
```npm install axios-like-fetch```

## Usage
```
// using ES6 modules
import axiosLikeFetch from 'axios-like-fetch';

// using CommonJS modules
const axiosLikeFetch = require('axios-like-fetch');

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
axiosLikeFetch({
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
axiosLikeFetch({
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

  // `transformRequest` allows changes to the request data before it is sent to the server
  // This is only applicable for request methods 'PUT', 'POST', 'PATCH' and 'DELETE'
  // The last function in the array must return a string or an instance of Buffer, ArrayBuffer,
  // FormData or Stream
  // You may modify the headers object.
  transformRequest: [function (data, headers) {
    // Do whatever you want to transform the data

    return data;
  }],

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
}
```
When using then, you will receive the response as follows:
```
axiosLikeFetch({ url: '/foo/bar' })
  .then(function (res) {
    console.log(res.data);
    console.log(res.status);
    console.log(res.statusText);
    console.log(res.headers);
  });
```
When using catch, or passing a rejection callback as second parameter of then, the response will be available through the error object as explained in the Handling Errors section.

## Interceptors
You can intercept requests or responses before they are handled by then or catch.
```
// Add a request interceptor
axiosLikeFetch.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }
);

// Add a response interceptor
axiosLikeFetch.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }
);
```
If you need to remove an interceptor later you can.
```
const myInterceptor = axiosLikeFetch.interceptors.request.use(function () {/*...*/});
axiosLikeFetch.interceptors.request.eject(myInterceptor);
```

## Cancellation
You can create a cancel token by passing an executor function to the CancelToken constructor:
```
const CancelToken = axiosLikeFetch.CancelToken;
let cancel;

axiosLikeFetch.get({
  url: '/foo/bar',
  cancelToken: new CancelToken(function executor(c) {
    // An executor function receives a cancel function as a parameter
    cancel = c;
  })
});

// cancel the request
cancel();
```

You can also use an alternate syntax for cancelling requests. This lets you add an event listener to when the request is cancelled.
```
const controller = new axiosLikeFetch.AbortController();
const signal = controller.signal;
signal.addEventListener('abort', () => {
    console.log('Request Aborted');
});
axiosLikeFetch({
  url: '/foo/bar',
  cancelToken: controller
});
controller.abort();
```
> **Note:** you can cancel several requests with the same cancel token.

## License
[MIT](https://github.com/Ankit-Singla/axiosLikeFetch/blob/master/LICENSE.md)
