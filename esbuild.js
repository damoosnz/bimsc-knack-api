import esbuild from 'esbuild'

// Run the esbuild process
esbuild.build({
  entryPoints: ['index.js'], // Your entry file
  bundle: true, // Bundle the whole project
  outfile: 'dist/bundle.js', // Output file
  minify: true, // Optional: Minify the output
  sourcemap: true, // Optional: Generate sourcemaps
  target: ['es2020'], // Optional: Specify the target environment
  platform: 'browser', // Target the browser environment
}).catch(() => process.exit(1)); // Exit with error if build fails
