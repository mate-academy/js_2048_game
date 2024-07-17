'use strict';

class Game {
  scoreMax = 0;

  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState = []) {
    this.board = initialState ? [...this._getBlankBoard()] : initialState;
    this.scoreCurrent = 0;
    this.gameStatus = 'idle';
  }

  /**
   * Generate blank board
   * @returns blank board array
   */
  _getBlankBoard() {
    return Array.from(
      { length: 4 },
      () => Array.from({ length: 4 }, () => 0),
      // eslint-disable-next-line function-paren-newline
    );
  }

  /**
   * Innitiate game
   */
  _initialize() {
    this.board = [...this._getBlankBoard()];
    this._genRandCells();
    this._genRandCells();
  }

  /**
   * Generate 2 random tiles and populates the board
   * @returns {undefined}
   */
  _genRandCells() {
    const randTile = this._generateRandomTile(this.board);

    if (!randTile) {
      return;
    }
    this.board[randTile[0]][randTile[1]] = randTile[2];
  }

  /**
   * Function generate random row and colum which is currently unpopulated
   * Also return random number 2 or 4 with 4 (10% probability)
   * @param {number[][]} boardArrs
   * @returns [random row, random colum, random number]
   */
  _generateRandomTile(boardArrs) {
    let randRow;
    let randCol;

    // Run this random generator until row and
    // collum position in given board are zero(vacant)
    do {
      randRow = Math.floor(Math.random() * boardArrs.length);
      randCol = Math.floor(Math.random() * boardArrs[0].length);
    } while (boardArrs[randRow][randCol] !== 0);

    // Add 2 or 4 with 4 10% probability
    let randValue = 2;

    if (Math.floor(Math.random() * 100 + 1) <= 10) {
      randValue = 4;
    }

    return [randRow, randCol, randValue];
  }

  /**
   * Check if can continue to play
   * @returns true or false
   * true- can continue the game
   * false - stop the game (no moves, win or lose)
   */
  _checkGameStatus() {
    // Check if winning score reached
    if (this.scoreCurrent >= 2048) {
      this.gameStatus = 'win';

      return false;
    }

    // Check if less then 2 evaliable tiles exist on the board
    if (
      this.board.reduce(
        (acc, cur) => acc + cur.filter((cell) => cell === 0).length,
        0,
      ) === 0
    ) {
      this.gameStatus = 'lose';

      return false;
    }
    this.gameStatus = 'playing';

    return true;
  }

  _didTileMoved(newArr, oldArr) {
    // Check if newArr same as board
    for (let row = 0; row < oldArr.length; row++) {
      for (let col = 0; col < oldArr[row].length; col++) {
        if (oldArr[row][col] !== newArr[row][col]) {
          return true;
        }
      }
    }
    return false;
  }
  moveLeft() {
    if (this.getStatus() === 'playing') {
      const newTimeArr = this.board;
      this.board = this._shiftLeft(this.board);
      this._combineTiles('left');
      this.board = this._shiftLeft(this.board);

      if (this._didTileMoved(newTimeArr, this.board) !== false) {
        this._genRandCells();
        this._checkGameStatus();
      }
    }
  }

  moveRight() {
    if (this.getStatus() === 'playing') {
      const newTimeArr = this.board;
      this.board = this._shiftRight(this.board);
      this._combineTiles('right');
      this.board = this._shiftRight(this.board);

      if (this._didTileMoved(newTimeArr, this.board) !== false) {
        this._genRandCells();
        this._checkGameStatus();
      }
    }
  }

  moveUp() {
    if (this.getStatus() === 'playing') {
      const newTimeArr = this.board;
      this.board = this._transpose(this.board);
      this.board = this._shiftLeft(this.board);
      this._combineTiles('left');
      this.board = this._shiftLeft(this.board);
      this.board = this._transpose(this.board);

      if (this._didTileMoved(newTimeArr, this.board) !== false) {
        this._genRandCells();
        this._checkGameStatus();
      }
    }
  }

  moveDown() {
    if (this.getStatus() === 'playing') {
      const newTimeArr = this.board;
      this.board = this._transpose(this.board);
      this.board = this._shiftRight(this.board);
      this._combineTiles('right');
      this.board = this._shiftRight(this.board);
      this.board = this._transpose(this.board);

      if (this._didTileMoved(newTimeArr, this.board) !== false) {
        this._genRandCells();
        this._checkGameStatus();
      }
    }
  }

  _shiftRight(arrN) {
    const arr = [...arrN];

    // Run for each row: filter-out Zeros appen zeroes from the left
    for (let r = 0; r < arr.length; r++) {
      const temp = arr[r].filter((e) => e);

      arr[r] = Array.from(
        { length: arr[r].length - temp.length },
        () => 0,
      ).concat(temp);
    }

    return arr;
  }

  _shiftLeft(arrN) {
    const arr = [...arrN];

    // Run for each row: filter-out Zeros appen zeroes from the right
    for (let r = 0; r < arr.length; r++) {
      const temp = arr[r].filter((e) => e);

      arr[r] = temp.concat(
        Array.from({ length: arr[r].length - temp.length }, () => 0),
      );
    }

    return arr;
  }

  _transpose(arr) {
    const temp = [];

    for (let cols = 0; cols < arr.length; cols++) {
      const tempCol = [];

      for (let rows = 0; rows < arr[0].length; rows++) {
        tempCol.push(arr[rows][cols]);
      }
      temp.push(tempCol);
    }

    return temp;
  }

  _combineTiles(direction) {
    switch (direction) {
      case 'left':
        for (let row = 0; row < this.board.length; row++) {
          for (let col = 0; col < this.board[row].length - 1; col++) {
            const el = this.board[row][col];
            const elRight = this.board[row][col + 1];

            if (el && elRight && el === elRight) {
              this.board[row][col] = el + elRight;
              this.board[row][col + 1] = 0;
              col++;
              this.scoreCurrent += el + elRight;
            }
          }
        }
        break;

      case 'right':
        for (let row = this.board.length - 1; row >= 0; row--) {
          for (let col = this.board[row].length - 1; col >= 1; col--) {
            const el = this.board[row][col];
            const elLeft = this.board[row][col - 1];

            if (el && elLeft && el === elLeft) {
              this.board[row][col] = el + elLeft;
              this.board[row][col - 1] = 0;
              col--;
              this.scoreCurrent += el + elLeft;
            }
          }
        }
        break;
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.scoreCurrent;
  }

  getScoreMax() {
    return this.scoreMax;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.gameStatus;
  }

  getBoard() {
    return this.board;
  }

  /**
   * Starts the game.
   */
  start() {
    this.gameStatus = 'playing';
    this._initialize();
  }

  /**
   * Resets the game.
   */
  restart() {
    if (this.scoreMax < this.scoreCurrent && this.getStatus() === 'win') {
      this.scoreMax = this.scoreCurrent;
    }
    this.scoreCurrent = 0;
    this.gameStatus = 'playing';
    this._initialize();
  }
}

module.exports = Game;
