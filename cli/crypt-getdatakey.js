#!/usr/bin/env node

const
  program = require('commander'),
  co = require('co'),
  prompt = require('co-prompt'),
  KMS = require('../lib/KMS');

program
  .option('-k, --key <key>', 'The keyId of the master key')
  .option('-p, --path [path]',
    'The outputPath for the datakey')
  .option('-r, --region [region]',
    'The aws-region of the kms key (defaults to "eu-west-1")')
  .option('-kS, --keySpec [keySpec]',
    'The keyspec of the datakey ("AES_256" or "AES_128")')
  .option('-aK, --accessKey [accessKeyId]',
    'The accessKeyId for aws (defaults to global credentials)')
  .option('-sK, --secretKey [secretAccessKey]',
    'The secretAccessKey for aws (defaults to global credentials)')
  .option('-sT, --sessionToken [sessionToken]', 'The sessionToken for aws')
  .action(() => {
    const {
      path,
      region,
      accessKey,
      secretKey,
      sessionToken,
      keySpec
    } = program;

    let {
      args
    } = program;

    co(function* () {
      args = args.slice(0, -1);
      if (!args.length) {
        args = yield prompt('KeyId required: ');
        process.stdin.pause();
      }

      const kms = new KMS(args[0], accessKey, secretKey, sessionToken, region);
      kms.generateDataKey(keySpec, path);
    });
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log(
    '    $ crypt getdatakey -k 123-456-789'
  );
  console.log(
    '    $ crypt getdatakey -k 123-456-789 -p ~/Desktop'
  );
  console.log('');
});

program.parse(process.argv);
