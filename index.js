const
  // fs = require('fs'),
  AWS = require('aws-sdk');

const kms = new AWS.KMS({
  region: 'eu-west-1'
});

/* aws kms encrypt
 * --key-id 6bda8121-95b4-402a-83c3-26ae49e8a9d8
 * --plaintext "This is the secret you want to encrypt"
 * --query CiphertextBlob --output text | base64 -D > ./encrypted-secret
 */
// const secretPath = './encrypted-secret';
// const encryptedSecret = fs.readFileSync(secretPath);


const decrypt = (encryptedData) => {
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property
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

// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property
kms.encrypt(encryptParams, (err, data) => {
  if (err) {
    console.log(err, err.stack);
  } else {
    delete data.KeyId;
    decrypt(data);
  }
});
