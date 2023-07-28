const storage = {
  /**
   * @description: 同步获取 storage，等价于 uni.getStorageSync
   * @param {*} key
   * @example Storage.get(XXX);
   */
  get: function get(key) {
    try {
      const data = uni.getStorageSync(key);
      if (data.expire > Date.now()) {
        return data.value;
      }
      uni.removeStorage({ key });
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * @description: 异步获取 storage，等价于 uni.getStorage
   * @example Storage.getAsync(XXX).then().catch();
   * @param {*} key
   * 过期的会异步清除
   */
  getAsync: function getAsync(key) {
    return new Promise(function (resolve, reject) {
      uni.getStorage({
        key,
        success: function success(res) {
          const { data } = res;

          const expire = data.expire === undefined ? "" : data.expire;
          const value = data.value === undefined ? "" : data.value;

          if (expire > Date.now()) {
            resolve(value);
          } else {
            uni.removeStorage({ key });
            reject(`${key}已失效`);
          }
        },

        fail: reject,
      });
    });
  },

  /**
   * @description: 同步设置 storage，等价于 uni.setStorageSync
   * @example Storage.set(key, value);
   * @param {*} key
   * @param {*} value
   */
  set: function set(key, value, options = {}) {
    // 默认保存 7 天
    const expire = options.expire || 7;
    try {
      uni.setStorageSync(key, {
        value,
        expire: Date.now() + expire * 24 * 3600 * 1000,
      });
    } catch (e) {
      console.error(e);
    }
  },
  /**
   * @description: 异步设置 storage，等价于 uni.setStorage
   * @example Storage.set(key, value).then().catch();
   * @param {*} key
   * @param {*} value
   * @param [options]
   */
  setAsync: function setAsync(key, value, options = {}) {
    const expire = options.expire || 7;
    return new Promise(function (resolve, reject) {
      uni.setStorage({
        key,
        data: {
          value,
          expire: Date.now() + expire * 24 * 3600 * 1000,
        },
        success: resolve,
        fail: (e) => {
          reject(e);
        },
      });
    });
  },
  /**
   * @description: 同步删除 storage，等价于 uni.removeStorageSync
   * @example Storage.remove(key);
   * @param {*} key
   */
  remove: function remove(key) {
    try {
      uni.removeStorageSync(key);
    } catch (e) {
      console.error(e);
    }
  },
  /**
   * @description: 异步删除 storage，等价于 uni.removeStorage
   * @example Storage.removeAsync(key);
   * @param {*} key
   */
  removeAsync: function removeAsync(key) {
    return new Promise(function (resolve, reject) {
      uni.removeStorage({
        key,
        success: resolve,
        fail: (e) => {
          reject(e);
        },
      });
    });
  },
  /**
   * @description: 同步清空 storage，等价于 uni.clearStorageSync
   * @example Storage.clear();
   */
  clear: function clear() {
    try {
      uni.clearStorageSync();
    } catch (e) {
      console.error(e);
    }
  },
  /**
   * @description: 异步清空storage，等价于wx.clearStorage
   * @example Storage.clearAsync();
   */
  clearAsync: function clearAsync() {
    return new Promise(function (resolve, reject) {
      uni.clearStorage({
        success: resolve,
        fail: (e) => {
          reject(e);
        },
      });
    });
  },
};

/**
 * @description: 清理过期storage
 */
export function clearExpiredStorage() {
  uni.getStorageInfo({
    success: function (storageInfo) {
      storageInfo.keys.forEach((key) => {
        try {
          storage.getAsync(key);
        } catch (e) {
          console.error(e);
        }
      });
    },
  });
}

export default storage;
