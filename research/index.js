'use strict';

const putout = require('putout');
const fs = require('node:fs');
const path = require('node:path');

const file = 'test.js';
const source = fs.readFileSync(path.join(__dirname, file), {encoding:'utf8'});

const res = putout(source, {
    //rulesdir: 'rules',
    plugins: [
         //'remove-unused-variables',
         //'remove-unused-expressions',
         //'remove-unreachable-code',
        // 'remove-nested-blocks'
        //'remove-useless-escape',
        //'convert-apply-to-spread',
        //'convert-arguments-to-rest',
        //'convert-to-arrow-function',
        //'convert-quotes-to-backticks',
        //'math/apply-exponentiation',
        //'math/apply-numeric-separators'

        //['convert-jsfuck', require('./putout-plugins/putout-plugin-convert-jsfuck.js')],
        //['convert-string', require('./putout-plugins/putout-plugin-convert-string.js')],
        //['evaluate-expression', require('./rules/evaluate-expression/lib/evaluate-expression')],
        ['replace-const-assignment', require('./rules/replace-const-assignment/lib/replace-const-assignment')],
    ]
});

console.debug('stop');

fs.writeFileSync(path.join(__dirname, file), res.code, {encoding: 'utf8'});