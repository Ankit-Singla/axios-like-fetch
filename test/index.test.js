import axiosLikeFetch from '../axiosLikeFetch.js';
import expect from 'expect.js';

describe('axiosLikeFetch', () => {
    it('should be a function', function() {
        expect(axiosLikeFetch).to.be.a('function');
    });

    it('should return a response object with status, statusText, data, headers, config properties', function() {
        return axiosLikeFetch({ url: 'https://cat-fact.herokuapp.com/facts/random' }).then(res => {
            expect(res).to.be.an('object');
            expect(res).to.have.keys(['status', 'statusText', 'data', 'headers', 'config']);
            expect(res.status).to.be.a('number');
            expect(res.statusText).to.be.a('string');
            expect(res.data).to.be.a('object');
            expect(res.headers).to.be.an('object');
            expect(res.config).to.be.an('object');
        });
    });

    it('should transform response according to transformResponse input provided', function() {
        return axiosLikeFetch({
            url: 'https://cat-fact.herokuapp.com/facts/random',
            transformResponse: [
                (data) => { data += 'axios-like-'; return data; },
                (data) => { data += 'fetch'; return data; }
            ]
        }).then(res => {
            expect(res.data).to.contain('axios-like-fetch');
        });
    });
});