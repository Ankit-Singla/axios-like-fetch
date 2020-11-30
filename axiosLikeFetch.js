import 'isomorphic-unfetch';
import AbortController from 'abort-controller';

// default implementations for interceptors
let requestIntercept = (config) => { return config };
let responseIntercept = (res) => { return res };

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

export class CancelToken {
    constructor(executor) {
        const controller = new AbortController();
        executor(() => controller.abort());
        return controller;
    }
}

const transformRes = (res) => {
    return res.text().then(text => {
        try {
            text = JSON.parse(text || {});
        } catch(e) {}
        return text;
    });
};

const captainFetch = (config) => {
    config = requestIntercept(config);
    const {
        url,
        baseURL='',
        transformResponse=transformRes,
        timeout=0,
        cancelToken=new AbortController(),
        withCredentials=false,
    } = config;
    const credentials = withCredentials ? 'include' : 'same-origin';
    delete config.url;
    delete config.baseURL;
    delete config.withCredentials;

    if(timeout) {
        setTimeout(() => {
            controller.abort();
        }, timeout);
    }
    return fetch(baseURL+url, {...config, signal: cancelToken.signal, credentials})
        .then(res =>  transformResponse(res)
        .then(data => (responseIntercept({
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            data
        }))));
};

export default axiosLikeFetch;
