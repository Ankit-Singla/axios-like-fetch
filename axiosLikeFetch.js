import 'isomorphic-unfetch';
import AbortController from 'abort-controller';
import { checkStatus, getQueryString, recursiveApply, trimConfig } from './utils.js';

export class CancelToken {
    constructor(executor) {
        const controller = new AbortController();
        executor(() => controller.abort());
        return controller;
    }
}

// default implementations for interceptors and transformations
let requestIntercept = (config) => { return config };
let responseIntercept = (res) => { return res };

const transformRes = [(data) => {
    try {
        data = JSON.parse(data || {});
    } catch(e) {}
    return data;
}];

const axiosLikeFetch = (config) => {
    return captainFetch(config)
        .then(data => ({...data, config}));
};
axiosLikeFetch.AbortController = AbortController;
axiosLikeFetch.request = {
    interceptors: {
        use: (ic) => {requestIntercept = ic}
    },
};
axiosLikeFetch.response = {
    interceptors: {
        use: (ic) => {responseIntercept = ic}
    },
};

const captainFetch = (config) => {
    config = requestIntercept(config);
    const {
        url,
        baseURL='',
        params = {},
        transformResponse=transformRes,
        timeout=0,
        cancelToken=new AbortController(),
        withCredentials=false,
    } = config;
    const credentials = withCredentials ? 'include' : 'same-origin';
    const queryString = getQueryString(params || {});
    trimConfig(config);

    if(timeout) {
        setTimeout(() => {
            controller.abort();
        }, timeout);
    }
    return fetch(baseURL+url+`?${queryString}`, {...config, signal: cancelToken && cancelToken.signal, credentials})
        .then(checkStatus)
        .then(res => res.text().then(recursiveApply(res.data, 0, transformResponse))
        .then(data => (responseIntercept({
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            data
        }))));
};

export default axiosLikeFetch;
