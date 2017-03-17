const { Crypt } = require('./lib');

const salt = '43QZK/6G9SGG4MP99SlQwccjcHD8NkkLg7uR7GwxU7Q=';
const res = new Crypt(salt).decrypt('642c2952f59fa33c');
console.log(res);
