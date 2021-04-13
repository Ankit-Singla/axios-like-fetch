// for testing
import axiosLikeFetch, { CancelToken } from './axiosLikeFetch.js';

const url = 'https://apimocha.com/axioslikefetch/hi';
const transformResponse = [(data) => {
    // return res.blob().then(blob => {
    //     return blob;
    // });
    return data;
}];

const transformRequest = [
    (data, headers) => {

        return data;
    }
];

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
// axiosLikeFetch({ url, cancelToken: controller, params: {name: "ankit", surname: "singla"}, timeout: 5000 })
// .then(data => console.log(data));
// controller.abort();

// let dataToBeTransformed = {
//     name: 'axiosLikeFetch',
//     desc: 'Use fetch as if it was a cheper axios!'
// }

// axiosLikeFetch({
//     url,
//     method: 'POST',
//     data: dataToBeTransformed,
// }).then((data) => console.log(data));

var paramsString = "name=axiosLikeFetch&topic=api";
var searchParams = new URLSearchParams(paramsString);
axiosLikeFetch({url, params: searchParams}).then(res => console.log(res));
