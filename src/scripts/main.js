'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');

// Write your code here

function getTwoOrFour() {
  const randomChance = Math.random();

  if (randomChance <= 0.1) {
    return 4;
  }

  return 2;
}

function filledCellsCount(board) {
  let count = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) {
        count++;
      }
    }
  }

  return count;
}

function setTwoOrFour(board) {
  const filledCells = filledCellsCount(board);
  const diapasone = (16 - filledCells) / 10;

  while (true) {
    for (let row = 0; row < board.length; row++) {
      for (let cell = 0; cell < board[row].length; cell++) {
        const randomChance = Math.random() * (16 - filledCells);

        if (randomChance <= diapasone && board[row][cell] === 0) {
          board[row][cell] = getTwoOrFour();

          return;
        }
      }
    }
  }
}

function displayCells(board) {
  const gameCells = Array.from(document.querySelectorAll('.field-cell'));

  let count = 0;

  for (const row of board) {
    for (const cell of row) {
      if (cell !== 0) {
        gameCells[count].classList = `field-cell field-cell--${cell}`;
        gameCells[count].textContent = cell;
      } else {
        gameCells[count].classList = 'field-cell';
        gameCells[count].textContent = '';
      }
      count++;
    }
  }
}

function compareFields(startField, newField) {
  for (let r = 0; r < newField.length; r++) {
    for (let c = 0; c < newField[r].length; c++) {
      if (startField[r][c] === 2048) {
        return 'win';
      }
    }
  }

  for (let r = 0; r < newField.length; r++) {
    for (let c = 0; c < newField[r].length; c++) {
      if (startField[r][c] !== newField[r][c]) {
        return false;
      }
    }
  }

  return true;
}

function addNewTwoOrFour(board, startState) {
  if (compareFields(startState, board) === false) {
    setTwoOrFour(board);
  }

  if (compareFields(board, startState) === 'win') {
    const winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');
  }
}

function moveLeftHelper(board, boardScore) {
  const result = [];
  const boardCopy = board.map((row) => [...row]);
  const startBoardState = board.map((row) => [...row]);
  let currBoardScore = boardScore;

  let count = 0;

  for (const row of boardCopy) {
    let filtered = row.filter((x) => x !== 0);

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i + 1] === filtered[i]) {
        filtered[i] = filtered[i] * 2;
        filtered[i + 1] = 0;

        currBoardScore += filtered[i];
      } else if (filtered[i + 1] === 0 && filtered[i] !== 0) {
        filtered[i + 1] = filtered[i];
      }
    }
    filtered = filtered.filter((x) => x !== 0);

    for (let i = 0; i <= 3; i++) {
      if (!filtered[i]) {
        filtered.push(0);
      }
    }

    result.push(filtered);

    boardCopy[count] = result[count];

    count++;
  }

  const comparingStartToCurrBoard = compareFields(startBoardState, boardCopy);

  return [
    boardCopy,
    startBoardState,
    currBoardScore,
    comparingStartToCurrBoard,
  ];
}

//
//
//
//
//

function moveRightHelper(board, boardScore) {
  const result = [];
  const boardCopy = board.map((row) => [...row]);
  const startBoardState = board.map((row) => [...row]);
  let currBoardScore = boardScore;

  let count = 0;

  for (const row of boardCopy) {
    let filtered = row.filter((x) => x !== 0);

    filtered.reverse();

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i + 1] === filtered[i]) {
        filtered[i] = filtered[i] * 2;
        filtered[i + 1] = 0;

        currBoardScore += filtered[i];
      } else if (filtered[i + 1] === 0 && filtered[i] !== 0) {
        filtered[i + 1] = filtered[i];
      }
    }
    filtered = filtered.filter((x) => x !== 0);

    for (let i = 0; i <= 3; i++) {
      if (!filtered[i]) {
        filtered.push(0);
      }
    }

    filtered.reverse();

    result.push(filtered);

    boardCopy[count] = result[count];

    count++;
  }

  const comparingStartToCurrBoard = compareFields(startBoardState, boardCopy);

  return [
    boardCopy,
    startBoardState,
    currBoardScore,
    comparingStartToCurrBoard,
  ];
}

//
//
//
//
//

function moveDownHelper(board, boardScore) {
  let currBoardScore = boardScore;
  const boardCopy = board.map((row) => [...row]);
  const startBoardState = board.map((row) => [...row]);

  for (let c = 0; c < boardCopy[0].length; c++) {
    const startRowState = [];

    for (let r = 0; r < boardCopy.length; r++) {
      startRowState.push(boardCopy[r][c]);
    }

    let filtered = startRowState.filter((x) => x !== 0);

    for (let cell = 0; cell < filtered.length; cell++) {
      if (filtered[cell + 1] === filtered[cell]) {
        filtered[cell] = filtered[cell] * 2;
        filtered[cell + 1] = 0;

        currBoardScore += filtered[cell];
      } else if (filtered[cell + 1] === 0 && filtered[cell] !== 0) {
        filtered[cell + 1] = filtered[cell];
      }
    }

    filtered = filtered.filter((x) => x !== 0);

    for (let i = 0; i <= 3; i++) {
      if (filtered.length < 4) {
        filtered.unshift(0);
      } else {
        break;
      }
    }

    for (let row = 0; row < boardCopy.length; row++) {
      boardCopy[row][c] = filtered[row];
    }
  }

  const comparingStartToCurrBoard = compareFields(startBoardState, boardCopy);

  return [
    boardCopy,
    startBoardState,
    currBoardScore,
    comparingStartToCurrBoard,
  ];
}

function moveUpHelper(board, boardScore) {
  let currBoardScore = boardScore;
  const boardCopy = board.map((row) => [...row]);
  const startBoardState = board.map((row) => [...row]);

  for (let c = 0; c < boardCopy[0].length; c++) {
    const startRowState = [];

    for (let r = 0; r < boardCopy.length; r++) {
      startRowState.push(boardCopy[r][c]);
    }

    let filtered = startRowState.filter((x) => x !== 0);

    filtered.reverse();

    for (let cell = 0; cell < filtered.length; cell++) {
      if (filtered[cell + 1] === filtered[cell]) {
        filtered[cell] = filtered[cell] * 2;
        filtered[cell + 1] = 0;

        currBoardScore += filtered[cell];
      } else if (filtered[cell + 1] === 0 && filtered[cell] !== 0) {
        filtered[cell + 1] = filtered[cell];
      }
    }

    filtered = filtered.filter((x) => x !== 0);

    for (let i = 0; i <= 3; i++) {
      if (filtered.length < 4) {
        filtered.unshift(0);
      } else {
        break;
      }
    }

    filtered.reverse();

    for (let row = 0; row < boardCopy.length; row++) {
      boardCopy[row][c] = filtered[row];
    }
  }

  const comparingStartToCurrBoard = compareFields(startBoardState, boardCopy);

  return [
    boardCopy,
    startBoardState,
    currBoardScore,
    comparingStartToCurrBoard,
  ];
}

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    displayCells(this.board);

    this.score = 0;

    this.status = 'start';
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    const startMessage = document.querySelector('.message-start');
    const loseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');

    if (!loseMessage.classList.contains('hidden')) {
      return 'lose';
    } else if (!winMessage.classList.contains('hidden')) {
      return 'win';
    } else if (startMessage.classList.contains('hidden')) {
      return 'playing';
    } else {
      return 'start';
    }
  }

  moveLeft() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowLeft') {
        const board = moveLeftHelper(this.board, this.score)[0];
        const startBoard = moveLeftHelper(this.board, this.score)[1];
        const score = moveLeftHelper(this.board, this.score)[2];

        const mLeftRes = moveLeftHelper(this.board, this.score)[3];
        const mRightRes = moveRightHelper(this.board, this.score)[3];
        const mDownRes = moveDownHelper(this.board, this.score)[3];
        const mUpRes = moveUpHelper(this.board, this.score)[3];

        const loseMessage = document.querySelector('.message-lose');

        if (
          mLeftRes === true &&
          mRightRes === true &&
          mDownRes === true &&
          mUpRes === true
        ) {
          loseMessage.classList.remove('hidden');
        }

        const scoreDOM = document.querySelector('.game-score');

        scoreDOM.textContent = score;

        addNewTwoOrFour(board, startBoard);
        this.board = board;
        this.score = score;

        displayCells(this.board);
      }
    });
  }

  moveRight() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowRight') {
        const board = moveRightHelper(this.board, this.score)[0];
        const startBoard = moveRightHelper(this.board, this.score)[1];
        const score = moveRightHelper(this.board, this.score)[2];

        const mLeftRes = moveLeftHelper(this.board, this.score)[3];
        const mRightRes = moveRightHelper(this.board, this.score)[3];
        const mDownRes = moveDownHelper(this.board, this.score)[3];
        const mUpRes = moveUpHelper(this.board, this.score)[3];

        const loseMessage = document.querySelector('.message-lose');

        if (
          mLeftRes === true &&
          mRightRes === true &&
          mDownRes === true &&
          mUpRes === true
        ) {
          loseMessage.classList.remove('hidden');
        }

        const scoreDOM = document.querySelector('.game-score');

        scoreDOM.textContent = score;

        addNewTwoOrFour(board, startBoard);
        this.board = board;
        this.score = score;

        displayCells(this.board);
      }
    });
  }

  moveDown() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowDown') {
        const board = moveDownHelper(this.board, this.score)[0];
        const startBoard = moveDownHelper(this.board, this.score)[1];
        const score = moveDownHelper(this.board, this.score)[2];

        const mLeftRes = moveLeftHelper(this.board, this.score)[3];
        const mRightRes = moveRightHelper(this.board, this.score)[3];
        const mDownRes = moveDownHelper(this.board, this.score)[3];
        const mUpRes = moveUpHelper(this.board, this.score)[3];

        const loseMessage = document.querySelector('.message-lose');

        if (
          mLeftRes === true &&
          mRightRes === true &&
          mDownRes === true &&
          mUpRes === true
        ) {
          loseMessage.classList.remove('hidden');
        }

        const scoreDOM = document.querySelector('.game-score');

        scoreDOM.textContent = score;

        addNewTwoOrFour(board, startBoard);
        this.board = board;
        this.score = score;

        displayCells(this.board);
      }
    });
  }

  moveUp() {
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'ArrowUp') {
        const board = moveUpHelper(this.board, this.score)[0];
        const startBoard = moveUpHelper(this.board, this.score)[1];
        const score = moveUpHelper(this.board, this.score)[2];

        const mLeftRes = moveLeftHelper(this.board, this.score)[3];
        const mRightRes = moveRightHelper(this.board, this.score)[3];
        const mDownRes = moveDownHelper(this.board, this.score)[3];
        const mUpRes = moveUpHelper(this.board, this.score)[3];

        const loseMessage = document.querySelector('.message-lose');

        if (
          mLeftRes === true &&
          mRightRes === true &&
          mDownRes === true &&
          mUpRes === true
        ) {
          loseMessage.classList.remove('hidden');
        }

        const scoreDOM = document.querySelector('.game-score');

        scoreDOM.textContent = score;

        addNewTwoOrFour(board, startBoard);
        this.board = board;
        this.score = score;

        displayCells(this.board);
      }
    });
  }

  start() {
    const startMessage = document.querySelector('.message-start');
    const startButton = document.querySelector('.start');

    startButton.addEventListener('click', (ev) => {
      if (ev.target === startButton) {
        this.score = 0;

        this.board = [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];

        displayCells(this.board);

        startMessage.classList.add('hidden');
        startButton.classList.remove('start');
        startButton.classList.add('restart');
        startButton.textContent = 'Restart';
      }

      const score = document.querySelector('.game-score');

      score.textContent = this.score;

      startButton.removeEventListener('click', ev);

      const messageLose = document.querySelector('.message-lose');

      if (messageLose) {
        messageLose.classList.add('hidden');
      }
    });
  }

  restart() {
    const restartButton = document.querySelector('.start');

    if (restartButton && !restartButton.classList.contains('modifyied')) {
      restartButton.addEventListener('click', (ev) => {
        if (ev.target.closest('button')) {
          this.score = 0;

          this.board = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
          ];

          setTwoOrFour(this.board);
          setTwoOrFour(this.board);
        }
        displayCells(this.board);
        restartButton.classList.add('modifyied');
      });
    }
  }
}

const game = new Game();

game.getState();
game.getScore();
game.getStatus();
game.moveLeft();
game.moveRight();
game.moveDown();
game.moveUp();
game.start();
game.restart();
