
import {
  startRestart,
  printArr,
  checkProgress,
  moveDown,
  moveUp,
  moveRight,
  moveLeft,
  getIndexFromNumber,
  insertTwoOrFour,
  getEmptyList,
  makeRandomArr,
} from './logics.js';

let cells = [];
let cellsArr;
let gameScore = 0;
const notMove = false;

const button = document.getElementById('start');
const gameScoreHTML = document.getElementById('game-score');
const fieldCell = document.getElementsByClassName('field-cell');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

button.addEventListener('click', function() {
  cells = startRestart(cells);
  button.innerHTML = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
  printArr(cells, fieldCell);
  gameScore = 0;
  gameScoreHTML.innerHTML = 0;
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
});

document.onkeydown = function(e) {
  e.preventDefault();

  switch (e.key) {
    case 'ArrowLeft':
      cellsArr = moveLeft(cells, gameScore, notMove);
      cells = printArr(cellsArr[0], fieldCell);
      break;
    case 'ArrowRight':
      cellsArr = moveRight(cells, gameScore, notMove);
      cells = printArr(cellsArr[0], fieldCell);
      break;
    case 'ArrowUp':
      cellsArr = moveUp(cells, gameScore, notMove);
      cells = printArr(cellsArr[0], fieldCell);
      break;
    case 'ArrowDown':
      cellsArr = moveDown(cells, gameScore, notMove);
      cells = printArr(cellsArr[0], fieldCell);
      break;
    default:
      break;
  }

  if (!cellsArr[2]) {
    const empty = getEmptyList(cells);

    empty.sort(makeRandomArr);

    const randomNum = empty.pop();
    const coordinates = getIndexFromNumber(randomNum);

    cells = insertTwoOrFour(cells, coordinates[0], coordinates[1]);
    cells = printArr(cells, fieldCell);
    gameScore = cellsArr[1];
    gameScoreHTML.innerHTML = `${gameScore}`;
  }

  if (!cells.flat(Infinity).includes(0) && !checkProgress(cells)) {
    messageLose.classList.remove('hidden');
  }

  if (cells.flat(Infinity).includes(2048)) {
    messageWin.classList.remove('hidden');
  }
};
