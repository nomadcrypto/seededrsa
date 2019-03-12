# SeededRSA
The inspiration for this came from a project I was doing research for. In this project I was wanting to use ipfs in combination with orbitdb for a dapp(decentralized application). IPFS uses 2048 bit rsa keys for the peerid and orbitdb uses secp256k1 for read/write access in the db. In the cryptocurrency community we are used to using bip39 seed phrases to make backing up or restoring a bitcoin(or other cryptocurrency) wallet much easier. For my application I wanted an easy way for a user to restore their peerid and secp256k1 keys on another device while avoiding unnecessary overhead(like storing encrypted keys that were previously generated). Instead with this a user can simply restore their RSA key using a bip39 phrase when/if needed.

Most of rsa.js was taken from jsencrypt/cryptico which has been in the wild for years. I did research and wasn't able to find any security complaints regarding their implementation of the rsa keys. 

The rng was basically the product of this comment on stackoverflow regarding seeded random generators https://stackoverflow.com/a/47593316/4425082. It uses MurmurHash3's hashing function as a seed for the scf32 prng from pactrand. 

My goal here was to use existing implementations for both rsa and the rng to minimize the risk of me causing a dumbster fire of a situation. I still wouldn't trust this until it has been properly tested for randomness.

## Install
```bash
npm install seededrsa
```

## Example usage
```javascript
const RSA = require("seededrsa");
const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost"
const key = new RSA(seed);
key.generate(2048)
console.log(key.privateKey())
/*
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAgxtjKdnBWVDahMthfkPnfEhJOZooxcHXqC2BNITy9RPWXkEL
YFjOtNv7UoTrbbUINOPVtitB1cHK9C1B+O+BG4Estpd5GNLcXdND37SBA4EM4t7/
NOUuAmyRHnCqls+AZxNUTDp/Pj/3JM2CDeKVu67pff7x3dq2tsGPJsbBmre25AMq
bE9P8py80wUlc3c39P170pPKCcn8SNePot1L+jsxo+KmtOtqQpwTdgvaNzdHiHqT
pxafFoTZ+/EWWTFp9mOArEpXTmxY30YTk+U7lF8D4iTYAZyxjNCqjKkjBMVWruOj
sJzVLtU+9eyHXbYeK9dryEtbW6Bgwj21isvJSwIDBlU3AoIBABhgTVDUfSQ8sWb6
jyT9QsCRiS08VqQg03jVsv3WfPNT7ARTVcfjVeoUlp8jkeM9ZK9Om04lNp217im/
SHKwjkSoe7dgZ/E4fGgj2IbvLftyh5RPlYs/p+B5M8VSwoeG4ZMYAcRTZQKh5hss
c2x7B0etbln+v3CONC4H0ZO+YBOxgUtfjn5n/Z1rU0ekVksfxnO+2Gpz0bg/lWp5
qVk2Um9RlryQkMbpsSNgqKsWfUWXMSRgZbuJQduc1crDf8dKn0+JwWwFSxOvI/5F
u+YMReEX4HCLnzvAn13VZnAJS5iIAYiaTjlV7sFm7D1gx0ZlZYx8+nouAVNlAMO7
CB86pacCgYEAuDMxMDUyMTIyMzQ3NDEwNDQ1ODgyMTc5NzMxNDMxMTA5NDE0NjM0
OTE3NjEyMTMxOTYyMTI0NDE4MzE1MTg3MTM1NTcyMTIzOTI1MTE3NDI3MjMzMTU3
MTM1MTE1MTEwNzAxMDIyMDIxMDYxMzkxMTU1MTA2NTg0MDEzMjExM3sCgYEAtjYx
MTQxNDExMTExMDcxOTQyMjQyMjUyMzkzODI0NzExNzE4MTEzMjcxNDQxNDcyNDYx
Njc4MDE1MDI0ODI1MTEzOTcyMzEyMDAxMDE1MjE4OTY5NDUzMTAyMjQ4ODY0NDE0
ODI0NzE5MTQwNTUyMjg5NjM5MzY2NTI0ODE3MHECgYB3wP5Fdu8eCLhFXanMGxxe
uxSEqwOeOEfumUT1l8TEBrNq+Fs4TzwrMzk4CWX2eHgl3HdwHF2gGhjq5znaSiew
GFIY3ggL0PXkn+qfrzE3pF6WuDWRTqD7arrW18xNAv8IHze35nDHpuP+WApeOvFK
0bnfFeI6WxpDPcSzTx+EhwKBgG1XPpFV4zpQfo7/1U91HDof9y7JfxdigDIsOR6X
wJPDrTOGXbbMvY8qkjBv2LaoedQ5vhSEkUY3jphYRS5tNWt8EXzHYZAN92KiUkS6
h3ieq7bBWxjaRe1CUJp1ycVm2iP4B+DA28RuV7TvIVbYniPrjUPvHAVkA2UjZ9Lq
HJwnAoGBAKPR5KvLZXRoHmBp4LtSygEiNuaHLTWoi3RHAMcsdc9kLts6Ku3bKuKz
X1yjAhC0OhkP/SIa5J7dNyqQ7F4/PS4om1IGdiicwTzHoNgO73gRlF+cBCymGfyx
lB+BiAcWXUKoNNJvy0cNTRoxwVFf7cgHCSqkg9evIAE6miCZxNfw
-----END RSA PRIVATE KEY-----

*/

console.log(key.publicKey())
/*
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgxtjKdnBWVDahMthfkPn
fEhJOZooxcHXqC2BNITy9RPWXkELYFjOtNv7UoTrbbUINOPVtitB1cHK9C1B+O+B
G4Estpd5GNLcXdND37SBA4EM4t7/NOUuAmyRHnCqls+AZxNUTDp/Pj/3JM2CDeKV
u67pff7x3dq2tsGPJsbBmre25AMqbE9P8py80wUlc3c39P170pPKCcn8SNePot1L
+jsxo+KmtOtqQpwTdgvaNzdHiHqTpxafFoTZ+/EWWTFp9mOArEpXTmxY30YTk+U7
lF8D4iTYAZyxjNCqjKkjBMVWruOjsJzVLtU+9eyHXbYeK9dryEtbW6Bgwj21isvJ
SwIDBlU3
-----END PUBLIC KEY-----

*/
```

## Testing the RNG
I used [practrand](http://pracrand.sourceforge.net/) to test and will probably test with dieharder as well in the future. To run the test with practrand you will need a working installation first. The build process works on linux, mac and windows. 


```bash
node test_rng.js |/path/to/practrand/RNG_test stdin8
```

sample output:
```
RNG_test using PractRand version 0.93
RNG = RNG_stdin8, seed = 0x3bb19275
test set = normal, folding = standard (8 bit)

rng=RNG_stdin8, seed=0x3bb19275
length= 4 megabytes (2^22 bytes), time= 2.3 seconds 
  no anomalies in 56 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 8 megabytes (2^23 bytes), time= 5.0 seconds 
  no anomalies in 60 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 16 megabytes (2^24 bytes), time= 9.9 seconds
  no anomalies in 66 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 32 megabytes (2^25 bytes), time= 19.1 seconds
  no anomalies in 72 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 64 megabytes (2^26 bytes), time= 38.2 seconds
  no anomalies in 76 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 128 megabytes (2^27 bytes), time= 76.0 seconds
  no anomalies in 82 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 256 megabytes (2^28 bytes), time= 147 seconds
  no anomalies in 88 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 512 megabytes (2^29 bytes), time= 289 seconds
  no anomalies in 92 test result(s)

rng=RNG_stdin8, seed=0x3bb19275
length= 1 gigabyte (2^30 bytes), time= 571 seconds
  no anomalies in 98 test result(s)

```

From what I've read this test needs to run while before you can say it is safe. Even then there is evidence to suggest that passing those tests doesn't mean a RNG is cryptographically secure.
