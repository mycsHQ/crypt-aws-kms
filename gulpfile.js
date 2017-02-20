const
  KMS = require('./lib/KMS.js'),
  gulp = require('gulp'),
  argv = require('yargs').argv;

/**
 * @param {object} args command line arguments parsed by yargs
 * @returns {object} files, data, key
 * @description extract args from cl call
 */
const getArgs = (args) => {
  const {
    f: files = [],
    d: data = [],
    k: KeyId,
    r: region,
    aK: accessKeyId,
    sK: secretAccessKey,
    sT: sessionToken,
  } = args;

  return {
    files: !(files instanceof Array) ? [files] : files,
    data: !(data instanceof Array) ? [data] : data,
    KeyId,
    region,
    accessKeyId,
    secretAccessKey,
    sessionToken
  };
};

const getPromises = (encrypt) => {
  const {
    files,
    data,
    KeyId,
    region,
    accessKeyId,
    secretAccessKey,
    sessionToken
  } = getArgs(argv);

  const kms = new KMS(KeyId, accessKeyId, secretAccessKey, sessionToken, region);

  return [
    ...files.map((f) => encrypt ? kms.encryptFile(f) : kms.decryptFile(f)),
    ...data.map((d) => encrypt ? kms.encryptData(`${ d }`) : kms.decryptData(`${ d }`))
  ];
};

gulp.task('encrypt', () => {
  Promise.all(getPromises(true)).then(console.log, console.error);
});

gulp.task('decrypt', () => {
  Promise.all(getPromises(false)).then(res => {
    console.log({
      Plaintext: res.map(r => r.Plaintext.toString())
    });
  }, err => console.error(err));
});

gulp.task('create:key', () => {

  if (argv.a === undefined) {
    throw new Error('"Alias" (-a) has to be passed as param');
  }
  const AliasName = argv.a;
  delete argv.a;

  const {
    k,
    r,
    aK,
    sK,
    sT,
  } = argv;

  const vals = {
    b: 'BypassPolicyLockoutSafetyCheck',
    d: 'Description',
    k: 'KeyUsage',
    o: 'Origin',
    p: 'Policy',
    tk: 'TagKey',
    tv: 'TagValue'
  };

  const params = Object.keys(vals).reduce((obj, key) => {
    const arg = argv[key];
    if (arg !== undefined) {
      if (arg === 'tk' || arg === 'tv') {
        obj.Tags = {
          [vals[key]]: arg
        };
      } else {
        obj[vals[key]] = arg;
      }
    }
    return obj;
  }, {});

  const kms = new KMS(k, r, aK, sK, sT);

  kms.createKey(params).then((res) => {
    const {
      KeyId: TargetKeyId
    } = res;
    kms.createAlias({
      AliasName,
      TargetKeyId
    }).then((ures) => {
      console.log(`"${ AliasName }" key created`);
      console.log(res);
    }, console.error);
  }, console.error);
});
