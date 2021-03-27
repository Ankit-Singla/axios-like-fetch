import "isomorphic-unfetch";
import AbortController from "abort-controller";
import {
  checkStatus,
  getQueryString,
  recursiveApply,
  recursiveApplyTranformReq,
  trimConfig,
} from "./utils.js";

export class CancelToken {
  constructor(executor) {
    const controller = new AbortController();
    executor(() => controller.abort());
    return controller;
  }
}

// default implementations for interceptors and transformations
let defaultRequestIntercept = (config) => {
  return config;
};
let defaultResponseIntercept = (res) => {
  return res;
};

const transformRes = [
  (data) => {
    try {
      data = JSON.parse(data || {});
    } catch (e) {}
    return data;
  },
  (data) => {
    return { ...data, name: "Abhishek" };
  },
];

const transformReq = [
  (data, header) => {
    return { ...data, path: "from axiosLikeFetch, default 1st fun", header };
  },
  (data, header) => {
    header = {
      ...header,
      checkFrom2ndTransformReqinHeader: "true from 2nd function",
    };
    return { data, header };
  },
];

// const transformReq = (data, header) => {
//   return { ...data, path: "from axiosLikeFetch, default 1st fun" };
// };

const axiosLikeFetch = (config) => {
  return captainFetch(config).then((data) => ({ ...data, config }));
};
axiosLikeFetch.AbortController = AbortController;
axiosLikeFetch.requestIntercept = defaultRequestIntercept;
axiosLikeFetch.request = {
  interceptors: {
    use: (ic) => {
      axiosLikeFetch.requestIntercept = ic;
    },
    eject: () => {
      axiosLikeFetch.requestIntercept = defaultRequestIntercept;
    },
  },
};
axiosLikeFetch.responseIntercept = defaultResponseIntercept;
axiosLikeFetch.response = {
  interceptors: {
    use: (ic) => {
      axiosLikeFetch.responseIntercept = ic;
    },
    eject: () => {
      axiosLikeFetch.responseIntercept = defaultResponseIntercept;
    },
  },
};

const captainFetch = (config) => {
  config = axiosLikeFetch.requestIntercept(config);
  if (config.data) {
    console.log(transformReq.length);
    config.data = recursiveApplyTranformReq(
      config.data,
      config.header,
      0,
      transformReq
    );
    console.log(config.data);
  }

  const {
    url,
    baseURL = "",
    params = {},
    transformResponse = transformRes,
    timeout = 0,
    cancelToken = new AbortController(),
    withCredentials = false,
  } = config;
  const credentials = withCredentials ? "include" : "same-origin";
  const queryString = getQueryString(params || {});
  trimConfig(config);

  let timeoutEvent;
  const removeTimeout = (res) => {
    clearTimeout(timeoutEvent);
    return res;
  };
  if (timeout) {
    timeoutEvent = setTimeout(() => {
      cancelToken.abort();
      clearTimeout(timeoutEvent);
    }, timeout);
  }

  return fetch(baseURL + url + `?${queryString}`, {
    ...config,
    signal: cancelToken && cancelToken.signal,
    credentials,
  })
    .then(removeTimeout)
    .then(checkStatus)
    .then((res) =>
      res
        .text()
        .then((text) => recursiveApply(text, 0, transformResponse))
        .then((data) =>
          axiosLikeFetch.responseIntercept({
            status: res.status,
            statusText: res.statusText,
            headers: res.headers,
            data,
          })
        )
    );
};

export default axiosLikeFetch;
