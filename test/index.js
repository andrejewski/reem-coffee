
var exists = require('fs').existsSync,
	path = require('path'),
	Reem = require('reem'),
	coffee = require('../index'),
	assert = require('assert');

var identity = path.resolve('./test/fixture/identity'),
	compile = path.resolve('./test/fixture/compile');

function buildWithOptions(options) {
	return function(done) {
		var next = after(2, done);
		[identity, compile].forEach(function(dirc) {
			var reem = Reem(dirc);
			reem.File.use(coffee(options));
			reem.build(next);
		});

		function after(t, f) {
			t = t || 1;
			return function(error) {
				if(error) return f(error);
				t--;
				if(t === 0) f();
			}
		}
	}
}

function identityOutputExists(filename) {
	return exists(path.join(identity, 'output', filename));
}

function compileOutputExists(filename) {
	return exists(path.join(compile, 'output', filename));
}

describe('Reem-Coffee', function() {
	describe('with defaults', function() {
		before(buildWithOptions({}));

		it('should not mutate non-CoffeeScript files', function() {
			assert.ok(identityOutputExists('about.txt'));
		});

		it('should mutate CoffeeScript files into JavaScript files', function() {
			assert.ok(compileOutputExists('script.js'));
		});
		
	});
	describe('with preserveSources option', function() {
		before(buildWithOptions({preserveSources: true}));
		
		it('should not mutate non-CoffeeScript files', function() {
			assert.ok(identityOutputExists('about.txt'));
		});

		it('should preserve the orginal CoffeeScript file', function() {
			assert.ok(compileOutputExists('script.coffee'));
		});

		it('should transform CoffeeScript files into JavaScript files', function() {
			assert.ok(compileOutputExists('script.js'));
		});

	});
	describe('with sourceMap option', function() {
		before(buildWithOptions({sourceMap: true}));
		
		it('should not mutate non-CoffeeScript files', function() {
			assert.ok(identityOutputExists('about.txt'));
		});

		it('should mutate CoffeeScript files into JavaScript files', function() {
			assert.ok(compileOutputExists('script.js'));
		});

		it('should create a source map file', function() {
			assert.ok(compileOutputExists('script.map'));
		});

	});
	describe('with preserveSources and sourceMap options', function() {
		before(buildWithOptions({
			preserveSources: true,
			sourceMap: true
		}));

		it('should not mutate non-CoffeeScript files', function() {
			assert.ok(identityOutputExists('about.txt'));
		});
	
		it('should preserve the orginal CoffeeScript file', function() {
			assert.ok(compileOutputExists('script.coffee'));
		});

		it('should transform CoffeeScript files into JavaScript files', function() {
			assert.ok(compileOutputExists('script.js'));
		});

		it('should create a source map file', function() {
			assert.ok(compileOutputExists('script.map'));
		});

	});
});