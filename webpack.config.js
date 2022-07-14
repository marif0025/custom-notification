
const path = require('path');

const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
// SASS Compilation and CSS Post Processing
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const StylelintPlugin = require('stylelint-webpack-plugin');
const Webpack = require('webpack');

module.exports = (env) => ({
    mode: env.mode,
    stats: { colors: true, children: false, modules: false },
    performance: { hints: false },

    devtool: env.mode === 'development' ? 'inline-source-map' : false,
    plugins: [
        new StylelintPlugin({
            configFile: '.stylelintrc',
            context: './resources/sass',
        }),

        new MiniCssExtractPlugin({
            filename: '../css/[name].css',
        }),

        new Webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),

        new SpriteLoaderPlugin({
            plainSprite: true
        }),
    ],

    entry: {
        main: './resources/main',
    },

    resolve: {
        extensions: ['.ts', '.js']
    },

    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'Notification',
        libraryExport: 'default'
    },

    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.(scss|css)$/,

                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            url: {
                                filter(url) {
                                    // Don't resolve url() in public assets
                                    return !url.includes('../images');
                                },
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: env.mode === 'production' ? [autoprefixer(), cssnano()] : [autoprefixer()],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.(ttf|eot|png|jpg|gif|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    'svg-sprite-loader',
                    'svgo-loader',
                ]
            },
        ],
    },

    devServer: {
        compress: true,
        port: 7020,
        devMiddleware: {
            index: true,
            mimeTypes: { phtml: 'text/html' },
            publicPath: '/',
            serverSideRender: true,
            writeToDisk: (filePath) => {
                return /^(?!.*(hot)).*/.test(filePath);
            },
        },
    },
});
