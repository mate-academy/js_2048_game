'use strict';

function copyState(state) {
  return state.map((row) => [...row]);
}

function boardsEqual(a, b) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (a[row][col] !== b[row][col]) {
        return false;
      }
    }
  }

  return true;
}

function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

function transpose(board) {
  return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
}

function hasAvailableMoves(board) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board[row][col] === 0) {
        return true;
      }

      if (col < 3 && board[row][col] === board[row][col + 1]) {
        return true;
      }

      if (row < 3 && board[row][col] === board[row + 1][col]) {
        return true;
      }
    }
  }

  return false;
}

class Game {
  constructor(initialState) {
    if (initialState) {
      this.board = copyState(initialState);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.initialState = copyState(this.board);
    this.score = 0;
    this.status = 'idle';
  }

  // Slides every row of the given board to the left using slide().
  slideBoardLeft(board) {
    let totalScoreGained = 0;
    const newBoard = board.map((row) => {
      const { row: slidRow, scoreGained } = this.slide(row);

      totalScoreGained += scoreGained;

      return slidRow;
    });

    return { board: newBoard, scoreGained: totalScoreGained };
  }

  // Commits a move: only counts if the board actually changed.
  applyMove(newBoard, scoreGained) {
    if (boardsEqual(newBoard, this.board)) {
      return;
    }

    this.board = newBoard;
    this.score += scoreGained;
    this.addRandomTile();

    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    } else if (!hasAvailableMoves(this.board)) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const { board: newBoard, scoreGained } = this.slideBoardLeft(this.board);

    this.applyMove(newBoard, scoreGained);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const reversed = reverseRows(this.board);
    const { board: slid, scoreGained } = this.slideBoardLeft(reversed);
    const newBoard = reverseRows(slid);

    this.applyMove(newBoard, scoreGained);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = transpose(this.board);
    const { board: slid, scoreGained } = this.slideBoardLeft(transposed);
    const newBoard = transpose(slid);

    this.applyMove(newBoard, scoreGained);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = transpose(this.board);
    const reversed = reverseRows(transposed);
    const { board: slid, scoreGained } = this.slideBoardLeft(reversed);
    const newBoard = transpose(reverseRows(slid));

    this.applyMove(newBoard, scoreGained);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  filterZero(row) {
    return row.filter((n) => n !== 0);
  }

  slide(row) {
    let newRow = this.filterZero(row);
    let scoreGained = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        scoreGained += newRow[i];
      }
    }

    newRow = this.filterZero(newRow);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { row: newRow, scoreGained };
  }
}

module.exports = Game;

/*
Довідка (перенесено з коментарів вище, щоб не заважали):

constructor(initialState)
  @param {number[][]} initialState - початковий стан дошки.
  @default дошка 4x4 з нулів, якщо нічого не передали.
  Якщо передано - дошка ініціалізується цим значенням.

getScore()
  @returns {number}

getState()
  @returns {number[][]}

getStatus()
  @returns {string} одне з: 'idle', 'playing', 'win', 'lose'
  'idle'    - гра ще не почалась (початковий стан)
  'playing' - гра триває
  'win'     - гра виграна
  'lose'    - гра програна

start()    - запускає гру
restart()  - скидає гру до початкового стану
*/

// 'use strict';

// class Game {
//   /**
//    * Creates a new game instance.
//    *
//    * @param {number[][]} initialState
//    * The initial state of the board.
//    * @default
//    * [[0, 0, 0, 0],
//    *  [0, 0, 0, 0],
//    *  [0, 0, 0, 0],
//    *  [0, 0, 0, 0]]
//    *
//    * If passed, the board will be initialized with the provided
//    * initial state.
//    */
//   constructor(initialState) {
//     // eslint-disable-next-line no-console
//     console.log(initialState);
//   }

//   moveLeft() {}
//   moveRight() {}
//   moveUp() {}
//   moveDown() {}

//   /**
//    * @returns {number}
//    */
//   getScore() {}

//   /**
//    * @returns {number[][]}
//    */
//   getState() {}

//   /**
//    * Returns the current game status.
//    *
//    * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
//    *
//    * `idle` - the game has not started yet (the initial state);
//    * `playing` - the game is in progress;
//    * `win` - the game is won;
//    * `lose` - the game is lost
//    */
//   getStatus() {}

//   /**
//    * Starts the game.
//    */
//   start() {}

//   /**
//    * Resets the game.
//    */
//   restart() {}

//   // Add your own methods here
// }

// module.exports = Game;
