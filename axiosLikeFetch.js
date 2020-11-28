import 'isomorphic-unfetch';

const axiosLikeFetch = (config) => {
    return captainFetch(config)
        .then(data => ({...data, config}));
};

const captainFetch = (config) => {
    const {
        url,
    } = config;
    delete config.url;

    return fetch(url, config)
        .then(res =>  res.json()
        .then(data => ({status: res.status, statusText: res.statusText, headers: res.headers, body: data})));
};

export default axiosLikeFetch;
