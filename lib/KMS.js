const
  fs = require('fs'),
  path = require('path'),
  AWS = require('aws-sdk');

/**
 * Supply helper methods for file and data en- and decryption
 *
 * @class KMS
 */
class KMS {

  /**
   * @param {string} KeyId
   * @param {string} accessKeyId your AWS access key ID.
   * @param {string} secretAccessKey your AWS secret access key.
   * @param {string} sessionToken your AWS secret access key.
   * @param {string} region ['eu-west-1'] specify the region your kms is run
   *
   * @memberOf KMS
   * @description Creates an instance of KMS. If the credentials are not entered manually globals are used
   */
  constructor(KeyId, accessKeyId, secretAccessKey, sessionToken, region = 'eu-west-1') {
    this.KeyId = KeyId;
    this.counter = 0;
    this.kms = new AWS.KMS({
      region,
      accessKeyId,
      secretAccessKey,
      sessionToken
    });
  }

  /**
   * @param {object} params
   * @returns {promise} KeyMetadata
   * @memberOf KMS
   * @description create kms key
   */
  createKey(params) {
    return this.kms.createKey(params).promise();
  }

  /**
   * @param {object} params
   * @returns {promise} AWS.Request
   * @memberOf KMS
   * @description update alias of kms key
   * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#updateAlias-property
   */
  updateAlias(params) {
    return this.kms.updateAlias(params).promise();
  }

  /**
   * @param {string} filePath path to the file
   * @param {boolean} [true] writeToDisk
   * @returns null || {promise} result
   *
   * @memberOf KMS
   * @description check if file exist and pass content to encryptData
   */
  encryptFile(filePath, outPath, writeToDisk = true) {
    if (!fs.existsSync(filePath)) {
      console.error(`file ${ filePath } does not exist`);
      return null;
    }
    return this.encryptData(fs.readFileSync(filePath), outPath || path.dirname(filePath), writeToDisk);
  }


  /**
   * @param {string} Plaintext string to encrypt
   * @param {string} ['.'] filePath
   * @param {boolean} [true] writeToDisk
   * @throws {Error} Np KeyId specified
   *
   * @returns {promise} Buffer result
   *
   * @memberOf KMS
   * @description encrypt the data and write file to disk
   * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property
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
          let file;
          if (writeToDisk) {
            const uniqueFile = (() => {
              const file = `${ filePath }/encr_${ this.counter++ }`;
              return fs.existsSync(file) ?
                uniqueFile() : file;
            });
            file = uniqueFile();
            fs.writeFileSync(file, CiphertextBlob);
            console.log(`Encrypted "${ Plaintext }" stored in "${ file }"`);
          }
          resolve({
            CiphertextBlob,
            file,
            filePath
          });
        }
      });
    });
  }

  /**
   * @param {string} filePath
   * @returns {promise} result from decryptData
   * @throws {Error} File does not exist
   *
   * @memberOf KMS
   * @description check if file exists and pass content to decryptData
   */
  decryptFile(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${ filePath } does not exist`);
    }
    return this.decryptData(fs.readFileSync(filePath));
  }

  /**
   * @param {string} CiphertextBlob base64 encoded string
   * @returns {promise} result
   *
   * @memberOf KMS
   * @description decrypt the data
   * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property
   */
  decryptData(CiphertextBlob) {
    return this.kms.decrypt({
      CiphertextBlob
    }).promise();
  }
}

module.exports = KMS;
