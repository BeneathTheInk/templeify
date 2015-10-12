var Temple = require('templejs');
var path = require('path');
var through = require('through');

var hasOwn = Object.prototype.hasOwnProperty;
var slice = Array.prototype.slice;

var header = "var Temple = require(\"templejs\");\n\n";

function assign(obj) {
	slice.call(arguments, 1).forEach(function(v) {
		if (!v) return;
		for (var k in v) {
			if (hasOwn.call(v, k) && v[k] !== void 0) {
				obj[k] = v[k];
			}
		}
	});

	return obj;
}

// transforms mustache templates
module.exports = function templeify(file, options) {
	if (path.extname(file) !== ".html") return through();

	options = assign({
		originalFilename: path.basename(file),
		exports: "cjs",
		sourceMap: true
	}, options);

	var data = '';
	return through(write, end);

	function write (buf) { data += buf; }
	function end () {
		var src;

		try {
			src = Temple.getSource([
				header,
				Temple.parse(data).compile(options)
			], data, options);
		} catch (error) {
			this.emit('error', error);
		}

		this.queue(src);
		this.queue(null);
	}
};
