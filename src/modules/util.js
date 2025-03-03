const DEFAULT_INITIAL_STATE = Array.from({ length: 4 }, () => Array(4).fill(0));
const GAME_STATUS = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

const MOVE = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

const showElement = (cssName) =>
  document.querySelector(cssName).classList.remove('hidden');

const hideElement = (cssName) =>
  document.querySelector(cssName).classList.add('hidden');

const makeDeepClone = (data) => JSON.parse(JSON.stringify(data));

module.exports = {
  DEFAULT_INITIAL_STATE,
  GAME_STATUS,
  MOVE,
  showElement,
  hideElement,
  makeDeepClone,
};
