const path = require('path');

module.exports = {
  entry: {
    entry: path.resolve(__dirname, './src/component/Table/index.ts'),
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        issuer: /\.tsx?$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: 'removeViewBox',
                    active: false,
                  },
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        type: 'asset/inline',
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(scss|css)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  stats: 'errors-only',
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', 'storybook-build'),
    assetModuleFilename: 'assets/[hash][ext][query]',
  },
};
