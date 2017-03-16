const
  crypto = require('crypto');

class Crypt {

  constructor(salt, algorithm = 'aes-256-ctr', outputEncoding = 'hex', inputEncoding = 'utf8') {
    this.algorithm = algorithm;
    this.salt = salt;
    this.outputEncoding = outputEncoding;
    this.inputEncoding = inputEncoding;
  }

  encrypt(data, salt = this.salt, outputEncoding = this.outputEncoding, inputEncoding = this.inputEncoding) {
    if (!salt) {
      throw new Error('Salt has to be specified');
    }
    const cipher = crypto.createCipher(this.algorithm, salt);
    let crypted = cipher.update(data, inputEncoding, outputEncoding);
    crypted += cipher.final(outputEncoding);
    return crypted;
  }

  decrypt(data, salt = this.salt, outputEncoding = this.outputEncoding, inputEncoding = this.inputEncoding) {
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
