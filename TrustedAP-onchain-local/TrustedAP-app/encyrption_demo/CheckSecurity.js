const NodeRSA = require('node-rsa');
const Hasher = require('keccak256');

const ssid = "starbucks"
const mac = "10:14:AB:CF:78"
const serial = 5551212555

const details = Hasher(ssid.concat(mac, serial));
console.log('Hash of AP details follows:');
console.log(details.toString('hex'));

const seed = 12345;
const key = new NodeRSA({});
const publicKey = key.exportKey('pkcs8-public');
const privateKey = key.exportKey('pkcs8');
const encSeed = key.encryptPrivate(seed, 'base64');

console.log('Encrypted challenge seed follows:');
console.log(encSeed);

console.log('Public Key follows:');
console.log(publicKey);

console.log('Decoded plaintext:');
const plaintext=key.decryptPublic(encSeed);
console.log(plaintext.toString());
