var NwBuilder = require('nw-builder');
var nw = new NwBuilder({
    files: './src/**/**', // use the glob format
    platforms: ['osx64', 'win32', 'win64'],
    version: '0.23.6',
	winIco:"./src/favicon.ico",
	cacheDir:"./cache"
});

//Log stuff you want

nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});