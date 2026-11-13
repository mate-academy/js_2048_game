'use strict';
import Game from '../modules/Game.class.js';

const game = new Game();

document.addEventListener('keydown', (event) => {
  //слухати подію keydown перевіряти event.key і викликати відповідний метод екземпляра
  console.log('event', event.key);
  switch (event.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
  }

  const cell = document.querySelector('.field-cell');
  cell.classList.add('field-cell--2');

  // function renderBoard() {
  //   const state = game.getState();
  //   const cells = document.querySelectorAll('.field-cell');
  //   state.forEach((row, rowIndex) => {
  //     row.forEach((value, columnIndex) => {
  //       const cellIndex = rowIndex * 4 + columnIndex;
  //       const cell = cells[cellIndex];
  //       cell.textContent = value === 0 ? '' : value;
  //       cell.className = 'field-cell';
  //       if (value !== 0) {
  //         cell.classList.add(`field-cell--${value}`);
  //       }
  //     });
  //   });
  // }
});

export default Game;
