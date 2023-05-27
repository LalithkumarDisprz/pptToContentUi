const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ModuleFederationPlugin } = require('webpack').container;

const isDevelopment = process.env.NODE_ENV !== 'production';

const deps = require('./package.json').dependencies;
const reactVersion = '17.0.2'; // TODO: Replace with actual version when versioning is done
const requiredVersion = '^17.0.0'; // TODO: Replace with actual version when versioning is done

// Next to Auto Prefixes for CSS variable

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'eval-source-map' : false,
  devServer: {
    port: parseInt(`3000`, 10),
    allowedHosts: 'all',
    host: 'localhost.disprz.com',
    client: {
      reconnect: 5,
      progress: true,
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    open: true,
    liveReload: false,
    hot: true, // Move to React-Refresh Webpack plugin once it's stable
    // historyApiFallback: false,
  },
  entry: path.join(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'scripts/bundle.[name].[contenthash].js',
    chunkFilename: 'scripts/chunk.[name].[contenthash].js',
    clean: true,
  },
  optimization: {
    moduleIds: isDevelopment ? 'named' : 'deterministic',
    chunkIds: isDevelopment ? 'named' : 'deterministic',
    /**
     * 1. Module Federation doesn't support runtimeChunk
     * 2. ModuleFederationPlugin and SplitChunksPlugin confuses each other for
     *    splitting chunks
     */
    runtimeChunk: false,
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        default: false,
        defaultVendors: false,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|css)$/,
        enforce: 'pre',
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        use: [
          {
            loader: 'source-map-loader',
            // options: {
            //   filterSourceMappingUrl: (url, resourcePath) => {
            //     if (resourcePath.includes('disprzcomponents')) {
            //       return 'consume';
            //     }
            //     return 'skip';
            //   },
            // },
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        // match and process non-module scss files
        test: /(?<!\.module).s[ca]ss$/,
        exclude: /(node_modules)/,
        use: [
          // Creates `style` nodes from JS strings
          {
            loader: isDevelopment
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
          },
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.module\.s[ca]ss$/,
        exclude: /(node_modules)/,
        use: [
          // Creates `style` nodes from JS strings
          {
            loader: isDevelopment
              ? 'style-loader'
              : MiniCssExtractPlugin.loader,
          },
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              modules: {
                namedExport: false,
                localIdentName: isDevelopment
                  ? '[local]__[hash:base64:5]'
                  : '[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext]',
        },
      },
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg/i,
        exclude: /(node_modules)/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              // prettier: false,
              // svgo: false,
              // svgoConfig: {
              //   plugins: [{ removeViewBox: false }],
              // },
              // titleProp: true,
              // ref: true,
              // exportType: "named",
              icon: true,
              memo: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[hash][ext]',
        },
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './public/',
          to: './',
          filter: async (resourcePath) => {
            if (resourcePath.match(/\.html$/i)) {
              return false;
            }
            return true;
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: 'ContentRenderer',
      template: './public/index.html',
      publicPath: 'auto',
      minify: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[contenthash].css',
    }),
    new ModuleFederationPlugin({
      name: 'contentRenderer',
      filename: 'remoteEntry.js',
      remotes: {
        'react-library': isDevelopment
          ? `reactLibrary@https://disprzmicrofrontend.disprz.com/react-library/${reactVersion}/development/remoteEntry.js`
          : `reactLibrary@https://disprzmicrofrontend.disprz.com/react-library/${reactVersion}/production/remoteEntry.js`,
      },
      exposes: {
        '.': './src/remote.js',
      },
      shared: {
        '@disprz/components': {
          singleton: true,
          requiredVersion: deps['@disprz/components'],
          strictVersion: true,
        },
        '@disprz/icons': {
          singleton: true,
          requiredVersion: deps['@disprz/icons'],
        },
        'react-dom': {
          // version: reactVersion,
          singleton: true,
          requiredVersion: requiredVersion,
          strictVersion: true,
        },
        react: {
          // version: reactVersion,
          singleton: true,
          requiredVersion: requiredVersion,
          strictVersion: true,
        },
        /**
         * On trial basis, sharing all the deps by default to avoid duplication b/w MFEs.
         * We can collect feedback from others and remove this if it's not required.
         */
        ...deps,
      },
    }),
  ],
};
