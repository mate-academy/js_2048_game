'use strict';

const BOARD_DIM = 4;

class Board extends Array {
  constructor() {
    super();
    // Variable needed to check if there were any modified cells.
    this.successfulMove = false;
    // Variable for score
    this.score = 0;

    // Creating a matrix
    for (let i = 0; i < BOARD_DIM; i++) {
      this[i] = new Array(BOARD_DIM);
    }
  }

  // Property needed to check if there are no available moves.
  get noMoves() {
    // Create a copy of board
    const boardCheck = new Board();

    for (let i = 0; i < BOARD_DIM; ++i) {
      for (let j = 0; j < BOARD_DIM; ++j) {
        boardCheck[i][j] = this[i][j];
      }
    }

    // Check if any move is possible
    if (!boardCheck.moveUp()
    && !boardCheck.moveDown()
    && !boardCheck.moveRight()
    && !boardCheck.moveLeft()) {
      return true;
    }

    return false;
  }

  // Property needed to check if any value equals 2048.
  get isWin() {
    for (let i = 0; i < BOARD_DIM; ++i) {
      for (let j = 0; j < BOARD_DIM; ++j) {
        if (this[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  // Method to reset all values to 0, reset score to 0,
  // Additionally create 2 random values.
  reset() {
    for (let i = 0; i < BOARD_DIM; ++i) {
      for (let j = 0; j < BOARD_DIM; ++j) {
        this[i][j] = 0;
      }
    }

    this.score = 0;
    this.createRandomTile();
    this.createRandomTile();
  }

  // Method to create 2 or 4 value in a random cell.
  createRandomTile() {
    while (true) {
      const tile = [Math.floor(Math.random() * BOARD_DIM),
        Math.floor(Math.random() * BOARD_DIM)];

      if (this[tile[0]][tile[1]] === 0) {
        this[tile[0]][tile[1]] = random2or4();
        break;
      }
    }
  }

  // #region Move methods
  moveDown() {
    // Variable needed to check if there were any modified cells.
    let moveSuccess = false;

    for (let col = 0; col < BOARD_DIM; ++col) {
      let changedColumn = [];

      // Transform board column into row and slide left.
      for (let row = 0; row < BOARD_DIM; ++row) {
        changedColumn.push(this[row][col]);
      }
      // Reverse column -> slide it left -> reverse back.
      changedColumn = this.slideLeftandMerge(changedColumn.reverse()).reverse();

      // If row is changed (if there were any modified cells).
      for (let row = 0; row < BOARD_DIM; ++row) {
        if (changedColumn[row] !== this[row][col]) {
          moveSuccess = true;
        }
        this[row][col] = changedColumn[row];
      }
    }

    // Create random tile if there were any modified cells.
    if (moveSuccess) {
      this.createRandomTile();
    }

    // Return true if move was successful.
    return moveSuccess;
  }

  moveUp() {
    // Variable needed to check if there were any modified cells.
    let moveSuccess = false;

    for (let col = 0; col < BOARD_DIM; ++col) {
      let changedColumn = [];

      // Transform board column into row and slide left.
      for (let row = 0; row < BOARD_DIM; ++row) {
        changedColumn.push(this[row][col]);
      }
      changedColumn = this.slideLeftandMerge(changedColumn);

      // If row is changed (if there were any modified cells).
      for (let row = 0; row < BOARD_DIM; ++row) {
        if (changedColumn[row] !== this[row][col]) {
          moveSuccess = true;
        }
        this[row][col] = changedColumn[row];
      }
    }

    // Create random tile if there were any modified cells.
    if (moveSuccess) {
      this.createRandomTile();
    }

    // Return true if move was successful.
    return moveSuccess;
  }

  moveLeft() {
    // Variable needed to check if there were any modified cells.
    let moveSuccess = false;

    for (let row = 0; row < BOARD_DIM; ++row) {
      const changedRow = this.slideLeftandMerge(this[row]);

      // If row is changed (if there were any modified cells).
      if (changedRow.toString() !== this[row].toString()) {
        moveSuccess = true;
      }
      this[row] = changedRow;
    }

    // Create random tile if there were any modified cells.
    if (moveSuccess) {
      this.createRandomTile();
    }

    // Return true if move was successful.

    return moveSuccess;
  }

  moveRight() {
    // Variable needed to check if there were any modified cells.
    let moveSuccess = false;

    for (let row = 0; row < BOARD_DIM; ++row) {
      // Slide left the reversed row.
      this[row].reverse();

      const changedRow = this.slideLeftandMerge(this[row]);

      // If row is changed (if there were any modified cells).
      if (changedRow.toString() !== this[row].toString()) {
        moveSuccess = true;
      }

      this[row] = changedRow.reverse();
    }

    // Create random tile if there were any modified cells.
    if (moveSuccess) {
      this.createRandomTile();
    }

    // Return true if move was successful.

    return moveSuccess;
  }
  // #endregion

  // Method to slide the row with merging equal values.
  // Additionally increasing score.
  slideLeftandMerge(row) {
    // Removing all empty values.
    let newRow = row.filter(element => element !== 0);

    for (let i = 0; i < newRow.length - 1; ++i) {
      // If two values are equal => First value * 2 and Second value = 0.
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    // Removing all empty values.
    newRow = newRow.filter(element => element !== 0);

    // Adding empty values to the end of row.
    while (newRow.length < BOARD_DIM) {
      newRow.push(0);
    }

    return newRow;
  }
}

const board = new Board();
const buttonHTML = document.querySelector('.button');
const messagesHTML = document.getElementsByClassName('message');
const scoreHTML = document.querySelector('.game_score');
let firstMove = false;

// Reset the board and update HTML
buttonHTML.addEventListener('click', () => {
  firstMove = true;

  board.reset();
  messageUdate();
  updateHTML();
});

// Check for arrow keys.
document.addEventListener('keyup', (e) => {
  // Move board and update HTML only if not win.
  if (!board.isWin) {
    if (e.key === 'ArrowLeft') {
      board.moveLeft();
    }

    if (e.key === 'ArrowRight') {
      board.moveRight();
    }

    if (e.key === 'ArrowUp') {
      board.moveUp();
    }

    if (e.key === 'ArrowDown') {
      board.moveDown();
    }

    messageUdate();
    buttonUpdate();
    updateHTML();
  }
});

// Updates HTML with board, score and button
function updateHTML() {
  for (let i = 0; i < BOARD_DIM; ++i) {
    for (let j = 0; j < BOARD_DIM; ++j) {
      updateHTMLTile(document.getElementById(`${i}x${j}`), board[i][j]);
    }
  }

  scoreHTML.innerHTML = board.score;
  buttonUpdate();
}

// Updates HTML cell with value
function updateHTMLTile(tile, num) {
  tile.innerHTML = '';
  tile.classList.value = 'field_cell';

  if (num > 0) {
    tile.innerHTML = num;
    tile.classList.add(`field_cell_${num}`);
  }
}

// Updates HTML button
function buttonUpdate() {
  if (firstMove) {
    buttonHTML.innerHTML = 'Restart';
    buttonHTML.classList.value = 'button restart';
    firstMove = false;
  }
}

// Returns random value 2(90%) or 4(10%)
function random2or4() {
  if (Math.random() <= 0.1) {
    return 4;
  }

  return 2;
}

// Updates message if condition is met.
function messageUdate() {
  for (const message of messagesHTML) {
    switch (message.classList[1]) {
      case 'message_start': {
        if (firstMove) {
          message.classList.add('hidden');
        }
        break;
      }

      case 'message_lose': {
        if (board.isFull) {
          message.classList.remove('hidden');
        }

        if (firstMove) {
          message.classList.add('hidden');
        }
        break;
      }

      case 'message_win': {
        if (board.isWin) {
          message.classList.remove('hidden');
        }

        if (firstMove) {
          message.classList.add('hidden');
        }
        break;
      }
    }
  }
}
