/* eslint-disable */
'use strict';

const Game2048 = require('./classes/Game2048');
const Cell = require('./classes/Cell');

const testGame = new Game2048('.app', 8);

testGame._initGame();

console.log(testGame._field);
