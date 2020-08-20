'use strict';

const WIN_NUMBER = 2048;
const MAIN_CLASS_CELL = 'field-cell';

const TURN_GRID = {
  LEFT: {
    FIRST: 3,
    SECOND: 1,
  },
  RIGHT: {
    FIRST: 1,
    SECOND: 3,
  },
  UP: {
    FIRST: 2,
    SECOND: 2,
  },
  DOWN: {
    FIRST: 0,
    SECOND: 0,
  },
};

module.exports = {
  WIN_NUMBER,
  MAIN_CLASS_CELL,
  TURN_GRID,
};
