const bip39 = require("bip39");
const sha256 = require('js-sha256');

class RNG {
    constructor(seed) {
        if(bip39.validateMnemonic(seed)) {
            seed = bip39.mnemonicToSeedHex(seed);
        } else {
            seed = sha256(seed);
        }
        this.seed = seed;
        this.rng = this.sfc32();
    }

    xmur3() {
        for(var i = 0, h = 1779033703 ^ this.seed.length; i < this.seed.length; i++) {
            h = Math.imul(h ^ this.seed.charCodeAt(i), 3432918353);
            h = h << 13 | h >>> 19;
        }
        
        
        return function() {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }       
    }

    sfc32() {
        let seed = this.xmur3();
        let a = seed();
        let b = seed();
        let c = seed();
        let d = seed();
        return function() {
          a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
          var t = (a + b) | 0;
          a = b ^ b >>> 9;
          b = c + (c << 3) | 0;
          c = (c << 21 | c >>> 11);
          d = d + 1 | 0;
          t = t + d | 0;
          c = c + t | 0;
          return (t >>> 0) / 4294967296;
        }       
    }

    dec2Hex(dec) {
        return ('0' + dec.toString(16)).substr(-2)
    }

    random() {
        return this.rng();
    }

    randomRange(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    randomValues(array) {
        for(var i=0;i<array.length;i++) {
            array[i] = this.randomRange(0, 255);
        }
        return array
    }

    randomBytes(size) {
        var buffer = Buffer.allocUnsafe(size);
        buffer = this.randomValues(buffer)
        return buffer;
    }

    nextBytes(array) {
        return this.randomValues(array);
    }
}

module.exports = RNG;