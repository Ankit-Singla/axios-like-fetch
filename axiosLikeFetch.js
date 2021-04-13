import 'isomorphic-unfetch';
import AbortController from 'abort-controller';
import * as utils from './utils.js';

export class CancelToken {
    constructor(executor) {
        const controller = new AbortController();
        executor(() => controller.abort());
        return controller;
    }
}

// default implementations for interceptors and transformations
let defaultRequestIntercept = (config) => { return config };
let defaultResponseIntercept = (res) => { return res };

const transformRes = [(data) => {
    try {
        data = JSON.parse(data || {});
    } catch(e) {}
    return data;
}];

const transformReq = [(data, headers) => {
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      utils.setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      utils.setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
}];

const axiosLikeFetch = (config) => {
    return captainFetch(config)
        .then(data => ({...data, config}));
};
axiosLikeFetch.AbortController = AbortController;
axiosLikeFetch.requestIntercept = defaultRequestIntercept;
axiosLikeFetch.request = {
    interceptors: {
        use: (ic) => {axiosLikeFetch.requestIntercept = ic},
        eject: () => {axiosLikeFetch.requestIntercept = defaultRequestIntercept},
    },
};
axiosLikeFetch.responseIntercept = defaultResponseIntercept;
axiosLikeFetch.response = {
    interceptors: {
        use: (ic) => {axiosLikeFetch.responseIntercept = ic},
        eject: () => {axiosLikeFetch.responseIntercept = defaultResponseIntercept},
    },
};

const captainFetch = (config) => {
    config = axiosLikeFetch.requestIntercept(config);
    const {
        url,
        baseURL='',
        params = {},
        transformResponse=transformRes,
        transformRequest=transformReq,
        timeout=0,
        cancelToken=new AbortController(),
        withCredentials=false,
    } = config;

    config.data = utils.recursiveApply(config.data, 0, transformRequest, config.headers);
    const credentials = withCredentials ? 'include' : 'same-origin';
    const queryString = utils.getQueryString(params || {});
    utils.trimConfig(config);

    let timeoutEvent;
    const removeTimeout = (res) => {
        clearTimeout(timeoutEvent);
        return res;
    };
    if(timeout) {
        timeoutEvent = setTimeout(() => {
            cancelToken.abort();
            clearTimeout(timeoutEvent);
        }, timeout);
    }

    return fetch(baseURL+url+`?${queryString}`, {...config, signal: cancelToken && cancelToken.signal, credentials})
        .then(removeTimeout)
        .then(utils.checkStatus)
        .then(res => res.text().then(text => utils.recursiveApply(text, 0, transformResponse))
        .then(data => (axiosLikeFetch.responseIntercept({
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            data
        }))));
};

export default axiosLikeFetch;
