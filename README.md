# MYCS kms

TODO: Write a project description

## Installation

```bash
npm install
```

## Usage

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
mycs-kms [encrypt|decrypt|create-key] -h
# local
./cli/mycs-kms.js -h
./cli/mycs-kms.js [encrypt|decrypt|create-key] -h
```
___

Following args are used to create the [AWS.KMS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property "AWS.KMS") instance in [`encrypt`](#encrypt), [`decrypt`](#decrypt) and [`create-key`](#createKey):

```javascript
{
    -r: 'region',
    -aK: 'accessKeyId',
    -sK: 'secretAccessKey',
    -sT: 'sessionToken'
}
```

> if the accessKeyId, secretAccessKey or sessionToken is omitted the globally stored aws credentials are used
___
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
    -p: 'Path' // specify path for encrypted files
}
```

> files have to begin with "./", "/" or "~/"
___
<a name="decrypt"></a>
### [decrypt](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property "decrypt aws docu")

```bash
mycs-kms decrypt dataToEncrypt ~/fileToEncrypt
```
> files have to begin with "./", "/" or "~/"
___
<a name="createKey"></a>
### [create-key](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property "createKey aws docu")

```bash
mycs-kms create-key AliasName -d "This is the description"
```

Additional valid args.
```javascript
{
    -b: 'BypassPolicyLockoutSafetyCheck',
    -d: 'Description',
    -k: 'KeyUsage',
    -o: 'Origin',
    -p: 'Policy',
    -t: 'Tags'
}
```

## Requirements

- This project needs node > 6.
- Valid `aws` credentials have to be set up globally or passed as arguments

## License
© Mycs 2015