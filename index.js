
var fs = require('fs'),
	path = require('path'),
	coffee = require('coffee-script'),
	defaults = require('defaults');

module.exports = function(options) {
	var jsExt = '.js',
		mapExt = '.map',
		o = defaults(options, {
			filter: coffee.FILE_EXTENSIONS,
			preserveSources: false,
			rename: function(file) {
				return file.basename;
			}
		});
	if(Array.isArray(o.filter)) {
		var exts = o.filter;
		o.filter = function(file) {
			return exts.indexOf(file.extension) !== -1;
		}
	}

	return function(item, reem, done) {
		if(!o.filter(item)) return done(null, item);
		var basename = o.rename(item);

		fileContents(item, function(error, data) {
			if(error) return done(error);
			compile(data, function(error, compiled) {
				if(error) return done(error);
				attachFiles(compiled, function(error, script, sourceMap) {
					if(error) return done(error);
					modifySource(item, script, sourceMap, done);
				});
			});
		});

		function fileContents(item, next) {
			if(item.content) return next(null, item.content);
			fs.readFile(item.sourcePath, next);
		}

		function compile(data, next) {
			try {
				var compiled = coffee.compile(data.toString(), o);
			} catch (error) {
				return next(error);
			}
			if(typeof compiled === 'string') return next(null, {js: compiled});
			next(null, compiled);
		}

		function attachFiles(compiled, next) {
			attachJavaScript(compiled, function(error, script) {
				if(error) return next(error, script, null);
				attachV3SourceMap(compiled, function(error, sourceMap) {
					next(error, script, sourceMap);
				});
			});
		}

		function attachJavaScript(compiled, next) {
			if(!o.preserveSources || !item.list) return next(null, {
				dynamicFile: true,
				content: compiled.js
			});
			if(o.sourceMap) {
				var sourceMapURL = basename+mapExt;
				compiled.js += "\n//# sourceMappingURL="+sourceMapURL+"\n";
			}
			attach({
				extension: jsExt,
				content: compiled.js,
				v3SourceMap: compiled.v3SourceMap
			}, next);
		}

		function attachV3SourceMap(compiled, next) {
			if(!o.sourceMap || !item.list) return next(null, null);
			attach({
				extension: mapExt,
				content: compiled.v3SourceMap,
			}, next);
		}

		function attach(body, next) {
			var file = defaults(body, {
				basename: basename,
				filetype: 'file',
				dynamicFile: true,
				supportFile: false,
				sourceFile: item,
				list: item.list
			});
			item.list.files.push(file);
			next(null, file);
		}

		function modifySource(item, script, sourceMap, next) {
			item.javascriptFile = script;
			item.sourceMap = sourceMap;
			item.coffeeCompiled = true;
			if(!o.preserveSources) {
				item.extension = jsExt;
				item.basename = basename;
				item.content = script.content;
			}
			next(null, item);
		}

		function capitalize(s) {
			return s.charAt(0).toUpperCase() + s.slice(1);
		}
	}
}