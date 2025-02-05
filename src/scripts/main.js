'use strict';
import Game from '../modules/Game.class';

const game = new Game();

const startButton = document.querySelector('.button.start');
const restartButton = document.querySelector('.button.restart');
const scoreDisplay = document.querySelector('.game-score');
const gameField = document.querySelector('.game-field');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

function updateUI() {
  scoreDisplay.textContent = game.getScore();

  const board = game.getState();

  gameField.querySelectorAll('.field-cell').forEach((cell) => {
    cell.className = 'field-cell';
    cell.textContent = '';
  });

  board.forEach((row, r) => {
    row.forEach((value, c) => {
      if (value) {
        const cell = gameField.rows[r].cells[c];

        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    });
  });

  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');
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

  if (moveMap[eventKey]?.()) {
    updateUI();
  }
}

function startGame() {
  if (game.getStatus() === 'idle') {
    game.start();
    startMessage.classList.add('hidden');
    startButton.textContent = 'Restart';
  } else {
    game.restart();
    startButton.textContent = 'Start';
    startMessage.classList.remove('hidden');
  }
  updateUI();
}

// 🚀 Restart Button Click Event
function restartGame() {
  game.restart();
  updateUI();
}

document.addEventListener('keydown', (e) => handleMove(e.key));
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame); // Add event listener

updateUI();
