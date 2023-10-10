'use strict';

const game = document.querySelector('.game-field');
const score = document.querySelector('.game-score');
const buttonStart = document.querySelector('.start');
// const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const winner = document.querySelector('.message-win');
let scoreCount = 0;
let movePass = false;
let cells = [];

let matrix = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

buttonStart.addEventListener('click', (e) => {
  messageStart.classList.add('hidden');
  // messageLose.classList.remove('hidden');
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

    matrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
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

  if (maxCellValue >= 10) {
    // messageStart.classList.add('hidden');
    winner.classList.remove('hidden');
  }

  // console.log(largestOfFour(matrix))
}

// function largestOfFour(arr) {
//   let maxValue;
//   let arrMax = [];

//   for(let i = 0 ; i < arr.length ; i++){
//   maxValue = Math.max.apply(null ,arr[i])
//   arrMax.push(maxValue)
// }
//   return  arrMax;
// }

function handleInput(events) {
  if (movePass) {
    switch (events.key) {
      case 'ArrowUp':
        moveUp();
        break;

      case 'ArrowDown':
        moveDown();
        break;

      case 'ArrowRight':
        moveRigth();
        break;

      case 'ArrowLeft':
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
    if (isEmpti(group[i])) {
      continue;
    }

    const cellWithVelue = group[i];

    let targetCell;
    let j = i - 1;

    while (j >= 0
          && (isEmpti(group[j])
          || isEmptiForMerg(group[j], cellWithVelue))) {
      if (isEmptiForMerg(group[j], cellWithVelue)) {
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

    replacementIsEmptiValue(cellWithVelue, targetCell);

    matrix[targetCell.x][targetCell.y] += prevValue;

    setDataToTable();
  }
}

function replacementIsEmptiValue(cellWithVelue, targetCell) {
  for (const tile of cells) {
    if (tile.x === cellWithVelue.x && tile.y === cellWithVelue.y) {
      tile.isEmpty = true;
    }
  }

  for (const tile of cells) {
    if (tile.x === targetCell.x && tile.y === targetCell.y) {
      tile.isEmpty = false;
    }
  }
}

function isEmpti(tile) {
  return tile.isEmpty === true;
}

function isEmptiForMerg(tile, cellWithVelue) {
  return matrix[tile.x][tile.y] === matrix[cellWithVelue.x][cellWithVelue.y];
}
