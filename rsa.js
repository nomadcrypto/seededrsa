const BigInteger = require("./BigInteger");
const RNG = require("./rng");
const jsrsasign = require("jsrsasign");
const asn1 = require("jsrsasign").asn1;

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
    }

    generate(B, E) {
        E = E || "65537"
        var rng = new RNG(this.seed);
        var qs = B >> 1;
        this.e = parseInt(E, 16);
        var ee = new BigInteger(E, 16);
        for (;;)
        {
            for (;;)
            {
                this.p = new BigInteger(B - qs, 1, rng);
                if (this.p.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.p.isProbablePrime(10)) break;
            }
            for (;;)
            {
                this.q = new BigInteger(qs, 1, rng);
                if (this.q.subtract(BigInteger.ONE).gcd(ee).compareTo(BigInteger.ONE) == 0 && this.q.isProbablePrime(10)) break;
            }
            if (this.p.compareTo(this.q) <= 0)
            {
                var t = this.p;
                this.p = this.q;
                this.q = t;
            }
            var p1 = this.p.subtract(BigInteger.ONE);
            var q1 = this.q.subtract(BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0)
            {
                this.n = this.p.multiply(this.q);
                this.d = ee.modInverse(phi);
                this.dmp1 = this.d.mod(p1);
                this.dmq1 = this.d.mod(q1);
                this.coeff = this.q.modInverse(this.p);
                break;
            }
        }
    }

    privateBaseKey() {
        const options = {
            array: [
                new asn1.DERInteger({int: 0}),
                new asn1.DERInteger({bigint: this.n}),
                new asn1.DERInteger({int: this.e}),
                new asn1.DERInteger({bigint: this.d}),
                new asn1.DERInteger({bigint: this.p}),
                new asn1.DERInteger({bigint: this.q}),
                new asn1.DERInteger({bigint: this.dmp1}),
                new asn1.DERInteger({bigint: this.dmq1}),
                new asn1.DERInteger({bigint: this.coeff})
            ]
        };
        const seq = new asn1.DERSequence(options);
        return seq.getEncodedHex();
    }

    privateKey() {
        return asn1.ASN1Util.getPEMStringFromHex(this.privateBaseKey().toString("hex"),'RSA PRIVATE KEY');
    }

    publicBaseKey() {
        const first_sequence = new asn1.DERSequence({
            array: [
                new asn1.DERObjectIdentifier({oid: "1.2.840.113549.1.1.1"}), // RSA Encryption pkcs #1 oid
                new asn1.DERNull()
            ]
        });

        const second_sequence = new asn1.DERSequence({
            array: [
                new asn1.DERInteger({bigint: this.n}),
                new asn1.DERInteger({int: this.e})
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
        return seq.getEncodedHex();
    }

    publicKey() {
        return asn1.ASN1Util.getPEMStringFromHex(this.publicBaseKey().toString("hex"),'PUBLIC KEY');
    }
}



module.exports = RSAKey;

