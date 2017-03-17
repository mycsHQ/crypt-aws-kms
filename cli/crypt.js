#!/usr/bin/env node

const
  program = require('commander');

program
  .version('0.0.3')
  .command('encrypt <files|data> [options]', 'encrypt files and datastrings (files have to begin with "./", "/" or "~/")')
  .command('encrypt-local <files|data> [options]', 'encrypt files and datastrings (files have to begin with "./", "/" or "~/")')
  .command('decrypt-local <files|data> [options]', 'encrypt files and datastrings (files have to begin with "./", "/" or "~/")')
  .command('decrypt <files|data> [options]', 'decrypt files and base64-datastrings (files have to begin with "./", "/" or "~/")')
  .command('getdatakey <keyid> [options]', 'generate data key for specific master key id');

program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('   ENCRYPT');
  console.log('    $ crypt encrypt -k 123-456-789 dataToEncrypt ~/fileToEncrypt');
  console.log('');
  console.log('   DECRYPT');
  console.log('    $ crypt decrypt dataToEncrypt ~/fileToEncrypt');
  console.log('');
  console.log('   GENERATEDATAKEY');
  console.log('    $ crypt get-datakey 123-456-789');
  console.log('');
  console.log('   GENERATEDATAKEY');
  console.log('    $ crypt encrypt-local dataToEncrypt ~/fileToEncrypt -d pathTodataKey');
  console.log('');
  console.log('   GENERATEDATAKEY');
  console.log('    $ crypt decrypt-local dataToDecrypt ~/fileToDecrypt -d pathTodataKey');
  console.log('');
});

program.parse(process.argv);
