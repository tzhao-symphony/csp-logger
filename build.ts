import * as esbuild from 'esbuild'
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2), {
    boolean: ['watch', 'isDev']
});

console.log(argv)

const isWatch = argv.watch;
const isDev = argv.isDev;

const context = await esbuild.context({
    entryPoints: ['index.ts'],
    bundle: true,
    minify: !isDev,
    platform: "node",
    format: 'cjs',
    outdir: 'dist',
    outExtension: {'.js':'.cjs'}
});

if (isWatch) {
    context.watch();
} else {
    await context.rebuild();
    await context.dispose();
}


