'use strict';

const Game = require('../modules/Game.class');
const { gameStatus } = require('../utils/const');

const game = new Game();
const tileContainer = document.querySelector('.tile-container');
const button = document.querySelector('button');
const gameScore = document.querySelector('.game-score');
const [lose, win, start] = [
  ...document.querySelector('.message-container').children,
];

const updateFields = () => {
  if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
    return;
  }

  const tiles = game.getTiles();
  // const board = game.getState();

  tiles.forEach((anim) => {
    const {
      currentPosition,
      newPosition,
      value,
      // type
    } = anim;
    let tile = document.querySelector(
      `.tile[data-row="${currentPosition.row}"][data-col="${currentPosition.col}"]`,
    );

    if (!tile) {
      tile = document.createElement('div');
      tile.classList.add('field-cell', 'tile');
      tile.classList.add(`field-cell--${value}`);
      tile.setAttribute('data-row', newPosition.row);
      tile.setAttribute('data-col', newPosition.col);
      tile.innerText = value;
      tileContainer.appendChild(tile);
    }

    tile.style.transform = `translate(${newPosition.col * 85}px, ${newPosition.row * 85}px)`;
  });
};

// const updateFields = () => {
// if (game.getStatus() === 'lose' || game.getStatus() === 'win') {
//   return;
// }

//   const animations = game.getAnimations();

//   game.board.forEach((row, i) => {
//     row.forEach((cell, j) => {
//       const fieldCell = [...gameField.tBodies[0].rows][i].cells[j];
//       const classes = fieldCell.classList;

//       Array.from(classes).forEach((cls) => {
//         if (cls.startsWith('field-cell--')) {
//           fieldCell.classList.remove(cls);
//         }
//       });

//       if (cell !== 0) {
//         const span = document.createElement('span');

//         if (fieldCell.childNodes.length) {
//           fieldCell.innerHTML = '';
//         }

//         fieldCell.classList.add(`field-cell--${cell}`);

//         span.classList.add('field-cell__number');
//         span.classList.add(`field-cell--${cell}`);
//         span.innerText = cell;
//         fieldCell.appendChild(span);
//       } else {
//         if (fieldCell.childNodes.length) {
//           fieldCell.innerHTML = '';
//         }
//       }
//     });
//   });
// };

// const renderAnimations = () => {
//   const animations = game.getAnimations();

//   animations.forEach((anim) => {
//     const { prev, current, value, type } = anim;
//     let tile = document.querySelector(
//       `.tile[data-row="${prev.row}"][data-col="${prev.col}"]`,
//     );

// if (!tile) {
//   tile = document.createElement('div');
//   tile.classList.add('field-cell', 'tile');
//   tile.classList.add(`tile--${value}`);
//   tile.setAttribute('data-row', current.row);
//   tile.setAttribute('data-col', current.col);
//   tileContainer.appendChild(tile);
// }

//     if (type === 'move') {
//       tile.classList.add('tile-move');
//     } else if (type === 'merge') {
//       tile.classList.add('tile-merge');
//       tile.innerText = value;
//     }

//     tile.addEventListener('transitionend', () => {
//       tile.classList.remove('tile-move');
//       tile.classList.remove('tile-merge');
//       tile.setAttribute('data-row', current.row);
//       tile.setAttribute('data-col', current.col);
//     });
//   });
// };

const checkStatus = () => {
  const currentStatus = game.getStatus();

  gameScore.innerText = game.getScore();

  if (currentStatus === gameStatus.win) {
    win.classList.remove('hidden');
  } else if (currentStatus === gameStatus.lose) {
    lose.classList.remove('hidden');
  }
};

const setControl = (e) => {
  if (e.key === 'ArrowDown') {
    game.moveDown();
    updateFields();
    checkStatus();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    updateFields();
    checkStatus();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    updateFields();
    checkStatus();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    updateFields();
    checkStatus();
  }
};

button.addEventListener('click', (e) => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    start.classList.add('hidden');
    win.classList.add('hidden');
    lose.classList.add('hidden');

    game.start();
    updateFields();
    document.addEventListener('keydown', setControl);
  } else if (button.classList.contains('restart')) {
    button.classList.add('start');
    button.classList.remove('restart');
    button.innerText = 'Start';
    start.classList.remove('hidden');

    game.restart();
    updateFields();
    document.removeEventListener('keydown', setControl);
  }
});
