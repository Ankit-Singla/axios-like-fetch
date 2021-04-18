const REQUEST_FAILED_ERROR_MSG = 'Request failed with status code ';

function recursiveApply(data, idx, fnList, headers = {}) {
    if(idx >= fnList.length)
        return data;
    return recursiveApply(fnList[idx](data), idx+1, fnList, headers);
}

function checkStatus(res) {
    if (res.status >= 200 && res.status < 300) {
      return res;
    } else {
      var error = new Error(REQUEST_FAILED_ERROR_MSG + res.status);
      throw error;
    }
}

function trimConfig(config) {
    delete config.url;
    delete config.baseURL;
    delete config.withCredentials;
    delete config.params;
}

function getQueryString(params) {
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
}

function isObject(data) {
    return data && typeof data === 'object';
}
function isBlob(data) {
    return toString.call(data) === '[object Blob]';
}
function isFormData(data) {
    return typeof FormData !== 'undefined' && data instanceof FormData;
}
function isURLSearchParams(data) {
    return typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams;
}
function isArrayBuffer(data) {
    return toString.call(data) === '[object ArrayBuffer]';
}
function isArrayBufferView(data) {
    var output;
    if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        output = ArrayBuffer.isView(data);
    } else {
        output = (data) && (data.buffer) && (data.buffer instanceof ArrayBuffer);
    }
    return output;
}

function setContentTypeIfUnset(headers, value) {
    if (headers && !headers['Content-Type']) {
      headers['Content-Type'] = value;
    }
}

module.exports = {
    recursiveApply: recursiveApply,
    checkStatus: checkStatus,
    trimConfig: trimConfig,
    getQueryString: getQueryString,
    isObject: isObject,
    isBlob: isBlob,
    isFormData: isFormData,
    isURLSearchParams: isURLSearchParams,
    isArrayBuffer: isArrayBuffer,
    isArrayBufferView: isArrayBufferView,
    setContentTypeIfUnset: setContentTypeIfUnset,
};
