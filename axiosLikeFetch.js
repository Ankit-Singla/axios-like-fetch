const fetch = require('isomorphic-unfetch');
const AbortController = require('abort-controller');
const utils = require('./utils.js');

class CancelToken {
    constructor(executor) {
        const controller = new AbortController();
        executor(() => controller.abort());
        return controller;
    }
}

// default implementations for interceptors and transformations
let defaultRequestIntercept = function(config) { return config };
let defaultResponseIntercept = function(res) { return res };

function axiosLikeFetch(config) {
    return captainFetch(config)
        .then(data => ({...data, config}));
}
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
axiosLikeFetch.defaults = {
    transformRequest: [(data, headers) => {
        if (utils.isArrayBuffer(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if(utils.isFormData(data)) {
            utils.setContentTypeIfUnset(headers, 'form/multipart;charset=utf-8');
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
    }],

    transformResponse: [(data) => {
        try {
            data = JSON.parse(data || {});
        } catch(e) {}
        return data;
    }],

    timeout: 0,
    withCredentials: false,
    cancelToken: new AbortController(),
    params: {},
};

function captainFetch(config) {
    config = axiosLikeFetch.requestIntercept(config);
    const {
        url,
        baseURL='',
        params=axiosLikeFetch.defaults.params,
        transformResponse=axiosLikeFetch.defaults.transformResponse,
        transformRequest=axiosLikeFetch.defaults.transformRequest,
        timeout=axiosLikeFetch.defaults.timeout,
        cancelToken=axiosLikeFetch.defaults.cancelToken,
        withCredentials=axiosLikeFetch.defaults.withCredentials,
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
}

module.exports = axiosLikeFetch;
module.exports.CancelToken = CancelToken;
