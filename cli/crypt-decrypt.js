#!/usr/bin/env node

const
  fs = require('fs'),
  program = require('commander'),
  KMS = require('../lib/KMS.js'),
  { softFail } = require('../lib/helper');

program
  .option('-r, --region [string]',
    'The aws-region of the kms key (defaults to "eu-west-1")')
  .option('-a, --accessKey [string]',
    'The accessKeyId for aws (defaults to global credentials)')
  .option('-s, --secretKey [string]',
    'The secretAccessKey for aws (defaults to global credentials)')
  .option('-t, --sessionToken [string]', 'The sessionToken for aws')
  .action(() => {
    const {
      region,
      accessKey,
      secretKey,
      sessionToken
    } = program;

    let { args } = program;

    const kms = new KMS(undefined, accessKey, secretKey, sessionToken, region);

    args = args.slice(0, -1);
    if (!args.length) {
      console.error('data required');
      process.exit(1);
    }

    const promises = args.map(arg => {
      if (arg.startsWith('./') || arg.startsWith('/')) {
        if (fs.existsSync(arg)) {
          return kms.decryptFile(arg);
        }
        return Promise.resolve({
          message: `file "${ arg }" does not exist`
        });
      }
      return kms.decryptData(arg);
    });

    Promise.all(promises.map(softFail))
      .then(res => {
        console.log('');
        console.log('> Decryption results:');
        console.log(
          JSON.stringify(res.reduce((obj, {
            Plaintext,
            code,
            message
          }, i) => {
            obj[`decr_${ i }`] = Plaintext ? Plaintext.toString(
                Buffer.isBuffer(Plaintext) ? 'base64' : undefined) :
              `ERROR ${ code || message }`;
            return obj;
          }, {}), null, 2));
        console.log('');
      });
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ crypt decrypt dataToEncrypt ~/fileToEncrypt');
  console.log('');
});

program.parse(process.argv);
