const REQUEST_FAILED_ERROR_MSG = "Request failed with status code ";

export const recursiveApply = (data, idx, fnList) => {
  if (idx >= fnList.length) return data;
  return recursiveApply(fnList[idx](data), idx + 1, fnList);
};

export const recursiveApplyTranformReq = (data, header, idx, fnList) => {
  if (idx >= fnList.length) return data;
  return recursiveApplyTranformReq(
    fnList[idx](data),
    fnList[idx](header),
    idx + 1,
    fnList
  );
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
  Object.keys(params).forEach((key) => {
    queryParams.push(`${key}=${params[key]}`);
  });
  return queryParams.join("&");
};
