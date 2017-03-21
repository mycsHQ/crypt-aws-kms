# AWS KMS decrypt / encrypt cli

[![Build Status](https://travis-ci.org/mycsHQ/eslint-config-mycs.svg?branch=master)](https://travis-ci.org/mycsHQ/eslint-config-mycs)
[![npm](https://img.shields.io/npm/v/eslint-config-mycs.svg)](https://www.npmjs.com/package/eslint-config-mycs)
[![Code Style](https://img.shields.io/badge/code%20style-eslint--mycs-brightgreen.svg)](https://github.com/mycsHQ/eslint-config-mycs)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

A helper tool to decrypt encrypt data through AWS KMS service. Decryption and Encryption can be done through a cli or in the codebase with the KMS class.

## Installation

```bash
npm install
```

## Usage

### General use
The idea is to use the so called [Envelope Encryption](http://docs.aws.amazon.com/kms/latest/developerguide/workflow.html "Envelope Encryption") proposed by AWS KMS.
In short the steps are.
1. Create masterkey in AWS KMS
2. Generate datakey with masterkey id and store it ENCRYPTED! locally
3. Decrypt the datakey through KMS and encrypt files locally with decrypted datakey as key
4. Decrypt the datakey through KMS and decrypt files locally with decrypted datakey as key

> Do not store the decrypted datakey but keep it in memory only as long as you need it

### Use KMS in code

```javascript
const { KMS } = require('./lib');
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

// you could always wrap the functions into an async functions to have an synchronous workflow
decryptAsync();

async function decryptAsync() {
  const { CiphertextBlob } = await kms.encryptData('foo');
  const { Plaintext } = await kms.decryptData(CiphertextBlob);
  console.log({ decryptedSecret: Plaintext.toString() });
}
```

### Use CRYPT in code

```javascript
const { Crypt } = require('./lib');

// you should use a decrypted KMS masterkey as key
const crypt = new Crypt('decryptedMasterKeyValue');

const encryptedFoo = crypt.encrypt('foo');
const decryptedFoo = crypt.decrypt(encryptedFoo);

```

### Use `crypt` command globally
```bash
npm install -g && npm link
```

### Use locally
```bash
./cli/crypt.js [options]
```

### Access Help Menus

```bash
# global
crypt -h
crypt [encrypt|decrypt|get-datakey|encrypt-local|decrypt-local] -h

# local
./cli/crypt.js -h
./cli/crypt.js [encrypt|decrypt|get-datakey|encrypt-local|decrypt-local] -h
```
___

Following args are used to create the [AWS.KMS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property "AWS.KMS") instance in [`encrypt`](#encrypt) and [`decrypt`](#decrypt):

```javascript
{
    -r: 'region',
    -a: 'accessKeyId',
    -s: 'secretAccessKey',
    -t: 'sessionToken'
}
```

> if the accessKeyId, secretAccessKey or sessionToken is omitted the globally stored aws credentials are used

<a name="encrypt"></a>
### [encrypt](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property "encrypt aws docu")

```bash
crypt encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt

crypt -k 123-456-789 -p ~/Desktop dataToEncrypt ~/fileToEncrypt
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
crypt decrypt dataToEncrypt ~/fileToEncrypt
```
> files have to begin with "./", "/" or "~/"
> data strings have to be base64 encrypted

<a name="get-datakey"></a>
### [get-datakey](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#generateDataKey-property "generateDataKey aws docu")

Generate datakey with given aws masterkey and store it in binary - encrypted file.

```bash
crypt get-datakey -k 123-456-789

crypt -k 123-456-789 -p ~/Desktop
```

Additional valid args.
```javascript
{
    -k: 'KeyId', // required!!
    -p: 'Path' // if results should be stored in binary file - specify path
}
```

> the results are displayed as strings in console

<a name="encrypt-local"></a>
### [encrypt-local](https://nodejs.org/api/crypto.html#crypto_class_cipher "crypto nodejs docu")

Encrypt datakey locally with given aws datakey. It makes a call to kms, decrypts the datakey and encrypts with it the data. (AWS credentials have to be setup and masterkey active)

```bash
crypt encrypt-local dataToEncrypt ~/fileToEncrypt -d dataKey

crypt encrypt-local dataToEncrypt ~/fileToEncrypt -d dataKey -p ~/Desktop
```

Additional valid args.
```javascript
{
    -d: 'DataKey', // path to encrypted datakey - required!!
    -p: 'Path' // if results should be stored in file - specify path
}
```

> files have to begin with "./", "/" or "~/"
> the results are displayed as base64 string in console

<a name="decrypt-local"></a>
### [decrypt-local](https://nodejs.org/api/crypto.html#crypto_class_cipher "crypto nodejs docu")

Decrypt datakey locally with given aws datakey. It makes a call to kms, decrypts the datakey and encrypts with it the data. (AWS credentials have to be setup and masterkey active)

```bash
crypt decrypt-local dataToEncrypt ~/fileToEncrypt -d dataKey

crypt decrypt-local dataToEncrypt ~/fileToEncrypt -d dataKey -p ~/Desktop
```

Additional valid args.
```javascript
{
    -d: 'DataKey', // path to encrypted datakey - required!!
    -p: 'Path' // if results should be stored in file - specify path
}
```

> files have to begin with "./", "/" or "~/"
> the results are displayed as base64 string in console


## Requirements

- This project needs node > 6.
- Valid `aws` credentials have to be set up globally or passed as arguments
- For the tests to work you need to create a kms keyId you have access and use rights to and enter it in `./config.js`

## License
MIT
© mycs 2015

## Maintainer
[jroehl](https://github.com/jroehl "jroehl")

## TODO
- write tests for crypt
- documentation

## Whenever editing the repository

Should you update the readme, use npm script `semantic-release` to check if a new version has to be set and to publish it to npm.