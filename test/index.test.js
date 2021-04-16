import axiosLikeFetch from '../axiosLikeFetch.js';
import expect from 'expect.js';

describe('axiosLikeFetch', () => {
    it('should be a function', function() {
        expect(axiosLikeFetch).to.be.a('function');
    });

    it('should return a response object with status, statusText, data, headers, config properties', function() {
        return axiosLikeFetch({ url: 'https://apimocha.com/axioslikefetch/hi' }).then(res => {
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
            url: 'https://apimocha.com/axioslikefetch/hi',
            transformResponse: [
                (data) => { data += 'axiosLike'; return data; },
                (data) => { data += 'Fetch'; return data; }
            ]
        }).then(res => {
            expect(res.data).to.contain('axiosLikeFetch');
        });
    });

    it('should intercept requests when request interceptors are provided', () => {
        axiosLikeFetch.request.interceptors.use((config) => {config.headers = {'content-type': 'application/json'}; return config;});
        return axiosLikeFetch({ url: 'https://apimocha.com/axioslikefetch/hi' }).then(res => {
            expect(res.config.headers['content-type']).to.be('application/json');
        });
    });

    it('should remove request interceptors when eject function is executed on request interceptors', () => {
        axiosLikeFetch.request.interceptors.eject();
        return axiosLikeFetch({ url: 'https://apimocha.com/axioslikefetch/hi' }).then(res => {
            expect(res.config.headers).to.be(undefined);
        });
    });

    it('should intercept responses when response intercepts are provided', () => {
        axiosLikeFetch.response.interceptors.use((res) => { res.success = res.status == 200 ? true : false; return res; });
        return axiosLikeFetch({ url: 'https://apimocha.com/axioslikefetch/hi' }).then(res => {
            expect(res.success).to.be(true);
        });
    });

    it('should remove response interceptors when eject function is executed on response interceptors', () => {
        axiosLikeFetch.response.interceptors.eject();
        return axiosLikeFetch({ url: 'https://apimocha.com/axioslikefetch/hi' }).then(res => {
            expect(res.success).to.be(undefined);
        });
    });

    it('should prepend baseUrl to url when provided', () => {
        axiosLikeFetch({ baseUrl: 'https://apimocha.com/axioslikefetch', url: 'axioslikefetch/hi' }).then(res => {
            expect(res.status).to.be(200);
        })
    });
});