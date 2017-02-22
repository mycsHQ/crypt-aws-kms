#!/usr/bin/env node

const
  program = require('commander'),
  KMS = require('../lib/KMS.js');

const tags = (val) =>
  val.split(',').reduce((obj, tag) => {
    const t = tag.split(':');
    if (!t[0] || !t[1]) {
      console.error('wrong tag notation, should be "-t key1:val1,key2:val2');
      process.exit(1);
    }
    obj[t[0]] = t[1];
    return obj;
  }, {});

program
  .option('-b, --BypassPolicyLockoutSafetyCheck [string]', 'The BypassPolicyLockoutSafetyCheck of the kms key')
  .option('-d, --Description [string]', 'The Description of the kms key')
  .option('-k, --KeyUsage [string]', 'The KeyUsage of the kms key')
  .option('-o, --Origin [string]', 'The Origin of the kms key')
  .option('-p, --Policy [string]', 'The Policy of the kms key')
  .option('-t, --Tags [key:value]', 'The Tags of the kms key (eg "key1:val1,key2:val2"mycs-kms-create-key.js)', tags)
  .option('-r, --region [string]', 'The aws-region of the kms keys (defaults to "eu-west-1")')
  .option('-aK, --accessKey [string]', 'The accessKeyId for aws (defaults to global credentials)')
  .option('-sK, --secretKey [string]', 'The secretAccessKey for aws (defaults to global credentials)')
  .option('-sT, --sessionToken [string]', 'The sessionToken for aws')
  .action(() => {
    const {
      BypassPolicyLockoutSafetyCheck,
      Description,
      KeyUsage,
      Origin,
      Policy,
      Tags,
      region,
      accessKey,
      secretKey,
      sessionToken
    } = program;

    let {
      args
    } = program;

    args = args.slice(0, -1);

    const AliasName = args[0];

    if (args.length !== 1 || AliasName.indexOf('alias/') !== 0) {
      console.error('AliasName ("alias/*") required');
      process.exit(1);
    }

    const params = {
      BypassPolicyLockoutSafetyCheck,
      Description,
      KeyUsage,
      Origin,
      Policy,
      Tags
    };

    for (const key in params) {
      if (params[key] === true) {
        console.error(`wrong notation, need value for "${ key } (-${ key[0].toLowerCase() })"`);
        process.exit(1);
      }
    }

    const kms = new KMS(undefined, accessKey, secretKey, sessionToken, region);

    kms.createKey(params).then((res) => {
      const {
        KeyId: TargetKeyId
      } = res;
      kms.createAlias({
        AliasName,
        TargetKeyId
      }).then(() => {
        console.log(`"${ TargetKeyId }" with alias "${ AliasName }" key created`);
      }, console.error);
    }, console.error);
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ mycs-kms create-key AliasName -d "This is the description"');
  console.log('');
});


program.parse(process.argv);
