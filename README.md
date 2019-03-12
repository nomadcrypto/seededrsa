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
MIIEogIBAAKCAQB/fhIBfKuQa003rOXNK+HbIqlegfGYRWepNmDTIbQ2wEdpaJ0i
TyksL7yYyLvTUvmLUnyJgvZgf1GwF1UD0274NfJgExeCmv5F93SC8XJcvSE9VJTf
fliszefAgJuoCYaCZiFeZAaYJbiYXvj1W1gj58HAY8OPD1QrqiI+hl3WXvlWkRqo
oKMJb0PolCGdufBIwR9iW4rv662WmTk4IBi9x40ydRBB+3LMiwLgLr0ErDoOrWna
AGAF2euohD4PQ1MYfw7GSgIUmLBIHxSGFDOmewytIo5MIeBbKDdjFOhTrqSlyYfN
wXwa0ZrnjYCe+6oQugFLdqCLMCL2v2mmiNYjAgMGVTcCggEAUyzm8+/yCWgU7ySf
15nGq3xeQ2V5m7OhQDk8LFtbxaJikhYrUm0oYxaBLKkefMqVfTQpSOU5pSARC7tS
WeVZYaErfMq11ECbvHMCTt/uhJSQ4b8U6zQBZatCjivfaljQu0qNFrdHtS2l76eQ
TcA+ibe9EsekfnUP5nuLUQ3Myx31YmaEqjhXmWM96K817Qefofout98bgE2EmhIW
Em6D7Q/TpUeGH2iUig24BFF9LcT4cWbA/EQwlh23R0TySsQsQerO3FilEysV3hFT
Mym9P7DBPZsw8rUyRsVr8Mn4KGpCGfxN6e11RZXJ0pQC3yCtruBzZijXawbLJwMv
rFjORwKBgQC4MzEwNTIxMjIzNDc0MTA0NDU4ODIxNzk3MzE0MzExMDk0MTQ2MzQ5
MTc2MTIxMzE5NjIxMjQ0MTgzMTUxODcxMzU1NzIxMjM5MjUxMTc0MjcyMzMxNTcx
MzUxMTUxMTA3MDEwMjIwMjEwNjEzOTExNTUxMDY1ODQwMTMyMTEzewKBgQCxMDEy
ODM4MzAyNDMxOTAyNDM0MDM2MTM4MTQ3MTczMjAxNzEyMDkyMjExODUxMDkyMTkx
ODAzNzg1MTQ4MjUwMTc0MjExMTgzMjI0MTg5MjUyNzIxNTkxNTIxOTE1Mzk4NDYx
MTIzMjQxMTYxNjExNzAxNTAyMDUxMDU3MTIzeQKBgHfA/kV27x4IuEVdqcwbHF67
FISrA544R+6ZRPWXxMQGs2r4WzhPPCszOTgJZfZ4eCXcd3AcXaAaGOrnOdpKJ7AY
UhjeCAvQ9eSf6p+vMTekXpa4NZFOoPtqutbXzE0C/wgfN7fmcMem4/5YCl468UrR
ud8V4jpbGkM9xLNPH4SHAoGBAKtsEvjkyi+5juGmpKf1NkXIW9MK2vH9prmve5hM
ljXv7NKcPKQ424rijR5sDwvmnrAp8W/txnx1o1WAcdLt+pEUlAI7WXbZsI4HUU/H
BHBMDDqhoJnLetpvjrry/f/ORMmdAZaeoTl3etwc1vleGY+f7V77PYSI4ZZduL/9
NIVvAoGASQKnlWtKBnzfgQzecyJDbudJsL2tg+6Il2we90qQ7ZFLRIdL87EyQFrq
hIdW0liBrdwR04QFmcFO4YPfkIrRph8345vJlgG3uVVFQkgev2cok32VBOJwftGj
5NumiAqAxHHZHK0ZJottWDNPwwEEKtijEz90DdOjiWiFRKc6wQI=
-----END RSA PRIVATE KEY-----

*/

console.log(key.publicKey())
/*
-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB/fhIBfKuQa003rOXNK+Hb
IqlegfGYRWepNmDTIbQ2wEdpaJ0iTyksL7yYyLvTUvmLUnyJgvZgf1GwF1UD0274
NfJgExeCmv5F93SC8XJcvSE9VJTffliszefAgJuoCYaCZiFeZAaYJbiYXvj1W1gj
58HAY8OPD1QrqiI+hl3WXvlWkRqooKMJb0PolCGdufBIwR9iW4rv662WmTk4IBi9
x40ydRBB+3LMiwLgLr0ErDoOrWnaAGAF2euohD4PQ1MYfw7GSgIUmLBIHxSGFDOm
ewytIo5MIeBbKDdjFOhTrqSlyYfNwXwa0ZrnjYCe+6oQugFLdqCLMCL2v2mmiNYj
AgMGVTc=
-----END PUBLIC KEY-----
*/
```
