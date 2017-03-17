const
  KMS = require('./lib/KMS'),
  fs = require('fs'),
  path = require('path');

// const decryptDatakey = () => {
//   const datakeyFile = process.argv[2];

//   if (!datakeyFile || !fs.existsSync(datakeyFile)) {
//     throw new Error('datakey could not be found');
//   }

//   new KMS()
//     .decryptFile(path.resolve(datakeyFile))
//     .then(
//       ({ Plaintext }) => console.log(Plaintext.toString('base64')),
//       (err) => console.error({ err })
//     );
// };

/**
 * do not fail the promise.all call if one promise fails, but catch the errors and return them
 * @param {promise} promise
 */
const softFail = (promise) =>
  new Promise((resolve, reject) => promise.then(resolve)
    .catch(resolve));


module.exports = { softFail };
