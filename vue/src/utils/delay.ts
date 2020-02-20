/**
 * Asyncronic debounce that supports awaiting. Useful when need to wait
 * for the actual event to happen.
 *
 * @param {async function} fn Function to be called after debounce
 * @param {number} ms Time to wait in milliseconds
 * @returns {Promise} Is resolved after the actual debounce function runs
 */
export function asyncDebounce<T, F>(fn: F & any, ms: number): F & any {
  let tid = null as number | null;
  const wrapper = (...params: any[]) => {
    if (_.isNumber(tid)) {
      clearTimeout(tid);
    }
    return new Promise((resolve, reject) => {
      tid = setTimeout(async () => {
        tid = null;
        try {
          resolve(await fn(...params));
        }
        catch (err) {
          reject(err);
        }
      }, ms);
    });
  }
  return wrapper as unknown as F;
}


/**
 * delay
 *
 * @param {number} ms
 * @returns {undefined}
 */
export async function delay(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
