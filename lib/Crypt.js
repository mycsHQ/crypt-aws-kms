const
  crypto = require('crypto');

class Crypt {

  /**
   *
   * @param {string} key
   * @param {string} ['aes-256-ctr'] algorithm
   * @param {string} ['hex'] outputEncoding
   * @param {string} ['utf8'] inputEncoding
   *
   * @description Create an instance of Crypt. If the key is not specified, the key has to passed to encrypt/decrypt calls
   */
  constructor(key, algorithm = 'aes-256-ctr', outputEncoding = 'hex',
    inputEncoding = 'utf8') {
    this.algorithm = algorithm;
    this.key = key;
    this.outputEncoding = outputEncoding;
    this.inputEncoding = inputEncoding;
  }

  /**
   *
   * @param {string} data to encrypt
   * @param {string} [this.key] key
   * @param {string} [this.outputEncoding] outputEncoding
   * @param {string} [this.inputEncoding] inputEncoding
   * @throws {Error} key has to be specified if no key has been passed or entered in constructor
   * @returns {string}
   *
   * @description enrypt data a specified algorithm and key
   */
  encrypt(data, key = this.key, outputEncoding = this.outputEncoding,
    inputEncoding = this.inputEncoding) {
    if (!key) {
      throw new Error('key has to be specified');
    }
    const cipher = crypto.createCipher(this.algorithm, key);
    let crypted = cipher.update(data, inputEncoding, outputEncoding);
    crypted += cipher.final(outputEncoding);
    return crypted;
  }

  /**
   *
   * @param {string} data to encrypt
   * @param {string} [this.key] key
   * @param {string} [this.outputEncoding] outputEncoding
   * @param {string} [this.inputEncoding] inputEncoding
   * @throws {Error} key has to be specified if no key has been passed or entered in constructor
   *
   * @description decrypt data a specified algorithm and key
   */
  decrypt(data, key = this.key, outputEncoding = this.outputEncoding,
    inputEncoding = this.inputEncoding) {
    if (!key) {
      throw new Error('key has to be specified');
    }
    const decipher = crypto.createDecipher(this.algorithm, key);
    let dec = decipher.update(data, outputEncoding, inputEncoding);
    dec += decipher.final(inputEncoding);
    return dec;
  }
}

module.exports = Crypt;
