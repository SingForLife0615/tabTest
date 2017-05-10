var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');


module.exports = {
  entry: {
    app:'./app/js/app.js'
  },
  output: {
    path: __dirname,
    filename: '[name].soufang.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }, {
      test: /\.jsx$/,
      loader: 'babel-loader!jsx-loader?harmony'
    }]
  },
  plugins: [commonsPlugin]
};