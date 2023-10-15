'use strict';

const Grid = require('./Grid'); // я не можу тут використовувати імпорт
const Tile = require('./Tile');

const gameField = document.getElementsByClassName('game-field');

const grid = new Grid(gameField);

grid.randomEmptyCell().tile = new Tile(gameField);
grid.randomEmptyCell().tile = new Tile(gameField);
