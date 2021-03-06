const
  fs = require('fs'),
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
   * @param {string} sessionToken your AWS sessionToken.
   * @param {string} region ['eu-west-1'] specify the region your kms is run
   *
   * @memberOf KMS
   * @description Create an instance of KMS. If the credentials are not entered manually globals are used
   */
  constructor(KeyId, accessKeyId, secretAccessKey, sessionToken, region =
    'eu-west-1') {
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
   * @param {string} filePath path to the file
   * @param {string} outPath
   * @returns null || {promise} result
   *
   * @memberOf KMS
   * @description check if file exist and pass content to encryptData
   */
  encryptFile(filePath, outPath) {
    if (!fs.existsSync(filePath)) {
      console.error(`file ${ filePath } does not exist`);
      return null;
    }
    return this.encryptData(fs.readFileSync(filePath), outPath);
  }

  /**
   * @param {string} Plaintext string to encrypt
   * @param {string} filePath
   * @throws {Error} No KeyId specified
   * @returns {promise} Buffer result
   *
   * @memberOf KMS
   * @description encrypt the data and write file to disk
   * http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property
   */
  encryptData(Plaintext, filePath) {
    if (!this.KeyId) {
      throw new Error('No KeyId specified');
    }
    return new Promise((resolve, reject) => {
      this.kms.encrypt({ KeyId: this.KeyId, Plaintext },
        (err, data) => {
          if (!data || err) {
            return reject(err || data);
          }
          const { CiphertextBlob } = data;
          let file;
          if (filePath) {
            // create unique filename
            const uniqueFile = (() => {
              const file = `${ filePath }/encr_${ this.counter++ }`;
              return fs.existsSync(file) ?
                uniqueFile() : file;
            });
            file = uniqueFile();
            fs.writeFileSync(file, CiphertextBlob);
            console.log(
              `Encrypted "${ Plaintext }" stored in "${ file }"`);
          }
          resolve({
            CiphertextBlob,
            Plaintext,
            file
          });
        });
    });
  }

  /**
   *
   * @param {string} ['AES_256'] KeySpec of the generated data key
   * @param {string} [cwd] filePath to store the file
   * @param {boolean} [false] outputPlain return the key in plaintext
   * @throws {Error} No KeyId specified
   * @returns {promise} Buffer result
   *
   * @memberOf KMS
   * @description generate a data key for specified masterkey and store into binary file
   */
  generateDataKey(KeySpec = 'AES_256', filePath = process.cwd(), outputPlain = false) {
    if (!this.KeyId) {
      throw new Error('No KeyId specified');
    }
    const method = outputPlain ?
      'generateDataKey' :
      'generateDataKeyWithoutPlaintext';
    return new Promise((resolve, reject) => {
      this.kms[method]({ KeyId: this.KeyId, KeySpec },
        (err, data) => {
          if (!data || err) {
            return reject(err || data);
          }
          const { CiphertextBlob, Plaintext, KeyId } = data;
          let file;
          if (filePath) {
            // create unique filename
            const uniqueFile = (() => {
              const file = `${ filePath }/datakey_${ this.counter++ }`;
              return fs.existsSync(file) ?
                uniqueFile() : file;
            });
            file = uniqueFile();
            fs.writeFileSync(file, CiphertextBlob);
            console.log(
              `Encrypted datakey for key "${ KeyId }" stored in "${ file }"`);
          }
          resolve({
            CiphertextBlob,
            Plaintext,
            KeyId
          });
        });
    });
  }

  /**
   * @param {string} filePath
   * @throws {Error} File does not exist
   * @returns {promise} result from decryptData
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
    if (!Buffer.isBuffer(CiphertextBlob)) {
      CiphertextBlob = Buffer.from(CiphertextBlob, 'base64');
    }
    return this.kms
      .decrypt({ CiphertextBlob })
      .promise();
  }

}

module.exports = KMS;
