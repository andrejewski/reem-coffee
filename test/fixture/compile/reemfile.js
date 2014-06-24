// reemfile.js
var coffee = require('../../../');

module.exports = function(reem, done) {
	reem.view.engine = "ENGINE_NAME";
	reem.File.use(coffee({
		preserveSources: true
	}));

	done(null);
}