# SeededRSA
The inspiration for this came from a project I was doing research for. In this project I was wanting to use ipfs in combination with orbitdb for a dapp(decentralized application). IPFS uses 2048 bit rsa keys for the peerid and orbitdb uses secp256k1 for read/write access in the db. In the cryptocurrency community we are used to using bip39 seed phrases to make backing up or restoring a bitcoin(or other cryptocurrency) wallet much easier. For my application I wanted an easy way for a user to restore their peerid and secp256k1 keys on another device while avoiding unnecessary overhead(like storing encrypted keys that were previously generated). Instead with this a user can simply restore their RSA key using a bip39 phrase when/if needed.

Most of rsa.js was taken from [jsencrypt](https://github.com/travist/jsencrypt/blob/master/src/JSEncryptRSAKey.ts)/[cryptico](https://github.com/wwwtyro/cryptico/blob/master/rsa.js) which has been in the wild for years. I did research and wasn't able to find any security complaints regarding their implementation of the rsa keys so I felt safe in using that implementation. Cryptico uses a seeded rng and replaces the global Math.random() with that RNG. This means that any calls to Math.random() after using it are deterministic. This package uses it's own PRNG. 

The rng was basically the product of [this comment on stackoverflow](https://stackoverflow.com/a/47593316/4425082) regarding seeded random generators. It uses MurmurHash3's hashing function as a seed for the scf32 prng from pactrand. Right now it only tests for 8 bit but can be tested for any size that practrand supports. After a little while I realized there may be people that would need to use the RSA or RNG without having a valid bip39 seed. The rng can now accept a string of any size, including 0, and still work. If the supplied string is a valid bip39 seed it is coverted into the seed value and if not then I use a sha256 hash in place of the seed. It still passes all practrand tests. I will most likely move the RNG into a its own package

My goal here was to use existing implementations for both rsa and the rng to minimize the risk of me causing a dumbster fire of a situation. I still wouldn't trust this until it has been properly tested for randomness.


## Install
```bash
npm install seededrsa
```

## Example usage
```javascript
const RSA = require("./rsa");
const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost"
const key = new RSA(seed);
key.generate(2048).then(function(key) {
  console.log(key.privateKey)
  console.log(key.publicKey)
}).catch(function(error){
  console.error(error)
})

/*
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA3NdzUHz53SeYrpoR1JXtx/IokPeMhMcNEp3HtB7DW3rTRImg
SlxPv2doHSbYOZ1eEGexmAeJ7ClySm8Icj1vgetNq1mNTfi07LXHO0lQvburYOcX
q1yk+OshdurWfoIa7tsiiregYF1cjGh9kdjUaI+x59OUW+s1pWS9sfhnDwaK/lyQ
TG6vCSiyXX3tktc0Sso+8xOMg41jX0OZayKWNc63K0CHtUlVvTNqQ3x7W1YM1wyH
rzOm8MqRF1behCva73F9M8f1+zo9aqmASSgxs7wGQyozit/F/I4gDKEnrW2+1b+z
OKwQP+lKypSEeanmkZj3H1k95R2uctoOkuBgjQIDBlU3AoIBAEoVNIls76hBbflj
r8XsrxO/jBtJIp0vsRHFWbE0QHgl8VNS7fhV/PzgxR/cCJLRG/Ny5j4mnT0gNhxy
u62WAfPyEtLe+cwewmc73EdudPkDEBkCCwAHEYT7wuoBNN5UPm4916+kdKDQpcNN
LYk9mdZF3W/2j7kREKlAhAKsUz+yTA864w4iKKbVHnVAKSBMacfQI9FJ4rS/DwtE
SaE2IH4XO/CBm3jhnQ8kG0RHOssfVReWcnArdigmm4xJ8qGfE+BDzkLbvDbCRh3g
KIG1Tkr4tat5Q0eSkYJqV5fJ1igc97ARlBk3mBJ+aFHzV9Yn9eLWyeKonYHCtxDc
nuShjycCgYEA8o1va8Lg4e8m93UScRuQkwIup1CW+BlxYefIZTS9RQQ1CuBYQASU
9xOMN+RgJyRB+Kr7ACGmfpw9ASV7NNUF88aaUbx5HbEqXd18+5XEa4nbTqqjtCOH
rbSLYMTVClB1hTWqg2xwzbAcJ/rQeqlE9piVwV4MaOhIn9XgD0OBbrkCgYEA6RXf
BEpoLVjZYR8rbl6SIltMDINgFfS3D7uHOdQn+64b6Z2Hc25GZspqiwGbajoohHF2
pPGcqTOd+13rs6n40oAmHvO+8ygkipOtFKvR3blt27QlVZT6rtO34L38SJ+YvzVi
LgEMA/EQoaqWzWlH4O1/MTx3XlwZJdeJNRlr9nUCgYB8TtPcnLZHlLytM1Av8HWr
ZXAvscradmTPcWxg362lZtiamZqyfR8f7IjlJMe+Qz3BDfl7amVFxHA8chuSqm5F
n7ZAUeB089yrzAk1yWJkijEGkBYuGIMDWis9GLCK1QwOUcys4GcflUyxTOXst3qm
VY/h6RLOjYVadxycHSgkfwKBgBVT43uKpu5+7avz6aQDiKTVtBsc991UkMkHNOuO
R8Yr1wdWMl6D4525y+zCsy4CuYmnpcGz15GB7vgmH1ORnrc3SaCj72lNaTnP7OpK
36xXZU59/s5XrwfW6MVFcR0fbGdngF/7i86gqeyF+20Pe+GKXtOX1bP8Niu6OyDf
w9enAoGAU1rF0ty3hi6uJgG/4UPyZBeKlYJA1xqgXJrsSbD4UE3yMpn+MPGEZCr3
NfwNbc03UcrJoLva8mbspVz73udtR4SiecwD7o44S23+zn63w4NdEEQ8+KF2J1wT
XJqOG8nR/SfQHt/TH3ErQK4OfqEw/wExadhSZgCIUlpuULmi2MQ=
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3NdzUHz53SeYrpoR1JXt
x/IokPeMhMcNEp3HtB7DW3rTRImgSlxPv2doHSbYOZ1eEGexmAeJ7ClySm8Icj1v
getNq1mNTfi07LXHO0lQvburYOcXq1yk+OshdurWfoIa7tsiiregYF1cjGh9kdjU
aI+x59OUW+s1pWS9sfhnDwaK/lyQTG6vCSiyXX3tktc0Sso+8xOMg41jX0OZayKW
Nc63K0CHtUlVvTNqQ3x7W1YM1wyHrzOm8MqRF1behCva73F9M8f1+zo9aqmASSgx
s7wGQyozit/F/I4gDKEnrW2+1b+zOKwQP+lKypSEeanmkZj3H1k95R2uctoOkuBg
jQIDBlU3
-----END PUBLIC KEY-----
*/
*/


```

## Verifying the generated RSA Keys

I save the private and public keys from above to say key.pem(private) and key.pub(public). Then you can use openssl to verify them like this:

```
openssl rsa -in key.pem -check
RSA key ok
writing RSA key
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA3NdzUHz53SeYrpoR1JXtx/IokPeMhMcNEp3HtB7DW3rTRImg
SlxPv2doHSbYOZ1eEGexmAeJ7ClySm8Icj1vgetNq1mNTfi07LXHO0lQvburYOcX
q1yk+OshdurWfoIa7tsiiregYF1cjGh9kdjUaI+x59OUW+s1pWS9sfhnDwaK/lyQ
TG6vCSiyXX3tktc0Sso+8xOMg41jX0OZayKWNc63K0CHtUlVvTNqQ3x7W1YM1wyH
rzOm8MqRF1behCva73F9M8f1+zo9aqmASSgxs7wGQyozit/F/I4gDKEnrW2+1b+z
OKwQP+lKypSEeanmkZj3H1k95R2uctoOkuBgjQIDBlU3AoIBAEoVNIls76hBbflj
r8XsrxO/jBtJIp0vsRHFWbE0QHgl8VNS7fhV/PzgxR/cCJLRG/Ny5j4mnT0gNhxy
u62WAfPyEtLe+cwewmc73EdudPkDEBkCCwAHEYT7wuoBNN5UPm4916+kdKDQpcNN
LYk9mdZF3W/2j7kREKlAhAKsUz+yTA864w4iKKbVHnVAKSBMacfQI9FJ4rS/DwtE
SaE2IH4XO/CBm3jhnQ8kG0RHOssfVReWcnArdigmm4xJ8qGfE+BDzkLbvDbCRh3g
KIG1Tkr4tat5Q0eSkYJqV5fJ1igc97ARlBk3mBJ+aFHzV9Yn9eLWyeKonYHCtxDc
nuShjycCgYEA8o1va8Lg4e8m93UScRuQkwIup1CW+BlxYefIZTS9RQQ1CuBYQASU
9xOMN+RgJyRB+Kr7ACGmfpw9ASV7NNUF88aaUbx5HbEqXd18+5XEa4nbTqqjtCOH
rbSLYMTVClB1hTWqg2xwzbAcJ/rQeqlE9piVwV4MaOhIn9XgD0OBbrkCgYEA6RXf
BEpoLVjZYR8rbl6SIltMDINgFfS3D7uHOdQn+64b6Z2Hc25GZspqiwGbajoohHF2
pPGcqTOd+13rs6n40oAmHvO+8ygkipOtFKvR3blt27QlVZT6rtO34L38SJ+YvzVi
LgEMA/EQoaqWzWlH4O1/MTx3XlwZJdeJNRlr9nUCgYB8TtPcnLZHlLytM1Av8HWr
ZXAvscradmTPcWxg362lZtiamZqyfR8f7IjlJMe+Qz3BDfl7amVFxHA8chuSqm5F
n7ZAUeB089yrzAk1yWJkijEGkBYuGIMDWis9GLCK1QwOUcys4GcflUyxTOXst3qm
VY/h6RLOjYVadxycHSgkfwKBgBVT43uKpu5+7avz6aQDiKTVtBsc991UkMkHNOuO
R8Yr1wdWMl6D4525y+zCsy4CuYmnpcGz15GB7vgmH1ORnrc3SaCj72lNaTnP7OpK
36xXZU59/s5XrwfW6MVFcR0fbGdngF/7i86gqeyF+20Pe+GKXtOX1bP8Niu6OyDf
w9enAoGAU1rF0ty3hi6uJgG/4UPyZBeKlYJA1xqgXJrsSbD4UE3yMpn+MPGEZCr3
NfwNbc03UcrJoLva8mbspVz73udtR4SiecwD7o44S23+zn63w4NdEEQ8+KF2J1wT
XJqOG8nR/SfQHt/TH3ErQK4OfqEw/wExadhSZgCIUlpuULmi2MQ=
-----END RSA PRIVATE KEY-----
```

```
openssl rsa -inform PEM -pubin -in key.pub -text -noout
Public-Key: (2048 bit)
Modulus:
    00:dc:d7:73:50:7c:f9:dd:27:98:ae:9a:11:d4:95:
    ed:c7:f2:28:90:f7:8c:84:c7:0d:12:9d:c7:b4:1e:
    c3:5b:7a:d3:44:89:a0:4a:5c:4f:bf:67:68:1d:26:
    d8:39:9d:5e:10:67:b1:98:07:89:ec:29:72:4a:6f:
    08:72:3d:6f:81:eb:4d:ab:59:8d:4d:f8:b4:ec:b5:
    c7:3b:49:50:bd:bb:ab:60:e7:17:ab:5c:a4:f8:eb:
    21:76:ea:d6:7e:82:1a:ee:db:22:8a:b7:a0:60:5d:
    5c:8c:68:7d:91:d8:d4:68:8f:b1:e7:d3:94:5b:eb:
    35:a5:64:bd:b1:f8:67:0f:06:8a:fe:5c:90:4c:6e:
    af:09:28:b2:5d:7d:ed:92:d7:34:4a:ca:3e:f3:13:
    8c:83:8d:63:5f:43:99:6b:22:96:35:ce:b7:2b:40:
    87:b5:49:55:bd:33:6a:43:7c:7b:5b:56:0c:d7:0c:
    87:af:33:a6:f0:ca:91:17:56:de:84:2b:da:ef:71:
    7d:33:c7:f5:fb:3a:3d:6a:a9:80:49:28:31:b3:bc:
    06:43:2a:33:8a:df:c5:fc:8e:20:0c:a1:27:ad:6d:
    be:d5:bf:b3:38:ac:10:3f:e9:4a:ca:94:84:79:a9:
    e6:91:98:f7:1f:59:3d:e5:1d:ae:72:da:0e:92:e0:
    60:8d
Exponent: 415031 (0x65537)
```

The keys generated are fully functional RSA keys.

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
