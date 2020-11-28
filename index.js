// for testing
import axiosLikeFetch from './axiosLikeFetch.js';

const url = 'https://cat-fact.herokuapp.com/facts/random';
axiosLikeFetch({ url })
.then(data => console.log(data));
