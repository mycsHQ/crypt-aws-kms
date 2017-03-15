# MYCS kms

TODO: Write a project description

## Installation

```bash
npm install
```

## Usage

### Use in code

```javascript
const KMS = require('../lib/KMS');
const KeyId = '123-456-789';

const kms = new KMS(KeyId);
// uses global aws credentials
kms
    .encryptData('foo')
    .then(({ CiphertextBlob }) => {
        // returns a buffer
        console.log(CiphertextBlob.toString('base64'));
    }, err => console.error(err));

// uses global aws credentials
kms
    .decryptData('encryptedBase64Foo')
    .then(({ Plaintext }) => {
        // returns a buffer
        console.log(Plaintext.toString());
    }, err => console.error(err));
```

### Use `mycs-kms` command globally
```bash
npm install -g && npm link
```

### Use locally
```bash
./cli/mycs-kms.js [options]
```

### Access Help Menus

```bash
# global
mycs-kms -h
mycs-kms [encrypt|decrypt] -h

# local
./cli/mycs-kms.js -h
./cli/mycs-kms.js [encrypt|decrypt] -h
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
mycs-kms encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt

mycs-kms -k 123-456-789 -p ~/Desktop dataToEncrypt ~/fileToEncrypt
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
mycs-kms decrypt dataToEncrypt ~/fileToEncrypt
```
> files have to begin with "./", "/" or "~/"
> data strings have to be base64 encrypted

## Requirements

- This project needs node > 6.
- Valid `aws` credentials have to be set up globally or passed as arguments

## License
© Mycs 2015