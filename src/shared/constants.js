const ACTIONS = {
  // TODO?: find a key-value data structure that can only have unique VALUES
  MOVE_LEFT: 1,
  MOVE_RIGHT: 2,
  MOVE_UP: 3,
  MOVE_DOWN: 4,
};

const STATUSES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
};

module.exports = { ACTIONS, STATUSES };
