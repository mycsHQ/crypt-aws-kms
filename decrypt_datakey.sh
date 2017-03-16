#!/usr/bin/env bash
# script to decrypt datakey and echo the decrypted value

# specify path to datakey as first param
datakeyFile=$1;

output=`./cli/crypt.js decrypt $datakeyFile -k $keyId`;
regex='"decr_[0-1]": "(.+)?"';

if [[ $output =~ $regex ]]
  then
    decrypted=${BASH_REMATCH[1]};
    echo $decrypted;
    exit 0;
else
  echo 'data could not be decrypted';
  exit 1;
fi
