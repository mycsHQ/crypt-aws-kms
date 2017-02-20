# MYCS kms

TODO: Write a project description

## Installation

```bash
npm install
```

## Usage

### Encryption

```bash
npm run encrypt -- -k KeyId -d string1 (-d string2 ...) -f path1 (-f path2 ...)
```

> To encrypt multiple files or dataStrings use -d / -f multiple times

### Decryption

```bash
npm run decrypt -- -d string1 (-d string2 ...) -f path1 (-f path2 ...)
```

> To decrypt multiple files or dataStrings use -d / -f multiple times

## Requirements

- This project needs node > 6.
- `aws-cli` has to be set up with user credentials locally

## License
© Mycs 2015