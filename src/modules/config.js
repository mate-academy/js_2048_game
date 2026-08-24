'use strict';

const BOARD_SIZE = 4;
const WINNING_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

const CELL_VALUES = {
  common: 2,
  rare: 4,
};

const STATUS = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

module.exports = {
  BOARD_SIZE,
  WINNING_VALUE,
  FOUR_PROBABILITY,
  CELL_VALUES,
  STATUS,
};
