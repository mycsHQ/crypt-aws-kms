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
    k: key
  } = args;

  return {
    files: !(files instanceof Array) ? [files] : files,
    data: !(data instanceof Array) ? [data] : data,
    key
  };
};

gulp.task('encrypt', () => {
  const {
    files,
    data,
    key
  } = getArgs(argv);

  const kms = new KMS(key);

  const promises = [
    ...files.map((f) => kms.encryptFile(f)),
    ...data.map((d) => kms.encryptData(`${ d }`))
  ];

  Promise.all(promises).then(console.log, console.error);
});

gulp.task('decrypt', () => {
  const {
    files,
    data
  } = getArgs(argv);

  const kms = new KMS();

  const promises = [
    ...files.map(f => kms.decryptFile(f)),
    ...data.map(d => kms.decryptData(`${ d }`))
  ];

  Promise.all(promises).then(res => {
    console.log({
      plaintext: res.map(r => r.Plaintext.toString())
    });
  }, err => console.error(err));
});
