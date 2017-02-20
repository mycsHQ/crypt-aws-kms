# MYCS kms

TODO: Write a project description

## Installation

```bash
npm install
```

## Script Usage

Following args are used to create the [AWS.KMS](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#constructor-property "AWS.KMS") instance in [`encrypt`](#encrypt), [`decrypt`](#decrypt) and [`create:key`](#createKey):

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
## [encrypt](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#encrypt-property "encrypt aws docu")

Additional valid args.
```javascript
{
    -f: 'files',
    -d: 'data',
    -k: 'KeyId', // required for encryption
}
```

```bash
npm run encrypt -- -k KeyId -d string1 (-d string2 ...) -f path1 (-f path2 ...)
```

> To encrypt multiple files or dataStrings use -d / -f multiple times

<a name="decrypt"></a>
## [decrypt](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#decrypt-property "decrypt aws docu")

Additional valid args.
```javascript
{
    -f: 'files',
    -d: 'data',
}
```

```bash
npm run decrypt -- -d string1 (-d string2 ...) -f path1 (-f path2 ...)
```

> To decrypt multiple files or dataStrings use -d / -f multiple times

<a name="createKey"></a>
## [create:key](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html#createKey-property "createKey aws docu")

Additional valid args.
```javascript
{
    -a: 'Alias', // required
    -b: 'BypassPolicyLockoutSafetyCheck',
    -d: 'Description',
    -k: 'KeyUsage',
    -o: 'Origin',
    -p: 'Policy',
    -tk: 'TagKey',
    -tv: 'TagValue'
}
```

> To decrypt multiple files or dataStrings use -d / -f multiple times

## Requirements

- This project needs node > 6.
- Valid `aws` credentials have to be set up globally or passed as arguments

## License
© Mycs 2015