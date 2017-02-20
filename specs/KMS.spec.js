const
  fs = require('fs'),
  KMS = require('../lib/KMS');

const KeyId = '6bda8121-95b4-402a-83c3-26ae49e8a9d8';

let encryptedFile;
let encryptedData;

describe('KMS:', () => {
  it('encrypts file', () => {
    const kms = new KMS(KeyId);
    return kms.encryptFile('./test/encrypt-this.txt').then(res => {
      const {
        CiphertextBlob,
        file
      } = res;
      expect(CiphertextBlob).toBeDefined();
      encryptedFile = file;
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  it('decrypts file', () => {
    const kms = new KMS();
    return kms.decryptFile('./test/encr_0').then(res => {
      expect(res.Plaintext.toString()).toBe('This is the secret you want to encrypt');
      fs.unlinkSync(encryptedFile);
    });
  });

  it('encrypts data', () => {
    const kms = new KMS(KeyId);
    return kms.encryptData('Encrypt this please').then(res => {
      const {
        CiphertextBlob,
        file
      } = res;
      encryptedData = CiphertextBlob;
      expect(CiphertextBlob).toBeDefined();
      expect(fs.existsSync(file)).toBe(true);
      fs.unlinkSync(file);
    });
  });

  it('decrypts data', () => {
    const kms = new KMS();
    return kms.decryptData(encryptedData).then(res => {
      expect(res.Plaintext.toString()).toBe('Encrypt this please');
    });
  });
});
