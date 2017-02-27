#!/usr/bin/env node

const
  fs = require('fs'),
  program = require('commander'),
  KMS = require('../lib/KMS.js');

program
  .option('-r, --region [string]', 'The aws-region of the kms key (defaults to "eu-west-1")')
  .option('-aK, --accessKey [string]', 'The accessKeyId for aws (defaults to global credentials)')
  .option('-sK, --secretKey [string]', 'The secretAccessKey for aws (defaults to global credentials)')
  .option('-sT, --sessionToken [string]', 'The sessionToken for aws')
  .action(() => {
    const {
      region,
      accessKey,
      secretKey,
      sessionToken
    } = program;

    let {
      args
    } = program;

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
        console.error(`file "${ arg }" does not exist`);
        return undefined;
      }
      return kms.decryptData(arg);
    });


    Promise.all(promises).then(res => {
      console.log('');
      console.log('> Decryption results:');
      console.log(
        JSON.stringify(res.reduce((obj, r, i) => {
          if (r) {
            obj[`decr_${ i }`] = r.Plaintext.toString();
          }
          return obj;
        }, {}), null, 2));
      console.log('');
    }, console.error);
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ mycs-kms decrypt dataToEncrypt ~/fileToEncrypt');
  console.log('');
});

program.parse(process.argv);
