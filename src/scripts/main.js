import * as BoardModule from './modules/board.js';
// import * as GameControlModule from './modules/gameControl.js';
import * as GameStateModule from './modules/gameState.js';
import * as InputHandler from './modules/inputHandler.js';
import * as UIManager from './modules/UIManager.js';

const startButton = document.querySelector('.start');

document.addEventListener('DOMContentLoaded', function() {
  BoardModule.initializeBoard();
  InputHandler.listenForKeyboardEvents();
});

UIManager.updateStartButton(startButton);
InputHandler.listenForKeyboardEvents();

GameStateModule.setGameStarted(false);
