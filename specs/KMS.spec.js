const
  fs = require('fs'),
  KMS = require('../lib/KMS');

const testDir = './test/tmp';
const KeyId = '6bda8121-95b4-402a-83c3-26ae49e8a9d8';
let encryptedData;

describe('nscabinet:', () => {
  beforeAll(() => {
    !fs.existsSync(testDir) && fs.mkdirSync(testDir);
  });

  afterAll(() => {
    fs.rmdirSync(testDir);
  });

  it('encrypt file', () => {
    const kms = new KMS(KeyId);
    return kms.encryptFile('./test/encrypt-this.txt').then(res => {
      expect(res).toBeDefined();
      expect(fs.existsSync('./test/encr_0')).toBe(true);
    });
  });

  it('decrypt file', () => {
    const kms = new KMS();
    return kms.decryptFile('./test/encr_0').then(res => {
      expect(res.Plaintext.toString()).toBe('This is the secret you want to encrypt');
      fs.unlinkSync('./test/encr_0');
    });
  });

  it('encrypt data', () => {
    const kms = new KMS(KeyId);
    return kms.encryptData('Encrypt this please').then(res => {
      encryptedData = res;
      expect(res).toBeDefined();
      expect(fs.existsSync('./encr_0')).toBe(true);
      fs.unlinkSync('./encr_0');
    });
  });

  it('decrypt data', () => {
    const kms = new KMS(KeyId);
    return kms.decryptData(encryptedData).then(res => {
      expect(res.Plaintext.toString()).toBe('Encrypt this please');
    });
  });
});
