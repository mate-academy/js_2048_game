'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const rows = document.querySelectorAll('tr');
const cells = document.querySelectorAll('.field-cell')
const button = document.querySelector('button');

console.log(game.getStatus())

// const arr1 = [
//     [12, 8, 4, 0],
//     [13, 9, 5, 1],
//     [14, 10, 6, 2],
//     [15, 11, 7, 3]
// ];

// const arr2 = [
//     [0, 0, 2, 2],
//     [4, 4, 2, 2],
//     [16, 16, 8, 4],
//     [0, 0, 0, 0]
// ];

// const arr3 = [16, 16, 8, 4];

// console.log(game.moveStateUp(arr2))

// console.log(arr1)

// function rotateState(arr) {
//     const result = [];

//     for (let y = 0; y < 4; y++) {
//         result[y] = [];

//         for (let x = 3; x >= 0; x--) {
//             result[y].push(arr[x][y]);
//         }
//     }

//     return result;
// }

// function rotateStateBack(arr) {
//     const result = [];

//     for (let y = 0; y < 4; y++) {
//         result[y] = [];

//         for (let x = 0; x < 4; x++) {
//             result[y].push(arr[x][y]);
//         }
//     }

//     return result.reverse();
// }

// console.log(rotateState(arr1));
// console.log(rotateStateBack(arr1));

document.addEventListener('keydown', (e) => {
  console.log(game.getStatus())
  console.log(game.canCombineCells())
  console.log(game.hasEmptyCell())
  if (game.getStatus() === 'playing') {
    switch (e.key) {
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

    updateState();
  }
  });

function updateState() {
  const state = game.getState();
  let i = 0;

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      const cell = cells[i];

      cell.className = 'field-cell';

      if (state[x][y] !== 0) {
        cell.textContent = state[x][y];
        cell.classList.add(`field-cell--${state[x][y]}`);
      } else {
        cell.textContent = '';
      }

      i++;
    }
  }

  document.querySelector('.game-score').textContent = game.getScore();

  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  if (button.className === 'button restart') {
    game.restart();
  }
  game.start();
  console.log(game.getStatus())

  button.textContent = 'Restart';
  button.className = 'button restart';

  document.querySelector('.message-start').classList.add('hidden');

  updateState();
});

