// test.js
// "testing frameworks are dumb."
// bash: $ npm run test

var coffee = require('./index'),
	code = require('coffee-script').compile,
	show = require('util').inspect,
	assert = require('assert');

// testing tools
function g(p) {
	return function(name, tester, next) {
		p(name, false);
		if(!tester) return;
		var res = tester(function(msg, isTest) {
			p("  "+msg, isTest);
			return msg;
		});
		next.apply(null, Array.isArray(res) ? res : [res]);
	}
}

function e(p) {
	return function s(sign, ware, next) {
		p(sign, false);
		next(function o(inital, expected) {
			(ware.run || ware)(clone(inital), {}, function(error, result) {
				assert.deepEqual(result, expected, sign+" + "+show(inital)+" => "+show(result)+" ; expected "+show(expected));
				p("  "+show(inital)+" => "+show(result), true);
			});
		});
	}
}

var clone = function(o) {
	return JSON.parse(JSON.stringify(o));
}

var c = 0,
	t = g(function(msg, isTest) {
		console.log(msg);
		if(isTest) c++; // ha
	});

// fixtures

// control
var initalNoop = {
	filetype: 'file',
	filename: 'noop.txt',
	filepath: '/system/list/noop.txt',
	basename: 'noop',
	extension: '.txt',
	content: "bloop bloop",
	list: {
		filetype: 'list',
		filepath: '/system/list',
		files: [initalNoop]
	}
}
var expectedNoop = initalNoop;

// compile
var initalComp = {
	filetype: 'file',
	filename: 'comp.coffee',
	filepath: '/system/list/comp.coffee',
	basename: 'comp',
	extension: '.coffee',
	content: "a = -> b -> c -> a(b,c)\n",
	list: {
		filetype: 'list',
		filepath: '/system/list',
		files: [initalComp]
	}
};
var expectedComp = {
	filetype: 'file',
	filename: 'comp.js',
	filepath: '/system/list/comp.js',
	basename: 'comp',
	extension: '.js',
	content: code("a = -> b -> c -> a(b,c)\n"),
	list: {
		filetype: 'list',
		filepath: '/system/list',
		files: [expectedComp]
	}
};


// tests
t("reem-coffee", g, function(h) {
	h()

	o({[options]}, function(s) {
		s("inital object name", {[initial]}, function(e, i, r) {
			d("", r.filename, initial.filename)
		});
	})
});


console.log(c+" tests ran successfully.");
