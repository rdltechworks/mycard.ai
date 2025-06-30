const esbuild = require('esbuild');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');


esbuild.build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: './dist/app.js',
  format: 'iife',
  target: 'es2020',
  minify: !isWatch,
  sourcemap: isWatch,
  watch: isWatch && {
    onRebuild(error) {
      if (error) console.error('Rebuild failed:', error);
      else console.log('Rebuild succeeded');
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(isWatch ? 'development' : 'production'),
  },
}).then(() => {
    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist', { recursive: true });
    }
    fs.copyFileSync('public/index.html', './dist/index.html');
    fs.copyFileSync('src/styles.css', './dist/styles.css');

    console.log('Build completed successfully');

}).catch(() => process.exit(1));
