import 'isomorphic-unfetch';

const axiosLikeFetch = (config) => {
    return captainFetch(config)
        .then(data => ({...data, config}));
};

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
    } = config;
    delete config.url;

    return fetch(url, config)
        .then(res =>  transformResponse(res)
        .then(body => ({status: res.status, statusText: res.statusText, headers: res.headers, body})));
};



export default axiosLikeFetch;
