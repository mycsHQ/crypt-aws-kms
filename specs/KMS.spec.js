const
  fs = require('fs'),
  path = require('path'),
  exec = require('child_process').exec,
  KMS = require('../lib/KMS'),
  Crypt = require('../lib/Crypt'),
  { keyId } = require('../config');


const fileToEncrypt = './test/encrypt-this.txt';

let encryptedFile;
let encryptedData;

const encryptedFiles = [];

const rejectionTest = err => expect(err)
  .not.toBeDefined();

describe('KMS:', () => {
  it('encrypts file', () => {
    return new KMS(keyId)
      .encryptFile(fileToEncrypt, './test')
      .then(({
        CiphertextBlob,
        file
      }) => {
        expect(CiphertextBlob)
          .toBeDefined();
        encryptedFile = file;
        expect(fs.existsSync(file))
          .toBe(true);
      });
  });

  it('decrypts file', () => {
    return new KMS()
      .decryptFile('./test/encr_0')
      .then(({
        Plaintext
      }) => {
        expect(Plaintext.toString())
          .toBe('This is the secret you want to encrypt');
        fs.unlinkSync(encryptedFile);
      }, rejectionTest);
  });

  it('encrypts data', () => {
    return new KMS(keyId)
      .encryptData('Encrypt this please', './test')
      .then(({
        CiphertextBlob,
        file
      }) => {
        encryptedData = CiphertextBlob;
        expect(CiphertextBlob)
          .toBeDefined();
        expect(fs.existsSync(file))
          .toBe(true);
        fs.unlinkSync(file);
      }, rejectionTest);
  });

  it('decrypts data', () => {
    return new KMS()
      .decryptData(encryptedData)
      .then(res => {
        expect(res.Plaintext.toString())
          .toBe('Encrypt this please');
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
    const cmd =
      `./cli/crypt.js encrypt -p ./test -k ${ keyId } ${ fileToEncrypt } EncryptThis`;
    return new Promise(resolver(cmd))
      .then(({
        stdout
      }) => {
        expect(stdout)
          .toBeDefined();
        const regex = /stored in "(.*?)"/g;
        let match = regex.exec(stdout);
        while (match !== null) {
          const file = path.resolve(__dirname, '..', match[1]);
          encryptedFiles.push(file);
          expect(fs.existsSync(file))
            .toBe(true);
          match = regex.exec(stdout);
        }
      }, rejectionTest);
  });

  it('decrypts files and data via command line', () => {
    const cmd =
      `./cli/crypt.js decrypt ${ encryptedFiles.toString().replace(',', ' ') } AQECAHhhhtrQNZheJkiGg/z5m7eUR5dmM80wdxAI2ARO0dJHgQAAAGQwYgYJKoZIhvcNAQcGoFUwUwIBADBOBgkqhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDBGvjxq8UJ0bDK5fXgIBEIAhc6uwdMrhpmd/MgkxOgJOYm3aFIKkaY+i64E2HlOlWrlr`;
    return new Promise(resolver(cmd))
      .then(({
        stdout
      }) => {
        const regex = /"decr_[0-1]": "(.+)?"/gi;
        let match = regex.exec(stdout);
        const results = [];
        while (match !== null) {
          results.push(match[1]);
          match = regex.exec(stdout);
        }
        expect(results)
          .toContain('This is the secret you want to encrypt',
            'EncryptThis', 'foobar');
      }, rejectionTest);
  });

  afterAll(() =>
    encryptedFiles.map(fs.unlinkSync)
  );
});
