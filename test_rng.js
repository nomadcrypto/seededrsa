const RNG = require("./rng");

var crypto= require("crypto");
var stream = require('stream');
var util = require('util');

var Readable = stream.Readable;

function RandomStream(options) {
  // allow calling with or without new
  if (!(this instanceof RandomStream)) {
    return new RandomStream(options);
  }

  // init Readable
  Readable.call(this, options);

  this.seed = "praise you muffin lion enable neck grocery crumble super myself license ghost"
  this.rng = new RNG(this.seed)
  this.bytes = Buffer.allocUnsafe(8);
  
}
util.inherits(RandomStream, Readable);

RandomStream.prototype._read = function (size) {
	size= size||8
  var ready = true;
  while (ready) { // only cont while push returns true
    var bytes = this.rng.randomBytes(8)
    //ready = this.push(this.bytes.toString("binary") + "\n")
    
    //read = false;
    //bytes = crypto.randomBytes(8)
    ready = this.push(bytes)
  }

};

var readstream = new RandomStream();
readstream.pipe(process.stdout)