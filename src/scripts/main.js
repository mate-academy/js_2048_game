import { createBox } from './box';
import { handleInput } from './move';

const GRID = 4;
const COUNT_GRID = GRID * GRID;
let matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
let score = 0;
let addScore = 0;
let winner = false;
let loserGame = false;

const gameField = document.querySelector('.game-field');
const gameStart = document.getElementById('start');
const gameScore = document.getElementById('gameScore');

const win = document.querySelector('.message-win');
const lose = document.querySelector('.message-lose');
const start = document.querySelector('.message-start');

gameScore.textContent = score;

gameStart.onclick = function startGame() {
  gameStart.classList.remove('start');
  gameStart.classList.add('restart');
  gameStart.textContent = 'Restart';
  win.classList.add('hidden');
  lose.classList.add('hidden');
  start.classList.remove('hidden');
  start.textContent = 'Press "Restart" to play new game. Good luck!';
  score = 0;
  addScore = 0;
  winner = false;
  loserGame = false;
  gameScore.textContent = score;

  matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  gameField.innerHTML = '';

  for (let i = 0; i < COUNT_GRID; i++) {
    const cell = document.createElement('div');

    cell.classList.add('field-cell');
    cell.classList.add(`field-cell--pos--${i}`);
    gameField.append(cell);
  }

  createBox();
  createBox();

  setupInputOnce();
};

for (let i = 0; i < COUNT_GRID; i++) {
  const cell = document.createElement('div');

  cell.classList.add('field-cell');
  cell.classList.add(`field-cell--pos--${i}`);
  gameField.append(cell);
}

export function getEmptyMatrixCoordinates() {
  return matrix.reduce((emptyCoordinates, line, x) => {
    line.forEach((elem, y) => {
      if (!elem) {
        emptyCoordinates.push({
          x, y,
        });
      }
    });

    return emptyCoordinates;
  }, []);
}

export function setBoxToMatrix(box) {
  console.log(box.position);

  const x = box.position.x ? box.position.x : 0;
  const y = box.position.y ? box.position.y : 0;
  // const { x, y } = box.position;

  if (x !== undefined && y !== undefined) {
    matrix[x][y] = box;
  };
}

export function delFromMatrix(box) {
  const { x, y } = box.position;

  matrix[x][y] = 0;
}

export function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

export default function getMatrix() {
  return matrix;
}

export function getScore() {
  return score;
}

export function getAddScore() {
  return addScore;
}

export function setAddScore(newScore) {
  addScore += newScore;
}

export function resetAddScore(newScore) {
  addScore = 0;
}

export function setScore(newScore) {
  score = newScore;
  gameScore.textContent = score;
}

export function changeScore(plusScore) {
  const plusPoint = document.createElement('div');

  plusPoint.classList.add('fly');
  plusPoint.innerHTML = '+ ' + plusScore;
  gameScore.append(plusPoint);

  setTimeout(() => {
    plusPoint.remove();
  }, 500);
}

export function winGame() {
  win.classList.remove('hidden');
  start.classList.add('hidden');
  winner = true;
}

export function loseGame() {
  lose.classList.remove('hidden');
  start.classList.add('hidden');
  loserGame = true;
}

export function getWinner() {
  return winner;
}

export function getLoser() {
  return loserGame;
}

export function checkNextMove() {
  const gameOver = !matrix.some((line, y) => {
    return line.some((box, x) => {
      const leftBox = matrix[y] ? matrix[y][x - 1] : undefined;
      const rightBox = matrix[y] ? matrix[y][x + 1] : undefined;
      const upBox = matrix[y - 1] ? matrix[y - 1][x] : undefined;
      const downBox = matrix[y + 1] ? matrix[y + 1][x] : undefined;

      if (leftBox || rightBox || upBox || downBox) {
        const canMoved = [leftBox, rightBox, upBox, downBox].some((elem) => {
          if (elem !== undefined) {
            return elem.value === box.value;
          } else {
            return false;
          }
        });

        return canMoved;
      } else {
        return false;
      }
    });
  });

  return gameOver;
}
