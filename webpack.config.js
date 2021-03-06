module.exports = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  externals: {
    react: 'React',
		jquery: 'jQuery',
		Masonry: 'Masonry'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
};
