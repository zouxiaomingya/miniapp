// import {  } from "@utils/parse-url";

import { defaultHost } from "../constant/operate";
export const parseQuery = (query) => {
  // 去掉问号
  if (query && query.charAt(0) === "?") {
    query = query.substring(1);
  }
  // [^xxx] 不以 xxx 开头
  const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
  const obj = {};
  while (reg.exec(query)) {
    obj[RegExp.$1] = decodeURIComponent(RegExp.$2);
  }
  return obj;
};

export const addQuery = (url, queryData) => {
  const arr = [];
  for (const [key, value] of Object.entries(queryData)) {
    if (value !== undefined || "") {
      arr.push(`${key}=${encodeURIComponent(value)}`);
    }
  }

  // 没带参数的 url
  if (url.indexOf("?") === -1) {
    url = url + "?" + arr.join("&");
  } else {
    url = url + "&" + arr.join("&");
  }
  return url;
};

export const getFullUrl = (_url) => {
  return `${defaultHost}${_url}`;
};

export function getQueryValue(url, queryName) {
  // 通过 href 获取 query, 防止 hash 路由模式拿不到 location.search
  var query = decodeURI(url.split("?")[1]);
  if (!query) return;
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] === queryName) {
      return pair[1];
    }
  }
  return null;
}
