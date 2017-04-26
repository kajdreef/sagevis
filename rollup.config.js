import node from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');

export default {
    entry: pkg['module'],
    sourceMap: true, // for inline use 'inline' and for external use 'true'
    plugins: [
        node({
            module: true,
            jsnext: true,
            extensions: [ '.js', '.json' ],
            preferBuiltins: false
        })
    ],
    targets: [
        {
            dest: pkg['main'],
            format: 'umd',
            moduleName: pkg['name'],
            soureMap: true
        },
        {
            dest: pkg['jsnext:main'],
            format: 'es',
            sourceMap: true
        }
    ]
};
