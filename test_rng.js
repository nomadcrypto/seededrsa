const RNG = require("./rng");

var crypto= require("crypto");
var stream = require('stream');
var util = require('util');

var Readable = stream.Readable;

function RandomStream(options) {
  if (!(this instanceof RandomStream)) {
    return new RandomStream(options);
  }
  Readable.call(this, options);

  this.seed = "password"
  this.rng = new RNG(this.seed)
  this.bytes = Buffer.allocUnsafe(8);
  
}
util.inherits(RandomStream, Readable);

RandomStream.prototype._read = function (size) {
  var ready = true;
  while (ready) { 
    var bytes = this.rng.randomBytes(8)
    //bytes = crypto.randomBytes(8)
    ready = this.push(bytes)
  }

};

var readstream = new RandomStream();
readstream.pipe(process.stdout)