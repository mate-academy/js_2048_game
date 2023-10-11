'use strict';

const ARROW_UP = 'ArrowUp';
const ARROW_DOWN = 'ArrowDown';
const ARROW_RIGHT = 'ArrowRight';
const ARROW_LEFT = 'ArrowLeft';

const game = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const buttonStart = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const winner = document.querySelector('.message-win');
let scoreCount = 0;
let movePass = false;
let cells = [];
const EMPTY_MATRIX = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let matrix = EMPTY_MATRIX;

buttonStart.addEventListener('click', (e) => {
  messageStart.classList.add('hidden');
  movePass = true;

  if (buttonStart.classList.contains('start')) {
    buttonStart.classList.replace('start', 'restart');
    buttonStart.innerText = 'Restart';

    setRandomCell();
    setRandomCell();
  } else {
    buttonStart.classList.replace('restart', 'start');
    winner.classList.add('hidden');
    buttonStart.innerText = 'Start';
    scoreCount = 0;
    movePass = false;
    cells = [];
    cellsGroup();

    matrix = EMPTY_MATRIX;
  }

  if (movePass) {
    document.addEventListener('keydown', handleInput);
  }

  setDataToTable();
});

function getVelue() {
  return Math.random() > 0.8 ? 4 : 2;
}

function setDataToTable() {
  let data = '<tbody>';

  for (let i = 0; i < matrix.length; i++) {
    data += `<tr class="field-row">`;

    for (let j = 0; j < matrix[i].length; j++) {
      data += `<td class="field-cell
      field-cell--${matrix[i][j]}">${matrix[i][j] || ''}</td>`;
    }
    data += '</tr>';
  }

  data += '</tbody>';
  game.innerHTML = data;
  score.innerText = scoreCount;
}

function cellsGroup() {
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      cells.push({
        x: i,
        y: j,
        isEmpty: true,
      });
    }
  }
}

cellsGroup();

function setRandomCell() {
  const { x, y } = getRandomEmptyCell();

  cells = cells.map(tile => {
    if (tile.x === x && tile.y === y) {
      return ({
        ...tile,
        isEmpty: false,
      });
    }

    return tile;
  });

  matrix[x][y] = getVelue();

  const maxCell = matrix
    .map(function(row) {
      return Math.max.apply(Math, row);
    });

  const maxCellValue = Math.max.apply(null, maxCell);

  if (maxCellValue >= 2048) {
    winner.classList.remove('hidden');
  }
}

function handleInput(events) {
  if (movePass) {
    switch (events.key) {
      case ARROW_UP:
        moveUp();
        break;

      case ARROW_DOWN:
        moveDown();
        break;

      case ARROW_RIGHT:
        moveRigth();
        break;

      case ARROW_LEFT:
        moveLeft();
        break;
    }

    setRandomCell();
    setDataToTable();
  }
}

function groupCellsColum() {
  return cells.reduce((acumCels, cell) => {
    acumCels[cell.y] = acumCels[cell.y] || [];
    acumCels[cell.y][cell.x] = cell;

    return acumCels;
  }, []);
}

function groupCellsRow() {
  return cells.reduce((acumCels, cell) => {
    acumCels[cell.x] = acumCels[cell.x] || [];
    acumCels[cell.x][cell.y] = cell;

    return acumCels;
  }, []);
}

function moveUp() {
  const groupCells = groupCellsColum();

  sliderTile(groupCells);
}

function moveDown() {
  const groupCells = groupCellsColum();

  const groupCellsColumReverse = groupCells
    .map(colum => [...colum].reverse());

  sliderTile(groupCellsColumReverse);
}

function moveLeft() {
  const groupCells = groupCellsRow();

  sliderTile(groupCells);
}

function moveRigth() {
  const groupCells = groupCellsRow();

  const groupCellsRowReverse = groupCells
    .map(row => [...row].reverse());

  sliderTile(groupCellsRowReverse);
}

function sliderTile(groupCell) {
  groupCell.forEach(element => sliderCellsInGroup(element));
}

function getRandomEmptyCell() {
  const emptyCells = cells.filter(({ isEmpty }) => isEmpty);

  if (emptyCells.length) {
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }
}

function sliderCellsInGroup(group) {
  for (let i = 0; i < group.length; i++) {
    if (group[i].isEmpty === true) {
      continue;
    }

    const cellWithVelue = group[i];

    let targetCell;
    let j = i - 1;

    while (j >= 0
          && (group[j].isEmpty === true
          || isEmptyForMerg(group[j], cellWithVelue))) {
      if (isEmptyForMerg(group[j], cellWithVelue)) {
        scoreCount += matrix[cellWithVelue.x][cellWithVelue.y] * 2;
      }

      targetCell = group[j];
      j--;
    }

    const prevValue = matrix[cellWithVelue.x][cellWithVelue.y];

    if (!targetCell) {
      continue;
    }

    matrix[cellWithVelue.x][cellWithVelue.y] = 0;

    replacementIsEmptyValue(cellWithVelue, targetCell);

    matrix[targetCell.x][targetCell.y] += prevValue;

    setDataToTable();
  }
}

function replacementIsEmptyValue(cellWithVelue, targetCell) {
  for (const tile of cells) {
    if (tile.x === targetCell.x && tile.y === targetCell.y) {
      tile.isEmpty = false;
    }

    if (tile.x === cellWithVelue.x && tile.y === cellWithVelue.y) {
      tile.isEmpty = true;
    }
  }
}

function isEmptyForMerg(tile, cellWithVelue) {
  return matrix[tile.x][tile.y] === matrix[cellWithVelue.x][cellWithVelue.y];
}
