/**
 * do not fail the promise.all call if one promise fails, but catch the errors and return them
 * @param {promise} promise
 */
const softFail = (promise) =>
  new Promise((resolve, reject) => promise.then(resolve)
    .catch(resolve));


module.exports = { softFail };
