const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    'background/service-worker': './background/service-worker.ts',
    'popup/popup': './popup/popup.ts',
    'sidepanel/sidepanel': './sidepanel/sidepanel.ts',
    'sidepanel/sidepanel': './sidepanel/sidepanel.tsx',
    'models/models': './models/notes.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx','.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json', to: 'manifest.json' },
        { from: 'popup', to: 'popup', globOptions: { ignore: ['**/*.ts'] } },
        { from: 'sidepanel', to: 'sidepanel', globOptions: { ignore: ['**/*.ts'] } },
        { from: 'images', to: 'images' },
        { from: 'models', to: 'models', globOptions: {ignore: ['**/**.ts'] } },
      ],
    }),
  ],
};
