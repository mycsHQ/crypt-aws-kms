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

new KMS().decryptFile(path.resolve(datakeyFile))
  .then(
    ({ Plaintext }) => console.log(Plaintext.toString('base64')),
    (err) => console.error({ err })
  );
