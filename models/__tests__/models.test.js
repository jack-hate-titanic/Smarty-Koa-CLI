'use strict';

const models = require('..');
const assert = require('assert').strict;

assert.strictEqual(models(), 'Hello from models');
console.info("models tests passed");
