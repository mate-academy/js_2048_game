'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

// Write your code here
game.start();

// Selecionar os elementos do DOM (botão, score, campo, mensagens)
const startButton = document.getElementsByClassName('start')[0];
const scoreElement = document.getElementsByClassName('game-score')[0];
const startMessage = document.getElementsByClassName('message-start')[0];
const winMessage = document.getElementsByClassName('message-win')[0];
const loseMessage = document.getElementsByClassName('message-lose')[0];

// Criar uma função para renderizar o campo na tabela HTML
function renderField() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = game.getState()[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell' + (value ? ` field-cell--${value}` : '');
  });
  setTimeout(updateScore, 10);
}

// Atualizar o score na tela
function updateScore() {
  // eslint-disable-next-line no-console
  scoreElement.textContent = game.getScore();
}

// Adicionar evento no botão - chamar start() ou restart()
startButton.addEventListener('click', () => {
  game.restart();
  renderField();
  updateScore();
  startMessage.style.display = 'none';
  winMessage.style.display = 'none';
  loseMessage.style.display = 'none';
  startButton.textContent = 'Restart';
  startButton.classList.add('restart');
  startButton.classList.remove('start');
});

// Adicionar evento teclado - capturar setas e chamar os métodos de movimento
document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return; // Ignore other keys
  }

  renderField();
  updateScore();

  // Mostrar/esconder mensagens conforme o status
  if (game.getStatus() === 'win') {
    winMessage.style.display = 'block';
    loseMessage.style.display = 'none';
  } else if (game.getStatus() === 'lose') {
    winMessage.style.display = 'none';
    loseMessage.style.display = 'block';
  } else {
    winMessage.style.display = 'none';
    loseMessage.style.display = 'none';
  }
});

// Initial render
renderField();
updateScore();
