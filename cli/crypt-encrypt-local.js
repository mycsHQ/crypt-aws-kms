#!/usr/bin/env node

const
  fs = require('fs'),
  program = require('commander'),
  co = require('co'),
  prompt = require('co-prompt'),
  KMS = require('../lib/KMS'),
  Crypt = require('../lib/Crypt');

program
  .option('-d, --datakey <datakey>',
    'The path to the datakey of the master key')
  .option('-p, --path [path]',
    'The outputPath for encrypted files')
  .option('-r, --region [region]',
    'The aws-region of the kms key (defaults to "eu-west-1")')
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
      sessionToken
    } = program;

    let {
      args,
      datakey
    } = program;

    co(function* () {
      args = args.slice(0, -1);
      if (!args.length) {
        console.error('data required');
        process.exit(1);
      }

      if (!datakey || !fs.existsSync(datakey)) {
        datakey = yield prompt('DataKey required: ');
        process.stdin.pause();
      }

      const prom = new Promise((resolve, reject) => {
        new KMS(undefined, accessKey, secretKey, sessionToken, region)
          .decryptFile(datakey)
          .then(
            ({ Plaintext }) => {
              const crypt = new Crypt(Plaintext.toString('base64'));
              resolve(args.map(arg => {
                let secret = arg;
                if (arg.startsWith('./') || arg.startsWith('/')) {
                  if (fs.existsSync(arg)) {
                    secret = fs.readFileSync(arg);
                  } else {
                    return `file "${ arg }" does not exist`;
                  }
                }
                const result = crypt.encrypt(secret);
                if (path) {
                  const uniqueFile = (() => {
                    const file =
                      `${ path }/encr_${ this.counter++ }`;
                    return fs.existsSync(file) ? uniqueFile() :
                      file;
                  });
                  const file = uniqueFile();
                  fs.writeFileSync(file, result);
                  return `"${ secret }" -> "${ result }" stored in "${ file }"`;
                }
                return `"${ secret }" -> "${ result }"`;
              }));
            }, reject);
      });

      prom.then((res) => {
        console.log('');
        console.log('> Encryption results:');
        res.forEach((r) => {
          console.log(r);
        });
      }, (err) => console.log(`ERROR: ${ err }`));
    });
  });

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log(
    '    $ crypt encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt'
  );
  console.log(
    '    $ crypt -k 123-456-789 -p ~/Desktop dataToEncrypt ~/fileToEncrypt'
  );
  console.log('');
});

program.parse(process.argv);
