'use strict';

import Game from '../modules/Game.class';
import { BoardView } from './components/BoardView';
import { ScoreView } from './components/ScoreView';
import { MessageView } from './components/MessageView';
import { StartButton } from './components/StartButton';
import { KeyboardControls } from './components/KeyboardControls';

const game = new Game();

const render = () => {
  ui.board.render(game.getState());
  ui.score.render(game.getScore());
  ui.message.render(game.getStatus());
};

const moves = {
  left: () => game.moveLeft(),
  right: () => game.moveRight(),
  up: () => game.moveUp(),
  down: () => game.moveDown(),
};

const ui = {
  board: new BoardView(document.querySelector('.game-field')),
  score: new ScoreView(document.querySelector('.game-score')),
  message: new MessageView(document.querySelector('.message-container')),

  button: new StartButton(document.querySelector('.button'), {
    onStart: () => {
      game.start();
      render();
    },
    onRestart: () => {
      game.restart();
      render();
    },
  }),

  keyboard: new KeyboardControls((direction) => {
    moves[direction]();
    render();
  }),
};

render();
