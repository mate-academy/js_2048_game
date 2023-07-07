'use strict';

// import { Grid } from './Grid.js';
// import { Tile } from './Tile.js';

// const gameBoard = document.getElementById('game-field');

// const grid = new Grid(gameBoard);

// const startButton = document.getElementById('button-start');

// startButton.addEventListener('click', startGame);

// let score = 0;
// const scoreElement = document.getElementById('score');

// function startGame() {
//   setuptNewGame();

//   document.getElementById('message-start').classList.add('hidden');

//   startButton.classList.remove('start');
//   startButton.innerHTML = 'Restart';
//   startButton.classList.add('restart');

//   startButton.removeEventListener('click', startGame);
//   startButton.addEventListener('click', setuptNewGame);
// }

// function setuptNewGame() {
//   grid.cells.forEach(cell => {
//     if (!cell.isEmpty()) {
//       cell.linkedTile.removeFromDOM();
//       cell.unlinkTile();
//     }
//   });

//   grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
//   grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
//   setupInputOnce();

//   score = 0;
//   scoreElement.innerHTML = score;

//   document.getElementById('message-lose').classList.add('hidden');
//   document.getElementById('message-win').classList.add('hidden');
// }

// function setupInputOnce() {
//   window.addEventListener('keydown', handleInput, { once: true });
// }

// function handleInput(event) {
//   switch (event.key) {
//     case 'ArrowUp':
//       if (!canMoveUp()) {
//         setupInputOnce();

//         return;
//       }
//       moveUp();
//       break;

//     case 'ArrowDown':
//       if (!canMoveDown()) {
//         setupInputOnce();

//         return;
//       }
//       moveDown();
//       break;

//     case 'ArrowLeft':
//       if (!canMoveLeft()) {
//         setupInputOnce();

//         return;
//       }
//       moveLeft();
//       break;

//     case 'ArrowRight':
//       if (!canMoveRight()) {
//         setupInputOnce();

//         return;
//       }
//       moveRight();
//       break;

//     default:
//       setupInputOnce();

//       return;
//   }

//   const newTile = new Tile(gameBoard);

//   grid.getRandomEmptyCell().linkTile(newTile);

//   if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
//     document.getElementById('message-lose').classList.remove('hidden');

//     return;
//   }

//   setupInputOnce();
// }

// function moveUp() {
//   slideTiles(grid.cellsGroupedByColumn);
// }

// function moveDown() {
//   slideTiles(grid.cellsGroupedByReversedColumn);
// }

// function moveLeft() {
//   slideTiles(grid.cellsGroupedByRow);
// }

// function moveRight() {
//   slideTiles(grid.cellsGroupedByReversedRow);
// }

// function slideTiles(groupedCells) {
//   groupedCells.forEach(group => slideTilesInGroup(group));

//   grid.cells.forEach(cell => {
//     if (cell.hasTileForMerge()) {
//       cell.mergeTiles();
//       score += cell.getValue();
//       scoreElement.innerHTML = score;

//       if (cell.getValue() === 2048) {
//         document.getElementById('message-win').classList.remove('hidden');
//       }
//     }
//   });
// }

// function slideTilesInGroup(group) {
//   for (let i = 1; i < group.length; i++) {
//     if (group[i].isEmpty()) {
//       continue;
//     }

//     const cellWithTile = group[i];

//     let targetCell;
//     let j = i - 1;

//     while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
//       targetCell = group[j];
//       j--;
//     }

//     if (!targetCell) {
//       continue;
//     }

//     if (targetCell.isEmpty()) {
//       targetCell.linkTile(cellWithTile.linkedTile);
//     } else {
//       targetCell.linkTileForMerge(cellWithTile.linkedTile);
//     }

//     cellWithTile.unlinkTile();
//   }
// }

// function canMoveUp() {
//   return canMove(grid.cellsGroupedByColumn);
// }

// function canMoveDown() {
//   return canMove(grid.cellsGroupedByReversedColumn);
// }

// function canMoveLeft() {
//   return canMove(grid.cellsGroupedByRow);
// }

// function canMoveRight() {
//   return canMove(grid.cellsGroupedByReversedRow);
// }

// function canMove(groupCells) {
//   return groupCells.some(group => canMoveInGroup(group));
// }

// function canMoveInGroup(group) {
//   return group.some((cell, index) => {
//     if (index === 0) {
//       return false;
//     }

//     if (cell.isEmpty()) {
//       return false;
//     }

//     const targetCell = group[index - 1];

//     return targetCell.canAccept(cell.linkedTile);
//   });
// }
