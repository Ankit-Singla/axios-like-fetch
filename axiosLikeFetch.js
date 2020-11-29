import 'isomorphic-unfetch';
import AbortController from 'abort-controller';

const axiosLikeFetch = (config) => {
    return captainFetch(config)
        .then(data => ({...data, config}));
};
axiosLikeFetch.AbortController = AbortController;

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
    const {
        url,
        transformResponse=transformRes,
        timeout=0,
        cancelToken=new AbortController(),
    } = config;
    delete config.url;

    if(timeout) {
        setTimeout(() => {
            controller.abort();
        }, timeout);
    }
    return fetch(url, {...config, signal: cancelToken.signal})
        .then(res =>  transformResponse(res)
        .then(body => ({status: res.status, statusText: res.statusText, headers: res.headers, body})));
};

export default axiosLikeFetch;
