'use strict';

let gameField;
let score = 0;
let change;

const button = document.querySelector('button');
const startMessages = document.querySelector('.message-start');
const loseMessages = document.querySelector('.message-lose');
const winMessages = document.querySelector('.message-win');
const elementScore = document.querySelector('.game-score');

// function createField() {
//   return [
//     [0, 0, 0, 0],
//     [0, 0, 0, 0],
//     [0, 0, 0, 0],
//     [0, 0, 0, 0],
//   ];
// }

function fillGameField(board) {
  const cells = document.querySelectorAll('.field-cell');
  let count = 0;

  board.flat().forEach((item, i) => {
    if (item) {
      cells[i].textContent = item;
      cells[i].className = `field-cell field-cell--${item}`;

      if (item === 2048) {
        document.removeEventListener('keydown', keyPress);
        winMessages.classList.remove('hidden');
      }

      count++;
    } else {
      cells[i].textContent = '';
      cells[i].className = 'field-cell';
    }
  });

  let stopGame = true;

  board.forEach((element, i) => {
    element.forEach((item, j) => {
      if (item === board[i][j + 1]) {
        stopGame = false;
      }

      if (i < 3 && item === board[i + 1][j]) {
        stopGame = false;
      }
    });
  });

  // for (let i = 0; i < 4; i++) {
  //   for (let j = 0; j < 3; j++) {
  //     if (board[i][j] === board[i][j + 1]) {
  //       stopGame = false;
  //     }

  //     if (i < 3 && board[i][j] === board[i + 1][j]) {
  //       stopGame = false;
  //     }
  //   }
  // }

  if (count === 16 && stopGame === true) {
    document.removeEventListener('keydown', keyPress);
    loseMessages.classList.remove('hidden');
  }
}

function addCell(board) {
  let row, col;

  do {
    row = Math.floor(Math.random() * 4);
    col = Math.floor(Math.random() * 4);
  } while (board[row][col]);

  board[row][col] = Math.random() < 0.9 ? 2 : 4;
}

function stepX(board, reverse = false) {
  change = false;

  board.forEach((item, i) => {
    let row = item.filter(el => el !== 0);

    row = reverse ? row.reverse() : row;

    row.forEach((el, j) => {
      if (el === row[j + 1]) {
        row[j] *= 2;
        score += row[j];
        elementScore.innerText = score;
        row[j + 1] = 0;
      }
    });

    // for (let j = 0; j < row.length; j++) {
    //   if (row[j] === row[j + 1]) {
    //     row[j] *= 2;
    //     score += row[j];
    //     elementScore.innerText = score;
    //     row[j + 1] = 0;
    //   }
    // }

    row = row.filter(el => el !== 0);
    row = [...row, 0, 0, 0, 0];
    row.length = 4;
    row = reverse ? row.reverse() : row;

    if (row.toString() !== item.toString()) {
      board[i] = row;
      change = true;
    }
  });

  // for (let i = 0; i < 4; i++) {
  //   let row = board[i].filter(el => el !== 0);

  //   row = reverse ? row.reverse() : row;

  //   for (let j = 0; j < row.length; j++) {
  //     if (row[j] === row[j + 1]) {
  //       row[j] *= 2;
  //       score += row[j];
  //       elementScore.innerText = score;
  //       row[j + 1] = 0;
  //     }
  //   }

  //   row = row.filter(el => el !== 0);
  //   row = [...row, 0, 0, 0, 0];
  //   row.length = 4;
  //   row = reverse ? row.reverse() : row;

  //   if (row.toString() !== board[i].toString()) {
  //     board[i] = row;
  //     change = true;
  //   }
  // }

  return board;
}

function stepY(board, reverse = false) {
  // let rotateBoard = createField();
  let rotateBoard = board.map((el, i) =>
    el.map((item, j) => board[j][3 - i])
  );

  // board.forEach((element, i) => {
  //   element.forEach((item, j) => {
  //     rotateBoard[3 - j][i] = item;
  //   });
  // });

  // for (let i = 0; i < 4; i++) {
  //   for (let j = 0; j < 4; j++) {
  //     rotateBoard[3 - j][i] = board[i][j];
  //   }
  // }

  rotateBoard = stepX(rotateBoard, reverse);

  rotateBoard.forEach((element, i) => {
    element.forEach((item, j) => {
      board[i][j] = rotateBoard[3 - j][i];
    });
  });

  // for (let i = 0; i < 4; i++) {
  //   for (let j = 0; j < 4; j++) {
  //     board[i][j] = rotateBoard[3 - j][i];
  //   }
  // }

  return board;
}

function nextCell(board) {
  if (change) {
    addCell(board);
    setTimeout(() => fillGameField(board), 200);
  }
}

const keyPress = (e) => {
  e.preventDefault();

  if (e.code === 'ArrowLeft') {
    fillGameField(stepX(gameField));
    nextCell(gameField);
  }

  if (e.code === 'ArrowRight') {
    fillGameField(stepX(gameField, true));
    nextCell(gameField);
  }

  if (e.code === 'ArrowUp') {
    fillGameField(stepY(gameField));
    nextCell(gameField);
  }

  if (e.code === 'ArrowDown') {
    fillGameField(stepY(gameField, true));
    nextCell(gameField);
  }
};

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.textContent = 'Restart';
    button.className = 'button restart';
    startMessages.hidden = true;
  } else {
    score = 0;
    elementScore.innerText = score;
    loseMessages.classList.add('hidden');
    document.removeEventListener('keydown', keyPress);
  }

  gameField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  addCell(gameField);
  addCell(gameField);
  fillGameField(gameField);

  document.addEventListener('keydown', keyPress);
});

// const q = [
//   [1, 2, 3, 4],
//   [5, 6, 7, 8],
//   [9, 10, 11, 12],
//   [13, 14, 15, 16],
// ];

// const w = q.map((el, i) => el.map((item, j) => q[j][3 - i]));

// console.log(w);
//  //     board[i][j] = rotateBoard[3 - j][i];
