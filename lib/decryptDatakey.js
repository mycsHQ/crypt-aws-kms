const
  KMS = require('./lib/KMS'),
  fs = require('fs'),
  path = require('path');

const datakeyFile = process.argv[2];

if (!datakeyFile || !fs.existsSync(datakeyFile)) {
  throw new Error('datakey could not be found');
}

new KMS().decryptFile(path.resolve(datakeyFile))
  .then(
    ({ Plaintext }) => console.log(Plaintext.toString('base64')),
    (err) => console.error({ err })
  );
