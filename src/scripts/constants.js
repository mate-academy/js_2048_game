const WIN_VALUE = 2048;

const STATUS = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

const DIRECTION = {
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',

  isAxisX(direction) {
    return direction === this.left || this.right;
  },

  // left and up direction moves will be implemented by default
  // right and down directions will be: (1) reversed (2) moved (3) reversed back
  isReverseDirection(direction) {
    return direction === this.right || this.down;
  },
};

const INITIAL_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

const WIN_STATE_TEST = [
  [0, 2, 4, 8],
  [16, 32, 64, 128],
  [256, 512, 1024, 1024],
  [0, 2, 4, 8],
];

const LOSE_STATE_TEST = [
  [16, 32, 64, 128],
  [128, 512, 256, 16],
  [16, 32, 64, 128],
  [512, 0, 0, 0],
];

const PROBABILITY_FOR_FOUR = 0.1;

const FIELD_SIZE = 4;

export default {
  WIN_VALUE,
  STATUS,
  DIRECTION,
  INITIAL_STATE,
  PROBABILITY_FOR_FOUR,
  FIELD_SIZE,
  WIN_STATE_TEST,
  LOSE_STATE_TEST,
};
