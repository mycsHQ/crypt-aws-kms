const
  crypto = require('crypto');

class Crypt {

  /**
   *
   * @param {string} salt
   * @param {string} ['aes-256-ctr'] algorithm
   * @param {string} ['hex'] outputEncoding
   * @param {string} ['utf8'] inputEncoding
   *
   * @description Create an instance of Crypt. If the salt is not specified, the salt has to passed to encrypt/decrypt calls
   */
  constructor(salt, algorithm = 'aes-256-ctr', outputEncoding = 'hex',
    inputEncoding = 'utf8') {
    this.algorithm = algorithm;
    this.salt = salt;
    this.outputEncoding = outputEncoding;
    this.inputEncoding = inputEncoding;
  }

  /**
   *
   * @param {string} data to encrypt
   * @param {string} [this.salt] salt
   * @param {string} [this.outputEncoding] outputEncoding
   * @param {string} [this.inputEncoding] inputEncoding
   * @throws {Error} Salt has to be specified if no salt has been passed or entered in constructor
   * @returns {string}
   *
   * @description enrypt data a specified algorithm and salt
   */
  encrypt(data, salt = this.salt, outputEncoding = this.outputEncoding,
    inputEncoding = this.inputEncoding) {
    if (!salt) {
      throw new Error('Salt has to be specified');
    }
    const cipher = crypto.createCipher(this.algorithm, salt);
    let crypted = cipher.update(data, inputEncoding, outputEncoding);
    crypted += cipher.final(outputEncoding);
    return crypted;
  }

  /**
   *
   * @param {string} data to encrypt
   * @param {string} [this.salt] salt
   * @param {string} [this.outputEncoding] outputEncoding
   * @param {string} [this.inputEncoding] inputEncoding
   * @throws {Error} Salt has to be specified if no salt has been passed or entered in constructor
   *
   * @description decrypt data a specified algorithm and salt
   */
  decrypt(data, salt = this.salt, outputEncoding = this.outputEncoding,
    inputEncoding = this.inputEncoding) {
    if (!salt) {
      throw new Error('Salt has to be specified');
    }
    const decipher = crypto.createDecipher(this.algorithm, salt);
    let dec = decipher.update(data, outputEncoding, inputEncoding);
    dec += decipher.final(inputEncoding);
    return dec;
  }
}

module.exports = Crypt;
