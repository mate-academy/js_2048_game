'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreDisplay = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function updateCell(r, c, value) {
  const cell = gameField.rows[r].cells[c];
  cell.className = "field-cell";
  if (value) {
    cell.classList.add(`field-cell--${value}`);
    cell.textContent = value;
  } else {
    cell.textContent = "";
  }
}

function updateUI() {
  scoreDisplay.textContent = game.getScore();
  const board = game.getState();

  board.forEach((row, r) => row.forEach((value, c) => updateCell(r, c, value)));

  winMessage.classList.toggle("hidden", game.getStatus() !== "win");
  loseMessage.classList.toggle("hidden", game.getStatus() !== "lose");

}

function handleMove(eventKey) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moveMap = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const moveMade = moveMap[eventKey] && moveMap[eventKey]();
  if (moveMade) updateUI();
}

function startGame() {
  if (
    game.getStatus() === 'idle' ||
    game.getStatus() === 'lose' ||
    game.getStatus() === 'win'
  ) {
    game.start();
    startMessage.classList.add('hidden');
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else {
    game.restart();
  }

  updateUI();
}

document.addEventListener('keydown', (e) => handleMove(e.key));
startButton.addEventListener('click', startGame);

updateUI();
