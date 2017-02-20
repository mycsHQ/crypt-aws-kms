const
  KMS = require('./KMS.js'),
  gulp = require('gulp'),
  argv = require('yargs').argv;


const getArgs = (args) => {
  let {
    f: files = [],
    d: data = []
  } = args;

  const {
    k: key
  } = args;

  if (!(files instanceof Array)) {
    files = [files];
  }

  if (!(data instanceof Array)) {
    data = [data];
  }

  return {
    files,
    data,
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

  Promise.all(promises).then(res => {
    console.log({
      res
    });
  }, err => console.error(err));
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
    const plaintext = res.map(r => r.Plaintext.toString());
    console.log({
      plaintext
    });
  }, err => console.error(err));
});
