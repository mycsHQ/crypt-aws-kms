const
  fs = require('fs'),
  path = require('path'),
  AWS = require('aws-sdk');

// Command line encryption
/* aws kms encrypt
 * --key-id 6bda8121-95b4-402a-83c3-26ae49e8a9d8
 * --plaintext "This is the secret you want to encrypt"
 * --query CiphertextBlob --output text | base64 -D > ./encrypted-secret
 */


/**
 * class to supply helper methods for file and data en- and decryption
 *
 * @class KMS
 */
class KMS {

  /**
   * Creates an instance of KMS.
   *
   * @param {string} KeyId
   * @param {string} region ['eu-west-1'] specify the region your kms is run
   *
   * @memberOf KMS
   */
  constructor(KeyId, region = 'eu-west-1') {
    this.KeyId = KeyId;
    this.counter = 0;
    this.kms = new AWS.KMS({
      region
    });
  }

  /**
   *
   * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property
   * @param {object} params
   *
   * @memberOf KMS
   * @description
   */
  createKey(params) {
    this.kms.createKey(params).promise();
  }

  /**
   * check if file exist and pass content to encryptData
   *
   * @param {string} filePath path to the file
   * @param {boolean} [true] writeToDisk
   * @returns null || {promise} result
   *
   * @memberOf KMS
   * @description
   */
  encryptFile(filePath, writeToDisk = true) {
    if (!fs.existsSync(filePath)) {
      console.error(`file ${ filePath } does not exist`);
      return null;
    }
    return this.encryptData(fs.readFileSync(filePath), path.dirname(filePath), writeToDisk);
  }


  /**
   * encrypt the data and write file to disk
   * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property
   * @param {string} Plaintext string to encrypt
   * @param {string} ['.'] filePath
   * @param {boolean} [true] writeToDisk
   * @throws {Error} Np KeyId specified
   *
   * @returns {promise} Buffer result
   *
   * @memberOf KMS
   * @description
   */
  encryptData(Plaintext, filePath = '.', writeToDisk = true) {
    if (!this.KeyId) {
      throw new Error('No KeyId specified');
    }
    return new Promise((resolve, reject) => {
      this.kms.encrypt({
        KeyId: this.KeyId,
        Plaintext
      }, (err, data) => {
        if (err) {
          reject(err);
        }
        if (data) {
          const {
            CiphertextBlob
          } = data;
          if (writeToDisk) {
            const file = `${ filePath }/encr_${ this.counter++ }`;
            fs.writeFileSync(file, CiphertextBlob);
            console.log(`Encrypted "${ Plaintext }" stored in "${ file }"`);
          }
          resolve(CiphertextBlob);
        }
      });
    });
  }

  /**
   * check if file exists and pass content to decryptData
   *
   * @param {string} filePath
   * @returns {promise} result from decryptData
   * @throws {Error} File does not exist
   *
   * @memberOf KMS
   * @description
   */
  decryptFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${ filePath } does not exist`);
    }
    return this.decryptData(fs.readFileSync(filePath));
  }

  /**
   * decrypt the data
   * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property
   *
   * @param {string} CiphertextBlob base64 encoded string
   * @returns {promise} result
   *
   * @memberOf KMS
   * @description
   */
  decryptData(CiphertextBlob) {
    return this.kms.decrypt({
      CiphertextBlob
    }).promise();
  }
}

module.exports = KMS;
