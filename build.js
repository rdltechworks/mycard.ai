const esbuild = require('esbuild');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

async function build() {
  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Copy static files
  fs.copyFileSync('public/index.html', 'dist/index.html');
  fs.copyFileSync('src/styles.css', 'dist/styles.css');

  const buildOptions = {
    entryPoints: ['src/index.js'],
    bundle: true,
    outfile: 'dist/app.js',
    format: 'iife',
    target: 'es2020',
    minify: !isWatch,
    sourcemap: isWatch,
    loader: { 
      '.js': 'jsx',
      '.jsx': 'jsx'
    },
    define: {
      'process.env.NODE_ENV': isWatch ? '"development"' : '"production"'
    },
    external: [],
  };

  if (isWatch) {
    // Use context for watch mode
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('👀 Watching for changes...');
  } else {
    // Single build
    await esbuild.build(buildOptions);
    console.log('✅ Build complete');
  }
}

build().catch(() => process.exit(1));