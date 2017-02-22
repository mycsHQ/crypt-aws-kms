#!/usr/bin/env node

const
  program = require('commander');

program
  .version('0.0.1')
  .command('encrypt <files|data> [options]', 'encrypt files and datastrings (files have to begin with "./", "/" or "~/")', {
    isDefault: true
  })
  .command('decrypt <files|data> [options]', 'encrypt files and datastrings (files have to begin with "./", "/" or "~/")')
  .command('create-key <AliasName> [options]', 'create kms key (AliasName has to begin with "alias/")');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('   ENCRYPT');
  console.log('    $ mycs-kms encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt');
  console.log('    $ mycs-kms -k 123-456-789 -p ~/Desktop dataToEncrypt ~/fileToEncrypt');
  console.log('');
  console.log('   DECRYPT');
  console.log('    $ mycs-kms decrypt dataToEncrypt ~/fileToEncrypt');
  console.log('');
  console.log('   CREATE:KEY');
  console.log('    $ mycs-kms create:key AliasName -d "This is the description"');
  console.log('');
});

program.parse(process.argv);
