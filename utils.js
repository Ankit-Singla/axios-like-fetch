const REQUEST_FAILED_ERROR_MSG = 'Request failed with status code ';

export const recursiveApply = (data, idx, fnList, headers = {}) => {
    if(idx >= fnList.length)
        return data;
    return recursiveApply(fnList[idx](data), idx+1, fnList, headers);
};

export const checkStatus = (res) => {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      var error = new Error(REQUEST_FAILED_ERROR_MSG + res.status);
      throw error;
    }
};

export const trimConfig = (config) => {
    delete config.url;
    delete config.baseURL;
    delete config.withCredentials;
    delete config.params;
};

export const getQueryString = (params) => {
    let queryParams = [];
    if(isURLSearchParams(params)) {
        params.forEach((value, key) => {
            queryParams.push(`${key}=${value}`);
        });
    } else if(isObject(params)) {
        for(let key in params) {
            queryParams.push(`${key}=${params[key]}`);
        }
    }
    return queryParams.join('&');
};

export const isObject = (data) => {
    return data && typeof data === 'object';
};
export const isBlob = (data) => {
    return toString.call(data) === '[object Blob]';
};
export const isFormData = (data) => {
    return typeof FormData !== 'undefined' && data instanceof FormData;
};
export const isURLSearchParams = (data) => {
    return typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams;
};
export const isArrayBuffer = (data) => {
    return toString.call(data) === '[object ArrayBuffer]';
};
export const isArrayBufferView = (data) => {
    var output;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        output = ArrayBuffer.isView(data);
    } else {
        output = (data) && (data.buffer) && (data.buffer instanceof ArrayBuffer);
    }
    return output;
};

export const setContentTypeIfUnset = (headers, value) => {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = value;
    }
};
