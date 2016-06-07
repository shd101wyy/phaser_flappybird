var path = require('path')
module.exports = {
	entry: path.resolve(__dirname, 'game/main.js'),
	output: {
		path: path.resolve(__dirname, 'lib/'),
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			 { test: /\.(js|jsx)$/,
				 include: [path.resolve(__dirname, 'game/')],
				 exclude: [/node_modules/],
				 loader: 'babel',
				 query: { presets: ['es2015'] }
			}
		]
	}
}
