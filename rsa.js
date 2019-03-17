const RNG = require("./rng");
const asn1 = require("jsrsasign").asn1;
const BigInteger = require('jsbn').BigInteger;

class RSAKey {

    constructor(seed) {
        this.n = null;
        this.e = 0;
        this.d = null;
        this.p = null;
        this.q = null;
        this.dmp1 = null;
        this.dmq1 = null;
        this.coeff = null;
        this.seed = seed;
        this.rng = new RNG(seed);
    }


    async _getRandomBN(length) {
        const self = this;
        return new Promise(function(resolve, reject) {
            try {
                let num = new BigInteger(length, 1, self.rng)
                resolve(num)
            } catch(e) {
                reject(e)
            }
        })


    }

    async _isValid(num, exponent) {
        return new Promise(function(resolve, reject) {
            try {
                resolve(num.subtract(BigInteger.ONE).gcd(exponent).compareTo(BigInteger.ONE) == 0 && num.isProbablePrime(10))

            } catch(e) {
                reject(e)
            }
        })
    }

    async _getPrime(length,exponent) {
        const self = this;
        return new Promise(async function(resolve, reject) {
            try {
                let valid = false;
                let num;
                while(!valid) {
                    num = await self._getRandomBN(length, exponent)
                    valid = await self._isValid(num, exponent)
                }
                resolve(num);


            } catch(e) {
                reject(e)
            }
        })
                
    }


    async generate(B, E) {

        const self = this;
        return new Promise(async function(resolve, reject) {

            try {
                //key size
                B = B || 2048
                //exponent
                E = E || "65537"
                const qs = B >> 1
                self.e = parseInt(E, 16)
                const exponent = new BigInteger(E, 16);

                let valid = false;

                while(!valid) {
                    self.p = await self._getPrime(B-qs, exponent)
                    self.q = await self._getPrime(qs, exponent)
                    
                    if(self.p.compareTo(self.q) <= 0) {
                        //swap values
                        let t = self.p
                        self.p = self.q
                        self.q = t
                    }

                    let p1 = self.p.subtract(BigInteger.ONE);
                    let q1 = self.q.subtract(BigInteger.ONE);
                    let phi = p1.multiply(q1);

                    if(phi.gcd(exponent).compareTo(BigInteger.ONE) == 0) {
                        self.n = self.p.multiply(self.q);
                        self.d = exponent.modInverse(phi);
                        self.dmp1 = self.d.mod(p1);
                        self.dmq1 = self.d.mod(q1);
                        self.coeff = self.q.modInverse(self.p);
                        valid = true;
                    }
                }

                let key = {}
                key.privateKey = await self.privateKey();
                key.publicKey = await self.publicKey();
                resolve(key);
                    
            } catch(error) {
                reject(error);
            }
                
        })
        

    }


    async privateBaseKey() {
        const self = this
        return new Promise(async function(resolve, reject) {
            try {
                const options = {
                    array: [
                        new asn1.DERInteger({int: 0}),
                        new asn1.DERInteger({bigint: self.n}),
                        new asn1.DERInteger({int: self.e}),
                        new asn1.DERInteger({bigint: self.d}),
                        new asn1.DERInteger({bigint: self.p}),
                        new asn1.DERInteger({bigint: self.q}),
                        new asn1.DERInteger({bigint: self.dmp1}),
                        new asn1.DERInteger({bigint: self.dmq1}),
                        new asn1.DERInteger({bigint: self.coeff})
                    ]
                };
                const seq = new asn1.DERSequence(options);
                resolve(seq.getEncodedHex());

            } catch(e) {
                reject(e);
            }
        })
                
    }

    async privateKey() {
        const self = this;
        return new Promise(async function(resolve, reject) {
            try {
                let basekey = await self.privateBaseKey()
                let key = asn1.ASN1Util.getPEMStringFromHex(basekey.toString("hex"),'RSA PRIVATE KEY')
                resolve(key)
            } catch(e) {
                reject(e);
            }
        })
        return 
    }

    async publicBaseKey() {
        const self = this;
        return new Promise(async function(resolve, reject) {
            try {
                const first_sequence = new asn1.DERSequence({
                    array: [
                        new asn1.DERObjectIdentifier({oid: "1.2.840.113549.1.1.1"}), // RSA Encryption pkcs #1 oid
                        new asn1.DERNull()
                    ]
                });

                const second_sequence = new asn1.DERSequence({
                    array: [
                        new asn1.DERInteger({bigint: self.n}),
                        new asn1.DERInteger({int: self.e})
                    ]
                });

                const bit_string = new asn1.DERBitString({
                    hex: "00" + second_sequence.getEncodedHex()
                });

                const seq = new asn1.DERSequence({
                    array: [
                        first_sequence,
                        bit_string
                    ]
                });
                let basekey = seq.getEncodedHex()
                resolve(basekey);
            } catch(e) {
                reject(e);
            }
        })
                
    }

    async publicKey() {
        const self = this;
        return new Promise(async function(resolve, reject) {
            try {
                let basekey = await self.publicBaseKey();
                let key = asn1.ASN1Util.getPEMStringFromHex(basekey.toString("hex"),'PUBLIC KEY')
                resolve(key)
            } catch(e) {
                reject(e);
            }
        })
    }
}



module.exports = RSAKey;

