const RNG = require("./rng");

function test() {
	const seed = "praise you muffin lion enable neck grocery crumble super myself license ghost"
	const rng = new RNG(seed)
	
	while(true) {
		var bytes = Buffer.allocUnsafe(8)
		rng.nextBytes(bytes)
		process.stdout.write(bytes.toString("binary"))
		
	}
		

}

test()