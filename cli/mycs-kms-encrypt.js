#!/usr/bin/env node

const
  fs = require('fs'),
  program = require('commander'),
  co = require('co'),
  prompt = require('co-prompt'),
  KMS = require('../lib/KMS.js');

program
  .option('-k, --key <key>', 'The keyId of the master key')
  .option('-p, --path [path]', 'The outputPath for encrypted files (defaults to current working dir)')
  .option('-r, --region [region]', 'The aws-region of the kms key (defaults to "eu-west-1")')
  .option('-aK, --accessKey [accessKeyId]', 'The accessKeyId for aws (defaults to global credentials)')
  .option('-sK, --secretKey [secretAccessKey]', 'The secretAccessKey for aws (defaults to global credentials)')
  .option('-sT, --sessionToken [sessionToken]', 'The sessionToken for aws')
  .action(() => {
    const {
      path,
      region,
      accessKey,
      secretKey,
      sessionToken
    } = program;

    let {
      args,
      key
    } = program;

    co(function*() {

      args = args.slice(0, -1);
      if (!args.length) {
        console.error('data required');
        process.exit(1);
      }

      if (!key) {
        key = yield prompt('KeyId required: ');
        process.stdin.pause();
      }

      const kms = new KMS(key, accessKey, secretKey, sessionToken, region);

      for (const arg of args) {
        if (arg.startsWith('./') || arg.startsWith('/')) {
          if (fs.existsSync(arg)) {
            kms.encryptFile(arg, path);
          } else {
            console.error(`file "${ arg }" does not exist`);
          }
        } else {
          kms.encryptData(arg, path);
        }
      }
    });
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ mycs-kms encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt');
  console.log('    $ mycs-kms -k 123-456-789 -p ~/Desktop dataToEncrypt ~/fileToEncrypt');
  console.log('');
});

program.parse(process.argv);
