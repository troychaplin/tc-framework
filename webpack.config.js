/**
 * Webpack Config
 */
const path = require("path");
const {resolve} = require("path");
require("dotenv").config();
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
    entry: {
        scripts: "./src/js/scripts.js",
    },
    output: {
        filename: "js/[name].js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "css/[name].css",
                        },
                    },
                    {
                        loader: "extract-loader",
                    },
                    {
                        loader: "css-loader?-url",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.svg(\?.*)?$/, // match img.svg and img.svg?param=value
                use: [
                    "url-loader", // or file-loader or svg-url-loader
                    "svg-transform-loader",
                ],
            },
        ],
    },
    plugins: [
        new CompressionPlugin({
            test: /\.(js|css)(\?.*)?$/i,
            algorithm: "gzip", // not required, used here to identify what test is doing
        }),
        new copyWebpackPlugin({
            patterns: [
                {from: "./src/favicon", to: "../dist/favicon"},
                {from: "./src/svg", to: "../dist/svg"},
            ],
        }),
        new FileManagerPlugin({
            events: {
                onStart: {
                    delete: ["./release"],
                },
                onEnd: {
                    copy: [
                        {
                            source: "./_examples",
                            destination: "./release/_examples",
                        },
                        {
                            source: "./asides",
                            destination: "./release/asides",
                        },
                        {
                            source: "./blocks",
                            destination: "./release/blocks",
                        },
                        {
                            source: "./components",
                            destination: "./release/components",
                        },
                        {
                            source: "./dist",
                            destination: "./release/dist",
                        },
                        {
                            source: "./*.php",
                            destination: "./release",
                        },
                    ],
                },
            }
        }),
        new BrowserSyncPlugin({
            host: "localhost",
            port: 3000,
            proxy: "https://tcframework:8890",
            files: [
                "*.php",
                "_examples/*",
                "asides/**/*",
                "blocks/**/*",
                "components/**/*",
                "dist/**/*",
            ],
            watchOptions: {
                ignoreInitial: true,
                ignored: "dist/svg/*.svg",
            },
            notify: false,
        }),
    ],
};
