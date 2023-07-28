// 多个地方同时调用时复用一个。防止登录多次。
// 如果调用的 fn.name 相同，需手动传入不同的 cacheKey
const cache = {};

/**
 * 传入一个返回 promise 的函数 fn，会重试到 fn 第一次 resolve
 * @param {function} fn
 * @param {string} [cacheKey=fn.name] 如果调用的 fn.name 有重复，需手动传入不同的 cacheKey
 * @returns {Promise}
 *
 * @example
 * waitResolve(login).then(success)
 */
export const waitResolve = (fn, cacheKey = fn.name) => {
  cache[cacheKey] =
    cache[cacheKey] ||
    new Promise((resolve, reject) => {
      const loopFnByTimes = (retryTimes) => {
        fn()
          .then((res) => {
            resolve(res);
            cache[cacheKey] = null;
          })
          .catch((err) => {
            if (retryTimes-- > 0) {
              setTimeout(() => {
                loopFnByTimes(retryTimes);
              }, 1000);
            } else {
              reject(err)
              uni.showToast({
                title: "登录失败，请稍后再试",
                icon: "none",
              });
            }
          });
      };
      // 失败后再循环调用 1 次
      loopFnByTimes(1);
    });
  return cache[cacheKey];
};
