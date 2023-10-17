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
const lose = document.querySelector('.message-lose');
let scoreCount = 0;
let cells = [];

let matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

buttonStart.addEventListener('click', (e) => {
  messageStart.classList.add('hidden');
  lose.classList.add('hidden');

  if (buttonStart.classList.contains('start')) {
    buttonStart.classList.replace('start', 'restart');
    buttonStart.innerText = 'Restart';

    winner.classList.add('hidden');
  }

  scoreCount = 0;
  cells = [];
  cellsGroup();

  matrix = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  setRandomCell();
  setRandomCell();

  document.addEventListener('keydown', handleInput);

  setDataToTable();
});

function getVelue() {
  return Math.random() > 0.9 ? 4 : 2;
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

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(events) {
  switch (events.key) {
    case ARROW_UP:
      if (!canMuveUp()) {
        return setupInputOnce();
      }

      moveUp();
      break;

    case ARROW_DOWN:
      if (!canMuveDown()) {
        return setupInputOnce();
      }

      moveDown();
      break;

    case ARROW_RIGHT:
      if (!canMuveRigth()) {
        return setupInputOnce();
      }

      moveRigth();
      break;

    case ARROW_LEFT:
      if (!canMuveLeft()) {
        return setupInputOnce();
      }

      moveLeft();
      break;
  }
  setRandomCell();

  if (!canMuveUp() && !canMuveDown() && !canMuveLeft() && !canMuveRigth()) {
    lose.classList.remove('hidden');
  }

  setDataToTable();
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

  return groupCellsRowReverse;
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

function canMuveUp() {
  const groups = groupCellsColum();

  return canMuve(groups);
}

function canMuveDown() {
  const groupCells = groupCellsColum();

  const groupCellsColumReverse = groupCells
    .map(colum => [...colum].reverse());

  return canMuve(groupCellsColumReverse);
}

function canMuveRigth() {
  const groupCells = groupCellsRow();

  const groupCellsRowReverse = groupCells
    .map(row => [...row].reverse());

  return canMuve(groupCellsRowReverse);
}

function canMuveLeft() {
  const groups = groupCellsRow();

  return canMuve(groups);
}

function canMuve(groups) {
  return groups.some(group => canMuveInGroup(group));
}

function canMuveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty === true) {
      return false;
    }

    const targetCell = group[index - 1];

    setDataToTable();

    return targetCell.isEmpty === true
      || isEmptyForMerg(cell, targetCell);
  });
}
