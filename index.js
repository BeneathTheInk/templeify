var Temple = require('templejs');
var path = require('path');
var through = require('through');

var header = "// Compiled Temple Template\n";
var exporter = "module.exports = ";

// transforms mustache templates
module.exports = function templeify(file) {
	if (path.extname(file) !== ".html") return through();

	var data = '';
	return through(write, end);

	function write (buf) { data += buf }
	function end () {
		var src;
		
		try {
			src = render(data, path.basename(file));
		} catch (error) {
			this.emit('error', error);
		}

		this.queue(src);
		this.queue(null);
	}
};

var render = module.exports.render = function(data, name) {
	var result, src;

	if (data.substr(0, header.length) !== header) {
		result = Temple.parse(data);
		src = header + "// " + name + "\n" + exporter + JSON.stringify(result) + ";";
	} else {
		src = data;
	}

	return src;
}