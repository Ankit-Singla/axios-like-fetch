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
        .then(res =>  res.text()
        .then(text => ({status: res.status, statusText: res.statusText, headers: res.headers, body: transformResponse(text)})));
};

const transformResponse = (text) => {
    try{
        text = JSON.parse(text || {});
    } catch(e) {}
    return text;
};

export default axiosLikeFetch;
