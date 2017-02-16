const
  fs = require('fs'),
  AWS = require('aws-sdk');

const kms = new AWS.KMS({
  region: 'eu-west-1'
});

const secretPath = './encrypted-secret';
const encryptedSecret = fs.readFileSync(secretPath);

const decrypt = (encryptedData) => {
  kms.decrypt(encryptedData, (err, data) => {
    if (err) {
      console.error(err, err.stack);
    } else {
      const decryptedSecret = data.Plaintext.toString();
      console.log({
        decryptedSecret
      });
    }
  });
};

const encryptParams = {
  KeyId: '6bda8121-95b4-402a-83c3-26ae49e8a9d8',
  Plaintext: 'This is so encrypted'
};

/* aws kms encrypt
 * --key-id 6bda8121-95b4-402a-83c3-26ae49e8a9d8
 * --plaintext "This is the secret you want to encrypt"
 * --query CiphertextBlob --output text | base64 -D > ./encrypted-secret
 */
kms.encrypt(encryptParams, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    delete data.KeyId;
    decrypt(data);
  }
});
