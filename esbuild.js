import esbuild from 'esbuild'

esbuild.build({
    entryPoints: ['index.js'], // Entry point to your project
    bundle: true, // Bundle the whole project
    outfile: 'dist/bundle.js', // Output bundle file
    format: 'esm', // Output as an ES module (so you can import it)
    platform: 'browser', // Ensure it's bundled for browser usage
    define: {
      'process.env.KNACK_API_RUNENV': '"browser"', // Set your environment
    },
    globalName: 'knackApi', // Expose the knackApi object globally if needed
    target: ['es2020'], // Optional: Specify the target environment
    sourcemap: true, // Optional: Generate sourcemaps
    minify: false // Optional: You can minify if needed
  }).catch(() => process.exit(1));