// helper function to decrypt a datakey and log out the decrypted value
// use this eg in a shell script to pass it to your node scripts as env variable

const
  { KMS } = require('./lib'),
  fs = require('fs'),
  path = require('path');

new KMS(undefined, 'AWS_ACCESS_KEY_ID', 'j89GgGGyNfLODPROXeqdOFGW1D9fTik361IlwS98').decryptFile(path.resolve('./datakey_local'))
  .then(
    ({ Plaintext }) => console.log(Plaintext.toString('base64')),
    (err) => console.error({ err })
  );
