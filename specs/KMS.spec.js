const
  fs = require('fs'),
  exec = require('child_process').exec,
  KMS = require('../lib/KMS');


const KeyId = '6bda8121-95b4-402a-83c3-26ae49e8a9d8';
const fileToEncrypt = './test/encrypt-this.txt';

let encryptedFile1;
let encryptedFile2;
let encryptedData;

const rejectionTest = err => expect(err).not.toBeDefined();

describe('KMS:', () => {
  it('encrypts file', () => {
    return new KMS(KeyId).encryptFile(fileToEncrypt).then(({
      CiphertextBlob,
      file
    }) => {
      expect(CiphertextBlob).toBeDefined();
      encryptedFile1 = file;
      expect(fs.existsSync(file)).toBe(true);
    });
  });

  it('decrypts file', () => {
    return new KMS().decryptFile('./test/encr_0').then(({
      Plaintext
    }) => {
      expect(Plaintext.toString()).toBe('This is the secret you want to encrypt');
      fs.unlinkSync(encryptedFile1);
    }, rejectionTest);
  });

  it('encrypts data', () => {
    return new KMS(KeyId).encryptData('Encrypt this please').then(({
      CiphertextBlob,
      file
    }) => {
      encryptedData = CiphertextBlob;
      expect(CiphertextBlob).toBeDefined();
      expect(fs.existsSync(file)).toBe(true);
      fs.unlinkSync(file);
    }, rejectionTest);
  });

  it('decrypts data', () => {
    return new KMS().decryptData(encryptedData).then(res => {
      expect(res.Plaintext.toString()).toBe('Encrypt this please');
    }, rejectionTest);
  });

  const resolver = (cmd) => (resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err || stderr) {
        console.log(err, stderr);
        reject(err || stderr);
      }
      resolve({
        err,
        stdout,
        stderr
      });
    });
  };

  it('encrypts file and data via command line', () => {
    const cmd = `npm run encrypt -- -f ${ fileToEncrypt } -d EncryptThis -k ${ KeyId }`;
    return new Promise(resolver(cmd)).then(({
      stdout
    }) => {
      expect(stdout).toBeDefined();
      const regex = /file: '(.*?)'/g;
      let match = regex.exec(stdout);
      while (match !== null) {
        const file = match[1];
        file.startsWith('./test') ? encryptedFile1 = file : encryptedFile2 = file;
        expect(fs.existsSync(file)).toBe(true);
        match = regex.exec(stdout);
      }
    }, rejectionTest);
  });

  it('decrypts files via command line', () => {
    const cmd = `npm run decrypt -- -f ${ encryptedFile1 } -f ${ encryptedFile2 } }`;
    return new Promise(resolver(cmd)).then(({
      stdout
    }) => {
      const regex = /{ Plaintext: \[ '(.+)'[, ]*'(.+)' \] }/g;
      const match = regex.exec(stdout).slice(1, 3);
      expect(match).toContain('This is the secret you want to encrypt');
      expect(match).toContain('EncryptThis');
    }, rejectionTest);
  });

  afterAll(() => {
    fs.unlinkSync(encryptedFile1);
    fs.unlinkSync(encryptedFile2);
  });
});
