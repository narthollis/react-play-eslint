import path from 'path';
import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import createStyledComponentsTransformer from 'typescript-plugin-styled-components';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

delete process.env.TS_NODE_PROJECT;

const styledComponentsTransformer = createStyledComponentsTransformer();

const config: webpack.Configuration & webpackDevServer.Configuration = {
    mode: 'production',
    entry: 'src/',
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true,
                    getCustomTransformers: (): unknown => ({ before: [styledComponentsTransformer] }),
                },
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {},
                    },
                    'css-loader',
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
        plugins: [
            new TsconfigPathsPlugin({
                configFile: path.resolve(__dirname, './tsconfig.json'),
                extensions: ['.ts', '.tsx', '.js'],
            }),
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Play',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            tsconfig: path.resolve(__dirname, './tsconfig.json'),
            eslint: true,
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
    devtool: 'eval-source-map',
    devServer: {
        historyApiFallback: {
            disableDotRule: true,
        },
    },
};

export default config;
