#!/usr/bin/env node

const
  program = require('commander');

program
  .version('0.0.1')
  .command('encrypt <files|data> [options]', 'encrypt files and datastrings (files have to begin with "./", "/" or "~/")', {
    isDefault: true
  })
  .command('decrypt <files|data> [options]', 'decrypt files and base64-datastrings (files have to begin with "./", "/" or "~/")');

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
});

program.parse(process.argv);
