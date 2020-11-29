// for testing
import axiosLikeFetch, { CancelToken } from './axiosLikeFetch.js';

const url = 'https://cat-fact.herokuapp.com/facts/random';
const transformResponse = (res) => {
    return res.blob().then(blob => {
        return blob;
    });
};
// let cancel;
// axiosLikeFetch({ url, cancelToken: new CancelToken((param) => {cancel = param}) })
// .then(data => console.log(data));
// // cancel();

const controller = new axiosLikeFetch.AbortController();
const signal = controller.signal;
signal.addEventListener('abort', () => {
    console.log('Request Aborted');
});
axiosLikeFetch({ url, cancelToken: controller })
.then(data => console.log(data));
// controller.abort();
