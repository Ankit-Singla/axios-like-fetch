// for testing
import axiosLikeFetch, { CancelToken } from './axiosLikeFetch.js';

const url = 'https://cat-fact.herokuapp.com/facts/random';
const transformResponse = [(data) => {
    // return res.blob().then(blob => {
    //     return blob;
    // });
    return data;
}];
// let cancel;
// axiosLikeFetch({ url, cancelToken: new CancelToken((param) => {cancel = param}) })
// .then(data => console.log(data));
// // cancel();

axiosLikeFetch.request.interceptors.use((config) => {
    if(!config.headers)
        config.headers = [];
    config.headers['Content-Type'] = 'application/json';
    return config;
});

axiosLikeFetch.response.interceptors.use((res) => {
    res.ok = true;
    return res;
});

const controller = new axiosLikeFetch.AbortController();
const signal = controller.signal;
signal.addEventListener('abort', () => {
    console.log('Request Aborted');
});
axiosLikeFetch({ url, cancelToken: controller, params: {name: "ankit", surname: "singla"} })
.then(data => console.log(data));
// controller.abort();
