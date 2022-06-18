const mix = require("laravel-mix");
const glob = require("glob");
const path = require("path");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.js('resources/js/app.js', 'public/js').postCss('resources/css/app.css', 'public/css', [
//     require('postcss-import'),
//     require('tailwindcss'),
//     require('autoprefixer'),
// ]);

// scssがあるディレクトリを指定
const scss = path.resolve(__dirname, "resources/sass/*.scss");

glob.sync(scss).map(function (file) {
    mix.sass(file, "public/css").options({
        processCssUrls: false,
        postCss: [],
        autoprefixer: {
            options: {
                browsers: ["last 2 versions"],
                cascade: false,
            },
        },
    });
});

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.scss/,
                loader: "import-glob-loader",
            },
        ],
    },
    resolve: {
        modules: [path.resolve("./resources/"), "node_modules"],
    },
});

// npm run prodのときはversionを指定
if (mix.inProduction()) {
    mix.version();
}
