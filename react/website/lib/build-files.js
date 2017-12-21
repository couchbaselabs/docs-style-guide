/* babel-register is used to compile all required JavaScript on the fly. It means we can start the program with node instead of babel-node. */
require('babel-register')({
  babelrc: false,
  presets: ['react', 'env'],
});

const generate = require('./server/generate');
generate();
console.log("Site built successfully. Generated files in 'build' folder.");