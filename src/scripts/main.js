'use strict';

import { start, control } from './utils';
import Game from '../modules/Game.class';

const game = new Game();

const button = document.querySelector('.button');
const messages = document.querySelectorAll('.message');
const gameScore = document.querySelector('.game-score');
const dialog = document.querySelector('.dialog');
const restartButton = document.getElementById('restart');
const cancelButton = document.getElementById('restart-cancel');

const args = {
  Game,
  game,
  button,
  messages,
  gameScore,
  dialog,
  restartButton,
  cancelButton,
  controlHandler,
};

function controlHandler(e) {
  return control(e, args);
}

button.addEventListener('click', () => start(args));

document.addEventListener('keydown', controlHandler);
