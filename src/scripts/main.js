'use strict';

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
let gameStarted = false;
const initTable = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let table = initTable;

startButton.addEventListener('click', () => {
  gameStarted = true;
  gameScore.innerText = 0;
  table = initTable;
  startButton.innerText = 'Restart';
  startButton.classList.add('restart');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  const oneRowTable = tableToRow(table);

  oneRowTable[randomEmptyCellIndex(oneRowTable)] = randomTwoOrFour();
  oneRowTable[randomEmptyCellIndex(oneRowTable)] = randomTwoOrFour();
  table = rowToTable(oneRowTable);

  updateInfo(oneRowTable);
});

document.addEventListener('keyup', () => {
  if (!gameStarted) {
    return;
  }

  const prevRows = tableToRow(table);
  let toRenderRows = [];
  let rotatedTable = [];

  switch (event.code) {
    case 'ArrowUp':
      rotatedTable = rotateLeft(table);
      toRenderRows = tableToRow(sumCells(rotatedTable));
      rotatedTable = rowToTable(toRenderRows);
      rotatedTable = rotateRight(rotatedTable);
      toRenderRows = tableToRow(rotatedTable);

      break;
    case 'ArrowLeft':
      toRenderRows = tableToRow(sumCells(table));

      break;
    case 'ArrowDown':
      rotatedTable = rotateRight(table);
      toRenderRows = tableToRow(sumCells(rotatedTable));
      rotatedTable = rowToTable(toRenderRows);
      rotatedTable = rotateLeft(rotatedTable);
      toRenderRows = tableToRow(rotatedTable);

      break;
    case 'ArrowRight':
      rotatedTable = rotateRight(rotateRight(table));
      toRenderRows = tableToRow(sumCells(rotatedTable));
      rotatedTable = rowToTable(toRenderRows);
      rotatedTable = rotateLeft(rotateLeft(rotatedTable));
      toRenderRows = tableToRow(rotatedTable);

      break;
    default:
      break;
  }

  if (!prevRows.every((cell, i) => cell === toRenderRows[i])) {
    handleArrowMove(toRenderRows);
  };
});

const sumCells = (kube) => {
  return kube.map(oneRow => {
    let row = oneRow.filter(cell => cell !== 0);

    if (row.length > 1) {
      row.reduce((prevCell, cell, i) => {
        if (prevCell === cell) {
          gameScore.innerText = +gameScore.innerText + row[i - 1] * 2;
          row[i - 1] *= 2;
          row[i] = 0;

          return 0;
        }

        return cell;
      });

      row = row.filter(cell => cell !== 0);
    }

    while (row.length < 4) {
      row.push(0);
    }

    return row;
  });
};

const handleArrowMove = (row) => {
  updateInfo(row);
  row[randomEmptyCellIndex(row)] = randomTwoOrFour();
  table = rowToTable(row);

  setTimeout(() => {
    updateInfo(row);
  }, 150);

  if (row.some(cell => cell === 2048)) {
    messageWin.classList.remove('hidden');
    gameStarted = false;
  } else if (
    !(randomEmptyCellIndex(tableToRow(table)) + 1)
      && !isMovePosible()
  ) {
    messageLose.classList.remove('hidden');
  };
};

const randomTwoOrFour = () => {
  const x = Math.floor(Math.random() * 10 + 1);

  return (x === 1) ? 4 : 2;
};

const randomEmptyCellIndex = (rows) => {
  const indexes = [];

  rows.forEach((cell, i) => cell === 0 && indexes.push(i));

  return indexes[Math.floor(Math.random() * indexes.length)];
};

const tableToRow = (squere) => {
  return [...squere[0], ...squere[1], ...squere[2], ...squere[3]];
};

const rowToTable = (row) => {
  return [
    [row[0], row[1], row[2], row[3]],
    [row[4], row[5], row[6], row[7]],
    [row[8], row[9], row[10], row[11]],
    [row[12], row[13], row[14], row[15]],
  ];
};

const updateInfo = (rows) => {
  [...cells].map((cell, i) => {
    cell.classList.remove(`field-cell--${cell.innerText}`);
    cell.innerText = rows[i];
    cell.classList.add(`field-cell--${rows[i]}`);
  });
};

const rotateRight = (kube) => {
  return [
    [kube[3][0], kube[2][0], kube[1][0], kube[0][0]],
    [kube[3][1], kube[2][1], kube[1][1], kube[0][1]],
    [kube[3][2], kube[2][2], kube[1][2], kube[0][2]],
    [kube[3][3], kube[2][3], kube[1][3], kube[0][3]],
  ];
};

const rotateLeft = (kube) => {
  return [
    [kube[0][3], kube[1][3], kube[2][3], kube[3][3]],
    [kube[0][2], kube[1][2], kube[2][2], kube[3][2]],
    [kube[0][1], kube[1][1], kube[2][1], kube[3][1]],
    [kube[0][0], kube[1][0], kube[2][0], kube[3][0]],
  ];
};

const isMovePosible = () => {
  const row = tableToRow(table);

  return row.some((cell, i) => {
    if ((i + 1) % 4 !== 0) {
      return cell === row[i + 1] || cell === row[i + 4];
    }

    return cell === row[i + 4];
  });
};
