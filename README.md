# AWS KMS decrypt / encrypt cli

A helper tool to decrypt encrypt data through AWS KMS service. Decryption and Encryption can be done through a cli or in the codebase with the KMS class.

## Installation

```bash
npm install
```

## Usage

### Use in code

```javascript
const { KMS } = require('../lib/KMS');
const KeyId = '123-456-789';

const kms = new KMS(KeyId);
// uses global aws credentials
kms.encryptData('foo')
    .then(({ CiphertextBlob }) => {
        // returns a buffer
        console.log(CiphertextBlob.toString('base64'));
    }, err => console.error(err));

kms.decryptData('encryptedBase64Foo')
    .then(({ Plaintext }) => {
        // returns a buffer
        console.log(Plaintext.toString());
    }, err => console.error(err));

// this relies on [deasync](https://github.com/abbr/deasync "deasync") package and is in an experimental state
const PlaintextBuffer = kms.decryptDataSync('encryptedBase64Foo');
console.log(PlaintextBuffer.toString());
```

### Use `crypt-kms` command globally
```bash
npm install -g && npm link
```

### Use locally
```bash
./cli/crypt-kms.js [options]
```

### Access Help Menus

```bash
# global
crypt-kms -h
crypt-kms [encrypt|decrypt] -h

# local
./cli/crypt-kms.js -h
./cli/crypt-kms.js [encrypt|decrypt] -h
```
___

Following args are used to create the [AWS.KMS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property "AWS.KMS") instance in [`encrypt`](#encrypt) and [`decrypt`](#decrypt):

```javascript
{
    -r: 'region',
    -aK: 'accessKeyId',
    -sK: 'secretAccessKey',
    -sT: 'sessionToken'
}
```

> if the accessKeyId, secretAccessKey or sessionToken is omitted the globally stored aws credentials are used

<a name="encrypt"></a>
### [encrypt](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property "encrypt aws docu")

```bash
crypt-kms encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt

crypt-kms -k 123-456-789 -p ~/Desktop dataToEncrypt ~/fileToEncrypt
```

Additional valid args.
```javascript
{
    -k: 'KeyId', // required!!
    -p: 'Path' // if results should be stored in binary file - specify path
}
```

> files have to begin with "./", "/" or "~/"
> the results are displayed as base64 string in console

<a name="decrypt"></a>
### [decrypt](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property "decrypt aws docu")

```bash
crypt-kms decrypt dataToEncrypt ~/fileToEncrypt
```
> files have to begin with "./", "/" or "~/"
> data strings have to be base64 encrypted

## Requirements

- This project needs node > 6.
- Valid `aws` credentials have to be set up globally or passed as arguments
- For the tests to work you need to create a kms keyId you have access and use rights to and enter it in `./config.js`

## License
MIT
© crypt 2015

## Maintainer
[jroehl](https://github.com/jroehl "jroehl")