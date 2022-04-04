// 'use strict';

// class Game {
//   static fieldOfGame = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ];

// // if a field is not square we should use two variables for its sizes
//   static fieldSize = Game.fieldOfGame.length;
//   static movable = false;
//   static countMovedCells = 0;
//   static numberOfMergeableCells = 0;
//   static currentScore = 0;

//   static startMessage = document.querySelector('.message-start');
//   static winMessage = document.querySelector('.message-win');
//   static loseMessage = document.querySelector('.message-lose');
//   static fieldRows = document.querySelector('.game-field').rows;
//   static scoreboard = document.querySelector('.game-score');

//   static findEmptyCells() {
//       const cellsArray = [];

//       for (let i = 0; i < Game.fieldSize; i++) {
//         for (let j = 0; j < Game.fieldSize; j++) {
//           if (Game.fieldOfGame[i][j] === 0) {
//             cellsArray.push(`${i}${j}`);
//           }
//         }
//       }

//       if (cellsArray.length === 0) {
//         Game.movable = false;
//       } else {
//         Game.movable = true;
//       }

//       return cellsArray;
//     }

//   static defineCreatingCellValue() {
//     const isFour = parseInt(Math.random() * 10) + 1;
//     if (isFour === 4) {
//       return 4;
//     } else {
//       return 2;
//     }
//   }

//   static findCoordsForNewCell() {
//     const emptyCellsArray = Game.findEmptyCells();

//     const cellForCreationNumber
//       = parseInt(Math.random() * emptyCellsArray.length);

//     return emptyCellsArray[cellForCreationNumber].split('');
//   }

//   static createCell() {
//     const cellCoords = Game.findCoordsForNewCell();

//     Game.fieldOfGame[+cellCoords[0]][+cellCoords[1]]
//       = Game.defineCreatingCellValue();
//   }

//   static startGame() {
//     Game.countMovedCells = 0;
//     Game.currentScore = 0;

//     Game.clearCells();
//     Game.createCell();
//     Game.createCell();

//     Game.render('start', 'start');

//     document.addEventListener('keydown', Game.handleArrowPress);
//   }

//   static clearCells() {
//     for (let i = 0; i < Game.fieldSize; i++) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         Game.fieldOfGame[i][j] = 0;
//       }
//     }
//   }

//   static changeCellClass(cell, cellNewValue) {
//     if (cell.classList.contains(`field-cell--${cell.innerText}`)) {
//       cell.classList.remove(`field-cell--${cell.innerText}`);
//     }

//     if (cellNewValue !== 0) {
//       cell.classList.add(`field-cell--${cellNewValue}`);
//     }
//   }

//   static renderfieldOfGame() {
//     for (let i = 0; i < Game.fieldSize; i++) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         if (Game.fieldOfGame[i][j] !== 0) {
//           Game.changeCellClass(Game.fieldRows[i].cells[j],
//              Game.fieldOfGame[i][j]);
//           Game.fieldRows[i].cells[j].innerText = Game.fieldOfGame[i][j];
//         } else {
//           Game.changeCellClass(Game.fieldRows[i].cells[j],
//            Game.fieldOfGame[i][j]);
//           Game.fieldRows[i].cells[j].innerText = '';
//         }
//       }
//     }
//   }

//   static renderMesage(currentMesage) {
//     switch (currentMesage) {
//       case 'win':
//         Game.winMessage.classList.remove('hidden');
//         break;

//       case 'lose':
//         Game.loseMessage.classList.remove('hidden');
//         break;

//       case 'prepareForStart':
//         Game.winMessage.classList.add('hidden');
//         Game.loseMessage.classList.add('hidden');
//         Game.startMessage.classList.remove('hidden');
//         break;

//       case 'start':
//         Game.startMessage.classList.add('hidden');
//         Game.winMessage.classList.add('hidden');
//         Game.loseMessage.classList.add('hidden');
//     }
//   }

//   static renderButton(buttonType) {
//     const startButton = document.querySelector('.start');

//     switch (buttonType) {
//       case 'prepareForStart':
//         startButton.addEventListener('click', () => Game.startGame());

//         startButton.classList.add('start');
//         startButton.innerText = 'Start';

//         break;

//       case 'start':
//         if (startButton) {
//           startButton.classList.add('restart');
//           startButton.innerText = 'Restart';
//         }

//         break;
//     }
//   }

//   static render(message, button) {
//     Game.renderfieldOfGame();
//     Game.scoreboard.innerText = Game.currentScore;
//     Game.renderMesage(message);
//     Game.renderButton(button);
//   }

//   static createMatrixClone() {
//     const matrixClone = [
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//       [0, 0, 0, 0],
//     ];

//     for (let i = 0; i < Game.fieldSize; i++) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         matrixClone[i][j] = Game.fieldOfGame[i][j];
//       }
//     }

//     return matrixClone;
//   }

//   static getTargetValue(fieldTemp, rotationDirection, row, column) {
//     let targetValue;

//     switch (rotationDirection) {
//       case 'left':
//         targetValue = fieldTemp[column][Game.fieldSize - row - 1];
//         break;

//       case 'right':
//         targetValue = fieldTemp[Game.fieldSize - column - 1][row];
//         break;

//       case 'down':
//         targetValue = fieldTemp[Game.fieldSize - row - 1][column];
//         break;
//     }

//     return targetValue;
//   }

//   static rotateMatrix(direction) {
//     const tempField = Game.createMatrixClone(Game.fieldOfGame);

//     for (let i = 0; i < Game.fieldSize; i++) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         Game.fieldOfGame[i][j]
//            = Game.getTargetValue(tempField, direction, i, j);
//       }
//     }
//   }

//   static moveCells() {
//     for (let i = Game.fieldSize - 1; i > 0; i--) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         if (Game.fieldOfGame[i - 1][j] === 0
//             && Game.fieldOfGame[i][j] !== 0) {
//           Game.fieldOfGame[i - 1][j] = Game.fieldOfGame[i][j];
//           Game.fieldOfGame[i][j] = 0;
//           Game.countMovedCells++;
//         }
//       }
//     }
//   }

//   static mergeCells() {
//     for (let i = 0; i < Game.fieldSize - 1; i++) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         if (Game.fieldOfGame[i][j] === Game.fieldOfGame[i + 1][j]
//             && Game.fieldOfGame[i][j] !== 0) {
//           Game.fieldOfGame[i][j] = Game.fieldOfGame[i + 1][j] * 2;
//           Game.fieldOfGame[i + 1][j] = 0;
//           Game.currentScore += Game.fieldOfGame[i][j];
//           Game.countMovedCells++;
//         }
//       }
//     }
//   }

//   static makeChanges() {
//     for (let i = 0; i < Game.fieldSize - 1; i++) {
//       Game.moveCells();
//     }

//     Game.mergeCells();

//     for (let i = 0; i < Game.fieldSize - 1; i++) {
//       Game.moveCells();
//     }
//   }

//   static findCellsForMerge() {
//     for (let i = 0; i < Game.fieldSize - 1; i++) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         if (Game.fieldOfGame !== 0) {
//           if (Game.fieldOfGame[i][j] === Game.fieldOfGame[i + 1][j]) {
//             Game.numberOfMergeableCells++;

//             return;
//           }
//         }
//       }
//     }

//     for (let i = 0; i < Game.fieldSize; i++) {
//       for (let j = 0; j < Game.fieldSize - 1; j++) {
//         if (Game.fieldOfGame !== 0) {
//           if (Game.fieldOfGame[i][j] === Game.fieldOfGame[i][j + 1]) {
//             Game.numberOfMergeableCells++;

//             return;
//           }
//         }
//       }
//     }
//   }

//   static checkWinScenario() {
//     for (let i = 0; i < Game.fieldSize; i++) {
//       for (let j = 0; j < Game.fieldSize; j++) {
//         if (Game.fieldOfGame[i][j] === 2048) {
//           return true;
//         }
//       }
//     }
//   }

//   static checkLoseScenario() {
//     if (!Game.movable && Game.numberOfMergeableCells === 0) {
//       return true;
//     }
//   }

//   static prepareForNewRound() {
//     document.addEventListener('keydown', Game.handleArrowPress);
//     Game.countMovedCells = 0;
//     Game.movable = false;
//     Game.numberOfMergeableCells = 0;

//     Game.render('start', 'start');
//   }

//   static finishRound() {
//     if (Game.countMovedCells === 0) {
//       return;
//     }

//     document.removeEventListener('keydown', Game.handleArrowPress);

//     if (Game.checkWinScenario()) {
//       Game.render('start', 'start');

//       setTimeout(() => {
//         Game.finishGame('win');
//       }, 1000);

//       return;
//     }

//     setTimeout(Game.createCell, 200);

//     setTimeout(() => {
//       Game.findEmptyCells();
//       Game.findCellsForMerge();

//       if (Game.checkLoseScenario()) {
//         Game.render('start', 'start');
//         Game.finishGame('lose');

//         return;
//       }

//       Game.prepareForNewRound();
//     }, 300);
//   }

//   static finishGame(gameResult) {
//     document.removeEventListener('keydown', Game.handleArrowPress);

//     Game.clearCells();

//     Game.currentScore = 0;

//     if (gameResult === 'win') {
//       Game.render('win', 'start');
//     } else {
//       Game.loseMessage.classList.remove('hidden');
//     }
//   }

//   static handleArrowPress(e) {
//     e.preventDefault();

//     switch (e.code) {
//       case 'ArrowUp':
//         Game.makeChanges();
//         Game.finishRound();
//         break;

//       case 'ArrowDown':
//         Game.rotateMatrix('down');
//         Game.makeChanges();
//         Game.rotateMatrix('down');
//         Game.finishRound();
//         break;

//       case 'ArrowLeft':
//         Game.rotateMatrix('right');
//         Game.makeChanges();
//         Game.rotateMatrix('left');
//         Game.finishRound();
//         break;

//       case 'ArrowRight':
//         Game.rotateMatrix('left');
//         Game.makeChanges();
//         Game.rotateMatrix('right');
//         Game.finishRound();
//         break;
//     }
//   }
// }

// Game.render('prepareForStart', 'prepareForStart');
