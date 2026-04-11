'use strict';

import { Game } from './models/Game.js';
import { BoardView } from './view/BoardView.js';
import { Controller } from './controller/GameController.js';
import { GAME_STATUS } from './constants.js';

// DOM Elements
const table = document.querySelector('.game-field');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.button.start');
const messages = {
  [GAME_STATUS.LOST]: document.querySelector('.message-lose'),
  [GAME_STATUS.WON]: document.querySelector('.message-win'),
  [GAME_STATUS.IDLE]: document.querySelector('.message-start'),
};

// Initialization
const game = new Game();
const view = new BoardView(table, scoreEl, messages);
const controller = new Controller(game, view, startBtn);

controller.init();
