#!/usr/bin/env node

const
  program = require('commander');

program
  .version('0.0.2')
  .command('encrypt <files|data> [options]', 'encrypt files and datastrings (files have to begin with "./", "/" or "~/")', {
    isDefault: true
  })
  .command('decrypt <files|data> [options]', 'decrypt files and base64-datastrings (files have to begin with "./", "/" or "~/")')
  .command('generate-datakey <files|data> [options]', 'generate data key for specific master key id');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('   ENCRYPT');
  console.log('    $ crypt encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt');
  console.log('    $ crypt -k 123-456-789 -p ~/Desktop dataToEncrypt ~/fileToEncrypt');
  console.log('');
  console.log('   DECRYPT');
  console.log('    $ crypt decrypt dataToEncrypt ~/fileToEncrypt');
  console.log('');
  console.log('   DECRYPT');
  console.log('    $ crypt -k 123-456-789 generate-datakey dataToEncrypt ~/fileToEncrypt');
  console.log('');
});

program.parse(process.argv);
