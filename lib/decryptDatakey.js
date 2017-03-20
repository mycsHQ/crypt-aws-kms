// helper function to decrypt a datakey and log out the decrypted value
// use this eg in a shell script to pass it to your node scripts as env variable

const
  KMS = require('./KMS'),
  fs = require('fs'),
  path = require('path');

const datakeyFile = process.env.FILE || process.argv[2];

if (!datakeyFile || !fs.existsSync(datakeyFile)) {
  throw new Error('datakey could not be found');
}
console.log({
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION: process.env.AWS_DEFAULT_REGION
});
new KMS(undefined, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY,
    null, process.env.AWS_DEFAULT_REGION)
  .decryptFile(path.resolve(datakeyFile))
  .then(
    ({ Plaintext }) => console.log(Plaintext.toString('base64')),
    (err) => console.error({ err })
  );
